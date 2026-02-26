'use client';

import Link from 'next/link';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';

const heroStyle = css`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: radial-gradient(ellipse at top, ${theme.colors.obsidianLight} 0%, ${theme.colors.surfaceDark} 70%);
`;

const features = [
  { title: 'AI Consultation', desc: 'Parse messy notes with Claude-powered confidence scoring.' },
  { title: 'Chemistry Engine', desc: 'Deterministic color math — rule of 11/12, pH prediction, offline.' },
  { title: 'Formula Builder', desc: 'Multi-zone formulas with gram-precise measurements.' },
  { title: 'Inventory Tracking', desc: 'UPC barcode scanning, auto-deduction, reorder alerts.' },
  { title: 'Voice Commands', desc: 'Hands-free formula recall and timer control.' },
  { title: 'Safety First', desc: 'Chemical compatibility checks, patch test tracking.' },
];

export default function LandingPage() {
  return (
    <div>
      <div className={heroStyle}>
        <h1 className={css`font-family: ${theme.fonts.heading}; font-size: 4rem; color: ${theme.colors.roseGold}; margin-bottom: 0.5rem; letter-spacing: 0.04em;`}>
          Elara Pro
        </h1>
        <p className={css`font-size: 1.25rem; color: ${theme.colors.textSecondary}; max-width: 600px; margin-bottom: 3rem; line-height: 1.8;`}>
          The intelligent hair color consultation platform built for licensed stylists.
          Precision formulation, deterministic safety, beautiful results.
        </p>
        <div className={css`display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;`}>
          <Link href="/onboarding" className={css`display: inline-flex; align-items: center; min-height: ${theme.tapTarget}; padding: 0.875rem 2.5rem; background: ${theme.colors.roseGold}; color: ${theme.colors.obsidian}; border-radius: ${theme.radii.lg}; font-weight: 600; font-size: 1rem; transition: all 0.2s; box-shadow: ${theme.shadows.glow}; &:hover { background: ${theme.colors.roseGoldLight}; }`}>
            Start Free Trial
          </Link>
          <Link href="/dashboard" className={css`display: inline-flex; align-items: center; min-height: ${theme.tapTarget}; padding: 0.875rem 2.5rem; background: transparent; color: ${theme.colors.warmCream}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.lg}; font-weight: 500; transition: all 0.2s; &:hover { border-color: ${theme.colors.roseGold}; }`}>
            Sign In
          </Link>
        </div>
      </div>
      <div className={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1200px; margin: 4rem auto; padding: 0 2rem;`}>
        {features.map((f) => (
          <div key={f.title} className={css`background: ${theme.colors.surfaceLight}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.lg}; padding: 2rem; h3 { font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 0.75rem; } p { color: ${theme.colors.textSecondary}; font-size: 0.875rem; line-height: 1.6; }`}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
