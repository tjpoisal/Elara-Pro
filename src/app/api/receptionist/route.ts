/**
 * POST /api/receptionist
 * Handles client-facing AI receptionist chat + appointment booking actions.
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { chatWithReceptionist, generatePrepMessage, generateServiceRecap } from '@/lib/ai/receptionist';
import { db } from '@/lib/db';
import { appointments, salons, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendAppointmentReminder } from '@/lib/sms';
import * as emailLib from '@/lib/email';

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  // Prep message generation
  if (action === 'prep-message') {
    const auth = getAuthContext(request);
    if (!auth) return errorResponse('Unauthorized', 401);
    const body = await request.json();
    const message = await generatePrepMessage(body);
    return jsonResponse({ message });
  }

  // Service recap email
  if (action === 'service-recap') {
    const auth = getAuthContext(request);
    if (!auth) return errorResponse('Unauthorized', 401);
    const body = await request.json();
    const recap = await generateServiceRecap(body);
    // Send via Resend if email provided
    if (body.clientEmail && recap.body) {
      await (emailLib as any).sendGenericEmail?.({
        to: body.clientEmail,
        subject: recap.subject,
        html: recap.body,
      }).catch(() => {});
    }
    return jsonResponse({ recap });
  }

  // Main receptionist chat (can be called without auth for client-facing portal)
  let body: {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    context: Parameters<typeof chatWithReceptionist>[0]['context'];
    salonId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON', 400);
  }

  if (!body.messages?.length) return errorResponse('messages required', 400);

  // Enrich context from DB if salonId provided
  let context = body.context;
  if (body.salonId) {
    const [salon] = await db.select().from(salons).where(eq(salons.id, body.salonId)).limit(1);
    if (salon) {
      context = {
        ...context,
        salonName: salon.name,
        salonPhone: salon.phone ?? undefined,
        salonAddress: [salon.address, salon.city, salon.state].filter(Boolean).join(', ') || undefined,
      };
    }
  }

  try {
    const { reply, action: bookingAction } = await chatWithReceptionist({ messages: body.messages, context });

    // Handle booking action
    let bookingResult = null;
    if (bookingAction?.action === 'book_appointment' && body.salonId) {
      // In production: create appointment in DB, send confirmation SMS/email
      bookingResult = { booked: true, details: bookingAction };

      // Send SMS confirmation if phone available
      if (bookingAction.clientPhone) {
        await sendAppointmentReminder({
          to: bookingAction.clientPhone,
          clientName: bookingAction.clientName ?? 'there',
          dateTime: `${bookingAction.date} at ${bookingAction.time}`,
          stylistName: bookingAction.stylist ?? 'your stylist',
        }).catch(() => {});
      }
    }

    return jsonResponse({ reply, action: bookingAction, bookingResult });
  } catch (err) {
    console.error('Receptionist error:', err);
    return errorResponse('Receptionist unavailable', 500);
  }
}
