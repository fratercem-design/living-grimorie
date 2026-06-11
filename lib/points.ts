import { sql, eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { pointsLedger } from '@/lib/db/auth-schema';

// AP needed to hold each rank (index = rank). Matches the 7 initiation levels:
// Seeker, Adept, Magician, Alchemist, Oracle, Hierophant, Illuminated
export const LEVEL_THRESHOLDS = [0, 300, 800, 1600, 2800, 4500, 7000];

export function rankForPoints(points: number): number {
  let rank = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) rank = i;
  }
  return rank;
}

// Max times each action can earn AP per rolling 24h — keeps the economy unfarmable
const DAILY_CAPS: Record<string, number> = {
  'Submit a dream': 3,
  'Record a synchronicity': 3,
  'Consult an Oracle persona': 5,
  'Complete a lesson': 10,
  'Complete a quest': 10,
};

/** Award Akashic Points to the signed-in user, if any. Silent no-op for guests. */
export async function awardPoints(headers: Headers, action: string, points: number): Promise<void> {
  try {
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) return;
    const db = getDb();

    const cap = DAILY_CAPS[action];
    if (cap !== undefined) {
      const [row] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(pointsLedger)
        .where(
          sql`${pointsLedger.userId} = ${session.user.id} and ${pointsLedger.action} = ${action} and ${pointsLedger.createdAt} > now() - interval '24 hours'`,
        );
      if ((row?.count ?? 0) >= cap) return; // cap reached — action still works, just no AP
    }

    await db.insert(pointsLedger).values({ userId: session.user.id, action, points });
  } catch {
    // points are a bonus — never fail the main request over them
  }
}

export async function getPointsBalance(userId: string): Promise<number> {
  const db = getDb();
  const [row] = await db
    .select({ total: sql<number>`coalesce(sum(${pointsLedger.points}), 0)::int` })
    .from(pointsLedger)
    .where(eq(pointsLedger.userId, userId));
  return row?.total ?? 0;
}
