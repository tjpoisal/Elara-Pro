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
import { salons } from './core';

export const productCategoryEnum = pgEnum('product_category', [
  'permanent',
  'demi_permanent',
  'semi_permanent',
  'lightener',
  'developer',
  'toner',
  'gloss',
  'additive',
  'treatment',
  'other',
]);

export const brands = pgTable('brands', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).unique().notNull(),
  logoUrl: text('logo_url'),
  website: varchar('website', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const productLines = pgTable('product_lines', {
  id: uuid('id').defaultRandom().primaryKey(),
  brandId: uuid('brand_id')
    .references(() => brands.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  category: productCategoryEnum('category').notNull(),
  defaultMixingRatio: varchar('default_mixing_ratio', { length: 20 }),
  defaultProcessingTime: integer('default_processing_time'),
  phRange: varchar('ph_range', { length: 20 }),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  productLineId: uuid('product_line_id')
    .references(() => productLines.id, { onDelete: 'cascade' })
    .notNull(),
  brandId: uuid('brand_id')
    .references(() => brands.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  shade: varchar('shade', { length: 50 }),
  level: integer('level'),
  tone: varchar('tone', { length: 50 }),
  upc: varchar('upc', { length: 50 }),
  sku: varchar('sku', { length: 100 }),
  sizeOz: decimal('size_oz', { precision: 6, scale: 2 }),
  sizeGrams: decimal('size_grams', { precision: 8, scale: 2 }),
  wholesalePrice: decimal('wholesale_price', { precision: 8, scale: 2 }),
  retailPrice: decimal('retail_price', { precision: 8, scale: 2 }),
  colorData: jsonb('color_data').default({}).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const brandPartnerships = pgTable('brand_partnerships', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  brandId: uuid('brand_id')
    .references(() => brands.id, { onDelete: 'cascade' })
    .notNull(),
  partnershipType: varchar('partnership_type', { length: 50 }).notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }),
  contractStartDate: timestamp('contract_start_date', { withTimezone: true }),
  contractEndDate: timestamp('contract_end_date', { withTimezone: true }),
  terms: jsonb('terms').default({}).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
