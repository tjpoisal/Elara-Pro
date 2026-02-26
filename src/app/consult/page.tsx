'use client';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Grid, Button } from '@/components/Navigation';

export default function ConsultationsPage() {
  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Consultations" subtitle="Hair color consultation management" />
        <div className={css`display: flex; gap: 0.75rem; margin-bottom: 2rem;`}>
          <Button>New Consultation</Button>
          <Button variant="secondary">Filter</Button>
        </div>
        <Grid>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>Getting Started</h3>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>No data yet. Create your first entry to get started.</p>
          </Card>
        </Grid>
      </MainContent>
    </>
  );
}
