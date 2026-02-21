'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '◉' },
  { href: '/consult', label: 'Consult', icon: '◎' },
  { href: '/formulate', label: 'Formulate', icon: '⬡' },
  { href: '/clients', label: 'Clients', icon: '◑' },
  { href: '/inventory', label: 'Inventory', icon: '▦' },
  { href: '/products', label: 'Products', icon: '◈' },
  { href: '/analytics', label: 'Analytics', icon: '◧' },
  { href: '/business', label: 'Business', icon: '◫' },
  { href: '/voice', label: 'Voice', icon: '◉' },
  { href: '/school', label: 'Education', icon: '◬' },
  { href: '/settings', label: 'Settings', icon: '⚙' },
];

const sidebarStyle = css`
  width: 240px;
  min-height: 100vh;
  background: ${theme.colors.surfaceMid};
  border-right: 1px solid ${theme.colors.borderDefault};
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    width: 64px;
    padding: 1rem 0;
  }
`;

const logoStyle = css`
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid ${theme.colors.borderDefault};
  margin-bottom: 1rem;

  h1 {
    font-family: ${theme.fonts.heading};
    font-size: 1.5rem;
    color: ${theme.colors.roseGold};
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  span {
    font-size: 0.75rem;
    color: ${theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (max-width: 768px) {
    padding: 0 0.5rem 1rem;
    text-align: center;
    h1 { font-size: 1rem; }
    span { display: none; }
  }
`;

const navLinkStyle = (isActive: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.5rem;
  min-height: ${theme.tapTarget};
  color: ${isActive ? theme.colors.roseGold : theme.colors.textSecondary};
  background: ${isActive ? theme.colors.obsidianLight : 'transparent'};
  border-left: 3px solid ${isActive ? theme.colors.roseGold : 'transparent'};
  font-size: 0.875rem;
  font-weight: ${isActive ? '600' : '400'};
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    background: ${theme.colors.obsidianLight};
    color: ${theme.colors.warmCream};
  }

  @media (max-width: 768px) {
    padding: 0.625rem;
    justify-content: center;
    span:last-child { display: none; }
  }
`;

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={sidebarStyle}>
      <div className={logoStyle}>
        <h1>Elara</h1>
        <span>Professional</span>
      </div>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={navLinkStyle(pathname.startsWith(item.href))}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}

const mainContentStyle = css`
  margin-left: 240px;
  min-height: 100vh;
  padding: 2rem;

  @media (max-width: 768px) {
    margin-left: 64px;
    padding: 1rem;
  }
`;

export function MainContent({ children }: { children: React.ReactNode }) {
  return <main className={mainContentStyle}>{children}</main>;
}

const pageHeaderStyle = css`
  margin-bottom: 2rem;

  h2 {
    font-family: ${theme.fonts.heading};
    font-size: 1.875rem;
    color: ${theme.colors.warmCream};
    font-weight: 600;
  }

  p {
    color: ${theme.colors.textSecondary};
    margin-top: 0.25rem;
    font-size: 0.875rem;
  }
`;

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className={pageHeaderStyle}>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

const cardStyle = css`
  background: ${theme.colors.surfaceLight};
  border: 1px solid ${theme.colors.borderDefault};
  border-radius: ${theme.radii.lg};
  padding: 1.5rem;
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`${cardStyle} ${className ?? ''}`}>{children}</div>
  );
}

const buttonBaseStyle = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  min-height: ${theme.tapTarget};
  border-radius: ${theme.radii.md};
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
  transition: all 0.2s;
  cursor: pointer;
`;

const buttonPrimaryStyle = css`
  ${buttonBaseStyle}
  background: ${theme.colors.roseGold};
  color: ${theme.colors.obsidian};
  &:hover { background: ${theme.colors.roseGoldLight}; }
`;

const buttonSecondaryStyle = css`
  ${buttonBaseStyle}
  background: ${theme.colors.obsidianMid};
  color: ${theme.colors.warmCream};
  border: 1px solid ${theme.colors.borderDefault};
  &:hover { background: ${theme.colors.obsidianLight}; border-color: ${theme.colors.slateBlue}; }
`;

const buttonDangerStyle = css`
  ${buttonBaseStyle}
  background: ${theme.colors.error};
  color: white;
  &:hover { opacity: 0.9; }
`;

export function Button({
  children,
  variant = 'primary',
  ...props
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: buttonPrimaryStyle,
    secondary: buttonSecondaryStyle,
    danger: buttonDangerStyle,
  };

  return (
    <button className={styles[variant]} {...props}>
      {children}
    </button>
  );
}

const inputStyle = css`
  width: 100%;
  min-height: ${theme.tapTarget};
  padding: 0.625rem 1rem;
  background: ${theme.colors.obsidian};
  border: 1px solid ${theme.colors.borderDefault};
  border-radius: ${theme.radii.md};
  color: ${theme.colors.warmCream};
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${theme.colors.borderFocus};
    outline: none;
  }

  &::placeholder {
    color: ${theme.colors.textMuted};
  }
`;

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputStyle} {...props} />;
}

const gridStyle = css`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

export function Grid({ children }: { children: React.ReactNode }) {
  return <div className={gridStyle}>{children}</div>;
}

const badgeStyle = (color: string) => css`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${color}20;
  color: ${color};
`;

export function Badge({
  children,
  color = theme.colors.slateBlue,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return <span className={badgeStyle(color)}>{children}</span>;
}
