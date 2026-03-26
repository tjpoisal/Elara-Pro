/**
 * GET /api/gamification — stylist XP, badges, challenges, leaderboard
 * POST /api/gamification?action=award — award XP for an event
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { stylistXp, xpEvents, userBadges, badges, challenges, userChallenges, leaderboardSnapshots, clientPoints } from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { awardXp, type XpEventType } from '@/lib/gamification/xp';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const target = url.searchParams.get('target') ?? 'stylist';

  if (target === 'leaderboard') {
    const rows = await db
      .select()
      .from(leaderboardSnapshots)
      .where(and(eq(leaderboardSnapshots.salonId, auth.salonId), eq(leaderboardSnapshots.period, 'monthly')))
      .orderBy(leaderboardSnapshots.rank)
      .limit(10);
    return jsonResponse({ leaderboard: rows });
  }

  const [xp] = await db.select().from(stylistXp).where(eq(stylistXp.userId, auth.userId)).limit(1);
  const earnedBadges = await db
    .select({ badge: badges, earnedAt: userBadges.earnedAt })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, auth.userId))
    .orderBy(desc(userBadges.earnedAt));

  const activeChallenges = await db
    .select({ challenge: challenges, progress: userChallenges.progress, target: userChallenges.target, completedAt: userChallenges.completedAt })
    .from(userChallenges)
    .innerJoin(challenges, eq(userChallenges.challengeId, challenges.id))
    .where(and(eq(userChallenges.userId, auth.userId), eq(challenges.isActive, true)));

  const recentXp = await db
    .select()
    .from(xpEvents)
    .where(eq(xpEvents.userId, auth.userId))
    .orderBy(desc(xpEvents.createdAt))
    .limit(10);

  return jsonResponse({ xp: xp ?? null, badges: earnedBadges, challenges: activeChallenges, recentXp });
}

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'award') {
    let body: { eventType: XpEventType; description?: string; metadata?: Record<string, unknown> };
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }
    const result = await awardXp({ userId: auth.userId, salonId: auth.salonId, ...body });
    return jsonResponse(result);
  }

  return errorResponse('Invalid action', 400);
}
