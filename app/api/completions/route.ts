import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { completions, pointsLedger } from '@/lib/db/auth-schema';
import { INITIATION_LEVELS } from '@/lib/data/initiation';

// Valid item ids straight from the curriculum data
const LESSON_IDS = new Set<string>();
const QUEST_IDS = new Map<string, string>(); // quest id -> quest title
for (const level of INITIATION_LEVELS) {
  for (const lesson of level.lessons) {
    LESSON_IDS.add(lesson.id);
    if (lesson.quest) QUEST_IDS.set(lesson.quest.id, lesson.quest.title);
  }
}

const POINTS = { lesson: 25, quest: 75 } as const;

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) return NextResponse.json({ completed: [] });
    const db = getDb();
    const rows = await db
      .select({ itemId: completions.itemId })
      .from(completions)
      .where(eq(completions.userId, session.user.id));
    return NextResponse.json({ completed: rows.map(r => r.itemId) });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unavailable' },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Enter the Sanctum to record your progress' }, { status: 401 });
  }

  let body: { itemId?: string; kind?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const itemId = typeof body.itemId === 'string' ? body.itemId : '';
  const kind = body.kind === 'quest' ? 'quest' : body.kind === 'lesson' ? 'lesson' : null;
  if (!kind || (kind === 'lesson' && !LESSON_IDS.has(itemId)) || (kind === 'quest' && !QUEST_IDS.has(itemId))) {
    return NextResponse.json({ error: `Unknown ${body.kind ?? 'item'}: ${itemId}` }, { status: 400 });
  }

  try {
    const db = getDb();
    // unique index makes this idempotent — AP only awarded on first completion
    const inserted = await db
      .insert(completions)
      .values({ userId: session.user.id, itemId, kind })
      .onConflictDoNothing()
      .returning();

    const isNew = inserted.length > 0;
    if (isNew) {
      const action = kind === 'quest' ? `Complete a quest` : `Complete a lesson`;
      await db.insert(pointsLedger).values({
        userId: session.user.id,
        action,
        points: POINTS[kind],
      });
    }

    return NextResponse.json({ completed: true, awarded: isNew ? POINTS[kind] : 0 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Database unavailable' },
      { status: 503 },
    );
  }
}
