'use client';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Grid, Button } from '@/components/Navigation';

interface PlatformStats {
  totalSalons?: number;
  totalBrands?: number;
  aiDiscoveredBrands?: number;
}

export default function AdminPage() {
  const [brands, setBrands] = useState<{ id: string; name: string; source: string; aiConfidence: string | null; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brands?all=true')
      .then((r) => r.json())
      .then((d) => setBrands(d.brands ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const aiDiscovered = brands.filter((b) => b.source === 'ai_discovered');
  const seeded = brands.filter((b) => b.source === 'seed' || b.source === 'manual');

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Admin" subtitle="Platform administration" />

        <Grid>
          <div className={css`background: ${theme.colors.obsidianMid}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; padding: 1.5rem;`}>
            <p className={css`font-size: 2rem; font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0;`}>
              {loading ? '…' : brands.length}
            </p>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0.25rem 0 0;`}>Total Brands in Catalog</p>
          </div>
          <div className={css`background: ${theme.colors.obsidianMid}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; padding: 1.5rem;`}>
            <p className={css`font-size: 2rem; font-family: ${theme.fonts.heading}; color: ${theme.colors.roseGold}; margin: 0;`}>
              {loading ? '…' : aiDiscovered.length}
            </p>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0.25rem 0 0;`}>AI-Discovered Brands</p>
          </div>
          <div className={css`background: ${theme.colors.obsidianMid}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; padding: 1.5rem;`}>
            <p className={css`font-size: 2rem; font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0;`}>
              {loading ? '…' : seeded.length}
            </p>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0.25rem 0 0;`}>Catalog Brands</p>
          </div>
        </Grid>

        {aiDiscovered.length > 0 && (
          <div className={css`margin-top: 2rem;`}>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>
              AI-Discovered Brands
            </h3>
            <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
              {aiDiscovered.map((b) => (
                <div
                  key={b.id}
                  className={css`
                    background: ${theme.colors.obsidianMid};
                    border: 1px solid ${theme.colors.borderDefault};
                    border-radius: ${theme.radii.sm};
                    padding: 0.875rem 1.25rem;
                    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;
                  `}
                >
                  <div>
                    <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0;`}>{b.name}</p>
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0.2rem 0 0;`}>
                      Added {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {b.aiConfidence && (
                    <span className={css`
                      font-size: 0.75rem; padding: 0.2rem 0.6rem;
                      border-radius: 999px;
                      background: ${theme.colors.roseGold}20;
                      color: ${theme.colors.roseGold};
                    `}>
                      {Math.round(parseFloat(b.aiConfidence) * 100)}% confidence
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && aiDiscovered.length === 0 && (
          <div className={css`margin-top: 2rem;`}>
            <Card>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>
                No AI-discovered brands yet. When a stylist asks Elara about an unknown brand, it will appear here after being added to the global catalog.
              </p>
            </Card>
          </div>
        )}
      </MainContent>
    </>
  );
}
