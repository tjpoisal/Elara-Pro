import {
  pgTable, text, timestamp, uuid, varchar, boolean, integer, jsonb,
} from 'drizzle-orm/pg-core';
import { salons, users, clientProfiles } from './core';
import { consultations } from './consultations';
import { appointments } from './appointments';

export const clientPhotos = pgTable('client_photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  clientId: uuid('client_id').references(() => clientProfiles.id, { onDelete: 'cascade' }).notNull(),
  uploadedByUserId: uuid('uploaded_by_user_id').references(() => users.id),
  consultationId: uuid('consultation_id').references(() => consultations.id),
  appointmentId: uuid('appointment_id').references(() => appointments.id),
  photoType: varchar('photo_type', { length: 30 }).notNull(), // 'before'|'after'|'reference'|'progress'
  storageKey: text('storage_key').notNull(),   // S3/R2 object key
  publicUrl: text('public_url'),
  thumbnailUrl: text('thumbnail_url'),
  caption: text('caption'),
  takenAt: timestamp('taken_at', { withTimezone: true }),
  aiTags: jsonb('ai_tags').default([]).notNull(),             // AI-detected hair attributes
  sortOrder: integer('sort_order').default(0).notNull(),
  isSharedWithClient: boolean('is_shared_with_client').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
