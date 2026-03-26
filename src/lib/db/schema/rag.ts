/**
 * RAG (Retrieval-Augmented Generation) schema.
 * Stores chunked knowledge documents with vector embeddings
 * so Elara can retrieve relevant context before answering.
 *
 * Requires pgvector extension on Neon:
 *   CREATE EXTENSION IF NOT EXISTS vector;
 */
import {
  pgTable, text, timestamp, uuid, varchar, integer, decimal, jsonb, index,
} from 'drizzle-orm/pg-core';
import { customType } from 'drizzle-orm/pg-core';

/**
 * Custom vector type for pgvector.
 * Anthropic text-embedding-3-small produces 1536-dim vectors.
 * We use 1536 to match.
 */
export const vector = customType<{ data: number[]; driverData: string }>({
  dataType() { return 'vector(1536)'; },
  toDriver(value: number[]): string { return `[${value.join(',')}]`; },
  fromDriver(value: string): number[] {
    return value.replace(/[\[\]]/g, '').split(',').map(Number);
  },
});

export const knowledgeDocuments = pgTable('knowledge_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  /** Source identifier: 'milady', 'wella', 'redken', 'olaplex', 'elara_internal', etc. */
  source: varchar('source', { length: 100 }).notNull(),
  /** Category: 'chemistry', 'technique', 'brand', 'safety', 'business', 'seo', 'social' */
  category: varchar('category', { length: 50 }).notNull(),
  /** Human-readable title */
  title: varchar('title', { length: 500 }).notNull(),
  /** The actual text chunk (max ~800 tokens) */
  content: text('content').notNull(),
  /** Metadata: brand slug, technique name, chapter, etc. */
  metadata: jsonb('metadata').default({}).notNull(),
  /** Token count estimate */
  tokenCount: integer('token_count'),
  /** pgvector embedding — 1536 dims (Voyage AI / OpenAI compatible) */
  embedding: vector('embedding'),
  /** Cosine similarity search index built separately */
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const ragFeedback = pgTable('rag_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  /** The document chunk that was retrieved */
  documentId: uuid('document_id').references(() => knowledgeDocuments.id),
  /** The user query that triggered retrieval */
  query: text('query').notNull(),
  /** Was this chunk helpful? 1 = yes, -1 = no, 0 = not rated */
  rating: integer('rating').default(0).notNull(),
  /** Elara's response that used this chunk */
  response: text('response'),
  salonId: uuid('salon_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

/** Training examples captured from high-quality interactions */
export const trainingExamples = pgTable('training_examples', {
  id: uuid('id').defaultRandom().primaryKey(),
  /** Instruction-following format: the user prompt */
  instruction: text('instruction').notNull(),
  /** The ideal response (from Elara or human-verified) */
  response: text('response').notNull(),
  /** Context that was provided (RAG chunks, client data, etc.) */
  context: text('context'),
  /** Quality score 1-5 */
  qualityScore: integer('quality_score'),
  /** Source: 'user_approved', 'elara_generated', 'expert_written' */
  source: varchar('source', { length: 50 }).notNull(),
  /** Category for filtering during fine-tuning */
  category: varchar('category', { length: 50 }),
  salonId: uuid('salon_id'),
  /** Whether this has been exported to training dataset */
  exported: integer('exported').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
