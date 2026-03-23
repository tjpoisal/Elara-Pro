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

type Period = 'today' | 'week' | 'month';

const PERIOD_LABEL: Record<Period, string> = {
  today: 'Today',
  week: 'Last 7 Days',
  month: 'This Month',
};

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className={css`
      background: ${theme.colors.obsidianMid};
      border: 1px solid ${theme.colors.borderDefault};
      border-radius: ${theme.radii.md};
      padding: 1.5rem;
    `}>
      <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;`}>
        {label}
      </p>
      <p className={css`font-size: 2.25rem; font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0;`}>
        {value}
      </p>
      {sub && <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0.25rem 0 0;`}>{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [period, setPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => setStats(d.stats ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <>
      <Navigation />
      <MainContent>
        <div className={css`display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;`}>
          <PageHeader title="Analytics" subtitle="Business metrics and performance" />
          <div className={css`display: flex; gap: 0.5rem;`}>
            {(['today', 'week', 'month'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={css`
                  padding: 0.35rem 0.75rem;
                  border-radius: ${theme.radii.sm};
                  border: 1px solid ${period === p ? theme.colors.roseGold : theme.colors.borderDefault};
                  background: ${period === p ? theme.colors.roseGold + '20' : 'transparent'};
                  color: ${period === p ? theme.colors.roseGold : theme.colors.textSecondary};
                  font-size: 0.8rem; cursor: pointer;
                `}
              >{PERIOD_LABEL[p]}</button>
            ))}
          </div>
        </div>

        <Grid>
          <StatCard
            label="Active Clients"
            value={loading ? '…' : stats?.activeClients ?? 0}
            sub="Total active client profiles"
          />
          <StatCard
            label="Formulas"
            value={loading ? '…' : stats?.formulasThisPeriod ?? 0}
            sub={`Created ${PERIOD_LABEL[period].toLowerCase()}`}
          />
          <StatCard
            label="Services"
            value={loading ? '…' : stats?.servicesThisPeriod ?? 0}
            sub={`Completed ${PERIOD_LABEL[period].toLowerCase()}`}
          />
          <StatCard
            label="Low Stock Alerts"
            value={loading ? '…' : stats?.lowStockAlerts ?? 0}
            sub="Items below minimum threshold"
          />
        </Grid>

        <div className={css`margin-top: 2rem;`}>
          <Card>
            <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0 0 0.5rem;`}>
              More analytics coming soon
            </p>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0;`}>
              Revenue tracking, client retention, formula usage trends, and stylist performance metrics will appear here as you use the platform.
            </p>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
