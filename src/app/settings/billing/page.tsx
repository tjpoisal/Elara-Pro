'use client';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Badge } from '@/components/Navigation';
import { SUBSCRIPTION_TIERS } from '@/lib/stripe';

export default function BillingPage() {
  const tiers = Object.entries(SUBSCRIPTION_TIERS);

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Billing" subtitle="Choose the plan that fits your salon" />
        <div className={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;`}>
          {tiers.map(([slug, tier]) => (
            <Card key={slug}>
              <div className={css`margin-bottom: 1rem;`}>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; font-size: 1.25rem;`}>{tier.name}</h3>
                <div className={css`margin: 0.75rem 0;`}>
                  <span className={css`font-size: 2rem; font-weight: 700; color: ${theme.colors.roseGold};`}>
                    ${tier.monthlyPrice === 0 ? '0' : (tier.monthlyPrice / 100).toFixed(0)}
                  </span>
                  <span className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>/mo</span>
                </div>
                {tier.annualPrice > 0 && (
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem;`}>
                    ${(tier.annualPrice / 100).toFixed(0)}/year (save {Math.round((1 - tier.annualPrice / (tier.monthlyPrice * 12)) * 100)}%)
                  </p>
                )}
              </div>
              <ul className={css`list-style: none; margin-bottom: 1.5rem;`}>
                {tier.features.map((f) => (
                  <li key={f} className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; padding: 0.25rem 0; &::before { content: '✓ '; color: ${theme.colors.success}; }`}>
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={slug === 'free' ? 'secondary' : 'primary'}>
                {slug === 'free' ? 'Current Plan' : 'Upgrade'}
              </Button>
            </Card>
          ))}
        </div>
      </MainContent>
    </>
  );
}
