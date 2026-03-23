/**
 * GET /api/analytics
 * Returns dashboard stats for the authenticated salon.
 * Query params:
 *   ?period=today|week|month (default: month)
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import {
  clientProfiles,
  formulas,
  services,
  inventoryItems,
  consultations,
  salons,
} from '@/lib/db/schema';
import { eq, and, gte, count, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const period = url.searchParams.get('period') ?? 'month';

  const now = new Date();
  let periodStart: Date;
  if (period === 'today') {
    periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === 'week') {
    periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else {
    periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const salonId = auth.salonId;

  const [
    [clientCount],
    [formulaCount],
    [serviceCount],
    lowStockItems,
    recentConsultations,
    [salon],
  ] = await Promise.all([
    // Active clients
    db
      .select({ count: count() })
      .from(clientProfiles)
      .where(and(eq(clientProfiles.salonId, salonId), eq(clientProfiles.isActive, true))),

    // Formulas created this period
    db
      .select({ count: count() })
      .from(formulas)
      .where(and(eq(formulas.salonId, salonId), gte(formulas.createdAt, periodStart))),

    // Services this period
    db
      .select({ count: count() })
      .from(services)
      .where(and(eq(services.salonId, salonId), gte(services.createdAt, periodStart))),

    // Low stock: items where current <= minimum
    db
      .select({ count: count() })
      .from(inventoryItems)
      .where(
        and(
          eq(inventoryItems.salonId, salonId),
          sql`${inventoryItems.currentStockGrams} <= ${inventoryItems.minimumStockGrams}`
        )
      ),

    // Recent consultations (last 5)
    db
      .select({
        id: consultations.id,
        status: consultations.status,
        createdAt: consultations.createdAt,
        clientId: consultations.clientId,
        desiredResult: consultations.desiredResult,
      })
      .from(consultations)
      .where(eq(consultations.salonId, salonId))
      .orderBy(sql`${consultations.createdAt} desc`)
      .limit(5),

    // Salon trial info
    db
      .select({ trialEndsAt: salons.trialEndsAt, subscriptionStatus: salons.subscriptionStatus, subscriptionTier: salons.subscriptionTier, voiceEnabled: salons.voiceEnabled })
      .from(salons)
      .where(eq(salons.id, salonId))
      .limit(1),
  ]);

  return jsonResponse({
    period,
    stats: {
      activeClients: clientCount?.count ?? 0,
      formulasThisPeriod: formulaCount?.count ?? 0,
      servicesThisPeriod: serviceCount?.count ?? 0,
      lowStockAlerts: lowStockItems[0]?.count ?? 0,
    },
    recentConsultations,
    salon: salon ?? null,
  });
}
