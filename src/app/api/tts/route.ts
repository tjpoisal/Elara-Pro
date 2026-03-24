/**
 * POST /api/tts
 * Body: { text: string; voiceId?: string }
 *
 * Streams ElevenLabs TTS audio back to the client.
 * Requires the salon to have the voice add-on active ($9.99/mo).
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAuthContext, errorResponse } from '@/lib/api-helpers';
import { streamTTS, DEFAULT_VOICE_ID } from '@/lib/elevenlabs';
import { db } from '@/lib/db';
import { salons } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  // Check voice add-on entitlement
  const [salon] = await db
    .select({ voiceEnabled: salons.voiceEnabled, trialEndsAt: salons.trialEndsAt })
    .from(salons)
    .where(eq(salons.id, auth.salonId))
    .limit(1);

  if (!salon) return errorResponse('Salon not found', 404);

  const inTrial = salon.trialEndsAt && new Date(salon.trialEndsAt) > new Date();
  const hasVoice = salon.voiceEnabled || inTrial;

  if (!hasVoice) {
    return errorResponse('Voice add-on required. Upgrade at Settings → Billing.', 402);
  }

  let text: string;
  let voiceId: string = DEFAULT_VOICE_ID;

  try {
    const body = await request.json();
    text = (body.text ?? '').trim();
    if (body.voiceId) voiceId = body.voiceId;
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  if (!text) return errorResponse('text is required', 400);
  if (text.length > 2000) return errorResponse('text too long (max 2000 chars)', 400);

  try {
    const upstream = await streamTTS({ text, voiceId });

    // Proxy the stream directly — no buffering
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('TTS error:', err);
    return errorResponse('Voice synthesis failed. Please try again.', 500);
  }
}
