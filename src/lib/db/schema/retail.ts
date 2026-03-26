import {
  pgTable, text, timestamp, uuid, varchar, boolean, integer, decimal, jsonb,
} from 'drizzle-orm/pg-core';
import { salons, users, clientProfiles } from './core';
import { products } from './products';
import { appointments } from './appointments';

export const retailRecommendations = pgTable('retail_recommendations', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  clientId: uuid('client_id').references(() => clientProfiles.id).notNull(),
  stylistId: uuid('stylist_id').references(() => users.id).notNull(),
  appointmentId: uuid('appointment_id').references(() => appointments.id),
  productId: uuid('product_id').references(() => products.id),
  productName: varchar('product_name', { length: 255 }).notNull(), // fallback if no DB product
  reason: text('reason').notNull(),                                 // AI-generated explanation
  affiliateUrl: text('affiliate_url'),
  retailPrice: decimal('retail_price', { precision: 8, scale: 2 }),
  wasSold: boolean('was_sold').default(false).notNull(),
  soldAt: timestamp('sold_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const retailSales = pgTable('retail_sales', {
  id: uuid('id').defaultRandom().primaryKey(),
  salonId: uuid('salon_id').references(() => salons.id, { onDelete: 'cascade' }).notNull(),
  clientId: uuid('client_id').references(() => clientProfiles.id).notNull(),
  stylistId: uuid('stylist_id').references(() => users.id).notNull(),
  items: jsonb('items').default([]).notNull(),  // [{ productName, qty, price }]
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  tax: decimal('tax', { precision: 8, scale: 2 }),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
