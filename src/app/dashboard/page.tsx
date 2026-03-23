'use client';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Grid, Badge, Button } from '@/components/Navigation';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  activeClients: number;
  formulasThisPeriod: number;
  servicesThisPeriod: number;
  lowStockAlerts: number;
}

interface RecentConsultation {
  id: string;
  status: string;
  createdAt: string;
  clientId: string | null;
  desiredResult: string | null;
}

interface SalonInfo {
  trialEndsAt: string | null;
  subscriptionStatus: string;
  subscriptionTier: string;
  voiceEnabled: boolean;
}

const statCardStyle = css`
  h3 { font-size: 2rem; font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0; }
  p { color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-top: 0.25rem; }
`;

function TrialBanner({ salon }: { salon: SalonInfo }) {
  if (!salon.trialEndsAt) return null;
  const trialEnd = new Date(salon.trialEndsAt);
  const now = new Date();
  if (trialEnd <= now) return null;

  const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={css`
      background: ${theme.colors.roseGold}15;
      border: 1px solid ${theme.colors.roseGold}40;
      border-radius: ${theme.radii.md};
      padding: 0.875rem 1.25rem;
      margin-bottom: 1.5rem;
      display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
    `}>
      <p className={css`color: ${theme.colors.roseGold}; font-size: 0.875rem; margin: 0;`}>
        ✦ Free trial — {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
      </p>
      <a href="/settings/billing" className={css`
        color: ${theme.colors.roseGold}; font-size: 0.8rem; font-weight: 600;
        text-decoration: none; border: 1px solid ${theme.colors.roseGold}60;
        padding: 0.25rem 0.75rem; border-radius: ${theme.radii.sm};
        &:hover { background: ${theme.colors.roseGold}20; }
      `}>Upgrade →</a>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<RecentConsultation[]>([]);
  const [salon, setSalon] = useState<SalonInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?period=${period}`)
      .then((r) => r.json())
      .then((d) => {
        setStats(d.stats ?? null);
        setRecent(d.recentConsultations ?? []);
        setSalon(d.salon ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  const statItems = stats
    ? [
        { label: 'Active Clients', value: stats.activeClients, href: '/clients' },
        { label: period === 'today' ? 'Formulas Today' : period === 'week' ? 'Formulas This Week' : 'Formulas This Month', value: stats.formulasThisPeriod, href: '/formulate' },
        { label: period === 'today' ? 'Services Today' : period === 'week' ? 'Services This Week' : 'Services This Month', value: stats.servicesThisPeriod, href: '/service' },
        { label: 'Low Stock Alerts', value: stats.lowStockAlerts, href: '/inventory', alert: stats.lowStockAlerts > 0 },
      ]
    : Array(4).fill(null);

  return (
    <>
      <Navigation />
      <MainContent>
        <div className={css`display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;`}>
          <PageHeader title="Dashboard" subtitle="Your salon at a glance" />
          <div className={css`display: flex; gap: 0.5rem;`}>
            {(['today', 'week', 'month'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={css`
                  padding: 0.35rem 0.75rem;
                  border-radius: ${theme.radii.sm};
                  border: 1px solid ${period === p ? theme.colors.roseGold : theme.colors.borderDefault};
                  background: ${period === p ? theme.colors.roseGold + '20' : 'transparent'};
                  color: ${period === p ? theme.colors.roseGold : theme.colors.textSecondary};
                  font-size: 0.8rem; cursor: pointer; text-transform: capitalize;
                `}
              >{p}</button>
            ))}
          </div>
        </div>

        {salon && <TrialBanner salon={salon} />}

        <Grid>
          {statItems.map((item, i) =>
            item === null ? (
              <Card key={i}>
                <div className={statCardStyle}>
                  <h3 className={css`opacity: 0.3;`}>—</h3>
                  <p>Loading…</p>
                </div>
              </Card>
            ) : (
              <div
                key={item.label}
                onClick={() => router.push(item.href)}
                className={css`
                  background: ${theme.colors.obsidianMid};
                  border: 1px solid ${item.alert ? theme.colors.error + '60' : theme.colors.borderDefault};
                  border-radius: ${theme.radii.md};
                  padding: 1.5rem;
                  cursor: pointer;
                  transition: border-color 0.15s;
                  &:hover { border-color: ${theme.colors.roseGold}60; }
                `}
              >
                <div className={statCardStyle}>
                  <h3 className={css`color: ${item.alert ? theme.colors.error : theme.colors.warmCream};`}>
                    {loading ? '…' : item.value}
                  </h3>
                  <p>{item.label}</p>
                </div>
              </div>
            )
          )}
        </Grid>

        <div className={css`margin-top: 2rem;`}>
          <Card>
            <div className={css`display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;`}>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0;`}>
                Recent Consultations
              </h3>
              <Button variant="secondary" onClick={() => router.push('/consult')}>View All</Button>
            </div>

            {loading && (
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Loading…</p>
            )}

            {!loading && recent.length === 0 && (
              <div>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin-bottom: 1rem;`}>
                  No consultations yet. Start by adding a client.
                </p>
                <div className={css`display: flex; gap: 0.75rem;`}>
                  <Button onClick={() => router.push('/consult/new')}>New Consultation</Button>
                  <Button variant="secondary" onClick={() => router.push('/clients')}>Add Client</Button>
                </div>
              </div>
            )}

            {!loading && recent.length > 0 && (
              <div className={css`display: flex; flex-direction: column; gap: 0.625rem;`}>
                {recent.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/consult/${c.id}`)}
                    className={css`
                      display: flex; align-items: center; justify-content: space-between;
                      padding: 0.75rem 1rem;
                      background: ${theme.colors.obsidian};
                      border: 1px solid ${theme.colors.borderDefault};
                      border-radius: ${theme.radii.sm};
                      cursor: pointer;
                      &:hover { border-color: ${theme.colors.roseGold}40; }
                    `}
                  >
                    <div>
                      <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; margin: 0;`}>
                        {c.desiredResult ?? 'Consultation'}
                      </p>
                      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-top: 0.2rem;`}>
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge variant={c.status === 'completed' ? 'success' : c.status === 'in_progress' ? 'warning' : 'default'}>
                      {c.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </MainContent>
    </>
  );
}
