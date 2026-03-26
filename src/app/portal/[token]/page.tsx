'use client';
/**
 * Client Portal — public-facing page accessible via appointment self-booking token.
 * Clients can: view their appointment, see color history, sign consent forms,
 * chat with the AI receptionist, and view loyalty points.
 */
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';

interface PortalData {
  appointment: {
    id: string;
    serviceType: string;
    serviceLabel: string | null;
    scheduledAt: string;
    endsAt: string;
    durationMinutes: number;
    price: string | null;
    colorPrepInstructions: string | null;
    clientNotes: string | null;
    status: string;
  } | null;
  client: {
    firstName: string;
    lastName: string;
    email: string | null;
  } | null;
  salon: {
    name: string;
    phone: string | null;
    address: string | null;
  } | null;
  loyaltyPoints: number;
  loyaltyTier: string;
  visitStreak: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const TIER_COLORS: Record<string, string> = {
  bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', platinum: '#e5e4e2',
};

export default function ClientPortalPage({ params }: { params: { token: string } }) {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'appointment' | 'chat' | 'loyalty' | 'consent'>('appointment');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm Elara, your salon assistant. I can answer questions about your appointment, services, or help you reschedule. How can I help?" },
  ]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [signature, setSignature] = useState('');
  const [consentSigned, setConsentSigned] = useState(false);

  useEffect(() => {
    fetch(`/api/portal/${params.token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Unable to load your portal. Please contact the salon.'))
      .finally(() => setLoading(false));
  }, [params.token]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || chatLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/receptionist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          context: {
            salonName: data?.salon?.name ?? 'the salon',
            clientName: data?.client?.firstName,
            salonPhone: data?.salon?.phone ?? undefined,
            salonAddress: data?.salon?.address ?? undefined,
          },
        }),
      });
      const d = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: d.reply ?? 'Sorry, I had trouble with that.' }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return (
    <div className={css`min-height: 100vh; background: ${theme.colors.surfaceDark}; display: flex; align-items: center; justify-content: center;`}>
      <p className={css`color: ${theme.colors.textMuted};`}>Loading your portal…</p>
    </div>
  );

  if (error || !data) return (
    <div className={css`min-height: 100vh; background: ${theme.colors.surfaceDark}; display: flex; align-items: center; justify-content: center; padding: 2rem;`}>
      <div className={css`text-align: center;`}>
        <p className={css`color: ${theme.colors.error}; font-size: 1rem; margin-bottom: 0.5rem;`}>{error ?? 'Portal not found'}</p>
        <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Please contact the salon directly.</p>
      </div>
    </div>
  );

  const appt = data.appointment;
  const client = data.client;
  const salon = data.salon;

  const tabBtn = (t: typeof tab, label: string, icon: string) => (
    <button onClick={() => setTab(t)} className={css`
      flex: 1; padding: 0.75rem 0.5rem; border: none; cursor: pointer;
      background: ${tab === t ? theme.colors.roseGold + '20' : 'transparent'};
      border-bottom: 2px solid ${tab === t ? theme.colors.roseGold : 'transparent'};
      color: ${tab === t ? theme.colors.roseGold : theme.colors.textSecondary};
      font-size: 0.8rem; display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
    `}>
      <span className={css`font-size: 1.1rem;`}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div className={css`min-height: 100vh; background: ${theme.colors.surfaceDark}; color: ${theme.colors.warmCream}; font-family: 'Inter', sans-serif;`}>
      {/* Header */}
      <div className={css`
        background: ${theme.colors.obsidian};
        border-bottom: 1px solid ${theme.colors.borderDefault};
        padding: 1.25rem 1.5rem;
        display: flex; align-items: center; justify-content: space-between;
      `}>
        <div>
          <p className={css`font-family: 'Playfair Display', serif; color: ${theme.colors.roseGold}; font-size: 1.25rem; margin: 0;`}>
            {salon?.name ?? 'Elara Pro'}
          </p>
          {client && (
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0.2rem 0 0;`}>
              Welcome back, {client.firstName}
            </p>
          )}
        </div>
        <div className={css`
          font-size: 0.7rem; padding: 0.25rem 0.75rem; border-radius: 999px;
          background: ${TIER_COLORS[data.loyaltyTier] ?? theme.colors.roseGold}20;
          color: ${TIER_COLORS[data.loyaltyTier] ?? theme.colors.roseGold};
          text-transform: capitalize;
        `}>{data.loyaltyTier} Member</div>
      </div>

      {/* Tab bar */}
      <div className={css`display: flex; background: ${theme.colors.obsidianMid}; border-bottom: 1px solid ${theme.colors.borderDefault};`}>
        {tabBtn('appointment', 'Appointment', '📅')}
        {tabBtn('chat', 'Chat', '💬')}
        {tabBtn('loyalty', 'Rewards', '⭐')}
        {tabBtn('consent', 'Consent', '✍️')}
      </div>

      <div className={css`max-width: 560px; margin: 0 auto; padding: 1.5rem;`}>

        {/* Appointment tab */}
        {tab === 'appointment' && (
          <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
            {appt ? (
              <>
                <div className={css`
                  background: ${theme.colors.obsidianMid};
                  border: 1px solid ${theme.colors.roseGold}40;
                  border-radius: 1rem;
                  padding: 1.5rem;
                `}>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.5rem;`}>Your Appointment</p>
                  <p className={css`font-family: 'Playfair Display', serif; color: ${theme.colors.warmCream}; font-size: 1.25rem; margin: 0 0 0.25rem;`}>
                    {appt.serviceLabel ?? appt.serviceType}
                  </p>
                  <p className={css`color: ${theme.colors.roseGold}; font-size: 1rem; font-weight: 600; margin: 0 0 1rem;`}>
                    {new Date(appt.scheduledAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {' at '}
                    {new Date(appt.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <div className={css`display: flex; gap: 1.5rem;`}>
                    <div>
                      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0;`}>Duration</p>
                      <p className={css`color: ${theme.colors.warmCream}; font-size: 0.9rem; margin: 0;`}>{appt.durationMinutes} min</p>
                    </div>
                    {appt.price && (
                      <div>
                        <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0;`}>Price</p>
                        <p className={css`color: ${theme.colors.warmCream}; font-size: 0.9rem; margin: 0;`}>${parseFloat(appt.price).toFixed(0)}</p>
                      </div>
                    )}
                    <div>
                      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0;`}>Status</p>
                      <p className={css`color: ${theme.colors.success}; font-size: 0.9rem; margin: 0; text-transform: capitalize;`}>{appt.status.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>

                {appt.colorPrepInstructions && (
                  <div className={css`
                    background: ${theme.colors.roseGold}10;
                    border: 1px solid ${theme.colors.roseGold}30;
                    border-radius: 0.75rem;
                    padding: 1.25rem;
                  `}>
                    <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; font-weight: 600; margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;`}>
                      ✦ Prep Instructions
                    </p>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; line-height: 1.6; margin: 0; white-space: pre-wrap;`}>
                      {appt.colorPrepInstructions}
                    </p>
                  </div>
                )}

                <div className={css`
                  background: ${theme.colors.obsidianMid};
                  border: 1px solid ${theme.colors.borderDefault};
                  border-radius: 0.75rem;
                  padding: 1.25rem;
                `}>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0 0 0.5rem;`}>Cancellation Policy</p>
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; line-height: 1.5; margin: 0;`}>
                    Please provide at least 24 hours notice to cancel or reschedule. Late cancellations may incur a fee. To reschedule, tap Chat below.
                  </p>
                </div>
              </>
            ) : (
              <div className={css`text-align: center; padding: 3rem 1rem;`}>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No upcoming appointment found.</p>
              </div>
            )}
          </div>
        )}

        {/* Chat tab */}
        {tab === 'chat' && (
          <div className={css`display: flex; flex-direction: column; height: calc(100vh - 200px);`}>
            <div className={css`flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; padding-bottom: 1rem;`}>
              {messages.map((msg, i) => (
                <div key={i} className={css`display: flex; justify-content: ${msg.role === 'user' ? 'flex-end' : 'flex-start'};`}>
                  <div className={css`
                    max-width: 85%;
                    padding: 0.75rem 1rem;
                    border-radius: ${msg.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem'};
                    background: ${msg.role === 'user' ? theme.colors.roseGold : theme.colors.obsidianMid};
                    color: ${msg.role === 'user' ? theme.colors.obsidian : theme.colors.textSecondary};
                    font-size: 0.875rem; line-height: 1.5;
                  `}>{msg.content}</div>
                </div>
              ))}
              {chatLoading && (
                <div className={css`display: flex; justify-content: flex-start;`}>
                  <div className={css`padding: 0.75rem 1rem; background: ${theme.colors.obsidianMid}; border-radius: 1rem 1rem 1rem 0.25rem; color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>…</div>
                </div>
              )}
            </div>
            <div className={css`display: flex; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid ${theme.colors.borderDefault};`}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about your appointment…"
                className={css`
                  flex: 1; padding: 0.75rem 1rem;
                  background: ${theme.colors.obsidianMid};
                  border: 1px solid ${theme.colors.borderDefault};
                  border-radius: 1.5rem;
                  color: ${theme.colors.warmCream}; font-size: 0.875rem;
                  &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
                `}
              />
              <button
                onClick={sendMessage}
                disabled={chatLoading || !input.trim()}
                className={css`
                  width: 44px; height: 44px; border-radius: 50%;
                  background: ${theme.colors.roseGold}; border: none; cursor: pointer;
                  color: white; font-size: 1rem;
                  &:disabled { opacity: 0.4; cursor: not-allowed; }
                `}
              >↑</button>
            </div>
          </div>
        )}

        {/* Loyalty tab */}
        {tab === 'loyalty' && (
          <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
            <div className={css`
              background: linear-gradient(135deg, ${theme.colors.obsidianMid}, ${theme.colors.obsidian});
              border: 1px solid ${TIER_COLORS[data.loyaltyTier] ?? theme.colors.roseGold}40;
              border-radius: 1rem; padding: 1.75rem; text-align: center;
            `}>
              <p className={css`font-size: 3rem; font-weight: 800; color: ${theme.colors.roseGold}; margin: 0;`}>{data.loyaltyPoints}</p>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0.25rem 0 1rem;`}>Loyalty Points</p>
              <div className={css`
                display: inline-block; padding: 0.25rem 1rem; border-radius: 999px;
                background: ${TIER_COLORS[data.loyaltyTier] ?? theme.colors.roseGold}20;
                color: ${TIER_COLORS[data.loyaltyTier] ?? theme.colors.roseGold};
                font-size: 0.8rem; font-weight: 600; text-transform: capitalize;
              `}>{data.loyaltyTier} Member</div>
              {data.visitStreak > 0 && (
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem; margin: 0.75rem 0 0;`}>
                  🔥 {data.visitStreak} visit streak
                </p>
              )}
            </div>
            <div className={css`background: ${theme.colors.obsidianMid}; border: 1px solid ${theme.colors.borderDefault}; border-radius: 0.75rem; padding: 1.25rem;`}>
              <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0 0 0.75rem;`}>How to earn points</p>
              {[
                { action: 'Every visit', points: '100 pts' },
                { action: 'Refer a friend', points: '250 pts' },
                { action: 'Birthday month', points: '150 pts' },
                { action: 'Leave a review', points: '50 pts' },
                { action: '5-visit streak', points: '200 pts bonus' },
              ].map((item) => (
                <div key={item.action} className={css`display: flex; justify-content: space-between; padding: 0.375rem 0; border-bottom: 1px solid ${theme.colors.borderDefault}20;`}>
                  <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem;`}>{item.action}</span>
                  <span className={css`color: ${theme.colors.roseGold}; font-size: 0.8rem; font-weight: 600;`}>{item.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consent tab */}
        {tab === 'consent' && (
          <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
            <div className={css`background: ${theme.colors.obsidianMid}; border: 1px solid ${theme.colors.borderDefault}; border-radius: 0.75rem; padding: 1.25rem;`}>
              <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0 0 0.75rem;`}>Service Consent Form</p>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; line-height: 1.6; margin: 0 0 1rem;`}>
                I authorize the stylist to perform the requested hair service. I confirm I have disclosed all known allergies, previous chemical services, and medical conditions that may affect the service. I understand that results may vary based on my hair history and condition.
              </p>
              {!consentSigned ? (
                <>
                  <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.375rem;`}>
                    Type your full name to sign
                  </label>
                  <input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Your full name"
                    className={css`
                      width: 100%; padding: 0.75rem 1rem;
                      background: ${theme.colors.obsidian};
                      border: 1px solid ${theme.colors.borderDefault};
                      border-radius: 0.5rem;
                      color: ${theme.colors.warmCream}; font-size: 0.875rem;
                      box-sizing: border-box;
                      &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
                    `}
                  />
                  <button
                    onClick={() => signature.length > 2 && setConsentSigned(true)}
                    disabled={signature.length < 3}
                    className={css`
                      width: 100%; margin-top: 0.75rem; padding: 0.875rem;
                      background: ${theme.colors.roseGold}; border: none; border-radius: 0.5rem;
                      color: ${theme.colors.obsidian}; font-weight: 700; font-size: 0.9rem; cursor: pointer;
                      &:disabled { opacity: 0.4; cursor: not-allowed; }
                    `}
                  >Sign Consent Form</button>
                </>
              ) : (
                <div className={css`padding: 1rem; background: ${theme.colors.success}15; border: 1px solid ${theme.colors.success}40; border-radius: 0.5rem; text-align: center;`}>
                  <p className={css`color: ${theme.colors.success}; font-weight: 600; margin: 0;`}>✓ Signed by {signature}</p>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0.25rem 0 0;`}>{new Date().toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
