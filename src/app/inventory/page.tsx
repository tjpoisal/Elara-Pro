'use client';
import Link from 'next/link';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Grid, Button, Badge } from '@/components/Navigation';

export default function InventoryPage() {
  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Inventory" subtitle="Track product stock by the gram" />
        <div className={css`display: flex; gap: 0.75rem; margin-bottom: 2rem;`}>
          <Link href="/inventory/scan"><Button>Scan Barcode</Button></Link>
          <Button variant="secondary">Add Product</Button>
          <Button variant="secondary">Export</Button>
        </div>
        <Grid>
          <Card>
            <div className={css`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;`}>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream};`}>Stock Overview</h3>
              <Badge color={theme.colors.success}>All Stocked</Badge>
            </div>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>No inventory items yet. Scan a barcode or add products manually.</p>
          </Card>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>Low Stock Alerts</h3>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No alerts. All products are above reorder points.</p>
          </Card>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>Recent Usage</h3>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Usage logs will appear after services are completed.</p>
          </Card>
        </Grid>
      </MainContent>
    </>
  );
}
