/**
 * GET  /api/clients/[id]              — client profile
 * GET  /api/clients/[id]?section=services   — service history
 * GET  /api/clients/[id]?section=formulas   — formulas for client
 * GET  /api/clients/[id]?section=patch-tests — patch test records
 * GET  /api/clients/[id]?section=photos     — client photos
 * PATCH /api/clients/[id]             — update client profile
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import {
  clientProfiles, users, services, formulas, patchTests, clientPhotos,
} from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const { id } = params;
  const section = new URL(request.url).searchParams.get('section');

  // Verify client belongs to this salon
  const [client] = await db
    .select()
    .from(clientProfiles)
    .where(and(eq(clientProfiles.id, id), eq(clientProfiles.salonId, auth.salonId)))
    .limit(1);

  if (!client) return errorResponse('Client not found', 404);

  if (!section) {
    // Full profile
    const stylist = client.primaryStylistId
      ? await db.select({ firstName: users.firstName, lastName: users.lastName })
          .from(users).where(eq(users.id, client.primaryStylistId)).limit(1)
          .then((r) => r[0])
      : null;

    return jsonResponse({
      ...client,
      primaryStylist: stylist ? `${stylist.firstName} ${stylist.lastName}` : null,
      memberSince: client.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
  }

  if (section === 'services') {
    const rows = await db
      .select({
        id: services.id,
        serviceType: services.serviceType,
        completedAt: services.completedAt,
        price: services.price,
        clientSatisfaction: services.clientSatisfaction,
        notes: services.notes,
        stylistId: services.stylistId,
      })
      .from(services)
      .where(and(eq(services.clientId, id), eq(services.salonId, auth.salonId)))
      .orderBy(desc(services.completedAt))
      .limit(50);

    // Enrich with stylist names
    const enriched = await Promise.all(rows.map(async (s) => {
      const stylist = await db.select({ firstName: users.firstName, lastName: users.lastName })
        .from(users).where(eq(users.id, s.stylistId)).limit(1).then((r) => r[0]);
      return {
        id: s.id,
        service: s.serviceType,
        date: s.completedAt
          ? new Date(s.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : '—',
        stylist: stylist ? `${stylist.firstName} ${stylist.lastName}` : 'Unknown',
        formula: s.notes ?? '',
        price: s.price ? `$${parseFloat(s.price).toFixed(0)}` : '—',
        satisfaction: s.clientSatisfaction ?? 0,
      };
    }));

    return jsonResponse(enriched);
  }

  if (section === 'formulas') {
    const rows = await db
      .select({ id: formulas.id, name: formulas.name, createdAt: formulas.createdAt, notes: formulas.notes })
      .from(formulas)
      .where(and(eq(formulas.clientId, id), eq(formulas.salonId, auth.salonId)))
      .orderBy(desc(formulas.createdAt))
      .limit(50);

    return jsonResponse(rows.map((f) => ({
      id: f.id,
      name: f.name,
      date: new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      zones: 0, // zone count would require a join — simplified for now
      brand: f.notes ?? '',
    })));
  }

  if (section === 'patch-tests') {
    const rows = await db
      .select()
      .from(patchTests)
      .where(and(eq(patchTests.clientId, id), eq(patchTests.salonId, auth.salonId)))
      .orderBy(desc(patchTests.appliedAt))
      .limit(20);

    return jsonResponse(rows.map((pt) => ({
      id: pt.id,
      date: new Date(pt.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      products: Array.isArray(pt.productsTested) ? (pt.productsTested as string[]).join(', ') : String(pt.productsTested),
      result: pt.result,
      expiresAt: new Date(pt.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    })));
  }

  if (section === 'photos') {
    const rows = await db
      .select({ id: clientPhotos.id, photoType: clientPhotos.photoType, publicUrl: clientPhotos.publicUrl, createdAt: clientPhotos.createdAt })
      .from(clientPhotos)
      .where(and(eq(clientPhotos.clientId, id), eq(clientPhotos.salonId, auth.salonId)))
      .orderBy(desc(clientPhotos.createdAt))
      .limit(50);

    return jsonResponse(rows.map((p) => ({
      id: p.id,
      type: p.photoType as 'before' | 'after',
      date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      url: p.publicUrl,
    })));
  }

  return errorResponse('Unknown section', 400);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const [existing] = await db
    .select({ id: clientProfiles.id })
    .from(clientProfiles)
    .where(and(eq(clientProfiles.id, params.id), eq(clientProfiles.salonId, auth.salonId)))
    .limit(1);

  if (!existing) return errorResponse('Client not found', 404);

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }

  const [updated] = await db
    .update(clientProfiles)
    .set({ ...body, updatedAt: new Date() } as Partial<typeof clientProfiles.$inferInsert>)
    .where(eq(clientProfiles.id, params.id))
    .returning();

  return jsonResponse({ client: updated });
}
