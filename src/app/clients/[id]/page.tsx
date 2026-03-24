'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, Card, Button, Badge } from '@/components/Navigation';
import { getUnderlyingPigment } from '@/lib/chemistry';

interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  memberSince: string;
  primaryStylist: string;
  naturalLevel: number | null;
  naturalTone: string;
  grayPercentage: number;
  hairTexture: string;
  hairDensity: string;
  hairPorosity: string;
  scalpCondition: string;
  allergies: string;
  notes: string;
  chemicalHistory: string[];
  avatarUrl: string | null;
}

interface ServiceRecord {
  id: string;
  date: string;
  service: string;
  stylist: string;
  formula: string;
  price: string;
  satisfaction: number;
}

interface FormulaRecord {
  id: string;
  name: string;
  date: string;
  zones: number;
  brand: string;
}

interface PatchTest {
  id: string;
  date: string;
  products: string;
  result: string;
  expiresAt: string;
}

interface Photo {
  id: string;
  type: 'before' | 'after';
  date: string;
  url: string | null;
}

type Tab = 'overview' | 'history' | 'formulas' | 'photos' | 'safety';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [formulas, setFormulas] = useState<FormulaRecord[]>([]);
  const [patchTests, setPatchTests] = useState<PatchTest[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id;
    Promise.all([
      fetch(`/api/clients/${id}`).then((r) => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`/api/clients/${id}/services`).then((r) => r.ok ? r.json() : []),
      fetch(`/api/clients/${id}/formulas`).then((r) => r.ok ? r.json() : []),
      fetch(`/api/clients/${id}/patch-tests`).then((r) => r.ok ? r.json() : []),
      fetch(`/api/clients/${id}/photos`).then((r) => r.ok ? r.json() : []),
    ])
      .then(([c, s, f, pt, ph]) => {
        setClient(c);
        setServices(s);
        setFormulas(f);
        setPatchTests(pt);
        setPhotos(ph);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navigation />
        <MainContent>
          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Loading client…</p>
        </MainContent>
      </>
    );
  }

  if (error || !client) {
    return (
      <>
        <Navigation />
        <MainContent>
          <Card>
            <p className={css`color: #f44336; font-size: 0.875rem;`}>{error ? `Error: ${error}` : 'Client not found.'}</p>
            <Button variant="secondary" onClick={() => router.push('/clients')}>Back to Clients</Button>
          </Card>
        </MainContent>
      </>
    );
  }

  const pigment = client.naturalLevel ? getUnderlyingPigment(client.naturalLevel as 1) : null;

  const patchTestStatus = () => {
    const latest = patchTests[0];
    if (!latest) return { label: 'No patch test on record', color: theme.colors.warning };
    const expires = new Date(latest.expiresAt);
    if (latest.result !== 'negative') return { label: 'Reaction recorded — do not proceed', color: '#FF4444' };
    if (expires < new Date()) return { label: 'Patch test expired', color: theme.colors.warning };
    return { label: `Valid until ${latest.expiresAt}`, color: theme.colors.success };
  };

  const ptStatus = patchTestStatus();

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'Service History' },
    { id: 'formulas', label: 'Formulas' },
    { id: 'photos', label: 'Photos' },
    { id: 'safety', label: 'Patch Tests & Consent' },
  ];

  const labelCss = css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`;
  const valueCss = css`color: ${theme.colors.warmCream}; font-size: 0.875rem;`;
  const rowCss = css`display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid ${theme.colors.borderDefault};`;

  return (
    <>
      <Navigation />
      <MainContent>
        {/* Header */}
        <div className={css`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;`}>
          <div className={css`display: flex; align-items: center; gap: 1.25rem;`}>
            <div className={css`width: 64px; height: 64px; border-radius: 50%; background: ${theme.colors.obsidianMid}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: ${theme.colors.roseGold}; flex-shrink: 0;`}>
              {client.firstName[0]}{client.lastName[0]}
            </div>
            <div>
              <h2 className={css`font-family: ${theme.fonts.heading}; font-size: 1.75rem; color: ${theme.colors.warmCream};`}>{client.firstName} {client.lastName}</h2>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>{client.email} · {client.phone}</p>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>Client since {client.memberSince} · {client.primaryStylist}</p>
            </div>
          </div>
          <div className={css`display: flex; gap: 0.75rem;`}>
            <Button onClick={() => router.push(`/consult/new?client=${params.id}`)}>+ New Consultation</Button>
            <Button variant="secondary" onClick={() => router.push(`/clients/${params.id}/edit`)}>Edit Profile</Button>
          </div>
        </div>

        {/* Patch test alert */}
        <div className={css`padding: 0.75rem 1rem; background: ${ptStatus.color}15; border: 1px solid ${ptStatus.color}40; border-radius: ${theme.radii.md}; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;`}>
          <div className={css`display: flex; align-items: center; gap: 0.75rem;`}>
            <span>🧪</span>
            <div>
              <span className={css`color: ${ptStatus.color}; font-size: 0.875rem; font-weight: 600;`}>Patch Test: </span>
              <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>{ptStatus.label}</span>
            </div>
          </div>
          <Button variant="secondary" onClick={() => setTab('safety')}>View Records</Button>
        </div>

        {/* Tabs */}
        <div className={css`display: flex; gap: 0.25rem; margin-bottom: 1.5rem; border-bottom: 1px solid ${theme.colors.borderDefault}; overflow-x: auto;`}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={css`
                padding: 0.625rem 1rem; font-size: 0.875rem; cursor: pointer; white-space: nowrap;
                border: none; background: none;
                color: ${tab === t.id ? theme.colors.roseGold : theme.colors.textSecondary};
                border-bottom: 2px solid ${tab === t.id ? theme.colors.roseGold : 'transparent'};
                margin-bottom: -1px;
                &:hover { color: ${theme.colors.warmCream}; }
              `}>
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: Overview */}
        {tab === 'overview' && (
          <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
            <Card>
              <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Hair Profile</h3>
              <div className={css`display: flex; flex-direction: column;`}>
                {[
                  { label: 'Natural Level', value: client.naturalLevel ? `Level ${client.naturalLevel}` : '—' },
                  { label: 'Natural Tone',  value: client.naturalTone || '—' },
                  { label: 'Gray %',        value: `${client.grayPercentage}%` },
                  { label: 'Texture',       value: client.hairTexture },
                  { label: 'Density',       value: client.hairDensity },
                  { label: 'Porosity',      value: client.hairPorosity },
                  { label: 'Scalp',         value: client.scalpCondition },
                ].map((r) => (
                  <div key={r.label} className={rowCss}>
                    <span className={labelCss}>{r.label}</span>
                    <span className={valueCss}>{r.value}</span>
                  </div>
                ))}
              </div>
              {pigment && (
                <div className={css`margin-top: 1rem; padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; display: flex; align-items: center; gap: 0.75rem;`}>
                  <div className={css`width: 28px; height: 28px; border-radius: 50%; background: ${pigment.hexColor}; flex-shrink: 0;`} />
                  <div>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.7rem;`}>UNDERLYING PIGMENT AT NATURAL LEVEL</p>
                    <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem;`}>{pigment.pigmentName}</p>
                  </div>
                </div>
              )}
            </Card>

            <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
              <Card>
                <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Chemical History</h3>
                {client.chemicalHistory.length > 0 ? (
                  <div className={css`display: flex; flex-wrap: wrap; gap: 0.5rem;`}>
                    {client.chemicalHistory.map((h) => (
                      <Badge key={h} color={theme.colors.warning}>{h}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No chemical history recorded.</p>
                )}
              </Card>

              <Card>
                <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>Allergies & Notes</h3>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 0.75rem;`}>
                  <strong className={css`color: ${theme.colors.warmCream};`}>Allergies:</strong> {client.allergies || 'None recorded'}
                </p>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>{client.notes || 'No notes.'}</p>
              </Card>

              <Card>
                <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>Quick Stats</h3>
                <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;`}>
                  {[
                    { label: 'Total Visits',     value: services.length },
                    { label: 'Formulas on File', value: formulas.length },
                    { label: 'Patch Tests',      value: patchTests.length },
                    { label: 'Last Visit',       value: services[0]?.date ?? '—' },
                  ].map((s) => (
                    <div key={s.label} className={css`padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md};`}>
                      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem;`}>{s.label}</p>
                      <p className={css`color: ${theme.colors.warmCream}; font-size: 1.1rem; font-weight: 600;`}>{s.value}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB: Service History */}
        {tab === 'history' && (
          <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
            {services.length === 0 ? (
              <Card><p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No service history yet.</p></Card>
            ) : services.map((s) => (
              <Card key={s.id}>
                <div className={css`display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.75rem;`}>
                  <div>
                    <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin-bottom: 0.25rem;`}>{s.service}</p>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>{s.formula}</p>
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-top: 0.25rem;`}>{s.date} · {s.stylist}</p>
                  </div>
                  <div className={css`text-align: right;`}>
                    <p className={css`color: ${theme.colors.roseGold}; font-weight: 600;`}>{s.price}</p>
                    <p className={css`color: ${theme.colors.warning}; font-size: 0.875rem;`}>{'★'.repeat(s.satisfaction)}{'☆'.repeat(5 - s.satisfaction)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* TAB: Formulas */}
        {tab === 'formulas' && (
          <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
            <div className={css`display: flex; justify-content: flex-end;`}>
              <Button onClick={() => router.push(`/formulate/new?client=${params.id}`)}>+ New Formula</Button>
            </div>
            {formulas.length === 0 ? (
              <Card><p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No formulas on file yet.</p></Card>
            ) : formulas.map((f) => (
              <Card key={f.id}>
                <div className={css`display: flex; justify-content: space-between; align-items: center;`}>
                  <div>
                    <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin-bottom: 0.25rem;`}>{f.name}</p>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>{f.brand} · {f.zones} zone{f.zones !== 1 ? 's' : ''}</p>
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>{f.date}</p>
                  </div>
                  <Button variant="secondary" onClick={() => router.push(`/formulate/${f.id}`)}>Open</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* TAB: Photos */}
        {tab === 'photos' && (
          <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; @media (max-width: 600px) { grid-template-columns: 1fr; }`}>
            {(['before', 'after'] as const).map((type) => {
              const typePhotos = photos.filter((p) => p.type === type);
              return (
                <Card key={type}>
                  <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem; text-transform: capitalize;`}>{type} Photos</h3>
                  <div className={css`display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1rem;`}>
                    {typePhotos.length === 0 ? (
                      <div className={css`grid-column: 1/-1; padding: 2rem; text-align: center; color: ${theme.colors.textMuted}; font-size: 0.875rem; border: 1px dashed ${theme.colors.borderDefault}; border-radius: ${theme.radii.md};`}>
                        No {type} photos
                      </div>
                    ) : typePhotos.map((p) => (
                      <div key={p.id} className={css`aspect-ratio: 1; border-radius: ${theme.radii.md}; background: ${theme.colors.obsidian}; overflow: hidden; display: flex; align-items: center; justify-content: center; color: ${theme.colors.textMuted};`}>
                        {p.url
                          ? <img src={p.url} alt={type} className={css`width: 100%; height: 100%; object-fit: cover;`} />
                          : <span>📷</span>}
                      </div>
                    ))}
                  </div>
                  <Button variant="secondary" onClick={() => router.push(`/consult/new?client=${params.id}`)}>Add via Consultation</Button>
                </Card>
              );
            })}
          </div>
        )}

        {/* TAB: Safety */}
        {tab === 'safety' && (
          <div className={css`display: flex; flex-direction: column; gap: 1.5rem;`}>
            <Card>
              <div className={css`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`}>
                <h3 className={css`color: ${theme.colors.warmCream};`}>Patch Test Records</h3>
                <Button variant="secondary">+ Record New Test</Button>
              </div>
              {patchTests.length === 0 ? (
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No patch tests on record.</p>
              ) : (
                <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
                  {patchTests.map((pt) => {
                    const expired = new Date(pt.expiresAt) < new Date();
                    const resultColor = pt.result === 'negative' ? theme.colors.success : '#FF4444';
                    return (
                      <div key={pt.id} className={css`padding: 1rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; border-left: 3px solid ${expired ? theme.colors.warning : resultColor};`}>
                        <div className={css`display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 0.5rem;`}>
                          <div>
                            <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;`}>{pt.products}</p>
                            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>Applied: {pt.date} · Expires: {pt.expiresAt}</p>
                          </div>
                          <div className={css`display: flex; gap: 0.5rem; align-items: center;`}>
                            <Badge color={resultColor}>{pt.result}</Badge>
                            {expired && <Badge color={theme.colors.warning}>expired</Badge>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <div className={css`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`}>
                <h3 className={css`color: ${theme.colors.warmCream};`}>Consent Forms</h3>
                <Button variant="secondary">+ New Consent Form</Button>
              </div>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
                Consent forms are generated automatically during the consultation flow and stored here for your legal protection.
              </p>
            </Card>
          </div>
        )}
      </MainContent>
    </>
  );
}
