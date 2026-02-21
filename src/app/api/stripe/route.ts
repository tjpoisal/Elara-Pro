import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, parseBody, getAuthContext } from '@/lib/api-helpers';
import { createCheckoutSchema } from '@/lib/validators';
import {
  stripe,
  SUBSCRIPTION_TIERS,
  createCheckoutSession,
  createPortalSession,
  type TierSlug,
} from '@/lib/stripe';
import { db } from '@/lib/db';
import { salons } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'webhook') {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    if (!signature) return errorResponse('Missing signature', 400);

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch {
      return errorResponse('Invalid webhook signature', 400);
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;

        const [salon] = await db
          .select()
          .from(salons)
          .where(eq(salons.stripeCustomerId, customerId))
          .limit(1);

        if (salon) {
          // Determine tier from price
          const priceId = subscription.items.data[0]?.price?.id;
          let tier: TierSlug = 'free';
          for (const [slug, config] of Object.entries(SUBSCRIPTION_TIERS)) {
            if (slug === 'free') continue;
            // In production, match against actual Stripe price IDs
            tier = slug as TierSlug;
          }

          await db
            .update(salons)
            .set({
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'past_due',
              stripeSubscriptionId: subscription.id,
              subscriptionTier: tier,
              updatedAt: new Date(),
            })
            .where(eq(salons.id, salon.id));
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id;

        await db
          .update(salons)
          .set({
            subscriptionStatus: 'canceled',
            subscriptionTier: 'free',
            updatedAt: new Date(),
          })
          .where(eq(salons.stripeCustomerId, customerId));
        break;
      }
    }

    return jsonResponse({ received: true });
  }

  // Create checkout session
  if (action === 'checkout') {
    const auth = getAuthContext(request);
    if (!auth) return errorResponse('Unauthorized', 401);

    const result = await parseBody(request, createCheckoutSchema);
    if (result.error) return errorResponse(result.error);

    const [salon] = await db
      .select()
      .from(salons)
      .where(eq(salons.id, auth.salonId))
      .limit(1);

    if (!salon) return errorResponse('Salon not found', 404);

    if (!salon.stripeCustomerId) {
      return errorResponse('Stripe customer not configured. Complete onboarding first.', 400);
    }

    const tier = SUBSCRIPTION_TIERS[result.data!.tier];
    const priceId = result.data!.billingPeriod === 'annual'
      ? `price_${result.data!.tier}_annual`  // Replace with actual Stripe price IDs
      : `price_${result.data!.tier}_monthly`;

    const checkoutUrl = await createCheckoutSession({
      customerId: salon.stripeCustomerId,
      priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      trialDays: 14,
    });

    return jsonResponse({ url: checkoutUrl });
  }

  // Portal session
  if (action === 'portal') {
    const auth = getAuthContext(request);
    if (!auth) return errorResponse('Unauthorized', 401);

    const [salon] = await db
      .select()
      .from(salons)
      .where(eq(salons.id, auth.salonId))
      .limit(1);

    if (!salon?.stripeCustomerId) {
      return errorResponse('No billing account found', 400);
    }

    const portalUrl = await createPortalSession(
      salon.stripeCustomerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`
    );

    return jsonResponse({ url: portalUrl });
  }

  return errorResponse('Invalid action');
}
