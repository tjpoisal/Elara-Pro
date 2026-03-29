'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Badge } from '@/components/Navigation';

interface Formula {
  id: string;
  name: string;
  status: string;
  isTemplate: boolean;
  notes: string | null;
  clientId: string | null;
  createdAt: string;
}

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'warning' | 'gold'> = {
  draft: 'warning',
  active: 'success',
  archived: 'default',
  template: 'gold',
};

export default function FormulatePage() {
  const router = useRouter();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'template' | 'draft'>('all');

  useEffect(() => {
    fetch('/api/formulas')
      .then((r) => r.json())
      .then((d) => setFormulas(d.formulas ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = formulas.filter((f) => {
    if (filter === 'all') return true;
    if (filter === 'template') return f.isTemplate;
    return f.status === filter;
  });

  const counts = {
    all: formulas.length,
    active: formulas.filter((f) => f.status === 'active').length,
    template: formulas.filter((f) => f.isTemplate).length,
    draft: formulas.filter((f) => f.status === 'draft').length,
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <div className={css`display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;`}>
          <PageHeader title="Formulas" subtitle={`${formulas.length} formula${formulas.length !== 1 ? 's' : ''}`} />
          <Button onClick={() => router.push('/consult')}>+ New Consultation</Button>
        </div>

        {/* Filter tabs */}
        <div className={css`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;`}>
          {(['all', 'active', 'template', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={css`
                padding: 0.35rem 0.875rem; border-radius: ${theme.radii.full};
                border: 1px solid ${filter === f ? theme.colors.gold : theme.colors.borderDefault};
                background: ${filter === f ? theme.colors.gold + '20' : 'transparent'};
                color: ${filter === f ? theme.colors.gold : theme.colors.textMuted};
                font-size: 0.8rem; cursor: pointer; text-transform: capitalize;
                transition: all 0.15s;
              `}
            >
              {f} <span className={css`opacity: 0.6; font-size: 0.72rem;`}>({counts[f]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Loading formulas…</p>
        ) : filtered.length === 0 ? (
          <Card>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin: 0;`}>
              {filter === 'all'
                ? 'No formulas yet. Start a consultation to create your first formula.'
                : `No ${filter} formulas.`}
            </p>
            {filter === 'all' && (
              <Button onClick={() => router.push('/consult')} className={css`margin-top: 1rem;`}>
                Start Consultation
              </Button>
            )}
          </Card>
        ) : (
          <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
            {filtered.map((f) => (
              <div
                key={f.id}
                onClick={() => router.push(`/formulate/${f.id}`)}
                className={css`
                  background: ${theme.colors.obsidianMid};
                  border: 1px solid ${theme.colors.borderDefault};
                  border-radius: ${theme.radii.md};
                  padding: 1rem 1.25rem;
                  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
                  cursor: pointer;
                  transition: border-color 0.15s, background 0.15s;
                  &:hover { border-color: ${theme.colors.gold}50; background: ${theme.colors.obsidianLight}; }
                `}
              >
                <div>
                  <div className={css`display: flex; align-items: center; gap: 0.625rem; margin-bottom: 0.25rem;`}>
                    <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.9rem; margin: 0; font-family: ${theme.fonts.heading};`}>
                      {f.name}
                    </p>
                    {f.isTemplate && <Badge variant="gold">template</Badge>}
                    <Badge variant={STATUS_VARIANT[f.status] ?? 'default'}>{f.status}</Badge>
                  </div>
                  {f.notes && (
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.78rem; margin: 0; max-width: 480px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`}>
                      {f.notes}
                    </p>
                  )}
                </div>
                <p className={css`color: ${theme.colors.textDisabled}; font-size: 0.75rem; margin: 0; flex-shrink: 0;`}>
                  {new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </MainContent>
    </>
  );
}
