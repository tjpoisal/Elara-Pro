import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  integer,
  decimal,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'stylist',
  'owner',
  'manager',
  'assistant',
  'admin',
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'trialing',
  'past_due',
  'canceled',
  'incomplete',
]);

export const salons = pgTable('salons', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address'),
  city: varchar('city', { length: 100 }),
  state: varchar('state', { length: 50 }),
  zip: varchar('zip', { length: 20 }),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  logoUrl: text('logo_url'),
  subscriptionTier: varchar('subscription_tier', { length: 50 }).default('free').notNull(),
  subscriptionStatus: subscriptionStatusEnum('subscription_status').default('trialing').notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
  settings: jsonb('settings').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  role: userRoleEnum('role').default('stylist').notNull(),
  avatarUrl: text('avatar_url'),
  phone: varchar('phone', { length: 30 }),
  licenseNumber: varchar('license_number', { length: 100 }),
  licenseExpiry: timestamp('license_expiry', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  preferences: jsonb('preferences').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const clientProfiles = pgTable('client_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  primaryStylistId: uuid('primary_stylist_id').references(() => users.id),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 30 }),
  dateOfBirth: timestamp('date_of_birth', { withTimezone: true }),
  naturalLevel: integer('natural_level'),
  naturalTone: varchar('natural_tone', { length: 50 }),
  grayPercentage: integer('gray_percentage'),
  hairTexture: varchar('hair_texture', { length: 50 }),
  hairDensity: varchar('hair_density', { length: 50 }),
  hairPorosity: varchar('hair_porosity', { length: 50 }),
  scalpCondition: varchar('scalp_condition', { length: 100 }),
  allergies: text('allergies'),
  chemicalHistory: jsonb('chemical_history').default([]).notNull(),
  notes: text('notes'),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const clientLifetimeValue = pgTable('client_lifetime_value', {
  id: uuid('id').defaultRandom().primaryKey(),
  clientId: uuid('client_id')
    .references(() => clientProfiles.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  totalSpent: decimal('total_spent', { precision: 10, scale: 2 }).default('0').notNull(),
  totalVisits: integer('total_visits').default(0).notNull(),
  averageTicket: decimal('average_ticket', { precision: 10, scale: 2 }).default('0').notNull(),
  lastVisitAt: timestamp('last_visit_at', { withTimezone: true }),
  retentionScore: integer('retention_score').default(0).notNull(),
  predictedNextVisit: timestamp('predicted_next_visit', { withTimezone: true }),
  lifetimeValue: decimal('lifetime_value', { precision: 10, scale: 2 }).default('0').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
