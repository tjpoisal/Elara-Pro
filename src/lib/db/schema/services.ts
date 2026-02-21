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
import { salons, users, clientProfiles } from './core';
import { formulas } from './consultations';

export const serviceStatusEnum = pgEnum('service_status', [
  'scheduled',
  'in_progress',
  'processing',
  'completed',
  'canceled',
  'no_show',
]);

export const timerStatusEnum = pgEnum('timer_status', [
  'running',
  'paused',
  'completed',
  'canceled',
]);

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  stylistId: uuid('stylist_id')
    .references(() => users.id)
    .notNull(),
  clientId: uuid('client_id')
    .references(() => clientProfiles.id)
    .notNull(),
  formulaId: uuid('formula_id').references(() => formulas.id),
  status: serviceStatusEnum('status').default('scheduled').notNull(),
  serviceType: varchar('service_type', { length: 100 }).notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  totalDurationMinutes: integer('total_duration_minutes'),
  price: decimal('price', { precision: 8, scale: 2 }),
  productCost: decimal('product_cost', { precision: 8, scale: 2 }),
  notes: text('notes'),
  clientSatisfaction: integer('client_satisfaction'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const timelines = pgTable('timelines', {
  id: uuid('id').defaultRandom().primaryKey(),
  serviceId: uuid('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  stepName: varchar('step_name', { length: 255 }).notNull(),
  stepOrder: integer('step_order').notNull(),
  estimatedMinutes: integer('estimated_minutes'),
  actualMinutes: integer('actual_minutes'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const timerSessions = pgTable('timer_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  serviceId: uuid('service_id')
    .references(() => services.id, { onDelete: 'cascade' })
    .notNull(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  status: timerStatusEnum('status').default('running').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  pausedAt: timestamp('paused_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  elapsedSeconds: integer('elapsed_seconds').default(0).notNull(),
  alertAtSeconds: integer('alert_at_seconds'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
