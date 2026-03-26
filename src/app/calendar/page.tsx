'use client';
import { useState, useEffect, useCallback } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button } from '@/components/Navigation';
import { useRouter } from 'next/navigation';

interface Appointment {
  id: string;
  status: string;
  serviceType: string;
  serviceLabel: string | null;
  scheduledAt: string;
  endsAt: string;
  durationMinutes: number;
  price: string | null;
  clientId: string;
  stylistId: string;
  internalNotes: string | null;
  clientNotes: string | null;
}

const STATUS_COLOR: Record<string, string> = {
  pending:    theme.colors.warning,
  confirmed:  theme.colors.success,
  checked_in: theme.colors.info,
  in_service: theme.colors.roseGold,
  completed:  theme.colors.textMuted,
  canceled:   theme.colors.error,
  no_show:    theme.colors.error,
};

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am–8pm
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getWeekDates(anchor: Date): Date[] {
  const start = new Date(anchor);
  start.setDate(anchor.getDate() - anchor.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function timeToRow(dateStr: string): number {
  const d = new Date(dateStr);
  return (d.getHours() - 8) * 60 + d.getMinutes();
}

export default function CalendarPage() {
  const router = useRouter();
  const [anchor, setAnchor] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'week' | 'day'>('week');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newAppt, setNewAppt] = useState({ serviceType: '', scheduledAt: '', durationMinutes: 60, price: '' });

  const weekDates = getWeekDates(anchor);
  const startISO = weekDates[0]!.toISOString();
  const endISO = new Date(weekDates[6]!.getTime() + 86400000).toISOString();

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/appointments?start=${startISO}&end=${endISO}`)
      .then((r) => r.json())
      .then((d) => setAppointments(d.appointments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [startISO, endISO]);

  useEffect(() => { load(); }, [load]);

  const prevWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() - 7); setAnchor(d); };
  const nextWeek = () => { const d = new Date(anchor); d.setDate(d.getDate() + 7); setAnchor(d); };
  const today = () => setAnchor(new Date());

  const getApptForDayHour = (day: Date, hour: number) =>
    appointments.filter((a) => {
      const d = new Date(a.scheduledAt);
      return d.toDateString() === day.toDateString() && d.getHours() === hour;
    });

  const handleCreate = async () => {
    if (!newAppt.serviceType || !newAppt.scheduledAt) return;
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAppt, clientId: 'placeholder', sendReminder: false }),
    });
    setShowNewModal(false);
    load();
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/appointments?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const todayStr = new Date().toDateString();

  return (
    <>
      <Navigation />
      <MainContent>
        <div className={css`display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;`}>
          <PageHeader title="Calendar" subtitle="Appointments and scheduling" />
          <div className={css`display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;`}>
            <Button variant="secondary" onClick={prevWeek}>‹</Button>
            <Button variant="secondary" onClick={today}>Today</Button>
            <Button variant="secondary" onClick={nextWeek}>›</Button>
            <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; min-width: 160px; text-align: center;`}>
              {weekDates[0]!.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {weekDates[6]!.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {(['week', 'day'] as const).map((v) => (
              <button key={v} onClick={() => setView(v)} className={css`
                padding: 0.35rem 0.75rem; border-radius: ${theme.radii.sm};
                border: 1px solid ${view === v ? theme.colors.roseGold : theme.colors.borderDefault};
                background: ${view === v ? theme.colors.roseGold + '20' : 'transparent'};
                color: ${view === v ? theme.colors.roseGold : theme.colors.textSecondary};
                font-size: 0.8rem; cursor: pointer; text-transform: capitalize;
              `}>{v}</button>
            ))}
            <Button onClick={() => setShowNewModal(true)}>+ New</Button>
          </div>
        </div>

        {/* Week grid */}
        <div className={css`
          background: ${theme.colors.obsidianMid};
          border: 1px solid ${theme.colors.borderDefault};
          border-radius: ${theme.radii.lg};
          overflow: auto;
        `}>
          {/* Day headers */}
          <div className={css`display: grid; grid-template-columns: 56px repeat(7, 1fr); border-bottom: 1px solid ${theme.colors.borderDefault};`}>
            <div />
            {weekDates.map((d, i) => (
              <div key={i} className={css`
                padding: 0.75rem 0.5rem; text-align: center;
                border-left: 1px solid ${theme.colors.borderDefault};
                background: ${d.toDateString() === todayStr ? theme.colors.roseGold + '15' : 'transparent'};
              `}>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0;`}>{DAYS[i]}</p>
                <p className={css`
                  color: ${d.toDateString() === todayStr ? theme.colors.roseGold : theme.colors.warmCream};
                  font-size: 1rem; font-weight: ${d.toDateString() === todayStr ? '700' : '400'}; margin: 0;
                `}>{d.getDate()}</p>
              </div>
            ))}
          </div>

          {/* Time rows */}
          <div className={css`position: relative;`}>
            {HOURS.map((hour) => (
              <div key={hour} className={css`display: grid; grid-template-columns: 56px repeat(7, 1fr); min-height: 60px;`}>
                <div className={css`
                  padding: 0.25rem 0.5rem; text-align: right;
                  color: ${theme.colors.textMuted}; font-size: 0.7rem;
                  border-right: 1px solid ${theme.colors.borderDefault};
                  padding-top: 0.375rem;
                `}>
                  {hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`}
                </div>
                {weekDates.map((day, di) => {
                  const appts = getApptForDayHour(day, hour);
                  return (
                    <div key={di} className={css`
                      border-left: 1px solid ${theme.colors.borderDefault};
                      border-bottom: 1px solid ${theme.colors.borderDefault}20;
                      padding: 2px;
                      background: ${day.toDateString() === todayStr ? theme.colors.roseGold + '05' : 'transparent'};
                      min-height: 60px;
                    `}>
                      {appts.map((a) => (
                        <div
                          key={a.id}
                          onClick={() => router.push(`/service/${a.id}`)}
                          className={css`
                            background: ${STATUS_COLOR[a.status] ?? theme.colors.roseGold}25;
                            border-left: 3px solid ${STATUS_COLOR[a.status] ?? theme.colors.roseGold};
                            border-radius: ${theme.radii.sm};
                            padding: 0.25rem 0.375rem;
                            margin-bottom: 2px;
                            cursor: pointer;
                            &:hover { background: ${STATUS_COLOR[a.status] ?? theme.colors.roseGold}40; }
                          `}
                        >
                          <p className={css`color: ${theme.colors.warmCream}; font-size: 0.7rem; font-weight: 600; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;`}>
                            {a.serviceLabel ?? a.serviceType}
                          </p>
                          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.65rem; margin: 0;`}>
                            {new Date(a.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            {' · '}{a.durationMinutes}m
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Today's appointments list */}
        <div className={css`margin-top: 1.5rem;`}>
          <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>
            Today's Schedule
          </h3>
          {loading ? (
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Loading…</p>
          ) : (
            <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
              {appointments
                .filter((a) => new Date(a.scheduledAt).toDateString() === todayStr)
                .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
                .map((a) => (
                  <div key={a.id} className={css`
                    background: ${theme.colors.obsidianMid};
                    border: 1px solid ${STATUS_COLOR[a.status] ?? theme.colors.borderDefault}60;
                    border-radius: ${theme.radii.md};
                    padding: 1rem 1.25rem;
                    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
                  `}>
                    <div>
                      <div className={css`display: flex; align-items: center; gap: 0.625rem; margin-bottom: 0.25rem;`}>
                        <span className={css`
                          font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px;
                          background: ${STATUS_COLOR[a.status] ?? theme.colors.roseGold}20;
                          color: ${STATUS_COLOR[a.status] ?? theme.colors.roseGold};
                          text-transform: capitalize;
                        `}>{a.status.replace('_', ' ')}</span>
                        <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.9rem; margin: 0;`}>
                          {a.serviceLabel ?? a.serviceType}
                        </p>
                      </div>
                      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem; margin: 0;`}>
                        {new Date(a.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        {' – '}
                        {new Date(a.endsAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        {a.price ? ` · $${parseFloat(a.price).toFixed(0)}` : ''}
                      </p>
                    </div>
                    <div className={css`display: flex; gap: 0.5rem;`}>
                      {a.status === 'confirmed' && (
                        <Button variant="secondary" onClick={() => updateStatus(a.id, 'checked_in')}>Check In</Button>
                      )}
                      {a.status === 'checked_in' && (
                        <Button onClick={() => updateStatus(a.id, 'in_service')}>Start Service</Button>
                      )}
                      {a.status === 'in_service' && (
                        <Button onClick={() => updateStatus(a.id, 'completed')}>Complete</Button>
                      )}
                      {(a.status === 'confirmed' || a.status === 'pending') && (
                        <Button variant="danger" onClick={() => updateStatus(a.id, 'canceled')}>Cancel</Button>
                      )}
                    </div>
                  </div>
                ))}
              {appointments.filter((a) => new Date(a.scheduledAt).toDateString() === todayStr).length === 0 && (
                <Card>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No appointments today.</p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* New appointment modal */}
        {showNewModal && (
          <div className={css`
            position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200;
            display: flex; align-items: center; justify-content: center; padding: 1rem;
          `}>
            <div className={css`
              background: ${theme.colors.obsidianMid};
              border: 1px solid ${theme.colors.borderDefault};
              border-radius: ${theme.radii.xl};
              padding: 2rem; width: min(480px, 100%);
            `}>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1.5rem;`}>
                New Appointment
              </h3>
              <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
                {[
                  { label: 'Service Type', key: 'serviceType', type: 'text', placeholder: 'e.g. Balayage + Toner' },
                  { label: 'Date & Time', key: 'scheduledAt', type: 'datetime-local', placeholder: '' },
                  { label: 'Duration (minutes)', key: 'durationMinutes', type: 'number', placeholder: '60' },
                  { label: 'Price ($)', key: 'price', type: 'number', placeholder: '150' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={(newAppt as any)[key]}
                      onChange={(e) => setNewAppt((p) => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                      className={css`
                        width: 100%; padding: 0.625rem 0.875rem;
                        background: ${theme.colors.obsidian};
                        border: 1px solid ${theme.colors.borderDefault};
                        border-radius: ${theme.radii.sm};
                        color: ${theme.colors.warmCream}; font-size: 0.875rem;
                        box-sizing: border-box;
                        &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
                      `}
                    />
                  </div>
                ))}
              </div>
              <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
                <Button onClick={handleCreate}>Create Appointment</Button>
                <Button variant="secondary" onClick={() => setShowNewModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </MainContent>
    </>
  );
}
