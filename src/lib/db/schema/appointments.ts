import {
  pgTable, text, timestamp, uuid, varchar, boolean, integer, decimal, jsonb, pgEnum,
} from 'drizzle-orm/pg-core';
import { salons, users, clientProfiles } from './core';
import { formulas } from './consultations';

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'pending', 'confirmed', 'checked_in', 'in_service', 'completed', 'canceled', 'no_show', 'rescheduled',
]);

export const reminderStatusEnum = pgEnum('reminder_status', [
  'scheduled', 'sent', 'failed', 'skipped',
]);

export const appointments = pgTable('appointments', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  stylistId: uuid('stylist_id').references(() => users.id).notNull(),
  clientId: uuid('client_id').references(() => clientProfiles.id).notNull(),
  formulaId: uuid('formula_id').references(() => formulas.id),
  status: appointmentStatusEnum('status').default('pending').notNull(),
  serviceType: varchar('service_type', { length: 100 }).notNull(),
  serviceLabel: varchar('service_label', { length: 255 }),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(60),
  price: decimal('price', { precision: 8, scale: 2 }),
  depositPaid: decimal('deposit_paid', { precision: 8, scale: 2 }),
  colorPrepInstructions: text('color_prep_instructions'),
  internalNotes: text('internal_notes'),
  clientNotes: text('client_notes'),
  cancellationReason: text('cancellation_reason'),
  googleEventId: varchar('google_event_id', { length: 255 }),
  appleEventId: varchar('apple_event_id', { length: 255 }),
  selfBookingToken: varchar('self_booking_token', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const appointmentReminders = pgTable('appointment_reminders', {
  id: uuid('id').defaultRandom().primaryKey(),
  appointmentId: uuid('appointment_id').references(() => appointments.id, { onDelete: 'cascade' }).notNull(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  channel: varchar('channel', { length: 20 }).notNull(), // 'sms' | 'email'
  sendAt: timestamp('send_at', { withTimezone: true }).notNull(),
  status: reminderStatusEnum('status').default('scheduled').notNull(),
  message: text('message'),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const blockedTimes = pgTable('blocked_times', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  stylistId: uuid('stylist_id').references(() => users.id).notNull(),
  label: varchar('label', { length: 255 }),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  recurringRule: varchar('recurring_rule', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
