/**
 * Knowledge base seeder.
 * Run once to populate the vector DB with all Elara knowledge.
 * Re-run to update existing documents (upsert by title+source).
 *
 * Usage: npx tsx src/lib/rag/seed.ts
 */
import { db } from '@/lib/db';
import { knowledgeDocuments } from '@/lib/db/schema';
import { embedText } from './embed';
import { CHEMISTRY_KNOWLEDGE } from './knowledge/chemistry';
import { BRAND_KNOWLEDGE } from './knowledge/brands';
import { TECHNIQUE_KNOWLEDGE } from './knowledge/techniques';
import { BUSINESS_KNOWLEDGE } from './knowledge/business';
import { eq, and } from 'drizzle-orm';

const ALL_KNOWLEDGE = [
  ...CHEMISTRY_KNOWLEDGE,
  ...BRAND_KNOWLEDGE,
  ...TECHNIQUE_KNOWLEDGE,
  ...BUSINESS_KNOWLEDGE,
];

async function seed() {
  console.log(`[RAG Seed] Starting — ${ALL_KNOWLEDGE.length} documents to process`);

  // Ensure pgvector extension exists
  try {
    await db.execute(`CREATE EXTENSION IF NOT EXISTS vector`);
    console.log('[RAG Seed] pgvector extension ready');
  } catch (err) {
    console.warn('[RAG Seed] Could not create pgvector extension (may already exist):', err);
  }

  let inserted = 0;
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < ALL_KNOWLEDGE.length; i++) {
    const doc = ALL_KNOWLEDGE[i]!;
    console.log(`[RAG Seed] ${i + 1}/${ALL_KNOWLEDGE.length} — ${doc.title}`);

    try {
      const embedding = await embedText(doc.content);
      const tokenCount = Math.ceil(doc.content.length / 4); // rough estimate

      // Check if document already exists
      const existing = await db
        .select({ id: knowledgeDocuments.id })
        .from(knowledgeDocuments)
        .where(
          and(
            eq(knowledgeDocuments.title, doc.title),
            eq(knowledgeDocuments.source, doc.source)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(knowledgeDocuments)
          .set({
            content: doc.content,
            category: doc.category,
            metadata: doc.metadata,
            tokenCount,
            embedding,
            updatedAt: new Date(),
          })
          .where(eq(knowledgeDocuments.id, existing[0]!.id));
        updated++;
      } else {
        await db.insert(knowledgeDocuments).values({
          source: doc.source,
          category: doc.category,
          title: doc.title,
          content: doc.content,
          metadata: doc.metadata,
          tokenCount,
          embedding,
        });
        inserted++;
      }

      // Courtesy pause to avoid rate limiting
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      console.error(`[RAG Seed] Failed: ${doc.title}`, err);
      failed++;
    }
  }

  console.log(`\n[RAG Seed] Complete — ${inserted} inserted, ${updated} updated, ${failed} failed`);
}

// Run if called directly
seed().catch(console.error);
