/**
 * XP award engine — call awardXp() after any significant stylist action.
 * Handles level-ups, streak tracking, and badge checks.
 */
import { db } from '@/lib/db';
import { stylistXp, xpEvents, userBadges, badges } from '@/lib/db/schema';
import { eq, and, sql } from 'drizzle-orm';

// XP values per action
export const XP_TABLE = {
  consultation_completed:  50,
  formula_created:         30,
  formula_favorited:       10,
  service_completed:       40,
  patch_test_recorded:     20,
  client_added:            25,
  photo_uploaded:          15,
  ceu_logged:              60,
  badge_earned:             0, // bonus comes from badge itself
  daily_login:             10,
  streak_7_days:           75,
  streak_30_days:         200,
  brand_discovered:        50,
  consent_signed:          15,
  retail_sold:             20,
  five_star_review:        35,
} as const;

export type XpEventType = keyof typeof XP_TABLE;

/** XP required to reach each level (cumulative) */
export function xpForLevel(level: number): number {
  // Gentle curve: 100 * level^1.5
  return Math.floor(100 * Math.pow(level, 1.5));
}

export async function awardXp(params: {
  userId: string;
  salonId: string;
  eventType: XpEventType;
  description?: string;
  metadata?: Record<string, unknown>;
  overrideXp?: number;
}): Promise<{ newLevel: number; leveledUp: boolean; totalXp: number }> {
  const xp = params.overrideXp ?? XP_TABLE[params.eventType];

  // Log the event
  await db.insert(xpEvents).values({
    userId: params.userId,
    salonId: params.salonId,
    eventType: params.eventType,
    xpAwarded: xp,
    description: params.description ?? params.eventType,
    metadata: params.metadata ?? {},
  });

  // Upsert stylist XP row
  const existing = await db
    .select()
    .from(stylistXp)
    .where(eq(stylistXp.userId, params.userId))
    .limit(1);

  const now = new Date();
  const today = now.toDateString();

  if (existing.length === 0) {
    await db.insert(stylistXp).values({
      userId: params.userId,
      salonId: params.salonId,
      totalXp: xp,
      level: 1,
      currentLevelXp: xp,
      nextLevelXp: xpForLevel(2),
      streak: 1,
      longestStreak: 1,
      lastActiveDate: now,
    });
    return { newLevel: 1, leveledUp: false, totalXp: xp };
  }

  const row = existing[0]!;
  const newTotal = row.totalXp + xp;

  // Streak logic
  const lastDate = row.lastActiveDate ? new Date(row.lastActiveDate).toDateString() : null;
  const yesterday = new Date(now.getTime() - 86400000).toDateString();
  let newStreak = row.streak;
  if (lastDate !== today) {
    newStreak = lastDate === yesterday ? row.streak + 1 : 1;
  }
  const newLongest = Math.max(row.longestStreak, newStreak);

  // Level-up check
  let level = row.level;
  let leveledUp = false;
  while (newTotal >= xpForLevel(level + 1)) {
    level++;
    leveledUp = true;
  }

  await db.update(stylistXp)
    .set({
      totalXp: newTotal,
      level,
      currentLevelXp: newTotal - xpForLevel(level),
      nextLevelXp: xpForLevel(level + 1) - xpForLevel(level),
      streak: newStreak,
      longestStreak: newLongest,
      lastActiveDate: now,
      updatedAt: now,
    })
    .where(eq(stylistXp.userId, params.userId));

  // Streak milestone bonuses
  if (newStreak === 7 && lastDate !== today) {
    await awardXp({ userId: params.userId, salonId: params.salonId, eventType: 'streak_7_days', description: '7-day streak!' });
  }
  if (newStreak === 30 && lastDate !== today) {
    await awardXp({ userId: params.userId, salonId: params.salonId, eventType: 'streak_30_days', description: '30-day streak!' });
  }

  return { newLevel: level, leveledUp, totalXp: newTotal };
}
