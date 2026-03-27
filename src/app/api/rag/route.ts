/**
 * POST /api/rag?action=search   — search the knowledge base
 * POST /api/rag?action=ingest   — add a custom document
 * POST /api/rag?action=feedback — record retrieval feedback
 * GET  /api/rag?action=stats    — knowledge base stats
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { knowledgeDocuments, ragFeedback, trainingExamples } from '@/lib/db/schema';
import { retrieve } from '@/lib/rag/retrieve';
import { embedText } from '@/lib/rag/embed';
import { eq, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const action = url.searchParams.get('action') ?? 'stats';

  if (action === 'stats') {
    const [total] = await db.select({ count: count() }).from(knowledgeDocuments);
    const byCategory = await db.execute(sql`
      SELECT category, COUNT(*) as count
      FROM knowledge_documents
      GROUP BY category
      ORDER BY count DESC
    `);
    const bySource = await db.execute(sql`
      SELECT source, COUNT(*) as count
      FROM knowledge_documents
      GROUP BY source
      ORDER BY count DESC
    `);
    const [trainingCount] = await db.select({ count: count() }).from(trainingExamples);

    return jsonResponse({
      totalDocuments: total?.count ?? 0,
      trainingExamples: trainingCount?.count ?? 0,
      byCategory: byCategory.rows,
      bySource: bySource.rows,
    });
  }

  return errorResponse('Invalid action', 400);
}

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const action = url.searchParams.get('action') ?? 'search';

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { body = {}; }

  // ── Search ──────────────────────────────────────────────────────────────────
  if (action === 'search') {
    const query = body.query as string;
    if (!query) return errorResponse('query required', 400);

    const chunks = await retrieve(query, {
      topK: (body.topK as number) ?? 5,
      minSimilarity: (body.minSimilarity as number) ?? 0.60,
      category: body.category as string | undefined,
    });

    return jsonResponse({ chunks, count: chunks.length });
  }

  // ── Ingest custom document ──────────────────────────────────────────────────
  if (action === 'ingest') {
    const { title, content, category, source, metadata } = body as {
      title: string; content: string; category: string; source: string; metadata?: Record<string, unknown>;
    };

    if (!title || !content || !category || !source) {
      return errorResponse('title, content, category, source required', 400);
    }

    const embedding = await embedText(content);
    const [doc] = await db.insert(knowledgeDocuments).values({
      title,
      content,
      category,
      source,
      metadata: metadata ?? {},
      tokenCount: Math.ceil(content.length / 4),
      embedding,
    }).returning({ id: knowledgeDocuments.id });

    return jsonResponse({ id: doc?.id, ingested: true }, 201);
  }

  // ── Feedback ────────────────────────────────────────────────────────────────
  if (action === 'feedback') {
    const { documentId, query, rating, response } = body as {
      documentId?: string; query: string; rating: number; response?: string;
    };

    await db.insert(ragFeedback).values({
      documentId: documentId ?? null,
      query,
      rating,
      response: response ?? null,
      salonId: auth.salonId,
    });

    return jsonResponse({ recorded: true });
  }

  // ── Save training example ───────────────────────────────────────────────────
  if (action === 'training') {
    const { instruction, response, context, category, qualityScore } = body as {
      instruction: string; response: string; context?: string;
      category?: string; qualityScore?: number;
    };

    if (!instruction || !response) return errorResponse('instruction and response required', 400);

    const [ex] = await db.insert(trainingExamples).values({
      instruction,
      response,
      context: context ?? null,
      category: category ?? null,
      qualityScore: qualityScore ?? null,
      source: 'user_approved',
      salonId: auth.salonId,
    }).returning({ id: trainingExamples.id });

    return jsonResponse({ id: ex?.id, saved: true }, 201);
  }

  return errorResponse('Invalid action', 400);
}
