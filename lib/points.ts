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

/** Award Akashic Points to the signed-in user, if any. Silent no-op for guests. */
export async function awardPoints(headers: Headers, action: string, points: number): Promise<void> {
  try {
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) return;
    const db = getDb();
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
