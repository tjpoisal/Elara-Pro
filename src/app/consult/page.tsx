'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Grid, Button, Badge } from '@/components/Navigation';

interface ConsultationSummary {
  id: string;
  clientId: string | null;
  desiredResult: string | null;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  currentLevel: number | null;
  targetLevel: number | null;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  completed:  '#4CAF50',
  in_progress: '#4A9EFF',
  draft:      '#FF9800',
  archived:   theme.colors.textMuted,
};

export default function ConsultationsPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'in_progress' | 'completed'>('all');

  useEffect(() => {
    fetch('/api/consultations')
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => setConsultations(data.consultations ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = consultations.filter((c) => filter === 'all' || c.status === filter);

  const handleNew = async () => {
    try {
      const res = await fetch('/api/consultations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      const id = data.consultation?.id ?? data.id;
      if (id) router.push(`/consult/${id}`);
    } catch {
      router.push('/consult/new');
    }
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Consultations" subtitle={loading ? 'Loading…' : `${consultations.length} consultation${consultations.length !== 1 ? 's' : ''}`} />

        <div className={css`display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;`}>
          <Button onClick={handleNew}>+ New Consultation</Button>
          {(['all', 'draft', 'in_progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={css`
                padding: 0.375rem 0.875rem; border-radius: 999px; font-size: 0.8rem; cursor: pointer;
                border: 1px solid ${filter === f ? theme.colors.roseGold : theme.colors.borderDefault};
                background: ${filter === f ? theme.colors.roseGold + '20' : 'transparent'};
                color: ${filter === f ? theme.colors.roseGold : theme.colors.textSecondary};
              `}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading && (
          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Loading consultations…</p>
        )}

        {error && (
          <Card>
            <p className={css`color: #f44336; font-size: 0.875rem;`}>Failed to load consultations: {error}</p>
          </Card>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Card>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>
              {consultations.length === 0
                ? 'No consultations yet. Start a new one above.'
                : 'No consultations match this filter.'}
            </p>
          </Card>
        )}

        {!loading && !error && filtered.length > 0 && (
          <Grid>
            {filtered.map((c) => (
              <Card key={c.id}>
                <div className={css`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;`}>
                  <div>
                    <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 0.25rem; font-size: 0.95rem;`}>
                      {c.desiredResult ? c.desiredResult.slice(0, 60) + (c.desiredResult.length > 60 ? '…' : '') : 'Consultation'}
                    </h3>
                    {(c.currentLevel || c.targetLevel) && (
                      <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem;`}>
                        {c.currentLevel ? `Level ${c.currentLevel}` : ''}
                        {c.currentLevel && c.targetLevel ? ' → ' : ''}
                        {c.targetLevel ? `Level ${c.targetLevel}` : ''}
                      </p>
                    )}
                  </div>
                  <Badge color={statusColors[c.status] ?? theme.colors.textMuted}>{c.status.replace('_', ' ')}</Badge>
                </div>
                <div className={css`display: flex; justify-content: space-between; align-items: center;`}>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  <Button variant="secondary" onClick={() => router.push(`/consult/${c.id}`)}>Open</Button>
                </div>
              </Card>
            ))}
          </Grid>
        )}
      </MainContent>
    </>
  );
}
