/**
 * Stripe integration for Elara Pro subscriptions and add-ons.
 * Requires STRIPE_SECRET_KEY env var.
 */
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export type TierSlug = 'free' | 'pro' | 'elite' | 'salon';

export interface TierConfig {
  name: string;
  monthlyPrice: number; // cents
  annualPrice: number;  // cents (full year)
  features: string[];
  maxStylists: number | null;
  maxClients: number | null;
}

export const SUBSCRIPTION_TIERS: Record<TierSlug, TierConfig> = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    maxStylists: 1,
    maxClients: 25,
    features: ['1 stylist', '25 clients', '50 formulas', 'Basic consultation forms', 'Color math calculator'],
  },
  pro: {
    name: 'Pro',
    monthlyPrice: 2900,
    annualPrice: 27840, // $232/yr = $19.33/mo
    maxStylists: 3,
    maxClients: 200,
    features: ['3 stylists', '200 clients', '500 formulas', 'AI note parsing', 'Inventory tracking', 'Barcode scanning', 'Client history export'],
  },
  elite: {
    name: 'Elite',
    monthlyPrice: 7900,
    annualPrice: 75840, // $632/yr = $52.67/mo
    maxStylists: 10,
    maxClients: 1000,
    features: ['10 stylists', '1,000 clients', 'Unlimited formulas', 'Voice commands', 'Advanced analytics', 'Formula vault', 'Chemical safety tracking'],
  },
  salon: {
    name: 'Salon',
    monthlyPrice: 19900,
    annualPrice: 191040, // $1,592/yr = $132.67/mo
    maxStylists: null,
    maxClients: null,
    features: ['Unlimited stylists', 'Unlimited clients', 'Brand partnerships', 'CEU tracking', 'Business analytics', 'Custom branding', 'API access', 'Dedicated support'],
  },
};

export const VOICE_ADDON = {
  name: 'Elara Voice',
  monthlyPrice: 999, // $9.99/mo
  features: ['ElevenLabs TTS', '5 curated voices', 'Hands-free formula recall', 'Voice session logging'],
};

/**
 * Create a Stripe Checkout session for a subscription upgrade.
 */
export async function createCheckoutSession(params: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  trialDays?: number;
}): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: 'subscription',
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: params.trialDays
      ? { trial_period_days: params.trialDays }
      : undefined,
    allow_promotion_codes: true,
  });

  if (!session.url) throw new Error('Stripe did not return a checkout URL');
  return session.url;
}

/**
 * Create a Stripe Customer Portal session for managing billing.
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  return session.url;
}

/**
 * Create a Stripe customer for a new salon.
 */
export async function createStripeCustomer(params: {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}): Promise<string> {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata ?? {},
  });
  return customer.id;
}
