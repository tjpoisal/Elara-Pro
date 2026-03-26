'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',    icon: '⬡' },
  { href: '/calendar',     label: 'Calendar',     icon: '◷' },
  { href: '/consult',      label: 'Consult',      icon: '◎' },
  { href: '/formulate',    label: 'Formulate',    icon: '⬢' },
  { href: '/clients',      label: 'Clients',      icon: '◑' },
  { href: '/inventory',    label: 'Inventory',    icon: '▦' },
  { href: '/products',     label: 'Products',     icon: '◈' },
  { href: '/analytics',    label: 'Analytics',    icon: '◧' },
  { href: '/business',     label: 'Business',     icon: '◫' },
  { href: '/achievements', label: 'Achievements', icon: '◆' },
  { href: '/voice',        label: 'Voice',        icon: '◉' },
  { href: '/school',       label: 'Education',    icon: '◬' },
  { href: '/settings',     label: 'Settings',     icon: '⚙' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={css`
      width: 220px;
      min-height: 100vh;
      background: ${theme.colors.void};
      border-right: 1px solid ${theme.colors.borderDefault};
      padding: 0;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0; top: 0;
      z-index: 100;
      overflow-y: auto;

      @media (max-width: 768px) {
        width: 56px;
      }
    `}>
      {/* Logo */}
      <div className={css`
        padding: 1.5rem 1.25rem 1.25rem;
        border-bottom: 1px solid ${theme.colors.borderDefault};
        margin-bottom: 0.5rem;

        @media (max-width: 768px) {
          padding: 1rem 0.5rem;
          text-align: center;
        }
      `}>
        <div className={css`
          font-family: ${theme.fonts.heading};
          font-size: 1.375rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #d4af37 0%, #f5e070 50%, #d4af37 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-gold 4s linear infinite;

          @media (max-width: 768px) { font-size: 1rem; }
        `}>Elara</div>
        <div className={css`
          font-size: 0.65rem;
          color: ${theme.colors.textMuted};
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 0.125rem;
          font-weight: 500;

          @media (max-width: 768px) { display: none; }
        `}>Pro</div>
      </div>

      {/* Nav links */}
      <div className={css`flex: 1; padding: 0.25rem 0;`}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={css`
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.625rem 1.25rem;
                min-height: ${theme.tapTarget};
                font-size: 0.8rem;
                font-weight: ${isActive ? '600' : '400'};
                color: ${isActive ? theme.colors.gold : theme.colors.textMuted};
                background: ${isActive ? theme.colors.gold + '12' : 'transparent'};
                border-left: 2px solid ${isActive ? theme.colors.gold : 'transparent'};
                text-decoration: none;
                transition: all 0.15s;
                letter-spacing: 0.01em;

                &:hover {
                  background: ${theme.colors.gold}0a;
                  color: ${theme.colors.textSecondary};
                  border-left-color: ${theme.colors.gold}50;
                }

                @media (max-width: 768px) {
                  padding: 0.625rem;
                  justify-content: center;
                  gap: 0;
                }
              `}
            >
              <span className={css`
                font-size: 0.875rem;
                opacity: ${isActive ? 1 : 0.6};
                flex-shrink: 0;
              `}>{item.icon}</span>
              <span className={css`@media (max-width: 768px) { display: none; }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bottom version tag */}
      <div className={css`
        padding: 1rem 1.25rem;
        border-top: 1px solid ${theme.colors.borderDefault};

        @media (max-width: 768px) { display: none; }
      `}>
        <p className={css`color: ${theme.colors.textDisabled}; font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase;`}>
          v2.0 · Elara Pro
        </p>
      </div>
    </nav>
  );
}

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className={css`
      margin-left: 220px;
      min-height: 100vh;
      padding: 2rem 2.5rem;
      background: ${theme.colors.obsidian};

      @media (max-width: 768px) {
        margin-left: 56px;
        padding: 1.25rem 1rem;
      }
    `}>
      {children}
    </main>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className={css`margin-bottom: 2rem;`}>
      <h2 className={css`
        font-family: ${theme.fonts.heading};
        font-size: 1.75rem;
        font-weight: 700;
        color: ${theme.colors.textPrimary};
        letter-spacing: -0.02em;
        margin: 0;
      `}>{title}</h2>
      {subtitle && (
        <p className={css`
          color: ${theme.colors.textMuted};
          font-size: 0.875rem;
          margin-top: 0.25rem;
          font-weight: 400;
        `}>{subtitle}</p>
      )}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`${css`
      background: ${theme.colors.obsidianMid};
      border: 1px solid ${theme.colors.borderDefault};
      border-radius: ${theme.radii.lg};
      padding: 1.5rem;
      transition: border-color 0.15s;
    `} ${className ?? ''}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1.25rem;
    min-height: ${theme.tapTarget};
    border-radius: ${theme.radii.md};
    font-family: ${theme.fonts.body};
    font-weight: 600;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.01em;
    white-space: nowrap;
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  `;

  const variants = {
    primary: css`
      background: ${theme.colors.gold};
      color: ${theme.colors.obsidian};
      box-shadow: 0 0 16px ${theme.colors.gold}30;
      &:hover:not(:disabled) {
        background: ${theme.colors.goldLight};
        box-shadow: 0 0 24px ${theme.colors.gold}50;
        transform: translateY(-1px);
      }
    `,
    secondary: css`
      background: ${theme.colors.obsidianLight};
      color: ${theme.colors.textSecondary};
      border: 1px solid ${theme.colors.borderDefault};
      &:hover:not(:disabled) {
        background: ${theme.colors.surface};
        border-color: ${theme.colors.borderSubtle};
        color: ${theme.colors.textPrimary};
      }
    `,
    danger: css`
      background: ${theme.colors.ruby};
      color: white;
      box-shadow: 0 0 12px ${theme.colors.ruby}30;
      &:hover:not(:disabled) {
        background: ${theme.colors.rubyLight};
        box-shadow: 0 0 20px ${theme.colors.ruby}50;
      }
    `,
    ghost: css`
      background: transparent;
      color: ${theme.colors.textMuted};
      border: 1px solid ${theme.colors.borderDefault};
      &:hover:not(:disabled) {
        border-color: ${theme.colors.gold}60;
        color: ${theme.colors.gold};
      }
    `,
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={css`
        width: 100%;
        min-height: ${theme.tapTarget};
        padding: 0.5rem 0.875rem;
        background: ${theme.colors.obsidian};
        border: 1px solid ${theme.colors.borderDefault};
        border-radius: ${theme.radii.md};
        color: ${theme.colors.textPrimary};
        font-family: ${theme.fonts.body};
        font-size: 0.875rem;
        transition: border-color 0.15s;

        &:focus {
          border-color: ${theme.colors.gold};
          outline: none;
          box-shadow: 0 0 0 3px ${theme.colors.gold}15;
        }

        &::placeholder { color: ${theme.colors.textDisabled}; }
        &:disabled { opacity: 0.5; cursor: not-allowed; }
      `}
      {...props}
    />
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className={css`
      display: grid;
      gap: 1.25rem;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    `}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  variant = 'default',
  color,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold';
  color?: string;
}) {
  const variantColors: Record<string, { bg: string; text: string }> = {
    default: { bg: theme.colors.surface,        text: theme.colors.textSecondary },
    success: { bg: theme.colors.emerald + '20', text: theme.colors.emeraldLight },
    warning: { bg: theme.colors.topaz + '20',   text: theme.colors.topaz },
    error:   { bg: theme.colors.ruby + '20',    text: theme.colors.rubyLight },
    info:    { bg: theme.colors.sapphire + '20',text: theme.colors.sapphireLight },
    gold:    { bg: theme.colors.gold + '20',    text: theme.colors.gold },
  };

  const c = color
    ? { bg: color + '20', text: color }
    : variantColors[variant] ?? variantColors.default;

  return (
    <span className={css`
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.625rem;
      border-radius: ${theme.radii.full};
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      background: ${c.bg};
      color: ${c.text};
      white-space: nowrap;
    `}>
      {children}
    </span>
  );
}
