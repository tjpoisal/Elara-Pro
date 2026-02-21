import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Free',
    slug: 'free',
    monthlyPrice: 0,
    annualPrice: 0,
    maxStylists: 1,
    maxClients: 25,
    maxFormulas: 50,
    features: [
      'Basic consultation forms',
      'Formula builder (limited)',
      'Client profiles',
      'Color math calculator',
    ],
  },
  pro: {
    name: 'Pro',
    slug: 'pro',
    monthlyPrice: 2900, // cents
    annualPrice: 27900, // $279/yr = ~$23.25/mo
    maxStylists: 1,
    maxClients: 200,
    maxFormulas: 500,
    features: [
      'Everything in Free',
      'AI note parsing',
      'Confidence scoring',
      'Inventory tracking',
      'Barcode scanning',
      'Timer system',
      'Client history',
      'Export formulas',
    ],
  },
  elite: {
    name: 'Elite',
    slug: 'elite',
    monthlyPrice: 7900,
    annualPrice: 75900, // $759/yr = ~$63.25/mo
    maxStylists: 5,
    maxClients: 1000,
    maxFormulas: null, // unlimited
    features: [
      'Everything in Pro',
      'Multi-stylist support',
      'Voice commands',
      'Advanced analytics',
      'Formula vault (encrypted)',
      'Chemical safety tracking',
      'Wellness logging',
      'Priority support',
    ],
  },
  salon: {
    name: 'Salon',
    slug: 'salon',
    monthlyPrice: 19900,
    annualPrice: 190900, // $1,909/yr = ~$159/mo
    maxStylists: null, // unlimited
    maxClients: null,
    maxFormulas: null,
    features: [
      'Everything in Elite',
      'Unlimited stylists',
      'Unlimited clients',
      'Brand partnerships',
      'Distributor management',
      'CEU tracking',
      'Business analytics',
      'Stylist performance metrics',
      'Custom branding',
      'API access',
      'Dedicated support',
    ],
  },
} as const;

export type TierSlug = keyof typeof SUBSCRIPTION_TIERS;

/** Create a Stripe checkout session for a subscription */
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
    payment_method_types: ['card'],
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: params.trialDays
      ? { trial_period_days: params.trialDays }
      : undefined,
  });

  return session.url!;
}

/** Create a Stripe customer */
export async function createCustomer(params: {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}): Promise<string> {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: params.metadata,
  });

  return customer.id;
}

/** Create a billing portal session */
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

/** Cancel a subscription */
export async function cancelSubscription(
  subscriptionId: string,
  immediately = false
): Promise<void> {
  if (immediately) {
    await stripe.subscriptions.cancel(subscriptionId);
  } else {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }
}

/** Get subscription details */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}
