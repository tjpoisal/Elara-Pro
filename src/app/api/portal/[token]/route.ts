/**
 * GET /api/portal/[token]
 * Public endpoint — returns appointment + client data for the client portal.
 * No auth required — access is gated by the self-booking token.
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { appointments, clientProfiles, salons, clientPoints } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
  const { token } = params;
  if (!token) return errorResponse('Invalid token', 400);

  const [appt] = await db
    .select()
    .from(appointments)
    .where(eq(appointments.selfBookingToken, token))
    .limit(1);

  if (!appt) return errorResponse('Portal not found or link has expired', 404);

  const [client] = await db
    .select({ firstName: clientProfiles.firstName, lastName: clientProfiles.lastName, email: clientProfiles.email })
    .from(clientProfiles)
    .where(eq(clientProfiles.id, appt.clientId))
    .limit(1);

  const [salon] = await db
    .select({ name: salons.name, phone: salons.phone, address: salons.address, city: salons.city, state: salons.state })
    .from(salons)
    .where(eq(salons.id, appt.salonId))
    .limit(1);

  const [points] = await db
    .select()
    .from(clientPoints)
    .where(eq(clientPoints.clientId, appt.clientId))
    .limit(1);

  return jsonResponse({
    appointment: {
      id: appt.id,
      serviceType: appt.serviceType,
      serviceLabel: appt.serviceLabel,
      scheduledAt: appt.scheduledAt,
      endsAt: appt.endsAt,
      durationMinutes: appt.durationMinutes,
      price: appt.price,
      colorPrepInstructions: appt.colorPrepInstructions,
      clientNotes: appt.clientNotes,
      status: appt.status,
    },
    client: client ?? null,
    salon: salon ? {
      name: salon.name,
      phone: salon.phone,
      address: [salon.address, salon.city, salon.state].filter(Boolean).join(', ') || null,
    } : null,
    loyaltyPoints: points?.totalPoints ?? 0,
    loyaltyTier: points?.tier ?? 'bronze',
    visitStreak: points?.visitStreak ?? 0,
  });
}
