'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button } from '@/components/Navigation';
import { ELARA_VOICES } from '@/lib/elevenlabs';
import { useSalon } from '@/lib/salon-context';

interface SalonData {
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  subscriptionTier: string;
  subscriptionStatus: string;
  trialEndsAt: string | null;
  voiceEnabled: boolean;
  preferredVoiceId: string | null;
}

const inputClass = css`
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: ${theme.colors.obsidian};
  border: 1px solid ${theme.colors.borderDefault};
  border-radius: ${theme.radii.sm};
  color: ${theme.colors.warmCream};
  font-size: 0.875rem;
  box-sizing: border-box;
  &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
`;

const labelClass = css`
  color: ${theme.colors.textSecondary};
  font-size: 0.75rem;
  display: block;
  margin-bottom: 0.25rem;
`;

export default function SettingsPage() {
  const { settings: salonCtx } = useSalon();
  const [salon, setSalon] = useState<SalonData | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [previewAudio, setPreviewAudio] = useState<HTMLAudioElement | null>(null);
  const [previewing, setPreviewing] = useState(false);

  useEffect(() => {
    fetch('/api/analytics?period=month')
      .then((r) => r.json())
      .then((d) => {
        const s = d.salon as SalonData | null;
        if (s) {
          setSalon(s);
          setForm({
            name: (s as any).name ?? '',
            email: s.email ?? '',
            phone: s.phone ?? '',
            address: s.address ?? '',
            city: s.city ?? '',
            state: s.state ?? '',
          });
          setSelectedVoice(s.preferredVoiceId ?? ELARA_VOICES[0]!.voice_id);
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // In production this would POST to /api/settings or /api/auth
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const previewVoice = async (voiceId: string) => {
    if (previewing) { previewAudio?.pause(); setPreviewing(false); return; }
    setPreviewing(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: "Hi, I'm Elara. I'm here to help you create beautiful color.", voiceId }),
      });
      if (!res.ok) { setPreviewing(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setPreviewAudio(audio);
      audio.onended = () => { setPreviewing(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setPreviewing(false);
      await audio.play();
    } catch { setPreviewing(false); }
  };

  const trialDaysLeft = salon?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(salon.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Settings" subtitle="Manage your salon and account" />

        <div className={css`display: grid; gap: 1.5rem; max-width: 680px;`}>

          {/* Salon info */}
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1.25rem;`}>
              Salon Information
            </h3>
            <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
              <div>
                <label className={labelClass}>Salon Name</label>
                <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your salon name" />
              </div>
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;`}>
                <div>
                  <label className={labelClass}>Email</label>
                  <input className={inputClass} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Address</label>
                <input className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;`}>
                <div>
                  <label className={labelClass}>City</label>
                  <input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input className={inputClass} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="CA" />
                </div>
              </div>
              <Button onClick={handleSave}>
                {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Changes'}
              </Button>
            </div>
          </Card>

          {/* Elara Voice */}
          <Card>
            <div className={css`display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;`}>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0;`}>
                Elara Voice
              </h3>
              {salon?.voiceEnabled ? (
                <span className={css`
                  font-size: 0.75rem; padding: 0.2rem 0.6rem;
                  border-radius: 999px;
                  background: ${theme.colors.success}20;
                  color: ${theme.colors.success};
                `}>Active</span>
              ) : (
                <Link href="/settings/billing">
                  <Button variant="secondary">Add Voice — $9.99/mo</Button>
                </Link>
              )}
            </div>

            {!salon?.voiceEnabled && (
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 1.25rem;`}>
                Enable the voice add-on to hear Elara speak her responses. Choose from 5 curated voices.
              </p>
            )}

            <div className={css`display: flex; flex-direction: column; gap: 0.625rem;`}>
              {ELARA_VOICES.map((voice) => (
                <div
                  key={voice.voice_id}
                  className={css`
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0.875rem 1rem;
                    background: ${selectedVoice === voice.voice_id ? theme.colors.roseGold + '15' : theme.colors.obsidian};
                    border: 1px solid ${selectedVoice === voice.voice_id ? theme.colors.roseGold + '60' : theme.colors.borderDefault};
                    border-radius: ${theme.radii.sm};
                    cursor: ${salon?.voiceEnabled ? 'pointer' : 'default'};
                    opacity: ${salon?.voiceEnabled ? 1 : 0.5};
                  `}
                  onClick={() => salon?.voiceEnabled && setSelectedVoice(voice.voice_id)}
                >
                  <div>
                    <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 600; margin: 0;`}>
                      {voice.name}
                    </p>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; margin: 0.2rem 0 0;`}>
                      {voice.description}
                    </p>
                  </div>
                  {salon?.voiceEnabled && (
                    <button
                      onClick={(e) => { e.stopPropagation(); previewVoice(voice.voice_id); }}
                      className={css`
                        padding: 0.3rem 0.625rem;
                        background: transparent;
                        border: 1px solid ${theme.colors.borderDefault};
                        border-radius: ${theme.radii.sm};
                        color: ${theme.colors.textSecondary};
                        font-size: 0.75rem; cursor: pointer;
                        &:hover { border-color: ${theme.colors.roseGold}; color: ${theme.colors.roseGold}; }
                      `}
                    >
                      {previewing ? '⏹' : '▶ Preview'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {salon?.voiceEnabled && (
              <div className={css`margin-top: 1rem;`}>
                <Button onClick={handleSave}>Save Voice Preference</Button>
              </div>
            )}
          </Card>

          {/* Subscription */}
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 0.75rem;`}>
              Subscription
            </h3>
            <div className={css`display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap;`}>
              <span className={css`
                font-size: 0.8rem; padding: 0.25rem 0.75rem;
                border-radius: 999px;
                background: ${theme.colors.roseGold}20;
                color: ${theme.colors.roseGold};
                text-transform: capitalize;
              `}>{salon?.subscriptionTier ?? 'free'} plan</span>
              {trialDaysLeft !== null && trialDaysLeft > 0 && (
                <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem;`}>
                  {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left in trial
                </span>
              )}
            </div>
            <Link href="/settings/billing">
              <Button>Manage Billing →</Button>
            </Link>
          </Card>

          {/* Brands */}
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 0.75rem;`}>
              Carried Brands
            </h3>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 1rem;`}>
              {salonCtx.selectedBrands.length > 0
                ? `${salonCtx.selectedBrands.length} brand${salonCtx.selectedBrands.length !== 1 ? 's' : ''} selected`
                : 'No brands selected yet.'}
            </p>
            <Link href="/onboarding">
              <Button variant="secondary">Update Brand Selection →</Button>
            </Link>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
