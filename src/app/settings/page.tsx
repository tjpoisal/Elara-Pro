'use client';
import Link from 'next/link';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Input } from '@/components/Navigation';

export default function SettingsPage() {
  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Settings" subtitle="Manage your salon and account" />
        <div className={css`display: grid; gap: 1.5rem; max-width: 640px;`}>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Salon Information</h3>
            <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
              <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Salon Name</label><Input placeholder="Your salon" /></div>
              <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Email</label><Input type="email" /></div>
              <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Phone</label><Input /></div>
              <Button>Save Changes</Button>
            </div>
          </Card>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Subscription</h3>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 1rem;`}>You are on the Free plan.</p>
            <Link href="/settings/billing"><Button>Manage Billing</Button></Link>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
