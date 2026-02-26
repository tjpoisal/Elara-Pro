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
import { products } from './products';

export const consultStatusEnum = pgEnum('consult_status', [
  'draft',
  'in_progress',
  'completed',
  'archived',
]);

export const formulaStatusEnum = pgEnum('formula_status', [
  'draft',
  'active',
  'archived',
  'favorite',
]);

export const zoneTypeEnum = pgEnum('zone_type', [
  'roots',
  'midshaft',
  'ends',
  'full_head',
  'highlights',
  'lowlights',
  'balayage',
  'gloss',
  'toner',
  'custom',
]);

export const consultations = pgTable('consultations', {
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
  status: consultStatusEnum('status').default('draft').notNull(),
  rawNotes: text('raw_notes'),
  parsedNotes: jsonb('parsed_notes'),
  aiConfidenceScore: decimal('ai_confidence_score', { precision: 4, scale: 2 }),
  currentLevel: integer('current_level'),
  currentTone: varchar('current_tone', { length: 50 }),
  targetLevel: integer('target_level'),
  targetTone: varchar('target_tone', { length: 50 }),
  grayPercentage: integer('gray_percentage'),
  scalpCondition: varchar('scalp_condition', { length: 100 }),
  hairCondition: varchar('hair_condition', { length: 100 }),
  porosityLevel: varchar('porosity_level', { length: 50 }),
  previousChemical: text('previous_chemical'),
  desiredResult: text('desired_result'),
  contraindications: jsonb('contraindications').default([]).notNull(),
  narrative: text('narrative'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const consultPhotos = pgTable('consult_photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  consultationId: uuid('consultation_id')
    .references(() => consultations.id, { onDelete: 'cascade' })
    .notNull(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  photoUrl: text('photo_url').notNull(),
  photoType: varchar('photo_type', { length: 50 }).notNull(),
  lightingCondition: varchar('lighting_condition', { length: 50 }),
  notes: text('notes'),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const formulas = pgTable('formulas', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  consultationId: uuid('consultation_id').references(() => consultations.id),
  stylistId: uuid('stylist_id')
    .references(() => users.id)
    .notNull(),
  clientId: uuid('client_id').references(() => clientProfiles.id),
  name: varchar('name', { length: 255 }).notNull(),
  status: formulaStatusEnum('status').default('draft').notNull(),
  totalProcessingTime: integer('total_processing_time'),
  totalCost: decimal('total_cost', { precision: 8, scale: 2 }),
  retailPrice: decimal('retail_price', { precision: 8, scale: 2 }),
  notes: text('notes'),
  isTemplate: boolean('is_template').default(false).notNull(),
  parentFormulaId: uuid('parent_formula_id'),
  version: integer('version').default(1).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const formulaZones = pgTable('formula_zones', {
  id: uuid('id').defaultRandom().primaryKey(),
  formulaId: uuid('formula_id')
    .references(() => formulas.id, { onDelete: 'cascade' })
    .notNull(),
  zoneType: zoneTypeEnum('zone_type').notNull(),
  zoneName: varchar('zone_name', { length: 100 }),
  developerVolume: integer('developer_volume'),
  mixingRatio: varchar('mixing_ratio', { length: 20 }),
  processingTime: integer('processing_time'),
  heatRequired: boolean('heat_required').default(false).notNull(),
  applicationMethod: varchar('application_method', { length: 100 }),
  applicationOrder: integer('application_order').default(1).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const formulaProducts = pgTable('formula_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  formulaZoneId: uuid('formula_zone_id')
    .references(() => formulaZones.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull(),
  amountGrams: decimal('amount_grams', { precision: 8, scale: 2 }).notNull(),
  proportion: decimal('proportion', { precision: 5, scale: 2 }),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
