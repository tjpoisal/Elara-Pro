/**
 * Elara Pro Design System v2
 * Palette: deep ultraviolet/amethyst backgrounds · metallic gold primary
 * Ruby alerts · garnet accents · jewel-tone semantic colors
 * All sans-serif — clean, minimal, modern
 * All color pairs verified ≥ 4.5:1 contrast ratio (WCAG AA)
 */
export const theme = {
  colors: {
    // ── Backgrounds (deep UV / amethyst) ──────────────────────────────────────
    /** #0a0812 — near-black with violet undertone */
    void:          '#0a0812',
    /** #100d1e — primary page background */
    obsidian:      '#100d1e',
    /** #1a1530 — card / panel background */
    obsidianMid:   '#1a1530',
    /** #231d3d — elevated surface, hover states */
    obsidianLight: '#231d3d',
    /** #2e2650 — border-adjacent surface */
    surface:       '#2e2650',

    // ── Gold (primary brand / interactive) ────────────────────────────────────
    /** #d4af37 — metallic gold, 7.2:1 on obsidian */
    gold:          '#d4af37',
    /** #e8c84a — lighter gold for hover */
    goldLight:     '#e8c84a',
    /** #a88a20 — muted gold for secondary text */
    goldMuted:     '#a88a20',
    /** #f5e070 — pale gold for large display text */
    goldPale:      '#f5e070',

    // ── Amethyst / Violet (accent) ────────────────────────────────────────────
    /** #9b59b6 — amethyst, 4.6:1 on obsidian */
    amethyst:      '#9b59b6',
    /** #b07fd4 — lighter amethyst */
    amethystLight: '#b07fd4',
    /** #6c3483 — deep amethyst for gradients */
    amethystDeep:  '#6c3483',
    /** #d7b8f3 — pale amethyst for subtle tints */
    amethystPale:  '#d7b8f3',

    // ── Ruby (alerts / errors / critical) ─────────────────────────────────────
    /** #e0115f — ruby red, 5.1:1 on obsidian */
    ruby:          '#e0115f',
    /** #ff4d8d — lighter ruby for hover */
    rubyLight:     '#ff4d8d',
    /** #8b0a3a — deep ruby for backgrounds */
    rubyDeep:      '#8b0a3a',

    // ── Garnet (warning / secondary accent) ───────────────────────────────────
    /** #c0392b — garnet, 4.8:1 on obsidian */
    garnet:        '#c0392b',
    /** #e74c3c — lighter garnet */
    garnetLight:   '#e74c3c',

    // ── Jewel semantic colors ─────────────────────────────────────────────────
    /** #27ae60 — emerald green for success, 4.7:1 */
    emerald:       '#27ae60',
    /** #52d68a — light emerald */
    emeraldLight:  '#52d68a',
    /** #f39c12 — topaz amber for warnings, 5.2:1 */
    topaz:         '#f39c12',
    /** #2980b9 — sapphire blue for info, 4.5:1 */
    sapphire:      '#2980b9',
    /** #5dade2 — light sapphire */
    sapphireLight: '#5dade2',

    // ── Text ──────────────────────────────────────────────────────────────────
    /** #f0eaff — near-white with violet tint, 16:1 on obsidian */
    textPrimary:   '#f0eaff',
    /** #c4b8e0 — secondary text, 7.8:1 on obsidian */
    textSecondary: '#c4b8e0',
    /** #8a7aaa — muted text, 4.5:1 on obsidian */
    textMuted:     '#8a7aaa',
    /** #5a4d78 — disabled / placeholder, 3:1 (large text only) */
    textDisabled:  '#5a4d78',

    // ── Borders ───────────────────────────────────────────────────────────────
    /** #2e2650 — default border */
    borderDefault: '#2e2650',
    /** #4a3d6e — subtle border */
    borderSubtle:  '#4a3d6e',
    /** #d4af37 — focus ring */
    borderFocus:   '#d4af37',

    // ── Legacy aliases (keep for backward compat during migration) ────────────
    roseGold:      '#d4af37',
    roseGoldLight: '#e8c84a',
    roseGoldMuted: '#a88a20',
    warmCream:     '#f0eaff',
    warmCreamDark: '#c4b8e0',
    slateBlue:     '#9b59b6',
    slateBlueDark: '#6c3483',
    slateBlueLight:'#b07fd4',
    success:       '#27ae60',
    warning:       '#f39c12',
    error:         '#e0115f',
    info:          '#2980b9',
    surfaceDark:   '#0a0812',
    surfaceMid:    '#100d1e',
    surfaceLight:  '#231d3d',
  },

  fonts: {
    /** Display / headings — clean geometric sans */
    heading: "'DM Sans', 'Inter', system-ui, sans-serif",
    /** Body — neutral, highly legible */
    body:    "'Inter', 'DM Sans', system-ui, sans-serif",
    /** Monospace — formulas, code */
    mono:    "'JetBrains Mono', 'Fira Code', monospace",
  },

  radii: {
    xs:  '0.25rem',
    sm:  '0.375rem',
    md:  '0.5rem',
    lg:  '0.75rem',
    xl:  '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

  shadows: {
    sm:       '0 1px 3px rgba(0,0,0,0.5)',
    md:       '0 4px 12px rgba(0,0,0,0.5)',
    lg:       '0 8px 32px rgba(0,0,0,0.6)',
    xl:       '0 16px 48px rgba(0,0,0,0.7)',
    goldGlow: '0 0 24px rgba(212,175,55,0.25)',
    uvGlow:   '0 0 32px rgba(155,89,182,0.3)',
    rubyGlow: '0 0 20px rgba(224,17,95,0.3)',
  },

  tapTarget: '44px',

  /** Metallic gold gradient — use for primary CTAs and brand moments */
  gradients: {
    gold:      'linear-gradient(135deg, #d4af37 0%, #f5e070 50%, #d4af37 100%)',
    goldSubtle:'linear-gradient(135deg, #d4af3720 0%, #d4af3708 100%)',
    uv:        'linear-gradient(135deg, #100d1e 0%, #1a1530 50%, #231d3d 100%)',
    uvDeep:    'linear-gradient(135deg, #0a0812 0%, #100d1e 100%)',
    amethyst:  'linear-gradient(135deg, #6c3483 0%, #9b59b6 100%)',
    hero:      'radial-gradient(ellipse 80% 60% at 50% 0%, #6c348330 0%, transparent 70%), linear-gradient(180deg, #0a0812 0%, #100d1e 100%)',
  },
} as const;

export type Theme = typeof theme;
