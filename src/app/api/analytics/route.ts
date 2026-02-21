import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import {
  services,
  formulas,
  clientProfiles,
  inventoryItems,
  stylistMetrics,
} from '@/lib/db/schema';
import { eq, count, sql, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const [totalClients] = await db
    .select({ count: count() })
    .from(clientProfiles)
    .where(eq(clientProfiles.salonId, auth.salonId));

  const [totalFormulas] = await db
    .select({ count: count() })
    .from(formulas)
    .where(eq(formulas.salonId, auth.salonId));

  const [totalServices] = await db
    .select({ count: count() })
    .from(services)
    .where(eq(services.salonId, auth.salonId));

  const lowStockItems = await db
    .select()
    .from(inventoryItems)
    .where(
      sql`${inventoryItems.salonId} = ${auth.salonId} AND ${inventoryItems.currentStockGrams}::numeric <= ${inventoryItems.reorderPointGrams}::numeric`
    );

  const recentMetrics = await db
    .select()
    .from(stylistMetrics)
    .where(eq(stylistMetrics.salonId, auth.salonId))
    .orderBy(desc(stylistMetrics.periodEnd))
    .limit(10);

  return jsonResponse({
    overview: {
      totalClients: totalClients?.count ?? 0,
      totalFormulas: totalFormulas?.count ?? 0,
      totalServices: totalServices?.count ?? 0,
      lowStockAlerts: lowStockItems.length,
    },
    lowStockItems,
    recentMetrics,
  });
}
