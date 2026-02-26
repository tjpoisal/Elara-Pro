import { NextRequest } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  parseBody,
  getAuthContext,
} from '@/lib/api-helpers';
import { inventoryAdjustSchema, barcodeLookupSchema } from '@/lib/validators';
import { db } from '@/lib/db';
import {
  inventoryItems,
  inventoryUsageLogs,
  products,
} from '@/lib/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const upc = url.searchParams.get('upc');

  // Barcode lookup
  if (upc) {
    const parsed = barcodeLookupSchema.safeParse({ upc });
    if (!parsed.success) return errorResponse('Invalid UPC format');

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.upc, parsed.data.upc))
      .limit(1);

    if (!product) return errorResponse('Product not found for UPC', 404);

    return jsonResponse({ product });
  }

  // List inventory
  const items = await db
    .select()
    .from(inventoryItems)
    .where(eq(inventoryItems.salonId, auth.salonId))
    .orderBy(desc(inventoryItems.updatedAt));

  return jsonResponse({ inventory: items });
}

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const result = await parseBody(request, inventoryAdjustSchema);
  if (result.error) return errorResponse(result.error);

  // Verify the item belongs to this salon
  const [item] = await db
    .select()
    .from(inventoryItems)
    .where(
      and(
        eq(inventoryItems.id, result.data!.inventoryItemId),
        eq(inventoryItems.salonId, auth.salonId)
      )
    )
    .limit(1);

  if (!item) return errorResponse('Inventory item not found', 404);

  // Adjust stock
  const isDeduction = ['service', 'waste', 'expired'].includes(result.data!.usageType);
  const adjustment = isDeduction ? -Math.abs(result.data!.amountGrams) : Math.abs(result.data!.amountGrams);

  await db
    .update(inventoryItems)
    .set({
      currentStockGrams: sql`${inventoryItems.currentStockGrams} + ${adjustment}`,
      updatedAt: new Date(),
      ...(result.data!.usageType === 'restock' ? { lastRestockedAt: new Date() } : {}),
    })
    .where(eq(inventoryItems.id, result.data!.inventoryItemId));

  // Log the usage
  const [log] = await db
    .insert(inventoryUsageLogs)
    .values({
      inventoryItemId: result.data!.inventoryItemId,
      salonId: auth.salonId,
      usedByUserId: auth.userId,
      amountGrams: String(Math.abs(result.data!.amountGrams)),
      usageType: result.data!.usageType,
      serviceId: result.data!.serviceId,
      notes: result.data!.notes,
    })
    .returning();

  return jsonResponse({ log, adjustment }, 201);
}
