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
import { products } from './products';

export const orderStatusEnum = pgEnum('order_status', [
  'draft',
  'submitted',
  'confirmed',
  'shipped',
  'delivered',
  'canceled',
]);

export const inventoryItems = pgTable('inventory_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull(),
  currentStockGrams: decimal('current_stock_grams', { precision: 10, scale: 2 }).default('0').notNull(),
  minimumStockGrams: decimal('minimum_stock_grams', { precision: 10, scale: 2 }).default('0').notNull(),
  reorderPointGrams: decimal('reorder_point_grams', { precision: 10, scale: 2 }),
  parLevelGrams: decimal('par_level_grams', { precision: 10, scale: 2 }),
  lastRestockedAt: timestamp('last_restocked_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  location: varchar('location', { length: 100 }),
  isAutoReorder: boolean('is_auto_reorder').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const inventoryUsageLogs = pgTable('inventory_usage_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  inventoryItemId: uuid('inventory_item_id')
    .references(() => inventoryItems.id, { onDelete: 'cascade' })
    .notNull(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  usedByUserId: uuid('used_by_user_id').references(() => users.id),
  amountGrams: decimal('amount_grams', { precision: 8, scale: 2 }).notNull(),
  usageType: varchar('usage_type', { length: 50 }).notNull(),
  serviceId: uuid('service_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const distributors = pgTable('distributors', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  contactName: varchar('contact_name', { length: 255 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 30 }),
  website: varchar('website', { length: 255 }),
  accountNumber: varchar('account_number', { length: 100 }),
  minimumOrder: decimal('minimum_order', { precision: 8, scale: 2 }),
  shippingTerms: text('shipping_terms'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const distributorPrices = pgTable('distributor_prices', {
  id: uuid('id').defaultRandom().primaryKey(),
  distributorId: uuid('distributor_id')
    .references(() => distributors.id, { onDelete: 'cascade' })
    .notNull(),
  productId: uuid('product_id')
    .references(() => products.id)
    .notNull(),
  price: decimal('price', { precision: 8, scale: 2 }).notNull(),
  bulkPrice: decimal('bulk_price', { precision: 8, scale: 2 }),
  bulkMinimumQuantity: integer('bulk_minimum_quantity'),
  lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow().notNull(),
});

export const inventoryOrders = pgTable('inventory_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id')
    .references(() => salons.id, { onDelete: 'cascade' })
    .notNull(),
  distributorId: uuid('distributor_id')
    .references(() => distributors.id)
    .notNull(),
  orderedByUserId: uuid('ordered_by_user_id')
    .references(() => users.id)
    .notNull(),
  status: orderStatusEnum('status').default('draft').notNull(),
  orderNumber: varchar('order_number', { length: 100 }),
  items: jsonb('items').default([]).notNull(),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }),
  tax: decimal('tax', { precision: 8, scale: 2 }),
  shipping: decimal('shipping', { precision: 8, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }),
  orderedAt: timestamp('ordered_at', { withTimezone: true }),
  expectedDeliveryAt: timestamp('expected_delivery_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
