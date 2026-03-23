/**
 * Global middleware — enforces 7-day trial / subscription paywall.
 *
 * Protected routes redirect to /settings/billing when:
 *   - Trial has expired AND
 *   - No active subscription
 *
 * Auth is read from the x-salon-id / x-user-id headers (set by your
 * auth layer). Unauthenticated requests are redirected to /onboarding.
 *
 * Public routes (/, /onboarding, /api/auth, /api/stripe webhook) are
 * always allowed through.
 */
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/',
  '/onboarding',
  '/api/auth',
  '/api/stripe',   // webhooks must be reachable
  '/_next',
  '/favicon.ico',
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith('/_next'));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) return NextResponse.next();

  // Read auth from headers (set by upstream auth middleware / session layer)
  const salonId = request.headers.get('x-salon-id');
  const trialEndsAt = request.headers.get('x-trial-ends-at');
  const subscriptionStatus = request.headers.get('x-subscription-status');

  // No session → onboarding
  if (!salonId) {
    const url = request.nextUrl.clone();
    url.pathname = '/onboarding';
    return NextResponse.redirect(url);
  }

  // Check paywall: trial expired + no active subscription
  const inTrial = trialEndsAt && new Date(trialEndsAt) > new Date();
  const isActive = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';

  if (!inTrial && !isActive && pathname !== '/settings/billing') {
    const url = request.nextUrl.clone();
    url.pathname = '/settings/billing';
    url.searchParams.set('reason', 'trial_expired');
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files and Next.js internals.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
