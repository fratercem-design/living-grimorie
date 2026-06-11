import { NextResponse } from 'next/server';
import { desc, sql } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { dreams } from '@/lib/db/schema';
import { completeWithFallback } from '@/lib/openrouter';
import { awardPoints } from '@/lib/points';

export async function GET() {
  try {
    const db = getDb();
    const [rows, stats] = await Promise.all([
      db.select().from(dreams).orderBy(desc(dreams.createdAt)).limit(24),
      db
        .select({
          total: sql<number>`count(*)::int`,
          archetypes: sql<number>`count(distinct ${dreams.archetype})::int`,
          symbols: sql<number>`coalesce(sum(jsonb_array_length(${dreams.symbols})), 0)::int`,
        })
        .from(dreams),
    ]);
    return NextResponse.json({ dreams: rows, stats: stats[0] });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database unavailable' },
      { status: 503 },
    );
  }
}

// Pull symbols + archetype out of the dream so the Atlas card has metadata
async function extractMetadata(dream: string): Promise<{ symbols: string[]; archetype: string }> {
  const fallback = { symbols: [], archetype: 'The Unnamed' };
  const result = await completeWithFallback([
    {
      role: 'system',
      content:
        'Extract dream metadata. Respond with ONLY a JSON object, no prose, no code fences: {"symbols": [up to 3 short symbol names from the dream imagery, each 1-2 words, capitalized], "archetype": "the single dominant archetype, e.g. The Shadow, The Threshold, The High Priestess, Ariadne"}',
    },
    { role: 'user', content: dream.slice(0, 3000) },
  ]);
  if (!result.ok) return fallback;
  try {
    const match = result.content.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    const parsed = JSON.parse(match[0]);
    const symbols = Array.isArray(parsed.symbols)
      ? parsed.symbols.filter((s: unknown) => typeof s === 'string').slice(0, 3).map((s: string) => s.slice(0, 40))
      : [];
    const archetype = typeof parsed.archetype === 'string' && parsed.archetype.trim() !== ''
      ? parsed.archetype.slice(0, 120)
      : fallback.archetype;
    return { symbols, archetype };
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  let body: { title?: string; dream?: string; emotions?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const dreamText = typeof body.dream === 'string' ? body.dream.trim().slice(0, 6000) : '';
  if (dreamText.length < 20) {
    return NextResponse.json({ error: 'Dream text too short' }, { status: 400 });
  }

  const title = (typeof body.title === 'string' && body.title.trim() !== ''
    ? body.title.trim()
    : 'Untitled Dream'
  ).slice(0, 200);
  const emotions = typeof body.emotions === 'string' ? body.emotions.trim().slice(0, 300) : '';

  const meta = await extractMetadata(dreamText);

  try {
    const db = getDb();
    const [row] = await db
      .insert(dreams)
      .values({ title, dream: dreamText, emotions, symbols: meta.symbols, archetype: meta.archetype })
      .returning();
    await awardPoints(request.headers, 'Submit a dream', 30);
    return NextResponse.json({ dream: row });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database unavailable' },
      { status: 503 },
    );
  }
}
