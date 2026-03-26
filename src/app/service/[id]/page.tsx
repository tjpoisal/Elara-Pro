'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Badge } from '@/components/Navigation';

interface Appointment {
  id: string;
  status: string;
  serviceType: string;
  serviceLabel: string | null;
  scheduledAt: string;
  durationMinutes: number;
  price: string | null;
  clientId: string;
  internalNotes: string | null;
}

interface TimerEntry {
  id: string;
  label: string;
  durationMinutes: number;
  elapsed: number;
  running: boolean;
  completed: boolean;
}

const STATUS_COLOR: Record<string, string> = {
  confirmed:  theme.colors.success,
  checked_in: theme.colors.info,
  in_service: theme.colors.roseGold,
  completed:  theme.colors.textMuted,
  canceled:   theme.colors.error,
};

const DEFAULT_TIMERS: Omit<TimerEntry, 'id'>[] = [
  { label: 'Color Processing', durationMinutes: 35, elapsed: 0, running: false, completed: false },
  { label: 'Toner', durationMinutes: 20, elapsed: 0, running: false, completed: false },
  { label: 'Deep Condition', durationMinutes: 10, elapsed: 0, running: false, completed: false },
];

export default function ServicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState<TimerEntry[]>(
    DEFAULT_TIMERS.map((t) => ({ ...t, id: crypto.randomUUID() }))
  );
  const [newTimerLabel, setNewTimerLabel] = useState('');
  const [newTimerMins, setNewTimerMins] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/appointments?id=${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        const found = (d.appointments ?? []).find((a: Appointment) => a.id === params.id);
        setAppt(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  // Tick all running timers every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers((prev) =>
        prev.map((t) => {
          if (!t.running || t.completed) return t;
          const next = t.elapsed + 1;
          const done = next >= t.durationMinutes * 60;
          return { ...t, elapsed: next, running: !done, completed: done };
        })
      );
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const toggleTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => t.id === id && !t.completed ? { ...t, running: !t.running } : t)
    );
  };

  const resetTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => t.id === id ? { ...t, elapsed: 0, running: false, completed: false } : t)
    );
  };

  const removeTimer = (id: string) => setTimers((prev) => prev.filter((t) => t.id !== id));

  const addTimer = () => {
    if (!newTimerLabel.trim()) return;
    setTimers((prev) => [...prev, {
      id: crypto.randomUUID(),
      label: newTimerLabel.trim(),
      durationMinutes: newTimerMins,
      elapsed: 0, running: false, completed: false,
    }]);
    setNewTimerLabel('');
    setNewTimerMins(30);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const updateStatus = async (status: string) => {
    await fetch(`/api/appointments?id=${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setAppt((a) => a ? { ...a, status } : a);
    if (status === 'completed') router.push('/calendar');
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <div className={css`display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;`}>
          <PageHeader
            title={loading ? 'Active Service' : (appt?.serviceLabel ?? appt?.serviceType ?? 'Active Service')}
            subtitle={appt ? new Date(appt.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : `Service ${params.id}`}
          />
          {appt && (
            <div className={css`display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;`}>
              <Badge color={STATUS_COLOR[appt.status] ?? theme.colors.textMuted}>
                {appt.status.replace('_', ' ')}
              </Badge>
              {appt.status === 'confirmed' && (
                <Button onClick={() => updateStatus('in_service')}>Start Service</Button>
              )}
              {appt.status === 'in_service' && (
                <Button onClick={() => updateStatus('completed')}>Complete Service</Button>
              )}
            </div>
          )}
        </div>

        <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
          {/* Timers */}
          <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0;`}>Processing Timers</h3>

            {timers.map((t) => {
              const remaining = Math.max(0, t.durationMinutes * 60 - t.elapsed);
              const pct = Math.min(100, (t.elapsed / (t.durationMinutes * 60)) * 100);
              const isOverdue = t.elapsed > t.durationMinutes * 60;

              return (
                <div key={t.id} className={css`
                  background: ${theme.colors.obsidianMid};
                  border: 1px solid ${t.completed ? theme.colors.success + '60' : t.running ? theme.colors.roseGold + '60' : theme.colors.borderDefault};
                  border-radius: ${theme.radii.md};
                  padding: 1.25rem;
                `}>
                  <div className={css`display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;`}>
                    <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.9rem; margin: 0;`}>{t.label}</p>
                    <button
                      onClick={() => removeTimer(t.id)}
                      className={css`background: none; border: none; color: ${theme.colors.textMuted}; cursor: pointer; font-size: 0.8rem; &:hover { color: ${theme.colors.error}; }`}
                    >✕</button>
                  </div>

                  <div className={css`
                    font-family: ${theme.fonts.mono ?? 'monospace'};
                    font-size: 2.5rem;
                    color: ${t.completed ? theme.colors.success : t.running ? theme.colors.roseGold : theme.colors.warmCream};
                    text-align: center; margin-bottom: 0.75rem;
                  `}>
                    {t.completed ? '✓ Done' : formatTime(remaining)}
                  </div>

                  <div className={css`height: 4px; background: ${theme.colors.borderDefault}; border-radius: 2px; overflow: hidden; margin-bottom: 0.875rem;`}>
                    <div className={css`
                      height: 100%; border-radius: 2px;
                      background: ${t.completed ? theme.colors.success : theme.colors.roseGold};
                      width: ${pct}%;
                      transition: width 1s linear;
                    `} />
                  </div>

                  <div className={css`display: flex; gap: 0.5rem; justify-content: center;`}>
                    {!t.completed && (
                      <Button
                        variant={t.running ? 'danger' : 'primary'}
                        onClick={() => toggleTimer(t.id)}
                      >
                        {t.running ? 'Pause' : 'Start'}
                      </Button>
                    )}
                    <Button variant="secondary" onClick={() => resetTimer(t.id)}>Reset</Button>
                  </div>
                </div>
              );
            })}

            {/* Add timer */}
            <div className={css`
              background: ${theme.colors.obsidianMid};
              border: 1px dashed ${theme.colors.borderDefault};
              border-radius: ${theme.radii.md};
              padding: 1rem;
            `}>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Add Timer</p>
              <div className={css`display: flex; gap: 0.5rem; flex-wrap: wrap;`}>
                <input
                  value={newTimerLabel}
                  onChange={(e) => setNewTimerLabel(e.target.value)}
                  placeholder="Timer label"
                  onKeyDown={(e) => e.key === 'Enter' && addTimer()}
                  className={css`
                    flex: 1; min-width: 120px; padding: 0.5rem 0.75rem;
                    background: ${theme.colors.obsidian};
                    border: 1px solid ${theme.colors.borderDefault};
                    border-radius: ${theme.radii.sm};
                    color: ${theme.colors.warmCream}; font-size: 0.875rem;
                    &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
                  `}
                />
                <input
                  type="number"
                  value={newTimerMins}
                  onChange={(e) => setNewTimerMins(Number(e.target.value))}
                  min={1}
                  className={css`
                    width: 70px; padding: 0.5rem 0.5rem;
                    background: ${theme.colors.obsidian};
                    border: 1px solid ${theme.colors.borderDefault};
                    border-radius: ${theme.radii.sm};
                    color: ${theme.colors.warmCream}; font-size: 0.875rem;
                    &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
                  `}
                />
                <span className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem; align-self: center;`}>min</span>
                <Button onClick={addTimer}>Add</Button>
              </div>
            </div>
          </div>

          {/* Service info */}
          <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
            {appt && (
              <Card>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1rem;`}>Service Details</h3>
                <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
                  {[
                    { label: 'Service', value: appt.serviceLabel ?? appt.serviceType },
                    { label: 'Duration', value: `${appt.durationMinutes} min` },
                    { label: 'Price', value: appt.price ? `$${parseFloat(appt.price).toFixed(0)}` : '—' },
                    { label: 'Scheduled', value: new Date(appt.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) },
                  ].map(({ label, value }) => (
                    <div key={label} className={css`display: flex; justify-content: space-between; padding: 0.375rem 0; border-bottom: 1px solid ${theme.colors.borderDefault}20;`}>
                      <span className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem;`}>{label}</span>
                      <span className={css`color: ${theme.colors.warmCream}; font-size: 0.8rem;`}>{value}</span>
                    </div>
                  ))}
                </div>
                {appt.internalNotes && (
                  <div className={css`margin-top: 0.875rem; padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.sm};`}>
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0 0 0.25rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Notes</p>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0;`}>{appt.internalNotes}</p>
                  </div>
                )}
              </Card>
            )}

            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1rem;`}>Quick Actions</h3>
              <div className={css`display: flex; flex-direction: column; gap: 0.625rem;`}>
                <Button variant="secondary" onClick={() => appt?.clientId && router.push(`/clients/${appt.clientId}`)}>
                  View Client Profile
                </Button>
                <Button variant="secondary" onClick={() => router.push('/formulate')}>
                  Open Formula Builder
                </Button>
                <Button variant="secondary" onClick={() => router.push('/calendar')}>
                  Back to Calendar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </MainContent>
    </>
  );
}
