import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, parseBody } from '@/lib/api-helpers';
import { loginSchema, registerSchema } from '@/lib/validators';
import { db } from '@/lib/db';
import { users, salons } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createHash, randomBytes } from 'crypto';

function hashPassword(password: string, salt: string): string {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'register') {
    const result = await parseBody(request, registerSchema);
    if (result.error) return errorResponse(result.error);

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, result.data!.email))
      .limit(1);

    if (existing.length > 0) {
      return errorResponse('Email already registered', 409);
    }

    const salt = randomBytes(16).toString('hex');
    const passwordHash = hashPassword(result.data!.password, salt) + ':' + salt;

    const [salon] = await db
      .insert(salons)
      .values({
        name: result.data!.salonName,
        email: result.data!.email,
      })
      .returning();

    if (!salon) return errorResponse('Failed to create salon', 500);

    const [user] = await db
      .insert(users)
      .values({
        salonId: salon.id,
        email: result.data!.email,
        passwordHash,
        firstName: result.data!.firstName,
        lastName: result.data!.lastName,
        role: 'owner',
      })
      .returning();

    if (!user) return errorResponse('Failed to create user', 500);

    return jsonResponse(
      {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          salonId: salon.id,
        },
      },
      201
    );
  }

  if (action === 'login') {
    const result = await parseBody(request, loginSchema);
    if (result.error) return errorResponse(result.error);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, result.data!.email))
      .limit(1);

    if (!user) return errorResponse('Invalid credentials', 401);

    const [storedHash, salt] = user.passwordHash.split(':');
    if (!salt || !storedHash) return errorResponse('Invalid credentials', 401);

    const inputHash = hashPassword(result.data!.password, salt);
    if (inputHash !== storedHash) {
      return errorResponse('Invalid credentials', 401);
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    return jsonResponse({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        salonId: user.salonId,
      },
    });
  }

  if (action === 'update-salon') {
    const authCtx = getAuthContext(request);
    if (!authCtx) return errorResponse('Unauthorized', 401);

    let body: Record<string, string | undefined>;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }

    await db
      .update(salons)
      .set({
        ...(body.name ? { name: body.name } : {}),
        ...(body.email !== undefined ? { email: body.email } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.address !== undefined ? { address: body.address } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.state !== undefined ? { state: body.state } : {}),
        ...(body.preferredVoiceId !== undefined ? { preferredVoiceId: body.preferredVoiceId } : {}),
        updatedAt: new Date(),
      })
      .where(eq(salons.id, authCtx.salonId));

    return jsonResponse({ ok: true });
  }

  return errorResponse('Invalid action. Use ?action=register or ?action=login');
}

export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'update-salon') {
    const { getAuthContext: auth } = await import('@/lib/api-helpers');
    const authCtx = auth(request);
    if (!authCtx) return errorResponse('Unauthorized', 401);

    let body: Record<string, string | undefined>;
    try { body = await request.json(); } catch { return errorResponse('Invalid JSON', 400); }

    await db
      .update(salons)
      .set({
        ...(body.name ? { name: body.name } : {}),
        ...(body.email !== undefined ? { email: body.email } : {}),
        ...(body.phone !== undefined ? { phone: body.phone } : {}),
        ...(body.address !== undefined ? { address: body.address } : {}),
        ...(body.city !== undefined ? { city: body.city } : {}),
        ...(body.state !== undefined ? { state: body.state } : {}),
        ...(body.preferredVoiceId !== undefined ? { preferredVoiceId: body.preferredVoiceId } : {}),
        updatedAt: new Date(),
      })
      .where(eq(salons.id, authCtx.salonId));

    return jsonResponse({ ok: true });
  }

  return errorResponse('Invalid action');
}
