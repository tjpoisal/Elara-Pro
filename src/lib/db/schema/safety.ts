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

export const patchTestResultEnum = pgEnum('patch_test_result', [
  'pending',
  'negative',
  'mild_reaction',
  'moderate_reaction',
  'severe_reaction',
  'not_performed',
]);

export const consentStatusEnum = pgEnum('consent_status', [
  'pending',
  'signed',
  'declined',
  'expired',
]);

export const patchTests = pgTable('patch_tests', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  clientId: uuid('client_id')
    .references(() => clientProfiles.id)
    .notNull(),
  performedByUserId: uuid('performed_by_user_id')
    .references(() => users.id)
    .notNull(),
  productsTested: jsonb('products_tested').default([]).notNull(),
  applicationSite: varchar('application_site', { length: 100 }).notNull(),
  appliedAt: timestamp('applied_at', { withTimezone: true }).notNull(),
  checkAt: timestamp('check_at', { withTimezone: true }).notNull(),
  result: patchTestResultEnum('result').default('pending').notNull(),
  reactionDetails: text('reaction_details'),
  photoUrl: text('photo_url'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const consentForms = pgTable('consent_forms', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  clientId: uuid('client_id')
    .references(() => clientProfiles.id)
    .notNull(),
  formType: varchar('form_type', { length: 100 }).notNull(),
  status: consentStatusEnum('status').default('pending').notNull(),
  formContent: jsonb('form_content').default({}).notNull(),
  signatureData: text('signature_data'),
  signedAt: timestamp('signed_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  ipAddress: varchar('ip_address', { length: 45 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sdsLibrary = pgTable('sds_library', {
  id: uuid('id').defaultRandom().primaryKey(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 255 }).notNull(),
  sdsUrl: text('sds_url'),
  revisionDate: timestamp('revision_date', { withTimezone: true }),
  hazardClassification: jsonb('hazard_classification').default({}).notNull(),
  activeIngredients: jsonb('active_ingredients').default([]).notNull(),
  firstAidMeasures: text('first_aid_measures'),
  storageRequirements: text('storage_requirements'),
  disposalInstructions: text('disposal_instructions'),
  emergencyPhone: varchar('emergency_phone', { length: 30 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const chemicalExposureLogs = pgTable('chemical_exposure_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  chemicalName: varchar('chemical_name', { length: 255 }).notNull(),
  exposureType: varchar('exposure_type', { length: 100 }).notNull(),
  durationMinutes: integer('duration_minutes'),
  protectiveEquipment: jsonb('protective_equipment').default([]).notNull(),
  ventilationLevel: varchar('ventilation_level', { length: 50 }),
  symptoms: text('symptoms'),
  exposureDate: timestamp('exposure_date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const wellnessLogs = pgTable('wellness_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  logDate: timestamp('log_date', { withTimezone: true }).notNull(),
  skinCondition: varchar('skin_condition', { length: 100 }),
  respiratoryNotes: text('respiratory_notes'),
  handCondition: varchar('hand_condition', { length: 100 }),
  glovesUsed: boolean('gloves_used').default(true).notNull(),
  breaksTaken: integer('breaks_taken'),
  hoursWorked: decimal('hours_worked', { precision: 4, scale: 1 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
