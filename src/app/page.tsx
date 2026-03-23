'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { css, keyframes } from '@emotion/css';
import { theme } from '@/lib/theme';

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`;
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 ${theme.colors.roseGold}40; }
  50%       { box-shadow: 0 0 0 12px ${theme.colors.roseGold}00; }
`;

// ─── Shared styles ─────────────────────────────────────────────────────────────
const container = css`max-width: 1160px; margin: 0 auto; padding: 0 1.5rem;`;

const btnPrimary = css`
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.875rem 2rem; border-radius: ${theme.radii.lg};
  background: ${theme.colors.roseGold}; color: ${theme.colors.obsidian};
  font-weight: 700; font-size: 1rem; border: none; cursor: pointer;
  text-decoration: none; transition: all 0.2s;
  box-shadow: 0 0 24px ${theme.colors.roseGold}40;
  &:hover { background: ${theme.colors.roseGoldLight}; transform: translateY(-1px); box-shadow: 0 4px 32px ${theme.colors.roseGold}60; }
`;

const btnOutline = css`
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.875rem 2rem; border-radius: ${theme.radii.lg};
  background: transparent; color: ${theme.colors.warmCream};
  font-weight: 600; font-size: 1rem; cursor: pointer;
  text-decoration: none; transition: all 0.2s;
  border: 1px solid ${theme.colors.borderDefault};
  &:hover { border-color: ${theme.colors.roseGold}; color: ${theme.colors.roseGold}; }
`;

const sectionTitle = css`
  font-family: ${theme.fonts.heading};
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${theme.colors.warmCream};
  text-align: center;
  margin: 0 0 1rem;
  line-height: 1.2;
`;

const sectionSub = css`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 3.5rem;
  line-height: 1.7;
`;

// ─── Data ──────────────────────────────────────────────────────────────────────
const features = [
  { icon: '✦', title: 'Elara AI Assistant', desc: 'Ask anything — formulas, techniques, color theory. Elara knows every professional brand and answers in seconds.' },
  { icon: '🧪', title: 'Chemistry Engine', desc: 'Deterministic color math. Rule of 11/12, pH prediction, underlying pigment, porosity correction — all offline.' },
  { icon: '📋', title: 'Smart Consultations', desc: '8-step wizard with AI note parsing, confidence scoring, and automatic contraindication detection.' },
  { icon: '🎨', title: 'Formula Builder', desc: 'Multi-zone formulas with gram-precise measurements, developer volumes, and processing timers.' },
  { icon: '📦', title: 'Inventory Tracking', desc: 'UPC barcode scanning, auto-deduction per service, reorder alerts, and waste logging.' },
  { icon: '🔊', title: 'Voice Interface', desc: 'Hands-free formula recall and timer control. Elara speaks back with ElevenLabs TTS — 5 voice options.' },
  { icon: '🌐', title: 'Brand Discovery', desc: 'Ask about any brand. Elara researches it, adds it to the global catalog, and shares it with every stylist.' },
  { icon: '🔒', title: 'Formula Vault', desc: 'AES-256 encrypted formula storage. Your IP stays yours — not even Elara Pro staff can read it.' },
];

const steps = [
  { n: '01', title: 'Start your free trial', desc: '7 days, no credit card required. Full access to every feature.' },
  { n: '02', title: 'Select your brands', desc: 'Pick the lines you carry. Elara tailors formulas, videos, and suggestions to your toolkit.' },
  { n: '03', title: 'Add your first client', desc: 'Run a consultation, build a formula, and let Elara flag anything you should know.' },
  { n: '04', title: 'Download the app', desc: 'Install directly from this page — no app store required. Works on iOS and Android.' },
];

const plans = [
  {
    name: 'Free', price: '$0', period: '/mo', highlight: false,
    features: ['1 stylist', '25 clients', '50 formulas', 'Basic consultation forms', 'Color math calculator'],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro', price: '$29', period: '/mo', highlight: true,
    features: ['1 stylist', '200 clients', '500 formulas', 'AI note parsing', 'Inventory tracking', 'Barcode scanning', 'Client history export'],
    cta: 'Start 7-Day Trial',
  },
  {
    name: 'Elite', price: '$79', period: '/mo', highlight: false,
    features: ['5 stylists', '1,000 clients', 'Unlimited formulas', 'Voice commands', 'Advanced analytics', 'Formula vault', 'Chemical safety tracking'],
    cta: 'Start 7-Day Trial',
  },
  {
    name: 'Salon', price: '$199', period: '/mo', highlight: false,
    features: ['Unlimited stylists', 'Unlimited clients', 'Brand partnerships', 'CEU tracking', 'Business analytics', 'Custom branding', 'API access', 'Dedicated support'],
    cta: 'Contact Sales',
  },
];

const testimonials = [
  { quote: "Elara caught a relaxer contraindication I almost missed. That alone is worth every penny.", name: "Jasmine R.", title: "Master Colorist, Atlanta" },
  { quote: "I asked about a brand I'd never heard of and Elara had the full mixing ratios in 10 seconds.", name: "Tori M.", title: "Salon Owner, Austin" },
  { quote: "The formula vault means my signature techniques stay mine. No more worrying about staff turnover.", name: "Dani K.", title: "Color Specialist, NYC" },
];

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ scrolled }: { scrolled: boolean }) {
  return (
    <nav className={css`
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      transition: all 0.3s;
      background: ${scrolled ? theme.colors.obsidian + 'f0' : 'transparent'};
      backdrop-filter: ${scrolled ? 'blur(12px)' : 'none'};
      border-bottom: 1px solid ${scrolled ? theme.colors.borderDefault : 'transparent'};
    `}>
      <div className={css`${container} display: flex; align-items: center; justify-content: space-between; height: 64px;`}>
        <span className={css`font-family: ${theme.fonts.heading}; font-size: 1.375rem; color: ${theme.colors.roseGold}; letter-spacing: 0.04em;`}>
          Elara Pro
        </span>
        <div className={css`display: flex; align-items: center; gap: 1rem;`}>
          <a href="#features" className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; text-decoration: none; &:hover { color: ${theme.colors.warmCream}; } @media(max-width:640px){display:none;}`}>Features</a>
          <a href="#pricing" className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; text-decoration: none; &:hover { color: ${theme.colors.warmCream}; } @media(max-width:640px){display:none;}`}>Pricing</a>
          <a href="#download" className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; text-decoration: none; &:hover { color: ${theme.colors.warmCream}; } @media(max-width:640px){display:none;}`}>Download</a>
          <Link href="/dashboard" className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; text-decoration: none; &:hover { color: ${theme.colors.warmCream}; }`}>Sign In</Link>
          <Link href="/onboarding" className={css`
            padding: 0.5rem 1.25rem; border-radius: ${theme.radii.md};
            background: ${theme.colors.roseGold}; color: ${theme.colors.obsidian};
            font-weight: 700; font-size: 0.875rem; text-decoration: none;
            &:hover { background: ${theme.colors.roseGoldLight}; }
          `}>Try Free</Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Download Section ──────────────────────────────────────────────────────────
function DownloadSection() {
  return (
    <section id="download" className={css`
      padding: 6rem 0;
      background: linear-gradient(135deg, ${theme.colors.obsidianMid} 0%, ${theme.colors.obsidian} 100%);
      border-top: 1px solid ${theme.colors.borderDefault};
      border-bottom: 1px solid ${theme.colors.borderDefault};
    `}>
      <div className={container}>
        <h2 className={sectionTitle}>Download the App</h2>
        <p className={sectionSub}>
          Install directly from here — no App Store or Google Play required.
          Sideload on iOS or install the APK on Android in seconds.
        </p>

        <div className={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; max-width: 760px; margin: 0 auto;`}>
          {/* iOS */}
          <div className={css`
            background: ${theme.colors.obsidian};
            border: 1px solid ${theme.colors.borderDefault};
            border-radius: ${theme.radii.xl};
            padding: 2rem;
            text-align: center;
          `}>
            <div className={css`font-size: 3rem; margin-bottom: 1rem;`}>🍎</div>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; font-size: 1.25rem; margin: 0 0 0.5rem;`}>
              iOS App
            </h3>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0 0 1.5rem; line-height: 1.6;`}>
              iPhone &amp; iPad · iOS 16+<br />
              Install via TestFlight or direct IPA sideload with AltStore.
            </p>
            <a
              href="/downloads/elara-pro.ipa"
              download
              className={css`
                display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                padding: 0.875rem 1.5rem; border-radius: ${theme.radii.md};
                background: ${theme.colors.roseGold}; color: ${theme.colors.obsidian};
                font-weight: 700; font-size: 0.9rem; text-decoration: none;
                margin-bottom: 0.75rem;
                &:hover { background: ${theme.colors.roseGoldLight}; }
              `}
            >
              ↓ Download IPA
            </a>
            <a
              href="https://testflight.apple.com/join/elara-pro"
              target="_blank"
              rel="noopener noreferrer"
              className={css`
                display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                padding: 0.75rem 1.5rem; border-radius: ${theme.radii.md};
                background: transparent; color: ${theme.colors.textSecondary};
                font-size: 0.875rem; text-decoration: none;
                border: 1px solid ${theme.colors.borderDefault};
                &:hover { border-color: ${theme.colors.roseGold}; color: ${theme.colors.roseGold}; }
              `}
            >
              Join TestFlight Beta
            </a>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin-top: 1rem; line-height: 1.5;`}>
              For IPA: install AltStore on your Mac, connect your iPhone, and open the IPA file.
            </p>
          </div>

          {/* Android */}
          <div className={css`
            background: ${theme.colors.obsidian};
            border: 1px solid ${theme.colors.borderDefault};
            border-radius: ${theme.radii.xl};
            padding: 2rem;
            text-align: center;
          `}>
            <div className={css`font-size: 3rem; margin-bottom: 1rem;`}>🤖</div>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; font-size: 1.25rem; margin: 0 0 0.5rem;`}>
              Android App
            </h3>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0 0 1.5rem; line-height: 1.6;`}>
              Android 10+<br />
              Direct APK install — no Google Play required.
            </p>
            <a
              href="/downloads/elara-pro.apk"
              download
              className={css`
                display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                padding: 0.875rem 1.5rem; border-radius: ${theme.radii.md};
                background: ${theme.colors.roseGold}; color: ${theme.colors.obsidian};
                font-weight: 700; font-size: 0.9rem; text-decoration: none;
                margin-bottom: 0.75rem;
                &:hover { background: ${theme.colors.roseGoldLight}; }
              `}
            >
              ↓ Download APK
            </a>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin-top: 1rem; line-height: 1.5;`}>
              Enable "Install from unknown sources" in Android Settings → Security, then open the APK.
            </p>
          </div>
        </div>

        {/* Web app note */}
        <div className={css`
          text-align: center; margin-top: 2.5rem;
          padding: 1.25rem 2rem;
          background: ${theme.colors.roseGold}10;
          border: 1px solid ${theme.colors.roseGold}30;
          border-radius: ${theme.radii.lg};
          max-width: 560px; margin: 2.5rem auto 0;
        `}>
          <p className={css`color: ${theme.colors.roseGold}; font-size: 0.9rem; margin: 0;`}>
            ✦ Prefer the browser? Elara Pro is a full web app — just bookmark{' '}
            <strong>app.elarapro.com</strong> and use it from any device, no install needed.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={css`background: ${theme.colors.surfaceDark}; color: ${theme.colors.warmCream}; font-family: ${theme.fonts.body};`}>
      <Nav scrolled={scrolled} />

      {/* ── Hero ── */}
      <section className={css`
        min-height: 100vh;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; padding: 8rem 1.5rem 5rem;
        background: radial-gradient(ellipse 80% 60% at 50% 0%, ${theme.colors.roseGold}18 0%, transparent 70%),
                    radial-gradient(ellipse at bottom, ${theme.colors.obsidianLight} 0%, ${theme.colors.surfaceDark} 80%);
        position: relative; overflow: hidden;
      `}>
        <div className={css`
          position: absolute; inset: 0; pointer-events: none;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 80px,
            ${theme.colors.borderDefault}30 80px, ${theme.colors.borderDefault}30 81px
          ),
          repeating-linear-gradient(
            90deg, transparent, transparent 80px,
            ${theme.colors.borderDefault}30 80px, ${theme.colors.borderDefault}30 81px
          );
        `} />

        <div className={css`animation: ${fadeUp} 0.7s ease both; position: relative;`}>
          <div className={css`
            display: inline-block; margin-bottom: 1.5rem;
            padding: 0.35rem 1rem; border-radius: 999px;
            background: ${theme.colors.roseGold}15;
            border: 1px solid ${theme.colors.roseGold}40;
            color: ${theme.colors.roseGold}; font-size: 0.8rem; font-weight: 600;
            letter-spacing: 0.08em; text-transform: uppercase;
          `}>✦ Now with Elara AI — powered by Claude</div>

          <h1 className={css`
            font-family: ${theme.fonts.heading};
            font-size: clamp(3rem, 8vw, 5.5rem);
            line-height: 1.05;
            margin: 0 0 1.5rem;
            background: linear-gradient(135deg, ${theme.colors.warmCream} 40%, ${theme.colors.roseGold} 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: ${shimmer} 4s linear infinite;
          `}>
            The Hairdresser's<br />Ultimate Tool
          </h1>

          <p className={css`
            font-size: clamp(1rem, 2.5vw, 1.25rem);
            color: ${theme.colors.textSecondary};
            max-width: 580px; margin: 0 auto 2.5rem;
            line-height: 1.8;
          `}>
            AI-powered color consultation, precision formulation, and salon management
            — built for licensed stylists who take their craft seriously.
          </p>

          <div className={css`display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; margin-bottom: 3rem;`}>
            <Link href="/onboarding" className={css`${btnPrimary} animation: ${pulse} 2.5s ease infinite;`}>
              Start Free Trial — 7 Days
            </Link>
            <a href="#download" className={btnOutline}>
              Download the App ↓
            </a>
          </div>

          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem;`}>
            No credit card required · Works on web, iOS &amp; Android · Cancel anytime
          </p>
        </div>

        {/* Mock app preview */}
        <div className={css`
          margin-top: 4rem;
          width: min(900px, 90vw);
          background: ${theme.colors.obsidianMid};
          border: 1px solid ${theme.colors.borderDefault};
          border-radius: ${theme.radii.xl};
          padding: 1.5rem;
          box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px ${theme.colors.roseGold}20;
          animation: ${fadeUp} 0.9s 0.2s ease both;
          position: relative;
        `}>
          <div className={css`display: flex; gap: 0.5rem; margin-bottom: 1rem;`}>
            <div className={css`width: 12px; height: 12px; border-radius: 50%; background: #ff5f57;`} />
            <div className={css`width: 12px; height: 12px; border-radius: 50%; background: #febc2e;`} />
            <div className={css`width: 12px; height: 12px; border-radius: 50%; background: #28c840;`} />
          </div>
          <div className={css`display: grid; grid-template-columns: 200px 1fr; gap: 1rem; min-height: 280px; @media(max-width:600px){grid-template-columns:1fr;}`}>
            <div className={css`background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; padding: 1rem;`}>
              {['Dashboard', 'Clients', 'Formulas', 'Consult', 'Inventory', 'School', 'Voice'].map((item) => (
                <div key={item} className={css`
                  padding: 0.5rem 0.75rem; border-radius: ${theme.radii.sm};
                  color: ${item === 'Formulas' ? theme.colors.roseGold : theme.colors.textSecondary};
                  background: ${item === 'Formulas' ? theme.colors.roseGold + '15' : 'transparent'};
                  font-size: 0.8rem; margin-bottom: 0.25rem;
                `}>{item}</div>
              ))}
            </div>
            <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
              <div className={css`background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; padding: 1rem;`}>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Active Formula</p>
                <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0 0 0.25rem;`}>Balayage + Gloss — Sarah M.</p>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0;`}>Wella Blondor · 40vol · 45 min · pH 4.5 toner</p>
              </div>
              <div className={css`background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; padding: 1rem; border-left: 3px solid ${theme.colors.roseGold};`}>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0 0 0.375rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Elara</p>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.85rem; margin: 0; line-height: 1.5;`}>
                  Sarah has a keratin treatment from 6 weeks ago — use a lower developer (20vol) on the ends to avoid over-processing. I'd also recommend a bond additive in the lightener.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <div className={css`
        background: ${theme.colors.obsidianMid};
        border-top: 1px solid ${theme.colors.borderDefault};
        border-bottom: 1px solid ${theme.colors.borderDefault};
        padding: 1.25rem 1.5rem;
        text-align: center;
      `}>
        <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin: 0;`}>
          Trusted by colorists at{' '}
          {['Aveda Salons', 'Drybar', 'Great Clips', 'Supercuts', 'Independent Studios'].map((s, i, arr) => (
            <span key={s}>
              <span className={css`color: ${theme.colors.textSecondary};`}>{s}</span>
              {i < arr.length - 1 ? <span className={css`color: ${theme.colors.borderDefault}; margin: 0 0.5rem;`}>·</span> : ''}
            </span>
          ))}
        </p>
      </div>

      {/* ── Features ── */}
      <section id="features" className={css`padding: 6rem 0;`}>
        <div className={container}>
          <h2 className={sectionTitle}>Everything a colorist needs</h2>
          <p className={sectionSub}>
            Built from the ground up for professional stylists — not a generic salon app with a color tab bolted on.
          </p>
          <div className={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem;`}>
            {features.map((f) => (
              <div key={f.title} className={css`
                background: ${theme.colors.obsidianMid};
                border: 1px solid ${theme.colors.borderDefault};
                border-radius: ${theme.radii.lg};
                padding: 1.75rem;
                transition: border-color 0.2s, transform 0.2s;
                &:hover { border-color: ${theme.colors.roseGold}50; transform: translateY(-2px); }
              `}>
                <div className={css`font-size: 1.75rem; margin-bottom: 0.875rem;`}>{f.icon}</div>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; font-size: 1.1rem; margin: 0 0 0.5rem;`}>{f.title}</h3>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; line-height: 1.6; margin: 0;`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className={css`
        padding: 6rem 0;
        background: ${theme.colors.obsidianMid};
        border-top: 1px solid ${theme.colors.borderDefault};
        border-bottom: 1px solid ${theme.colors.borderDefault};
      `}>
        <div className={container}>
          <h2 className={sectionTitle}>Up and running in minutes</h2>
          <p className={sectionSub}>No training required. Elara walks you through everything.</p>
          <div className={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2rem; max-width: 900px; margin: 0 auto;`}>
            {steps.map((s) => (
              <div key={s.n} className={css`text-align: center;`}>
                <div className={css`
                  width: 56px; height: 56px; border-radius: 50%;
                  background: ${theme.colors.roseGold}20;
                  border: 1px solid ${theme.colors.roseGold}50;
                  display: flex; align-items: center; justify-content: center;
                  margin: 0 auto 1rem;
                  font-family: ${theme.fonts.heading}; font-size: 1rem; color: ${theme.colors.roseGold};
                `}>{s.n}</div>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; font-size: 1rem; margin: 0 0 0.5rem;`}>{s.title}</h3>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; line-height: 1.6; margin: 0;`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={css`padding: 6rem 0;`}>
        <div className={container}>
          <h2 className={sectionTitle}>Stylists love it</h2>
          <p className={sectionSub}>Real feedback from real colorists.</p>
          <div className={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;`}>
            {testimonials.map((t) => (
              <div key={t.name} className={css`
                background: ${theme.colors.obsidianMid};
                border: 1px solid ${theme.colors.borderDefault};
                border-radius: ${theme.radii.lg};
                padding: 2rem;
              `}>
                <p className={css`color: ${theme.colors.roseGold}; font-size: 1.5rem; margin: 0 0 1rem; line-height: 1;`}>"</p>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.9rem; line-height: 1.7; margin: 0 0 1.5rem; font-style: italic;`}>{t.quote}</p>
                <div>
                  <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.875rem; margin: 0;`}>{t.name}</p>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem; margin: 0.2rem 0 0;`}>{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className={css`
        padding: 6rem 0;
        background: ${theme.colors.obsidianMid};
        border-top: 1px solid ${theme.colors.borderDefault};
        border-bottom: 1px solid ${theme.colors.borderDefault};
      `}>
        <div className={container}>
          <h2 className={sectionTitle}>Simple, transparent pricing</h2>
          <p className={sectionSub}>
            Start free. Upgrade when you're ready. Every paid plan includes a 7-day free trial.
          </p>
          <div className={css`display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 1.25rem; align-items: start;`}>
            {plans.map((plan) => (
              <div key={plan.name} className={css`
                background: ${plan.highlight ? theme.colors.obsidian : theme.colors.obsidianMid};
                border: 1px solid ${plan.highlight ? theme.colors.roseGold : theme.colors.borderDefault};
                border-radius: ${theme.radii.xl};
                padding: 2rem;
                position: relative;
                ${plan.highlight ? `box-shadow: 0 0 40px ${theme.colors.roseGold}20;` : ''}
              `}>
                {plan.highlight && (
                  <div className={css`
                    position: absolute; top: -0.75rem; left: 50%; transform: translateX(-50%);
                    background: ${theme.colors.roseGold}; color: ${theme.colors.obsidian};
                    font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.875rem;
                    border-radius: 999px; white-space: nowrap; letter-spacing: 0.05em;
                    text-transform: uppercase;
                  `}>Most Popular</div>
                )}
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; font-size: 1.1rem; margin: 0 0 0.75rem;`}>{plan.name}</h3>
                <div className={css`margin-bottom: 1.5rem;`}>
                  <span className={css`font-size: 2.25rem; font-weight: 800; color: ${plan.highlight ? theme.colors.roseGold : theme.colors.warmCream};`}>{plan.price}</span>
                  <span className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>{plan.period}</span>
                </div>
                <ul className={css`list-style: none; padding: 0; margin: 0 0 1.75rem;`}>
                  {plan.features.map((f) => (
                    <li key={f} className={css`
                      color: ${theme.colors.textSecondary}; font-size: 0.85rem;
                      padding: 0.3rem 0;
                      &::before { content: '✓ '; color: ${theme.colors.success}; }
                    `}>{f}</li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Salon' ? 'mailto:hello@elarapro.com' : '/onboarding'}
                  className={css`
                    display: block; text-align: center;
                    padding: 0.75rem 1rem; border-radius: ${theme.radii.md};
                    background: ${plan.highlight ? theme.colors.roseGold : 'transparent'};
                    color: ${plan.highlight ? theme.colors.obsidian : theme.colors.warmCream};
                    border: 1px solid ${plan.highlight ? 'transparent' : theme.colors.borderDefault};
                    font-weight: 700; font-size: 0.875rem; text-decoration: none;
                    transition: all 0.2s;
                    &:hover {
                      background: ${plan.highlight ? theme.colors.roseGoldLight : theme.colors.roseGold + '15'};
                      border-color: ${theme.colors.roseGold};
                      color: ${plan.highlight ? theme.colors.obsidian : theme.colors.roseGold};
                    }
                  `}
                >{plan.cta}</Link>
              </div>
            ))}
          </div>

          {/* Voice add-on callout */}
          <div className={css`
            margin-top: 2rem; padding: 1.25rem 2rem;
            background: ${theme.colors.obsidian};
            border: 1px solid ${theme.colors.borderDefault};
            border-radius: ${theme.radii.lg};
            display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;
            max-width: 700px; margin: 2rem auto 0;
          `}>
            <div>
              <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0 0 0.25rem;`}>
                🔊 Elara Voice Add-on — $9.99/mo
              </p>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 0;`}>
                Hear Elara speak her responses. 5 AI voices powered by ElevenLabs. Add to any plan.
              </p>
            </div>
            <Link href="/onboarding" className={css`
              padding: 0.625rem 1.25rem; border-radius: ${theme.radii.md};
              background: transparent; color: ${theme.colors.roseGold};
              border: 1px solid ${theme.colors.roseGold}60;
              font-weight: 600; font-size: 0.875rem; text-decoration: none; white-space: nowrap;
              &:hover { background: ${theme.colors.roseGold}15; }
            `}>Add Voice →</Link>
          </div>
        </div>
      </section>

      {/* ── Download ── */}
      <DownloadSection />

      {/* ── Final CTA ── */}
      <section className={css`padding: 7rem 1.5rem; text-align: center;`}>
        <h2 className={css`
          font-family: ${theme.fonts.heading};
          font-size: clamp(2rem, 5vw, 3.5rem);
          color: ${theme.colors.warmCream};
          margin: 0 0 1rem; line-height: 1.2;
        `}>
          Ready to elevate your color work?
        </h2>
        <p className={css`color: ${theme.colors.textSecondary}; font-size: 1.1rem; margin: 0 auto 2.5rem; max-width: 500px; line-height: 1.7;`}>
          Join thousands of stylists using Elara Pro to formulate smarter, consult faster, and grow their business.
        </p>
        <Link href="/onboarding" className={btnPrimary}>
          Start Your Free Trial →
        </Link>
        <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem; margin-top: 1rem;`}>
          7 days free · No credit card · Cancel anytime
        </p>
      </section>

      {/* ── Footer ── */}
      <footer className={css`
        background: ${theme.colors.obsidianMid};
        border-top: 1px solid ${theme.colors.borderDefault};
        padding: 3rem 1.5rem;
      `}>
        <div className={css`${container} display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 2rem;`}>
          <div>
            <p className={css`font-family: ${theme.fonts.heading}; font-size: 1.25rem; color: ${theme.colors.roseGold}; margin: 0 0 0.5rem;`}>Elara Pro</p>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem; max-width: 240px; line-height: 1.6; margin: 0;`}>
              The intelligent hair color consultation platform for licensed stylists.
            </p>
          </div>
          <div className={css`display: flex; gap: 3rem; flex-wrap: wrap;`}>
            <div>
              <p className={css`color: ${theme.colors.warmCream}; font-size: 0.8rem; font-weight: 600; margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Product</p>
              {['Features', 'Pricing', 'Download', 'Changelog'].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`} className={css`display: block; color: ${theme.colors.textMuted}; font-size: 0.8rem; text-decoration: none; margin-bottom: 0.5rem; &:hover { color: ${theme.colors.textSecondary}; }`}>{l}</a>
              ))}
            </div>
            <div>
              <p className={css`color: ${theme.colors.warmCream}; font-size: 0.8rem; font-weight: 600; margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Company</p>
              {['About', 'Blog', 'Privacy', 'Terms'].map((l) => (
                <a key={l} href="#" className={css`display: block; color: ${theme.colors.textMuted}; font-size: 0.8rem; text-decoration: none; margin-bottom: 0.5rem; &:hover { color: ${theme.colors.textSecondary}; }`}>{l}</a>
              ))}
            </div>
            <div>
              <p className={css`color: ${theme.colors.warmCream}; font-size: 0.8rem; font-weight: 600; margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Support</p>
              {['Docs', 'Contact', 'Status'].map((l) => (
                <a key={l} href="#" className={css`display: block; color: ${theme.colors.textMuted}; font-size: 0.8rem; text-decoration: none; margin-bottom: 0.5rem; &:hover { color: ${theme.colors.textSecondary}; }`}>{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div className={css`${container} margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid ${theme.colors.borderDefault}; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;`}>
          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0;`}>
            © {new Date().getFullYear()} Elara Pro. All rights reserved.
          </p>
          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0;`}>
            Made for stylists, by people who care about the craft.
          </p>
        </div>
      </footer>
    </div>
  );
}
