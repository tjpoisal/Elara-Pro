/**
 * GET  /api/appointments?start=ISO&end=ISO  — list appointments in range
 * POST /api/appointments                    — create appointment
 * PATCH /api/appointments?id=xxx            — update status/details
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { appointments, appointmentReminders, clientProfiles, users } from '@/lib/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { sendAppointmentReminder } from '@/lib/sms';
import { nanoid } from 'nanoid';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const stylistId = url.searchParams.get('stylistId');

  const conditions = [eq(appointments.salonId, auth.salonId)];
  if (start) conditions.push(gte(appointments.scheduledAt, new Date(start)));
  if (end) conditions.push(lte(appointments.scheduledAt, new Date(end)));
  if (stylistId) conditions.push(eq(appointments.stylistId, stylistId));

  const rows = await db
    .select({
      id: appointments.id,
      status: appointments.status,
      serviceType: appointments.serviceType,
      serviceLabel: appointments.serviceLabel,
      scheduledAt: appointments.scheduledAt,
      endsAt: appointments.endsAt,
      durationMinutes: appointments.durationMinutes,
      price: appointments.price,
      clientNotes: appointments.clientNotes,
      internalNotes: appointments.internalNotes,
      colorPrepInstructions: appointments.colorPrepInstructions,
      clientId: appointments.clientId,
      stylistId: appointments.stylistId,
      selfBookingToken: appointments.selfBookingToken,
    })
    .from(appointments)
    .where(and(...conditions))
    .orderBy(appointments.scheduledAt);

  return jsonResponse({ appointments: rows });
}

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  let body: {
    clientId: string;
    stylistId?: string;
    serviceType: string;
    serviceLabel?: string;
    scheduledAt: string;
    durationMinutes?: number;
    price?: number;
    internalNotes?: string;
    clientNotes?: string;
    sendReminder?: boolean;
  };

  try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }
  if (!body.clientId || !body.serviceType || !body.scheduledAt) {
    return errorResponse('clientId, serviceType, scheduledAt required', 400);
  }

  const scheduledAt = new Date(body.scheduledAt);
  const duration = body.durationMinutes ?? 60;
  const endsAt = new Date(scheduledAt.getTime() + duration * 60000);
  const token = nanoid(32);

  const [appt] = await db.insert(appointments).values({
    salonId: auth.salonId,
    stylistId: body.stylistId ?? auth.userId,
    clientId: body.clientId,
    serviceType: body.serviceType,
    serviceLabel: body.serviceLabel,
    scheduledAt,
    endsAt,
    durationMinutes: duration,
    price: body.price ? String(body.price) : null,
    internalNotes: body.internalNotes,
    clientNotes: body.clientNotes,
    selfBookingToken: token,
    status: 'confirmed',
  }).returning();

  if (!appt) return errorResponse('Failed to create appointment', 500);

  // Schedule reminders (24h and 2h before)
  const reminder24h = new Date(scheduledAt.getTime() - 24 * 60 * 60 * 1000);
  const reminder2h = new Date(scheduledAt.getTime() - 2 * 60 * 60 * 1000);

  await db.insert(appointmentReminders).values([
    { appointmentId: appt.id, salonId: auth.salonId, channel: 'sms', sendAt: reminder24h, status: 'scheduled' },
    { appointmentId: appt.id, salonId: auth.salonId, channel: 'sms', sendAt: reminder2h, status: 'scheduled' },
  ]);

  // Send immediate confirmation SMS if client has phone
  if (body.sendReminder !== false) {
    const [client] = await db.select({ phone: clientProfiles.phone, firstName: clientProfiles.firstName })
      .from(clientProfiles).where(eq(clientProfiles.id, body.clientId)).limit(1);

    if (client?.phone) {
      await sendAppointmentReminder({
        to: client.phone,
        clientName: client.firstName,
        dateTime: scheduledAt.toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        stylistName: 'your stylist',
      }).catch(() => {});
    }
  }

  return jsonResponse({ appointment: appt }, 201);
}

export async function PATCH(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (!id) return errorResponse('id required', 400);

  let body: Partial<typeof appointments.$inferInsert>;
  try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }

  const [updated] = await db.update(appointments)
    .set({ ...body, updatedAt: new Date() })
    .where(and(eq(appointments.id, id), eq(appointments.salonId, auth.salonId)))
    .returning();

  if (!updated) return errorResponse('Appointment not found', 404);
  return jsonResponse({ appointment: updated });
}
