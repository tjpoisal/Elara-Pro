'use client';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Grid } from '@/components/Navigation';

interface Stats {
  activeClients: number;
  formulasThisPeriod: number;
  servicesThisPeriod: number;
  lowStockAlerts: number;
}

export default function BusinessPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics?period=month')
      .then((r) => r.json())
      .then((d) => setStats(d.stats ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { label: 'Active Clients', value: stats?.activeClients ?? 0, icon: '👤' },
    { label: 'Formulas This Month', value: stats?.formulasThisPeriod ?? 0, icon: '🧪' },
    { label: 'Services This Month', value: stats?.servicesThisPeriod ?? 0, icon: '✂️' },
    { label: 'Low Stock Alerts', value: stats?.lowStockAlerts ?? 0, icon: '📦' },
  ];

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Business" subtitle="Salon performance overview" />
        <Grid>
          {metrics.map((m) => (
            <div
              key={m.label}
              className={css`
                background: ${theme.colors.obsidianMid};
                border: 1px solid ${theme.colors.borderDefault};
                border-radius: ${theme.radii.md};
                padding: 1.5rem;
              `}
            >
              <p className={css`font-size: 1.75rem; margin: 0 0 0.5rem;`}>{m.icon}</p>
              <p className={css`font-size: 2rem; font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0;`}>
                {loading ? '…' : m.value}
              </p>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0.25rem 0 0;`}>{m.label}</p>
            </div>
          ))}
        </Grid>

        <div className={css`margin-top: 2rem; display: grid; gap: 1.5rem;`}>
          <Card>
            <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0 0 0.5rem;`}>Revenue Tracking</p>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0;`}>
              Revenue analytics will populate as services are completed and priced. Connect your POS or log service prices to enable this.
            </p>
          </Card>
          <Card>
            <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0 0 0.5rem;`}>Stylist Performance</p>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0;`}>
              Per-stylist metrics including services, revenue, client retention, and formula usage will appear here on Elite and Salon plans.
            </p>
          </Card>
          <Card>
            <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0 0 0.5rem;`}>Waste Reduction</p>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0;`}>
              Product waste logs and cost impact analysis will appear here as inventory adjustments are recorded.
            </p>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
