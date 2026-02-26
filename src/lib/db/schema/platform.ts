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
import { salons, users } from './core';
import { formulas } from './consultations';

export const auditActionEnum = pgEnum('audit_action', [
  'create',
  'read',
  'update',
  'delete',
  'login',
  'logout',
  'export',
  'formula_access',
  'consent_signed',
  'patch_test',
  'inventory_adjustment',
  'subscription_change',
]);

export const voiceLogs = pgTable('voice_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  transcription: text('transcription'),
  parsedIntent: jsonb('parsed_intent'),
  actionTaken: varchar('action_taken', { length: 255 }),
  confidence: decimal('confidence', { precision: 4, scale: 2 }),
  durationSeconds: integer('duration_seconds'),
  wakeWord: varchar('wake_word', { length: 50 }),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id').references(() => users.id),
  action: auditActionEnum('action').notNull(),
  resourceType: varchar('resource_type', { length: 100 }).notNull(),
  resourceId: uuid('resource_id'),
  metadata: jsonb('metadata').default({}).notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const formulaIpVault = pgTable('formula_ip_vault', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  formulaId: uuid('formula_id')
    .references(() => formulas.id, { onDelete: 'cascade' })
    .notNull(),
  encryptedData: text('encrypted_data').notNull(),
  encryptionIv: varchar('encryption_iv', { length: 64 }).notNull(),
  encryptionTag: varchar('encryption_tag', { length: 64 }).notNull(),
  accessLevel: varchar('access_level', { length: 50 }).default('owner').notNull(),
  lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }),
  accessCount: integer('access_count').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const subscriptionTiers = pgTable('subscription_tiers', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).unique().notNull(),
  slug: varchar('slug', { length: 50 }).unique().notNull(),
  monthlyPrice: decimal('monthly_price', { precision: 8, scale: 2 }).notNull(),
  annualPrice: decimal('annual_price', { precision: 8, scale: 2 }).notNull(),
  stripePriceIdMonthly: varchar('stripe_price_id_monthly', { length: 255 }),
  stripePriceIdAnnual: varchar('stripe_price_id_annual', { length: 255 }),
  maxStylists: integer('max_stylists'),
  maxClients: integer('max_clients'),
  maxFormulas: integer('max_formulas'),
  features: jsonb('features').default([]).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
