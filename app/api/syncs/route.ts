import { NextResponse } from 'next/server';
import { desc, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { syncs } from '@/lib/db/schema';
import { completeWithFallback } from '@/lib/openrouter';
import { awardPoints } from '@/lib/points';

const CATEGORIES = ['animal', 'number', 'person', 'dream', 'object', 'event', 'color', 'word'];
const INTENSITIES = ['low', 'medium', 'high', 'extreme'];

export async function GET() {
  try {
    const db = getDb();
    const [patterns, stats] = await Promise.all([
      // cluster reports into named patterns — the LLM assigns the same
      // canonical pattern name to similar reports at submission time
      db
        .select({
          pattern: syncs.pattern,
          category: sql<string>`(array_agg(${syncs.category} order by ${syncs.createdAt} desc))[1]`,
          description: sql<string>`(array_agg(${syncs.description} order by ${syncs.createdAt} desc))[1]`,
          symbol: sql<string>`(array_agg(${syncs.symbol} order by ${syncs.createdAt} desc))[1]`,
          intensity: sql<string>`(array_agg(${syncs.intensity} order by ${syncs.createdAt} desc))[1]`,
          count: sql<number>`count(*)::int`,
          latest: sql<string>`max(${syncs.createdAt})::text`,
        })
        .from(syncs)
        .groupBy(syncs.pattern)
        .orderBy(desc(sql`count(*)`))
        .limit(24),
      db
        .select({
          total: sql<number>`count(*)::int`,
          today: sql<number>`count(*) filter (where ${syncs.createdAt} > now() - interval '24 hours')::int`,
          patterns: sql<number>`count(distinct ${syncs.pattern})::int`,
          categories: sql<number>`count(distinct ${syncs.category})::int`,
        })
        .from(syncs),
    ]);
    return NextResponse.json({ patterns, stats: stats[0] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database unavailable' },
      { status: 503 },
    );
  }
}

// Classify the report into a canonical pattern so independent reports cluster
async function classify(
  title: string,
  description: string,
  category: string,
): Promise<{ pattern: string; symbol: string; intensity: string }> {
  const fallback = { pattern: title.slice(0, 120), symbol: '✨', intensity: 'medium' };

  // anchor with existing pattern names so similar reports converge on one cluster
  let existing: string[] = [];
  try {
    const db = getDb();
    const rows = await db
      .select({ pattern: syncs.pattern, count: sql<number>`count(*)::int` })
      .from(syncs)
      .groupBy(syncs.pattern)
      .orderBy(desc(sql`count(*)`))
      .limit(40);
    existing = rows.map(r => r.pattern);
  } catch {
    // no DB — classify without anchors
  }

  const anchorClause = existing.length > 0
    ? ` EXISTING PATTERNS — if the report describes the same phenomenon as one of these, you MUST return that exact string as the pattern: ${JSON.stringify(existing)}. Only invent a new pattern name if none of these fit.`
    : '';

  const result = await completeWithFallback([
    {
      role: 'system',
      content:
        'You classify synchronicity reports into canonical patterns. Respond with ONLY a JSON object, no prose, no code fences: {"pattern": "short canonical pattern name (3-6 words) that OTHER similar reports would also map to, e.g. \\"The number 11:11\\", \\"Crow before the change\\", \\"Books falling open to relevant pages\\"", "symbol": "one emoji that fits", "intensity": "low|medium|high|extreme — rate the strangeness/significance"}.' +
        anchorClause,
    },
    { role: 'user', content: `Category: ${category}\nTitle: ${title}\nReport: ${description.slice(0, 2000)}` },
  ]);
  if (!result.ok) return fallback;
  try {
    const match = result.content.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    const parsed = JSON.parse(match[0]);
    return {
      pattern:
        typeof parsed.pattern === 'string' && parsed.pattern.trim() !== ''
          ? parsed.pattern.trim().slice(0, 120)
          : fallback.pattern,
      symbol: typeof parsed.symbol === 'string' && parsed.symbol.trim() !== '' ? parsed.symbol.trim().slice(0, 16) : '✨',
      intensity: INTENSITIES.includes(parsed.intensity) ? parsed.intensity : 'medium',
    };
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  let body: { title?: string; description?: string; category?: string; emotion?: string; question?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 200) : '';
  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 4000) : '';
  if (title === '' || description.length < 10) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }
  const category = CATEGORIES.includes(body.category ?? '') ? (body.category as string) : 'event';
  const emotion = typeof body.emotion === 'string' ? body.emotion.trim().slice(0, 300) : '';
  const question = typeof body.question === 'string' ? body.question.trim().slice(0, 300) : '';

  const meta = await classify(title, description, category);

  try {
    const db = getDb();
    const [row] = await db
      .insert(syncs)
      .values({ title, description, category, emotion, question, ...meta })
      .returning();
    await awardPoints(request.headers, 'Record a synchronicity', 40);
    return NextResponse.json({ sync: row });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database unavailable' },
      { status: 503 },
    );
  }
}
