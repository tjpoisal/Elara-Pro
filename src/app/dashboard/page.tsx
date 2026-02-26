'use client';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Grid, Badge, Button } from '@/components/Navigation';

const statCardStyle = css`
  h3 { font-size: 2rem; font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; }
  p { color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-top: 0.25rem; }
`;

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Dashboard" subtitle="Your salon at a glance" />
        <Grid>
          <Card><div className={statCardStyle}><h3>0</h3><p>Active Clients</p></div></Card>
          <Card><div className={statCardStyle}><h3>0</h3><p>Formulas This Month</p></div></Card>
          <Card><div className={statCardStyle}><h3>0</h3><p>Services Today</p></div></Card>
          <Card><div className={statCardStyle}><h3>0</h3><p>Low Stock Alerts</p></div></Card>
        </Grid>
        <div className={css`margin-top: 2rem;`}>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Recent Activity</h3>
            <p className={css`color: ${theme.colors.textMuted};`}>No recent activity. Start by adding a client or creating a consultation.</p>
            <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
              <Button>New Consultation</Button>
              <Button variant="secondary">Add Client</Button>
            </div>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
