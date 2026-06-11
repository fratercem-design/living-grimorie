import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { pointsLedger } from '@/lib/db/auth-schema';
import { getPointsBalance, rankForPoints, LEVEL_THRESHOLDS } from '@/lib/points';

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ user: null });
    }

    const points = await getPointsBalance(session.user.id);
    const rank = rankForPoints(points);
    const db = getDb();
    const recent = await db
      .select({ action: pointsLedger.action, points: pointsLedger.points, createdAt: pointsLedger.createdAt })
      .from(pointsLedger)
      .where(eq(pointsLedger.userId, session.user.id))
      .orderBy(desc(pointsLedger.createdAt))
      .limit(15);

    return NextResponse.json({
      user: { name: session.user.name, email: session.user.email },
      points,
      rank,
      nextThreshold: LEVEL_THRESHOLDS[rank + 1] ?? null,
      recent,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unavailable' },
      { status: 503 },
    );
  }
}
