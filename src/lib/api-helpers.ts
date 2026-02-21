import { NextResponse } from 'next/server';
import type { ZodType } from 'zod/v4';

export function jsonResponse<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export async function parseBody<T>(
  request: Request,
  schema: ZodType<T>
): Promise<{ data: T; error: null } | { data: null; error: string }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);
    if (!result.success) {
      const issues = result.error.issues.map(
        (i) => `${i.path.join('.')}: ${i.message}`
      );
      return { data: null, error: issues.join('; ') };
    }
    return { data: result.data, error: null };
  } catch {
    return { data: null, error: 'Invalid JSON body' };
  }
}

/** Stub auth function — extracts user/salon from headers. Replace with real auth. */
export function getAuthContext(request: Request): {
  userId: string;
  salonId: string;
} | null {
  const userId = request.headers.get('x-user-id');
  const salonId = request.headers.get('x-salon-id');
  if (!userId || !salonId) return null;
  return { userId, salonId };
}
