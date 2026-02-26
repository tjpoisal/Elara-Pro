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
} from 'drizzle-orm/pg-core';
import { salons, users } from './core';

export const optimizationHistory = pgTable('optimization_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  optimizationType: varchar('optimization_type', { length: 100 }).notNull(),
  previousValue: jsonb('previous_value'),
  newValue: jsonb('new_value'),
  impactMetric: varchar('impact_metric', { length: 100 }),
  impactValue: decimal('impact_value', { precision: 10, scale: 2 }),
  description: text('description'),
  appliedAt: timestamp('applied_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const wasteLogs = pgTable('waste_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  amountGrams: decimal('amount_grams', { precision: 8, scale: 2 }).notNull(),
  wasteReason: varchar('waste_reason', { length: 100 }).notNull(),
  costImpact: decimal('cost_impact', { precision: 8, scale: 2 }),
  serviceId: uuid('service_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const stylistMetrics = pgTable('stylist_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
  periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
  totalServices: integer('total_services').default(0).notNull(),
  totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 }).default('0').notNull(),
  totalProductCost: decimal('total_product_cost', { precision: 10, scale: 2 }).default('0').notNull(),
  averageServiceTime: integer('average_service_time'),
  clientRetentionRate: decimal('client_retention_rate', { precision: 5, scale: 2 }),
  averageSatisfaction: decimal('average_satisfaction', { precision: 3, scale: 1 }),
  formulasCreated: integer('formulas_created').default(0).notNull(),
  wasteGrams: decimal('waste_grams', { precision: 10, scale: 2 }).default('0').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const certifications = pgTable('certifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  issuingOrganization: varchar('issuing_organization', { length: 255 }).notNull(),
  certificationNumber: varchar('certification_number', { length: 100 }),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  documentUrl: text('document_url'),
  isVerified: boolean('is_verified').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const ceuRecords = pgTable('ceu_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  courseName: varchar('course_name', { length: 255 }).notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  credits: decimal('credits', { precision: 5, scale: 1 }).notNull(),
  category: varchar('category', { length: 100 }),
  completedAt: timestamp('completed_at', { withTimezone: true }).notNull(),
  certificateUrl: text('certificate_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
