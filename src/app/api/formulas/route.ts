import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, parseBody, getAuthContext } from '@/lib/api-helpers';
import { createFormulaSchema } from '@/lib/validators';
import { db } from '@/lib/db';
import { formulas, formulaZones, formulaProducts } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const results = await db
    .select()
    .from(formulas)
    .where(eq(formulas.salonId, auth.salonId))
    .orderBy(desc(formulas.createdAt))
    .limit(50);

  return jsonResponse({ formulas: results });
}

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const result = await parseBody(request, createFormulaSchema);
  if (result.error) return errorResponse(result.error);

  const [formula] = await db
    .insert(formulas)
    .values({
      salonId: auth.salonId,
      stylistId: auth.userId,
      consultationId: result.data!.consultationId,
      clientId: result.data!.clientId,
      name: result.data!.name,
      notes: result.data!.notes,
      isTemplate: result.data!.isTemplate ?? false,
      status: 'draft',
    })
    .returning();

  if (!formula) return errorResponse('Failed to create formula', 500);

  // Create zones and their products
  for (let i = 0; i < result.data!.zones.length; i++) {
    const zoneData = result.data!.zones[i]!;
    const [zone] = await db
      .insert(formulaZones)
      .values({
        formulaId: formula.id,
        zoneType: zoneData.zoneType,
        zoneName: zoneData.zoneName,
        developerVolume: zoneData.developerVolume,
        mixingRatio: zoneData.mixingRatio,
        processingTime: zoneData.processingTime,
        heatRequired: zoneData.heatRequired ?? false,
        applicationMethod: zoneData.applicationMethod,
        applicationOrder: i + 1,
      })
      .returning();

    if (!zone) continue;

    for (let j = 0; j < zoneData.products.length; j++) {
      const product = zoneData.products[j]!;
      await db.insert(formulaProducts).values({
        formulaZoneId: zone.id,
        productId: product.productId,
        amountGrams: String(product.amountGrams),
        sortOrder: j,
      });
    }
  }

  return jsonResponse({ formula }, 201);
}
