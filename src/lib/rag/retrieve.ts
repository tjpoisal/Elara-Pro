/**
 * RAG retrieval engine.
 * Embeds a query, searches pgvector for nearest neighbors,
 * and returns ranked chunks to inject into Elara's context.
 */
import { db } from '@/lib/db';
import { knowledgeDocuments } from '@/lib/db/schema';
import { embedText } from './embed';
import { sql, desc, and, eq } from 'drizzle-orm';

export interface RetrievedChunk {
  id: string;
  source: string;
  category: string;
  title: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

export interface RetrievalOptions {
  /** Max chunks to return (default 5) */
  topK?: number;
  /** Minimum cosine similarity threshold 0–1 (default 0.65) */
  minSimilarity?: number;
  /** Filter by category: 'chemistry'|'technique'|'brand'|'safety'|'business'|'social' */
  category?: string;
  /** Filter by source slug */
  source?: string;
}

/**
 * Retrieve the most relevant knowledge chunks for a query.
 * Uses pgvector cosine distance operator (<=>).
 */
export async function retrieve(
  query: string,
  options: RetrievalOptions = {}
): Promise<RetrievedChunk[]> {
  const { topK = 5, minSimilarity = 0.60, category, source } = options;

  let embedding: number[];
  try {
    embedding = await embedText(query);
  } catch (err) {
    console.error('[RAG] Embedding failed, skipping retrieval:', err);
    return [];
  }

  const embeddingStr = `[${embedding.join(',')}]`;

  // pgvector cosine similarity: 1 - (embedding <=> query_vec)
  // We cast the string literal to vector type in the query
  try {
    const rows = await db.execute(sql`
      SELECT
        id,
        source,
        category,
        title,
        content,
        metadata,
        1 - (embedding <=> ${embeddingStr}::vector) AS similarity
      FROM knowledge_documents
      WHERE embedding IS NOT NULL
        ${category ? sql`AND category = ${category}` : sql``}
        ${source ? sql`AND source = ${source}` : sql``}
        AND 1 - (embedding <=> ${embeddingStr}::vector) >= ${minSimilarity}
      ORDER BY embedding <=> ${embeddingStr}::vector
      LIMIT ${topK}
    `);

    return (rows.rows as any[]).map((row) => ({
      id: row.id,
      source: row.source,
      category: row.category,
      title: row.title,
      content: row.content,
      metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata ?? {},
      similarity: parseFloat(row.similarity),
    }));
  } catch (err) {
    // pgvector extension may not be installed yet — fail gracefully
    console.error('[RAG] Vector search failed (is pgvector enabled?):', err);
    return [];
  }
}

/**
 * Format retrieved chunks into a context block for Elara's system prompt.
 */
export function formatContext(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) return '';

  const sections = chunks.map((c, i) => {
    const meta = c.metadata as Record<string, string>;
    const sourceLabel = [c.source, meta.brand, meta.chapter].filter(Boolean).join(' › ');
    return `[${i + 1}] ${c.title} (${sourceLabel})\n${c.content}`;
  });

  return `\nRELEVANT KNOWLEDGE BASE CONTEXT:\n${sections.join('\n\n---\n\n')}\n\nUse the above context to inform your answer. Cite the source title when referencing specific facts.`;
}

/**
 * Retrieve and format in one call — the main entry point for Elara.
 */
export async function retrieveContext(
  query: string,
  options?: RetrievalOptions
): Promise<string> {
  const chunks = await retrieve(query, options);
  return formatContext(chunks);
}
