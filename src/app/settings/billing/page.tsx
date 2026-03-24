'use client';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Badge } from '@/components/Navigation';
import { SUBSCRIPTION_TIERS, VOICE_ADDON } from '@/lib/stripe';

interface SalonBillingInfo {
  subscriptionTier: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  voiceEnabled: boolean;
}

function TrialCountdown({ endsAt }: { endsAt: string }) {
  const end = new Date(endsAt);
  const now = new Date();
  const expired = end <= now;
  const daysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className={css`
      background: ${expired ? theme.colors.error + '15' : theme.colors.roseGold + '15'};
      border: 1px solid ${expired ? theme.colors.error + '40' : theme.colors.roseGold + '40'};
      border-radius: ${theme.radii.md};
      padding: 1rem 1.25rem;
      margin-bottom: 2rem;
      display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
    `}>
      <div>
        <p className={css`color: ${expired ? theme.colors.error : theme.colors.roseGold}; font-weight: 600; margin: 0;`}>
          {expired ? 'Free trial expired' : `Free trial — ${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
        </p>
        <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0.25rem 0 0;`}>
          {expired
            ? 'Upgrade to continue using Elara Pro.'
            : `Trial ends ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
        </p>
      </div>
      {expired && <Button onClick={() => {}}>Choose a Plan</Button>}
    </div>
  );
}

export default function BillingPage() {
  const [billing, setBilling] = useState<SalonBillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    fetch('/api/analytics?period=month')
      .then((r) => r.json())
      .then((d) => setBilling(d.salon ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const tiers = Object.entries(SUBSCRIPTION_TIERS);
  const currentTier = billing?.subscriptionTier ?? 'free';

  const handleUpgrade = async (tier: string, period: 'monthly' | 'annual') => {
    const res = await fetch('/api/stripe?action=checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier, billingPeriod: period }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handleVoiceUpgrade = async () => {
    const res = await fetch('/api/stripe?action=checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: 'voice_addon', billingPeriod: 'monthly' }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handlePortal = async () => {
    const res = await fetch('/api/stripe?action=portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Billing" subtitle="Manage your subscription and add-ons" />

        {billing?.trialEndsAt && <TrialCountdown endsAt={billing.trialEndsAt} />}

        {/* Period toggle */}
        <div className={css`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; align-items: center;`}>
          <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Billing:</span>
          {(['monthly', 'annual'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setBillingPeriod(p)}
              className={css`
                padding: 0.35rem 0.875rem;
                border-radius: ${theme.radii.sm};
                border: 1px solid ${billingPeriod === p ? theme.colors.roseGold : theme.colors.borderDefault};
                background: ${billingPeriod === p ? theme.colors.roseGold + '20' : 'transparent'};
                color: ${billingPeriod === p ? theme.colors.roseGold : theme.colors.textSecondary};
                font-size: 0.8rem; cursor: pointer; text-transform: capitalize;
              `}
            >
              {p}{p === 'annual' ? ' (save up to 20%)' : ''}
            </button>
          ))}
        </div>

        {/* Subscription tiers */}
        <div className={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;`}>
          {tiers.map(([slug, tier]) => {
            const isCurrent = slug === currentTier;
            const price = billingPeriod === 'annual' ? tier.annualPrice : tier.monthlyPrice;
            const displayPrice = price === 0 ? '0' : (price / 100).toFixed(0);
            const perMonth = billingPeriod === 'annual' && tier.annualPrice > 0
              ? `$${(tier.annualPrice / 100 / 12).toFixed(2)}/mo`
              : null;

            return (
              <div
                key={slug}
                className={css`
                  background: ${theme.colors.obsidianMid};
                  border: 1px solid ${isCurrent ? theme.colors.roseGold : theme.colors.borderDefault};
                  border-radius: ${theme.radii.md};
                  padding: 1.5rem;
                  position: relative;
                `}
              >
                {isCurrent && (
                  <div className={css`
                    position: absolute; top: -0.6rem; left: 1rem;
                    background: ${theme.colors.roseGold};
                    color: white; font-size: 0.7rem; font-weight: 700;
                    padding: 0.15rem 0.6rem; border-radius: 999px;
                  `}>Current Plan</div>
                )}
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; font-size: 1.1rem; margin: 0 0 0.75rem;`}>
                  {tier.name}
                </h3>
                <div className={css`margin-bottom: 0.25rem;`}>
                  <span className={css`font-size: 1.875rem; font-weight: 700; color: ${theme.colors.roseGold};`}>
                    ${displayPrice}
                  </span>
                  <span className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>
                    /{billingPeriod === 'annual' ? 'yr' : 'mo'}
                  </span>
                </div>
                {perMonth && (
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; margin: 0 0 1rem;`}>
                    {perMonth} billed annually
                  </p>
                )}
                <ul className={css`list-style: none; padding: 0; margin: 0 0 1.25rem;`}>
                  {tier.features.map((f) => (
                    <li key={f} className={css`
                      color: ${theme.colors.textSecondary}; font-size: 0.8rem;
                      padding: 0.2rem 0;
                      &::before { content: '✓ '; color: ${theme.colors.success}; }
                    `}>{f}</li>
                  ))}
                </ul>
                <Button
                  variant={isCurrent ? 'secondary' : 'primary'}
                  onClick={() => !isCurrent && handleUpgrade(slug, billingPeriod)}
                >
                  {isCurrent ? 'Current Plan' : slug === 'free' ? 'Downgrade' : 'Upgrade'}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Voice Add-on */}
        <div className={css`margin-bottom: 2rem;`}>
          <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>
            Add-ons
          </h3>
          <div className={css`
            background: ${theme.colors.obsidianMid};
            border: 1px solid ${billing?.voiceEnabled ? theme.colors.roseGold : theme.colors.borderDefault};
            border-radius: ${theme.radii.md};
            padding: 1.5rem;
            display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
            max-width: 560px;
          `}>
            <div>
              <div className={css`display: flex; align-items: center; gap: 0.625rem; margin-bottom: 0.375rem;`}>
                <span className={css`font-size: 1.25rem;`}>🔊</span>
                <h4 className={css`color: ${theme.colors.warmCream}; font-size: 1rem; margin: 0;`}>
                  {VOICE_ADDON.name}
                </h4>
                {billing?.voiceEnabled && <Badge variant="success">Active</Badge>}
              </div>
              <ul className={css`list-style: none; padding: 0; margin: 0;`}>
                {VOICE_ADDON.features.map((f) => (
                  <li key={f} className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; &::before { content: '✓ '; color: ${theme.colors.success}; }`}>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className={css`text-align: right;`}>
              <div className={css`margin-bottom: 0.75rem;`}>
                <span className={css`font-size: 1.5rem; font-weight: 700; color: ${theme.colors.roseGold};`}>
                  ${(VOICE_ADDON.monthlyPrice / 100).toFixed(2)}
                </span>
                <span className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>/mo</span>
              </div>
              {billing?.voiceEnabled ? (
                <Button variant="secondary" onClick={handlePortal}>Manage</Button>
              ) : (
                <Button onClick={handleVoiceUpgrade}>Add Voice</Button>
              )}
            </div>
          </div>
        </div>

        {/* Manage existing subscription */}
        {billing && billing.subscriptionStatus === 'active' && (
          <Card>
            <div className={css`display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;`}>
              <div>
                <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0;`}>Manage Subscription</p>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0.25rem 0 0;`}>
                  Update payment method, view invoices, or cancel.
                </p>
              </div>
              <Button variant="secondary" onClick={handlePortal}>Billing Portal →</Button>
            </div>
          </Card>
        )}
      </MainContent>
    </>
  );
}
