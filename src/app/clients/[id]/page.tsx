'use client';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Badge, Grid } from '@/components/Navigation';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Client Profile" subtitle={`Client ${params.id}`} />
        <div className={css`display: grid; grid-template-columns: 1fr 2fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
          <Card>
            <div className={css`text-align: center; margin-bottom: 1.5rem;`}>
              <div className={css`width: 80px; height: 80px; border-radius: 50%; background: ${theme.colors.obsidianMid}; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: ${theme.colors.roseGold};`}>◑</div>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream};`}>Client Name</h3>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Member since 2024</p>
            </div>
            <div className={css`border-top: 1px solid ${theme.colors.borderDefault}; padding-top: 1rem;`}>
              <div className={css`display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;`}>
                <span className={css`color: ${theme.colors.textSecondary};`}>Natural Level</span>
                <span className={css`color: ${theme.colors.warmCream};`}>—</span>
              </div>
              <div className={css`display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;`}>
                <span className={css`color: ${theme.colors.textSecondary};`}>Gray %</span>
                <span className={css`color: ${theme.colors.warmCream};`}>—</span>
              </div>
              <div className={css`display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;`}>
                <span className={css`color: ${theme.colors.textSecondary};`}>Porosity</span>
                <span className={css`color: ${theme.colors.warmCream};`}>—</span>
              </div>
            </div>
            <div className={css`margin-top: 1rem; display: flex; gap: 0.5rem;`}>
              <Button>New Consult</Button>
              <Button variant="secondary">Edit</Button>
            </div>
          </Card>
          <div>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Service History</h3>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No services recorded yet.</p>
            </Card>
            <div className={css`margin-top: 1.5rem;`}>
              <Card>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Formula History</h3>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No formulas on record.</p>
              </Card>
            </div>
          </div>
        </div>
      </MainContent>
    </>
  );
}
