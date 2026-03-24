'use client';
import { useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Input, Button } from '@/components/Navigation';
import { US_PROFESSIONAL_BRANDS, type BrandSeed } from '@/lib/brands/data';

interface BrandSelectorProps {
  selectedBrands: string[];
  selectedLines: Record<string, string[]>;
  onChange: (brands: string[], lines: Record<string, string[]>) => void;
}

export function BrandSelector({ selectedBrands, selectedLines, onChange }: BrandSelectorProps) {
  const [search, setSearch] = useState('');
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  const filtered = useMemo(() =>
    US_PROFESSIONAL_BRANDS.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    ), [search]);

  const toggleBrand = (slug: string) => {
    if (selectedBrands.includes(slug)) {
      const next = selectedBrands.filter((s) => s !== slug);
      const nextLines = { ...selectedLines };
      delete nextLines[slug];
      onChange(next, nextLines);
    } else {
      onChange([...selectedBrands, slug], selectedLines);
      setExpandedBrand(slug);
    }
  };

  const toggleLine = (brandSlug: string, lineSlug: string) => {
    const current = selectedLines[brandSlug] ?? [];
    const next = current.includes(lineSlug)
      ? current.filter((s) => s !== lineSlug)
      : [...current, lineSlug];
    onChange(selectedBrands, { ...selectedLines, [brandSlug]: next });
  };

  const selectAllLines = (brand: BrandSeed) => {
    onChange(
      selectedBrands.includes(brand.slug) ? selectedBrands : [...selectedBrands, brand.slug],
      { ...selectedLines, [brand.slug]: brand.lines.map((l) => l.slug) }
    );
  };

  return (
    <div>
      <Input
        placeholder="Search brands..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0.75rem 0;`}>
        {selectedBrands.length} brand{selectedBrands.length !== 1 ? 's' : ''} selected
      </p>
      <div className={css`display: flex; flex-direction: column; gap: 0.5rem; max-height: 420px; overflow-y: auto; padding-right: 0.25rem;`}>
        {filtered.map((brand) => {
          const isSelected = selectedBrands.includes(brand.slug);
          const isExpanded = expandedBrand === brand.slug;
          const brandLines = selectedLines[brand.slug] ?? [];

          return (
            <div
              key={brand.slug}
              className={css`
                border: 1px solid ${isSelected ? theme.colors.roseGold : theme.colors.borderDefault};
                border-radius: ${theme.radii.md};
                overflow: hidden;
                transition: border-color 0.15s;
              `}
            >
              <div
                className={css`
                  display: flex; align-items: center; justify-content: space-between;
                  padding: 0.75rem 1rem; cursor: pointer;
                  background: ${isSelected ? `${theme.colors.roseGold}10` : 'transparent'};
                  &:hover { background: ${theme.colors.obsidianMid}; }
                `}
                onClick={() => toggleBrand(brand.slug)}
              >
                <div className={css`display: flex; align-items: center; gap: 0.75rem;`}>
                  <div className={css`
                    width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0;
                    border: 2px solid ${isSelected ? theme.colors.roseGold : theme.colors.borderDefault};
                    background: ${isSelected ? theme.colors.roseGold : 'transparent'};
                    display: flex; align-items: center; justify-content: center;
                  `}>
                    {isSelected && <span className={css`color: white; font-size: 11px; line-height: 1;`}>✓</span>}
                  </div>
                  <span className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 500;`}>{brand.name}</span>
                  {isSelected && brandLines.length > 0 && (
                    <span className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem;`}>{brandLines.length} line{brandLines.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
                {isSelected && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpandedBrand(isExpanded ? null : brand.slug); }}
                    className={css`background: none; border: none; color: ${theme.colors.textMuted}; cursor: pointer; font-size: 0.75rem; padding: 0.25rem;`}
                  >
                    {isExpanded ? '▲ hide lines' : '▼ select lines'}
                  </button>
                )}
              </div>

              {isSelected && isExpanded && (
                <div className={css`padding: 0.75rem 1rem; border-top: 1px solid ${theme.colors.borderDefault}; background: ${theme.colors.obsidian};`}>
                  <div className={css`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`}>
                    <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem;`}>Select product lines carried in your salon:</span>
                    <button
                      onClick={() => selectAllLines(brand)}
                      className={css`background: none; border: none; color: ${theme.colors.roseGold}; cursor: pointer; font-size: 0.75rem;`}
                    >
                      Select all
                    </button>
                  </div>
                  <div className={css`display: flex; flex-wrap: wrap; gap: 0.5rem;`}>
                    {brand.lines.map((line) => {
                      const lineSelected = brandLines.includes(line.slug);
                      return (
                        <button
                          key={line.slug}
                          onClick={() => toggleLine(brand.slug, line.slug)}
                          title={line.description}
                          className={css`
                            padding: 0.375rem 0.75rem; border-radius: 999px; font-size: 0.75rem; cursor: pointer;
                            border: 1px solid ${lineSelected ? theme.colors.roseGold : theme.colors.borderDefault};
                            background: ${lineSelected ? `${theme.colors.roseGold}20` : 'transparent'};
                            color: ${lineSelected ? theme.colors.roseGold : theme.colors.textSecondary};
                            transition: all 0.15s;
                            &:hover { border-color: ${theme.colors.roseGold}; color: ${theme.colors.roseGold}; }
                          `}
                        >
                          {line.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
