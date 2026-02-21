import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, parseBody, getAuthContext } from '@/lib/api-helpers';
import { voiceLogSchema } from '@/lib/validators';
import { db } from '@/lib/db';
import { voiceLogs } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const logs = await db
    .select()
    .from(voiceLogs)
    .where(eq(voiceLogs.salonId, auth.salonId))
    .orderBy(desc(voiceLogs.createdAt))
    .limit(50);

  return jsonResponse({ voiceLogs: logs });
}

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const result = await parseBody(request, voiceLogSchema);
  if (result.error) return errorResponse(result.error);

  const [log] = await db
    .insert(voiceLogs)
    .values({
      salonId: auth.salonId,
      userId: auth.userId,
      transcription: result.data!.transcription,
      durationSeconds: result.data!.durationSeconds,
      wakeWord: result.data!.wakeWord,
    })
    .returning();

  return jsonResponse({ voiceLog: log }, 201);
}
