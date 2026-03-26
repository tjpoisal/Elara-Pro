/**
 * POST /api/business
 * Business Manager AI — metrics analysis, social posts, pricing, retention.
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import {
  analyzeMetrics,
  generateSocialPost,
  generateContentCalendar,
  generatePricingRecommendation,
  generateRetentionStrategy,
  type SalonMetrics,
} from '@/lib/ai/businessManager';
import { db } from '@/lib/db';
import { clientProfiles, formulas, services, salons } from '@/lib/db/schema';
import { eq, and, gte, count, sql } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const action = url.searchParams.get('action') ?? 'analyze';

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { body = {}; }

  if (action === 'social-post') {
    const post = await generateSocialPost({
      platform: (body.platform as any) ?? 'instagram',
      contentType: (body.contentType as any) ?? 'before_after',
      salonName: (body.salonName as string) ?? 'Our Salon',
      serviceHighlight: body.serviceHighlight as string,
      promotionDetails: body.promotionDetails as string,
      brandVoice: body.brandVoice as string,
    });
    return jsonResponse({ post });
  }

  if (action === 'content-calendar') {
    const calendar = await generateContentCalendar({
      salonName: (body.salonName as string) ?? 'Our Salon',
      month: (body.month as string) ?? new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      upcomingPromotions: body.upcomingPromotions as string[],
      brandVoice: body.brandVoice as string,
    });
    return jsonResponse({ calendar });
  }

  if (action === 'pricing') {
    const recommendation = await generatePricingRecommendation({
      currentPrices: (body.currentPrices as any) ?? [],
      marketArea: (body.marketArea as string) ?? 'US',
      salonTier: (body.salonTier as any) ?? 'mid',
    });
    return jsonResponse({ recommendation });
  }

  if (action === 'retention') {
    const strategy = await generateRetentionStrategy({
      lapsedClients: (body.lapsedClients as number) ?? 0,
      avgDaysBetweenVisits: (body.avgDaysBetweenVisits as number) ?? 60,
      retentionRate: (body.retentionRate as number) ?? 65,
      salonName: (body.salonName as string) ?? 'Our Salon',
    });
    return jsonResponse({ strategy });
  }

  // Default: analyze — pull real metrics from DB
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const salonId = auth.salonId;

  const [[clientCount], [serviceCount], [salon]] = await Promise.all([
    db.select({ count: count() }).from(clientProfiles)
      .where(and(eq(clientProfiles.salonId, salonId), eq(clientProfiles.isActive, true))),
    db.select({ count: count() }).from(services)
      .where(and(eq(services.salonId, salonId), gte(services.createdAt, monthStart))),
    db.select({ name: salons.name }).from(salons).where(eq(salons.id, salonId)).limit(1),
  ]);

  const metrics: SalonMetrics = {
    period: now.toLocaleString('default', { month: 'long', year: 'numeric' }),
    activeClients: clientCount?.count ?? 0,
    totalServices: serviceCount?.count ?? 0,
    ...(body.metrics as Partial<SalonMetrics> ?? {}),
  };

  const question = body.question as string | undefined;
  const analysis = await analyzeMetrics({ metrics, question });

  return jsonResponse({ analysis, metrics, salonName: salon?.name });
}
