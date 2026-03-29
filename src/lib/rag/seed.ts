/**
 * Seed the RAG knowledge base.
 * Run with: npx tsx src/lib/rag/seed.ts
 *
 * Ingests all knowledge chunks from the knowledge/ directory into the
 * knowledge_documents table with vector embeddings.
 *
 * Safe to re-run — uses upsert by title+source to avoid duplicates.
 */
import { db } from '@/lib/db';
import { knowledgeDocuments } from '@/lib/db/schema';
import { embedText } from './embed';
import { CHEMISTRY_KNOWLEDGE } from './knowledge/chemistry';
import { BRAND_KNOWLEDGE } from './knowledge/brands';
import { TECHNIQUE_KNOWLEDGE } from './knowledge/techniques';
import { BUSINESS_KNOWLEDGE } from './knowledge/business';
import { sql } from 'drizzle-orm';

const ALL_KNOWLEDGE = [
  ...CHEMISTRY_KNOWLEDGE,
  ...BRAND_KNOWLEDGE,
  ...TECHNIQUE_KNOWLEDGE,
  ...BUSINESS_KNOWLEDGE,
];

async function seed() {
  console.log(`Seeding ${ALL_KNOWLEDGE.length} knowledge chunks…`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < ALL_KNOWLEDGE.length; i++) {
    const chunk = ALL_KNOWLEDGE[i]!;
    process.stdout.write(`[${i + 1}/${ALL_KNOWLEDGE.length}] ${chunk.title.slice(0, 60)}… `);

    try {
      // Check if already exists
      const existing = await db.execute(sql`
        SELECT id FROM knowledge_documents
        WHERE title = ${chunk.title} AND source = ${chunk.source}
        LIMIT 1
      `);

      if (existing.rows.length > 0) {
        console.log('skip (exists)');
        skipped++;
        continue;
      }

      const embedding = await embedText(chunk.content);

      await db.insert(knowledgeDocuments).values({
        title: chunk.title,
        content: chunk.content,
        category: chunk.category,
        source: chunk.source,
        metadata: chunk.metadata ?? {},
        tokenCount: Math.ceil(chunk.content.length / 4),
        embedding,
      });

      console.log('✓');
      inserted++;

      // Courtesy pause to avoid rate limits
      if (i < ALL_KNOWLEDGE.length - 1) {
        await new Promise((r) => setTimeout(r, 150));
      }
    } catch (err) {
      console.log(`✗ ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped: ${skipped}, Failed: ${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
