import { NextRequest } from 'next/server';
import {
  jsonResponse,
  errorResponse,
  parseBody,
  getAuthContext,
} from '@/lib/api-helpers';
import { createClientSchema } from '@/lib/validators';
import { db } from '@/lib/db';
import { clientProfiles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const results = await db
    .select()
    .from(clientProfiles)
    .where(eq(clientProfiles.salonId, auth.salonId))
    .orderBy(desc(clientProfiles.createdAt))
    .limit(100);

  return jsonResponse({ clients: results });
}

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const result = await parseBody(request, createClientSchema);
  if (result.error) return errorResponse(result.error);

  const [client] = await db
    .insert(clientProfiles)
    .values({
      salonId: auth.salonId,
      primaryStylistId: auth.userId,
      firstName: result.data!.firstName,
      lastName: result.data!.lastName,
      email: result.data!.email,
      phone: result.data!.phone,
      naturalLevel: result.data!.naturalLevel,
      naturalTone: result.data!.naturalTone,
      grayPercentage: result.data!.grayPercentage,
      hairTexture: result.data!.hairTexture,
      hairDensity: result.data!.hairDensity,
      hairPorosity: result.data!.hairPorosity,
      scalpCondition: result.data!.scalpCondition,
      allergies: result.data!.allergies,
      notes: result.data!.notes,
    })
    .returning();

  return jsonResponse({ client }, 201);
}
