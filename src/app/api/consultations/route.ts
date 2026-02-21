import { NextRequest } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  parseBody,
  getAuthContext,
} from '@/lib/api-helpers';
import { createConsultationSchema } from '@/lib/validators';
import { db } from '@/lib/db';
import { consultations } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const results = await db
    .select()
    .from(consultations)
    .where(eq(consultations.salonId, auth.salonId))
    .orderBy(desc(consultations.createdAt))
    .limit(50);

  return jsonResponse({ consultations: results });
}

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const result = await parseBody(request, createConsultationSchema);
  if (result.error) return errorResponse(result.error);

  const [consultation] = await db
    .insert(consultations)
    .values({
      salonId: auth.salonId,
      stylistId: auth.userId,
      clientId: result.data!.clientId,
      rawNotes: result.data!.rawNotes,
      currentLevel: result.data!.currentLevel,
      currentTone: result.data!.currentTone,
      targetLevel: result.data!.targetLevel,
      targetTone: result.data!.targetTone,
      grayPercentage: result.data!.grayPercentage,
      scalpCondition: result.data!.scalpCondition,
      hairCondition: result.data!.hairCondition,
      porosityLevel: result.data!.porosityLevel,
      previousChemical: result.data!.previousChemical,
      desiredResult: result.data!.desiredResult,
      status: 'draft',
    })
    .returning();

  return jsonResponse({ consultation }, 201);
}
