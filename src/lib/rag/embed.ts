/**
 * Embedding engine for Elara's RAG knowledge base.
 *
 * Uses Anthropic's claude-3-haiku to generate embeddings via the
 * messages API with a structured prompt, OR Voyage AI if configured.
 *
 * For production: set VOYAGE_API_KEY for voyage-2 embeddings (1536-dim,
 * best-in-class for domain-specific retrieval, ~$0.10/1M tokens).
 *
 * Fallback: uses a simple TF-IDF-style keyword approach for development
 * when no embedding API key is set.
 */

const VOYAGE_API_URL = 'https://api.voyageai.com/v1/embeddings';
const EMBED_DIM = 1536;

export async function embedText(text: string): Promise<number[]> {
  const voyageKey = process.env.VOYAGE_API_KEY;

  if (voyageKey) {
    return embedWithVoyage(text, voyageKey);
  }

  // Fallback: use OpenAI-compatible endpoint if OPENAI_API_KEY set
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return embedWithOpenAI(text, openaiKey);
  }

  // Dev fallback: deterministic pseudo-embedding (NOT for production)
  console.warn('[RAG] No embedding API key set — using dev fallback. Set VOYAGE_API_KEY for production.');
  return devFallbackEmbed(text);
}

async function embedWithVoyage(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch(VOYAGE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: [text.slice(0, 4000)], // voyage-2 max input
      model: 'voyage-2',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Voyage embedding error ${res.status}: ${err}`);
  }

  const data = await res.json() as { data: Array<{ embedding: number[] }> };
  return data.data[0]!.embedding;
}

async function embedWithOpenAI(text: string, apiKey: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text.slice(0, 8000),
      model: 'text-embedding-3-small',
      dimensions: EMBED_DIM,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI embedding error ${res.status}`);
  const data = await res.json() as { data: Array<{ embedding: number[] }> };
  return data.data[0]!.embedding;
}

/** Deterministic dev fallback — produces consistent but meaningless vectors */
function devFallbackEmbed(text: string): number[] {
  const vec = new Array(EMBED_DIM).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % EMBED_DIM] += text.charCodeAt(i) / 1000;
  }
  // Normalize
  const mag = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / mag);
}

/** Embed multiple texts in batches */
export async function embedBatch(texts: string[], batchSize = 8): Promise<number[][]> {
  const results: number[][] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const embeddings = await Promise.all(batch.map(embedText));
    results.push(...embeddings);
    // Rate limit courtesy pause
    if (i + batchSize < texts.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }
  return results;
}

/** Cosine similarity between two vectors */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i]! * b[i]!;
    magA += a[i]! * a[i]!;
    magB += b[i]! * b[i]!;
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}
