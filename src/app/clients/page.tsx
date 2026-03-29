'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Input, Badge } from '@/components/Navigation';

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  naturalLevel: number | null;
  grayPercentage: number | null;
  hairPorosity: string | null;
  allergies: string | null;
  createdAt: string;
}

const POROSITY_COLOR: Record<string, string> = {
  low: theme.colors.sapphire,
  normal: theme.colors.emerald,
  high: theme.colors.topaz,
};

const levelBg = (level: number) => {
  if (level <= 2) return '#1a1a1a';
  if (level <= 4) return '#5c3d1e';
  if (level <= 6) return '#c4813a';
  if (level <= 8) return '#d4a96a';
  return '#f5e6c8';
};
const levelFg = (level: number) => (level <= 4 ? '#f5e6c8' : '#1a1a1a');

const BLANK = {
  firstName: '', lastName: '', email: '', phone: '',
  naturalLevel: '', grayPercentage: '', hairPorosity: '', allergies: '', notes: '',
};

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/clients')
      .then((r) => r.json())
      .then((d) => setClients(d.clients ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return clients;
    return clients.filter((c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
    );
  }, [clients, search]);

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email || undefined,
          phone: form.phone || undefined,
          naturalLevel: form.naturalLevel ? Number(form.naturalLevel) : undefined,
          grayPercentage: form.grayPercentage ? Number(form.grayPercentage) : undefined,
          hairPorosity: form.hairPorosity || undefined,
          allergies: form.allergies || undefined,
          notes: form.notes || undefined,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? 'Failed to create client.');
        return;
      }
      setShowModal(false);
      setForm(BLANK);
      load();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <div className={css`display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;`}>
          <PageHeader title="Clients" subtitle={`${clients.length} client${clients.length !== 1 ? 's' : ''}`} />
          <Button onClick={() => { setShowModal(true); setError(''); setForm(BLANK); }}>+ Add Client</Button>
        </div>

        {/* Search */}
        <div className={css`max-width: 360px; margin-bottom: 1.5rem;`}>
          <Input
            placeholder="Search by name, email, or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Loading clients…</p>
        ) : filtered.length === 0 ? (
          <Card>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>
              {search ? 'No clients match your search.' : 'No clients yet. Add your first client to get started.'}
            </p>
          </Card>
        ) : (
          <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/clients/${c.id}`)}
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
                <div className={css`display: flex; align-items: center; gap: 1rem;`}>
                  {/* Avatar */}
                  <div className={css`
                    width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
                    background: ${theme.colors.roseGold}20;
                    border: 1px solid ${theme.colors.roseGold}40;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.875rem; font-weight: 700; color: ${theme.colors.roseGold};
                    font-family: ${theme.fonts.heading};
                  `}>
                    {c.firstName[0]}{c.lastName[0]}
                  </div>
                  <div>
                    <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.9rem; margin: 0;`}>
                      {c.firstName} {c.lastName}
                    </p>
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.78rem; margin: 0.125rem 0 0;`}>
                      {[c.phone, c.email].filter(Boolean).join(' · ') || 'No contact info'}
                    </p>
                  </div>
                </div>

                <div className={css`display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;`}>
                  {c.naturalLevel && (
                    <span className={css`
                      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
                      background: ${levelBg(c.naturalLevel)};
                      color: ${levelFg(c.naturalLevel)};
                      display: flex; align-items: center; justify-content: center;
                      font-size: 0.75rem; font-weight: 700;
                      border: 1px solid rgba(255,255,255,0.1);
                    `} title={`Level ${c.naturalLevel}`}>
                      {c.naturalLevel}
                    </span>
                  )}
                  {c.grayPercentage != null && c.grayPercentage > 0 && (
                    <Badge variant="default">{c.grayPercentage}% gray</Badge>
                  )}
                  {c.hairPorosity && (
                    <Badge color={POROSITY_COLOR[c.hairPorosity] ?? theme.colors.textMuted}>
                      {c.hairPorosity} porosity
                    </Badge>
                  )}
                  {c.allergies && (
                    <Badge variant="error">⚠ allergies</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Client Modal */}
        {showModal && (
          <div className={css`
            position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200;
            display: flex; align-items: center; justify-content: center; padding: 1rem;
          `}>
            <div className={css`
              background: ${theme.colors.obsidianMid};
              border: 1px solid ${theme.colors.borderDefault};
              border-radius: ${theme.radii.xl};
              padding: 2rem; width: min(520px, 100%);
              max-height: 90vh; overflow-y: auto;
            `}>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1.5rem;`}>
                New Client
              </h3>

              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;`}>
                {[
                  { label: 'First Name *', key: 'firstName', type: 'text' },
                  { label: 'Last Name *', key: 'lastName', type: 'text' },
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'Phone', key: 'phone', type: 'tel' },
                  { label: 'Natural Level (1–10)', key: 'naturalLevel', type: 'number' },
                  { label: 'Gray %', key: 'grayPercentage', type: 'number' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>{label}</label>
                    <Input
                      type={type}
                      value={(form as any)[key]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      min={type === 'number' ? 0 : undefined}
                      max={key === 'naturalLevel' ? 10 : key === 'grayPercentage' ? 100 : undefined}
                    />
                  </div>
                ))}
              </div>

              <div className={css`margin-top: 1rem;`}>
                <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Porosity</label>
                <div className={css`display: flex; gap: 0.5rem;`}>
                  {['low', 'normal', 'high'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm((f) => ({ ...f, hairPorosity: f.hairPorosity === p ? '' : p }))}
                      className={css`
                        flex: 1; padding: 0.5rem; border-radius: ${theme.radii.sm};
                        border: 1px solid ${form.hairPorosity === p ? (POROSITY_COLOR[p] ?? theme.colors.gold) : theme.colors.borderDefault};
                        background: ${form.hairPorosity === p ? (POROSITY_COLOR[p] ?? theme.colors.gold) + '20' : 'transparent'};
                        color: ${form.hairPorosity === p ? (POROSITY_COLOR[p] ?? theme.colors.gold) : theme.colors.textMuted};
                        font-size: 0.8rem; cursor: pointer; text-transform: capitalize;
                      `}
                    >{p}</button>
                  ))}
                </div>
              </div>

              <div className={css`margin-top: 1rem;`}>
                <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Allergies / Sensitivities</label>
                <Input
                  placeholder="e.g. PPD, resorcinol, fragrance"
                  value={form.allergies}
                  onChange={(e) => setForm((p) => ({ ...p, allergies: e.target.value }))}
                />
              </div>

              <div className={css`margin-top: 1rem;`}>
                <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Notes</label>
                <textarea
                  placeholder="Any additional notes…"
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  className={css`
                    width: 100%; padding: 0.625rem 0.875rem; resize: vertical;
                    background: ${theme.colors.obsidian};
                    border: 1px solid ${theme.colors.borderDefault};
                    border-radius: ${theme.radii.md};
                    color: ${theme.colors.textPrimary}; font-size: 0.875rem; font-family: inherit;
                    box-sizing: border-box;
                    &:focus { border-color: ${theme.colors.gold}; outline: none; }
                  `}
                />
              </div>

              {error && (
                <p className={css`color: ${theme.colors.error}; font-size: 0.8rem; margin-top: 0.75rem;`}>{error}</p>
              )}

              <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Add Client'}</Button>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </MainContent>
    </>
  );
}
