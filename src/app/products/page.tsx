'use client';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button } from '@/components/Navigation';
import { US_PROFESSIONAL_BRANDS } from '@/lib/brands/data';
import { useSalon } from '@/lib/salon-context';

interface DBBrand {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  source: string;
  aiConfidence: string | null;
  createdAt: string;
}

interface ProductLine {
  id: string;
  name: string;
  category: string;
  defaultMixingRatio: string | null;
  defaultProcessingTime: number | null;
  phRange: string | null;
  description: string | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  permanent: 'Permanent',
  demi_permanent: 'Demi-Permanent',
  semi_permanent: 'Semi-Permanent',
  lightener: 'Lightener',
  developer: 'Developer',
  toner: 'Toner',
  gloss: 'Gloss',
  additive: 'Additive',
  treatment: 'Treatment',
  other: 'Other',
};

export default function ProductsPage() {
  const { settings } = useSalon();
  const [dbBrands, setDbBrands] = useState<DBBrand[]>([]);
  const [lines, setLines] = useState<Record<string, ProductLine[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'catalog' | 'discovered'>('catalog');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/brands')
      .then((r) => r.json())
      .then((d) => setDbBrands(d.brands ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fetchLines = async (brandId: string) => {
    if (lines[brandId]) return;
    const res = await fetch(`/api/brands?brandId=${brandId}`);
    const d = await res.json();
    setLines((prev) => ({ ...prev, [brandId]: d.lines ?? [] }));
  };

  const toggleBrand = (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    fetchLines(id);
  };

  // Static catalog brands filtered by search + carried brands
  const staticBrands = US_PROFESSIONAL_BRANDS.filter((b) => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase());
    const matchCarried = tab === 'catalog'
      ? (settings.selectedBrands.length === 0 || settings.selectedBrands.includes(b.slug))
      : false;
    return matchSearch && (tab === 'catalog' ? matchCarried : false);
  });

  const discoveredBrands = dbBrands.filter((b) => {
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase());
    return b.source === 'ai_discovered' && matchSearch;
  });

  const displayBrands = tab === 'catalog' ? staticBrands : discoveredBrands;

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader
          title="Products"
          subtitle="Brand catalog and product lines"
        />

        <div className={css`display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; align-items: center;`}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands…"
            className={css`
              padding: 0.5rem 0.875rem;
              background: ${theme.colors.obsidianMid};
              border: 1px solid ${theme.colors.borderDefault};
              border-radius: ${theme.radii.sm};
              color: ${theme.colors.warmCream};
              font-size: 0.875rem;
              width: 220px;
              &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
            `}
          />
          {(['catalog', 'discovered'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={css`
                padding: 0.4rem 0.875rem;
                border-radius: ${theme.radii.sm};
                border: 1px solid ${tab === t ? theme.colors.roseGold : theme.colors.borderDefault};
                background: ${tab === t ? theme.colors.roseGold + '20' : 'transparent'};
                color: ${tab === t ? theme.colors.roseGold : theme.colors.textSecondary};
                font-size: 0.8rem; cursor: pointer; text-transform: capitalize;
              `}
            >
              {t === 'catalog' ? 'Your Brands' : `AI Discovered (${discoveredBrands.length})`}
            </button>
          ))}
        </div>

        {tab === 'catalog' && settings.selectedBrands.length === 0 && (
          <div className={css`
            background: ${theme.colors.roseGold}10;
            border: 1px solid ${theme.colors.roseGold}30;
            border-radius: ${theme.radii.md};
            padding: 0.875rem 1.25rem;
            margin-bottom: 1.5rem;
          `}>
            <p className={css`color: ${theme.colors.roseGold}; font-size: 0.875rem; margin: 0;`}>
              ✦ Showing all brands. Select your carried brands in{' '}
              <a href="/onboarding" className={css`color: ${theme.colors.roseGold}; text-decoration: underline;`}>onboarding</a>{' '}
              to filter this view.
            </p>
          </div>
        )}

        {loading && tab === 'discovered' && (
          <div className={css`text-align: center; padding: 3rem; color: ${theme.colors.textMuted};`}>
            Loading…
          </div>
        )}

        {displayBrands.length === 0 && !loading && (
          <Card>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>
              {tab === 'discovered'
                ? 'No AI-discovered brands yet. Ask Elara about a brand to add it to the global catalog.'
                : 'No brands match your search.'}
            </p>
          </Card>
        )}

        <div className={css`display: flex; flex-direction: column; gap: 0.625rem;`}>
          {tab === 'catalog' && staticBrands.map((brand) => (
            <div
              key={brand.slug}
              className={css`
                background: ${theme.colors.obsidianMid};
                border: 1px solid ${theme.colors.borderDefault};
                border-radius: ${theme.radii.md};
                overflow: hidden;
              `}
            >
              <button
                onClick={() => setExpanded(expanded === brand.slug ? null : brand.slug)}
                className={css`
                  width: 100%; padding: 1rem 1.25rem;
                  display: flex; align-items: center; justify-content: space-between;
                  background: transparent; border: none; cursor: pointer; text-align: left;
                  &:hover { background: ${theme.colors.obsidian}40; }
                `}
              >
                <div>
                  <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0;`}>{brand.name}</p>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0.2rem 0 0;`}>
                    {brand.lines.length} product line{brand.lines.length !== 1 ? 's' : ''}
                    {brand.website ? ` · ${brand.website}` : ''}
                  </p>
                </div>
                <span className={css`color: ${theme.colors.textMuted}; font-size: 1.2rem;`}>
                  {expanded === brand.slug ? '−' : '+'}
                </span>
              </button>

              {expanded === brand.slug && (
                <div className={css`padding: 0 1.25rem 1.25rem; border-top: 1px solid ${theme.colors.borderDefault};`}>
                  <div className={css`display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem; margin-top: 1rem;`}>
                    {brand.lines.map((line) => (
                      <div
                        key={line.name}
                        className={css`
                          background: ${theme.colors.obsidian};
                          border: 1px solid ${theme.colors.borderDefault};
                          border-radius: ${theme.radii.sm};
                          padding: 0.875rem;
                        `}
                      >
                        <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 600; margin: 0 0 0.375rem;`}>
                          {line.name}
                        </p>
                        <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; margin: 0 0 0.5rem;`}>
                          {CATEGORY_LABEL[line.category] ?? line.category}
                        </p>
                        <div className={css`display: flex; flex-wrap: wrap; gap: 0.5rem;`}>
                          {line.mixRatio && (
                            <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
                              Mix {line.mixRatio}
                            </span>
                          )}
                          {line.processingTime && (
                            <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
                              ⏱ {line.processingTime} min
                            </span>
                          )}
                        </div>
                        {line.description && (
                          <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; margin: 0.5rem 0 0; line-height: 1.4;`}>
                            {line.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {tab === 'discovered' && discoveredBrands.map((brand) => (
            <div
              key={brand.id}
              className={css`
                background: ${theme.colors.obsidianMid};
                border: 1px solid ${theme.colors.borderDefault};
                border-radius: ${theme.radii.md};
                overflow: hidden;
              `}
            >
              <button
                onClick={() => toggleBrand(brand.id)}
                className={css`
                  width: 100%; padding: 1rem 1.25rem;
                  display: flex; align-items: center; justify-content: space-between;
                  background: transparent; border: none; cursor: pointer; text-align: left;
                  &:hover { background: ${theme.colors.obsidian}40; }
                `}
              >
                <div>
                  <div className={css`display: flex; align-items: center; gap: 0.5rem;`}>
                    <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0;`}>{brand.name}</p>
                    <span className={css`
                      font-size: 0.65rem; padding: 0.15rem 0.4rem;
                      border-radius: 999px;
                      background: ${theme.colors.roseGold}20;
                      color: ${theme.colors.roseGold};
                    `}>AI Discovered</span>
                    {brand.aiConfidence && (
                      <span className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem;`}>
                        {Math.round(parseFloat(brand.aiConfidence) * 100)}% confidence
                      </span>
                    )}
                  </div>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0.2rem 0 0;`}>
                    Added {new Date(brand.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <span className={css`color: ${theme.colors.textMuted}; font-size: 1.2rem;`}>
                  {expanded === brand.id ? '−' : '+'}
                </span>
              </button>

              {expanded === brand.id && (
                <div className={css`padding: 0 1.25rem 1.25rem; border-top: 1px solid ${theme.colors.borderDefault};`}>
                  {!lines[brand.id] ? (
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin-top: 1rem;`}>Loading lines…</p>
                  ) : lines[brand.id].length === 0 ? (
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin-top: 1rem;`}>No product lines recorded.</p>
                  ) : (
                    <div className={css`display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem; margin-top: 1rem;`}>
                      {lines[brand.id].map((line) => (
                        <div
                          key={line.id}
                          className={css`
                            background: ${theme.colors.obsidian};
                            border: 1px solid ${theme.colors.borderDefault};
                            border-radius: ${theme.radii.sm};
                            padding: 0.875rem;
                          `}
                        >
                          <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 600; margin: 0 0 0.375rem;`}>
                            {line.name}
                          </p>
                          <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; margin: 0 0 0.5rem;`}>
                            {CATEGORY_LABEL[line.category] ?? line.category}
                          </p>
                          <div className={css`display: flex; flex-wrap: wrap; gap: 0.5rem;`}>
                            {line.defaultMixingRatio && (
                              <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
                                Mix {line.defaultMixingRatio}
                              </span>
                            )}
                            {line.defaultProcessingTime && (
                              <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
                                ⏱ {line.defaultProcessingTime} min
                              </span>
                            )}
                          </div>
                          {line.description && (
                            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; margin: 0.5rem 0 0; line-height: 1.4;`}>
                              {line.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </MainContent>
    </>
  );
}
