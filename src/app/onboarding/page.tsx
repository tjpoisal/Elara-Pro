'use client';
import { useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Button, Input, Card } from '@/components/Navigation';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const containerStyle = css`min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem;`;
  const formStyle = css`max-width: 480px; width: 100%;`;
  const titleStyle = css`font-family: ${theme.fonts.heading}; font-size: 2rem; color: ${theme.colors.roseGold}; margin-bottom: 0.5rem;`;
  const subtitleStyle = css`color: ${theme.colors.textSecondary}; margin-bottom: 2rem;`;
  const fieldStyle = css`margin-bottom: 1rem; label { display: block; color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 0.375rem; }`;
  const stepsStyle = css`display: flex; gap: 0.5rem; margin-bottom: 2rem;`;
  const stepDotStyle = (active: boolean) => css`width: 2rem; height: 4px; border-radius: 2px; background: ${active ? theme.colors.roseGold : theme.colors.obsidianMid};`;

  return (
    <div className={containerStyle}>
      <div className={formStyle}>
        <h1 className={titleStyle}>Welcome to Elara Pro</h1>
        <p className={subtitleStyle}>
          {step === 1 ? 'Create your account' : step === 2 ? 'Set up your salon' : 'Choose your plan'}
        </p>
        <div className={stepsStyle}>
          {[1, 2, 3].map((s) => <div key={s} className={stepDotStyle(s <= step)} />)}
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
              <div className={fieldStyle}><label>Phone</label><Input placeholder="(555) 123-4567" /></div>
              <div className={fieldStyle}><label>License Number</label><Input placeholder="Your cosmetology license" /></div>
              <div className={css`display: flex; gap: 0.75rem;`}>
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue</Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <p className={css`color: ${theme.colors.textSecondary}; margin-bottom: 1.5rem;`}>Start your 14-day free trial. No credit card required.</p>
              {['Free', 'Pro — $29/mo', 'Elite — $79/mo', 'Salon — $199/mo'].map((plan) => (
                <div key={plan} className={css`padding: 1rem; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; margin-bottom: 0.75rem; cursor: pointer; &:hover { border-color: ${theme.colors.roseGold}; }`}>
                  {plan}
                </div>
              ))}
              <div className={css`display: flex; gap: 0.75rem; margin-top: 1rem;`}>
                <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                <Button>Start Free Trial</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
