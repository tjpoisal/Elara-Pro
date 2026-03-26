import {
  pgTable, text, timestamp, uuid, varchar, boolean, integer, decimal, jsonb, pgEnum,
} from 'drizzle-orm/pg-core';
import { salons, users, clientProfiles } from './core';

export const badgeTierEnum = pgEnum('badge_tier', ['bronze', 'silver', 'gold', 'platinum', 'diamond']);

// ── Stylist XP & Levels ────────────────────────────────────────────────────────
export const stylistXp = pgTable('stylist_xp', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  totalXp: integer('total_xp').default(0).notNull(),
  level: integer('level').default(1).notNull(),
  currentLevelXp: integer('current_level_xp').default(0).notNull(),
  nextLevelXp: integer('next_level_xp').default(100).notNull(),
  streak: integer('streak').default(0).notNull(),           // consecutive days active
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastActiveDate: timestamp('last_active_date', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const xpEvents = pgTable('xp_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  xpAwarded: integer('xp_awarded').notNull(),
  description: text('description'),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── Badges ─────────────────────────────────────────────────────────────────────
export const badges = pgTable('badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 10 }).notNull(),          // emoji
  tier: badgeTierEnum('tier').notNull(),
  category: varchar('category', { length: 50 }).notNull(),  // 'formula'|'client'|'safety'|'streak'|'school'
  xpReward: integer('xp_reward').default(0).notNull(),
  criteria: jsonb('criteria').default({}).notNull(),         // { type, threshold }
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userBadges = pgTable('user_badges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  badgeId: uuid('badge_id').references(() => badges.id).notNull(),
  earnedAt: timestamp('earned_at', { withTimezone: true }).defaultNow().notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
});

// ── Challenges ─────────────────────────────────────────────────────────────────
export const challenges = pgTable('challenges', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 10 }).notNull(),
  xpReward: integer('xp_reward').notNull(),
  badgeId: uuid('badge_id').references(() => badges.id),
  criteria: jsonb('criteria').default({}).notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  recurringPeriod: varchar('recurring_period', { length: 20 }),  // 'daily'|'weekly'|'monthly'
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userChallenges = pgTable('user_challenges', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  challengeId: uuid('challenge_id').references(() => challenges.id).notNull(),
  progress: integer('progress').default(0).notNull(),
  target: integer('target').notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  periodStart: timestamp('period_start', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── Client Loyalty Points ──────────────────────────────────────────────────────
export const clientPoints = pgTable('client_points', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id').references(() => clientProfiles.id, { onDelete: 'cascade' }).notNull().unique(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  totalPoints: integer('total_points').default(0).notNull(),
  lifetimePoints: integer('lifetime_points').default(0).notNull(),
  tier: varchar('tier', { length: 20 }).default('bronze').notNull(), // bronze|silver|gold|platinum
  visitStreak: integer('visit_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastVisitAt: timestamp('last_visit_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const clientPointEvents = pgTable('client_point_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id').references(() => clientProfiles.id, { onDelete: 'cascade' }).notNull(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  points: integer('points').notNull(),
  description: text('description'),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const clientRewards = pgTable('client_rewards', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  pointsCost: integer('points_cost').notNull(),
  discountType: varchar('discount_type', { length: 20 }).notNull(), // 'percent'|'fixed'|'free_service'
  discountValue: decimal('discount_value', { precision: 8, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ── Leaderboard ────────────────────────────────────────────────────────────────
export const leaderboardSnapshots = pgTable('leaderboard_snapshots', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  period: varchar('period', { length: 20 }).notNull(),      // 'weekly'|'monthly'|'alltime'
  periodKey: varchar('period_key', { length: 20 }).notNull(), // '2025-W12'|'2025-03'
  rank: integer('rank').notNull(),
  score: integer('score').notNull(),
  metric: varchar('metric', { length: 50 }).notNull(),       // 'xp'|'services'|'formulas'
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
