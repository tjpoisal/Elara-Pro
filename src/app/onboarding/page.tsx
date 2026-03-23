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
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<Record<string, string[]>>({});

  const containerStyle = css`min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;`;
  const formStyle = css`max-width: 560px; width: 100%;`;
  const titleStyle = css`font-family: ${theme.fonts.heading}; font-size: 2rem; color: ${theme.colors.roseGold}; margin-bottom: 0.5rem;`;
  const subtitleStyle = css`color: ${theme.colors.textSecondary}; margin-bottom: 2rem;`;
  const fieldStyle = css`margin-bottom: 1rem; label { display: block; color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 0.375rem; }`;
  const stepsStyle = css`display: flex; gap: 0.5rem; margin-bottom: 2rem;`;
  const stepDotStyle = (active: boolean) => css`flex: 1; height: 4px; border-radius: 2px; background: ${active ? theme.colors.roseGold : theme.colors.obsidianMid};`;

  const stepTitles = ['Create your account', 'Set up your salon', 'Brands & product lines', 'Choose your plan'];

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
          {step === 1 && (
            <div>
              <div className={fieldStyle}><label>First Name</label><Input placeholder="Jane" /></div>
              <div className={fieldStyle}><label>Last Name</label><Input placeholder="Smith" /></div>
              <div className={fieldStyle}><label>Email</label><Input type="email" placeholder="jane@salon.com" /></div>
              <div className={fieldStyle}><label>Password</label><Input type="password" placeholder="Min 8 characters" /></div>
              <Button onClick={() => setStep(2)}>Continue</Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className={fieldStyle}><label>Salon Name</label><Input placeholder="Your salon name" /></div>
              <div className={fieldStyle}><label>Address</label><Input placeholder="123 Main St" /></div>
              <div className={fieldStyle}><label>City</label><Input placeholder="City" /></div>
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;`}>
                <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; display: block; margin-bottom: 0.375rem;`}>State</label><Input placeholder="CA" /></div>
                <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; display: block; margin-bottom: 0.375rem;`}>ZIP</label><Input placeholder="90210" /></div>
              </div>
              <div className={fieldStyle}><label>Phone</label><Input placeholder="(555) 123-4567" /></div>
              <div className={fieldStyle}><label>Cosmetology License #</label><Input placeholder="Your license number" /></div>
              <div className={css`display: flex; gap: 0.75rem;`}>
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue</Button>
              </div>
            </div>
          )}

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

          {step === 4 && (
            <div>
              <p className={css`color: ${theme.colors.textSecondary}; margin-bottom: 1.5rem;`}>Start your 14-day free trial. No credit card required.</p>
              {[
                { label: 'Free', desc: '1 stylist, 25 clients, basic formulas' },
                { label: 'Pro — $29/mo', desc: '3 stylists, unlimited clients, full formula builder' },
                { label: 'Elite — $79/mo', desc: '10 stylists, AI consultation, technique library' },
                { label: 'Salon — $199/mo', desc: 'Unlimited stylists, multi-location, white label' },
              ].map((plan) => (
                <div key={plan.label} className={css`padding: 1rem; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; margin-bottom: 0.75rem; cursor: pointer; &:hover { border-color: ${theme.colors.roseGold}; }`}>
                  <div className={css`color: ${theme.colors.warmCream}; font-weight: 500;`}>{plan.label}</div>
                  <div className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-top: 0.25rem;`}>{plan.desc}</div>
                </div>
              ))}
              <div className={css`display: flex; gap: 0.75rem; margin-top: 1rem;`}>
                <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={() => { updateBrands(selectedBrands, selectedLines); router.push('/dashboard'); }}>Start Free Trial</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
