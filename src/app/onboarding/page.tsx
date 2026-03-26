'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Button, Input, Card } from '@/components/Navigation';
import { BrandSelector } from '@/components/BrandSelector';
import { useSalon } from '@/lib/salon-context';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { updateBrands } = useSalon();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Step 1 — account
  const [account, setAccount] = useState({ firstName: '', lastName: '', email: '', password: '' });

  // Step 2 — salon
  const [salon, setSalon] = useState({ salonName: '', address: '', city: '', state: '', zip: '', phone: '', licenseNumber: '' });

  // Step 3 — brands
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<Record<string, string[]>>({});

  const containerStyle = css`min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;`;
  const formStyle = css`max-width: 560px; width: 100%;`;
  const titleStyle = css`font-family: ${theme.fonts.heading}; font-size: 2rem; color: ${theme.colors.roseGold}; margin-bottom: 0.5rem;`;
  const subtitleStyle = css`color: ${theme.colors.textSecondary}; margin-bottom: 2rem;`;
  const fieldStyle = css`margin-bottom: 1rem;`;
  const labelStyle = css`display: block; color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 0.375rem;`;
  const stepsStyle = css`display: flex; gap: 0.5rem; margin-bottom: 2rem;`;
  const stepDotStyle = (active: boolean) => css`flex: 1; height: 4px; border-radius: 2px; background: ${active ? theme.colors.roseGold : theme.colors.obsidianMid};`;

  const stepTitles = ['Create your account', 'Set up your salon', 'Brands & product lines', 'Choose your plan'];

  const handleRegister = async () => {
    if (!account.firstName || !account.lastName || !account.email || !account.password) {
      setError('All fields are required.');
      return;
    }
    if (account.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!salon.salonName) {
      setError('Salon name is required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          password: account.password,
          salonName: salon.salonName,
          phone: salon.phone || undefined,
          licenseNumber: salon.licenseNumber || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Registration failed.');
        return;
      }
      // Store auth context in headers via a session cookie approach
      // For now, store in localStorage for the stub auth
      if (data.user) {
        localStorage.setItem('elara_user_id', data.user.id);
        localStorage.setItem('elara_salon_id', data.user.salonId);
      }
      setStep(4);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    updateBrands(selectedBrands, selectedLines);
    router.push('/dashboard');
  };

  return (
    <div className={containerStyle}>
      <div className={formStyle}>
        <h1 className={titleStyle}>Welcome to Elara Pro</h1>
        <p className={subtitleStyle}>{stepTitles[step - 1]}</p>
        <div className={stepsStyle}>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className={stepDotStyle(i + 1 <= step)} />
          ))}
        </div>

        <Card>
          {/* Step 1 — Account */}
          {step === 1 && (
            <div>
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;`}>
                <div>
                  <label className={labelStyle}>First Name</label>
                  <Input placeholder="Jane" value={account.firstName} onChange={(e) => setAccount((p) => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelStyle}>Last Name</label>
                  <Input placeholder="Smith" value={account.lastName} onChange={(e) => setAccount((p) => ({ ...p, lastName: e.target.value }))} />
                </div>
              </div>
              <div className={fieldStyle}>
                <label className={labelStyle}>Email</label>
                <Input type="email" placeholder="jane@salon.com" value={account.email} onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))} />
              </div>
              <div className={fieldStyle}>
                <label className={labelStyle}>Password</label>
                <Input type="password" placeholder="Min 8 characters" value={account.password} onChange={(e) => setAccount((p) => ({ ...p, password: e.target.value }))} />
              </div>
              {error && <p className={css`color: ${theme.colors.error}; font-size: 0.8rem; margin-bottom: 0.75rem;`}>{error}</p>}
              <Button onClick={() => {
                if (!account.firstName || !account.lastName || !account.email || !account.password) { setError('All fields are required.'); return; }
                if (account.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
                setError(''); setStep(2);
              }}>Continue</Button>
            </div>
          )}

          {/* Step 2 — Salon */}
          {step === 2 && (
            <div>
              <div className={fieldStyle}>
                <label className={labelStyle}>Salon Name *</label>
                <Input placeholder="Your salon name" value={salon.salonName} onChange={(e) => setSalon((p) => ({ ...p, salonName: e.target.value }))} />
              </div>
              <div className={fieldStyle}>
                <label className={labelStyle}>Address</label>
                <Input placeholder="123 Main St" value={salon.address} onChange={(e) => setSalon((p) => ({ ...p, address: e.target.value }))} />
              </div>
              <div className={fieldStyle}>
                <label className={labelStyle}>City</label>
                <Input placeholder="City" value={salon.city} onChange={(e) => setSalon((p) => ({ ...p, city: e.target.value }))} />
              </div>
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;`}>
                <div>
                  <label className={labelStyle}>State</label>
                  <Input placeholder="CA" value={salon.state} onChange={(e) => setSalon((p) => ({ ...p, state: e.target.value }))} />
                </div>
                <div>
                  <label className={labelStyle}>ZIP</label>
                  <Input placeholder="90210" value={salon.zip} onChange={(e) => setSalon((p) => ({ ...p, zip: e.target.value }))} />
                </div>
              </div>
              <div className={fieldStyle}>
                <label className={labelStyle}>Phone</label>
                <Input placeholder="(555) 123-4567" value={salon.phone} onChange={(e) => setSalon((p) => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className={fieldStyle}>
                <label className={labelStyle}>Cosmetology License #</label>
                <Input placeholder="Your license number" value={salon.licenseNumber} onChange={(e) => setSalon((p) => ({ ...p, licenseNumber: e.target.value }))} />
              </div>
              {error && <p className={css`color: ${theme.colors.error}; font-size: 0.8rem; margin-bottom: 0.75rem;`}>{error}</p>}
              <div className={css`display: flex; gap: 0.75rem;`}>
                <Button variant="secondary" onClick={() => { setError(''); setStep(1); }}>Back</Button>
                <Button onClick={() => { if (!salon.salonName) { setError('Salon name is required.'); return; } setError(''); setStep(3); }}>Continue</Button>
              </div>
            </div>
          )}

          {/* Step 3 — Brands */}
          {step === 3 && (
            <div>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 1rem;`}>
                Select the professional brands and product lines your salon carries. This powers your formula builder and inventory.
              </p>
              <BrandSelector
                selectedBrands={selectedBrands}
                selectedLines={selectedLines}
                onChange={(brands, lines) => { setSelectedBrands(brands); setSelectedLines(lines); }}
              />
              <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>
                  Continue {selectedBrands.length > 0 ? `(${selectedBrands.length} brands)` : ''}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4 — Plan */}
          {step === 4 && (
            <div>
              <p className={css`color: ${theme.colors.textSecondary}; margin-bottom: 1.5rem;`}>Start your 14-day free trial. No credit card required.</p>
              {[
                { label: 'Free', desc: '1 stylist, 25 clients, basic formulas' },
                { label: 'Pro — $29/mo', desc: '3 stylists, unlimited clients, full formula builder' },
                { label: 'Elite — $79/mo', desc: '10 stylists, AI consultation, technique library' },
                { label: 'Salon — $199/mo', desc: 'Unlimited stylists, multi-location, white label' },
              ].map((plan) => (
                <div key={plan.label} className={css`
                  padding: 1rem; border: 1px solid ${theme.colors.borderDefault};
                  border-radius: ${theme.radii.md}; margin-bottom: 0.75rem; cursor: pointer;
                  &:hover { border-color: ${theme.colors.roseGold}; }
                `}>
                  <div className={css`color: ${theme.colors.warmCream}; font-weight: 500;`}>{plan.label}</div>
                  <div className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-top: 0.25rem;`}>{plan.desc}</div>
                </div>
              ))}
              {error && <p className={css`color: ${theme.colors.error}; font-size: 0.8rem; margin-bottom: 0.75rem;`}>{error}</p>}
              <div className={css`display: flex; gap: 0.75rem; margin-top: 1rem;`}>
                <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={handleRegister} disabled={saving}>
                  {saving ? 'Creating account…' : 'Start Free Trial'}
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
