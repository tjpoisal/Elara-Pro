/**
 * SVG <defs> patterns for each technique type.
 * Import and render once inside the SVG.
 */
import { TECHNIQUE_META, type TechniqueType } from './types';

export function TechniquePatterns() {
  return (
    <defs>
      {/* Foil stripe pattern */}
      <pattern id="pat-foil_highlight" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#f5e6c8" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#e8d4a8" strokeWidth="2" />
      </pattern>
      <pattern id="pat-foil_lowlight" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#8b6f47" />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#6b5030" strokeWidth="2" />
      </pattern>

      {/* Balayage diagonal sweep */}
      <pattern id="pat-balayage" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
        <rect width="10" height="10" fill="#d4a97a" />
        <line x1="0" y1="10" x2="10" y2="0" stroke="#c4956a" strokeWidth="2.5" />
      </pattern>

      {/* Babylight fine dots */}
      <pattern id="pat-babylight" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#fdf3e0" />
        <circle cx="4" cy="4" r="1.2" fill="#e8d8b0" />
      </pattern>

      {/* Toner solid */}
      <pattern id="pat-toner" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
        <rect width="1" height="1" fill="#b8a9d4" />
      </pattern>

      {/* Root color solid */}
      <pattern id="pat-root_color" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
        <rect width="1" height="1" fill="#4a3728" />
      </pattern>

      {/* Gloss wave */}
      <pattern id="pat-gloss" x="0" y="0" width="12" height="8" patternUnits="userSpaceOnUse">
        <rect width="12" height="8" fill="#c4956a" fillOpacity="0.3" />
        <path d="M0 4 Q3 1 6 4 Q9 7 12 4" stroke="#c4956a" strokeWidth="1.5" fill="none" />
      </pattern>

      {/* Bleach solid bright */}
      <pattern id="pat-bleach" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
        <rect width="1" height="1" fill="#fff8e7" />
      </pattern>

      {/* Color melt diagonal gradient-like */}
      <pattern id="pat-color_melt" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
        <rect width="14" height="14" fill="#e8c4a0" />
        <line x1="0" y1="14" x2="14" y2="0" stroke="#c4956a" strokeWidth="3" strokeOpacity="0.4" />
        <line x1="7" y1="14" x2="14" y2="7" stroke="#c4956a" strokeWidth="2" strokeOpacity="0.25" />
      </pattern>

      {/* Erase / none */}
      <pattern id="pat-none" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
        <rect width="1" height="1" fill="transparent" />
      </pattern>

      {/* Skin base gradient */}
      <radialGradient id="skin-gradient" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#f0d5b8" />
        <stop offset="60%" stopColor="#e8c9a8" />
        <stop offset="100%" stopColor="#d4b090" />
      </radialGradient>

      {/* Hair base gradient */}
      <linearGradient id="hair-base" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3d2b1f" />
        <stop offset="100%" stopColor="#2a1a10" />
      </linearGradient>

      {/* Elara Pro watermark gradient */}
      <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#c4956a" />
        <stop offset="100%" stopColor="#d4a97a" />
      </linearGradient>

      {/* Drop shadow filter */}
      <filter id="head-shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.4" />
      </filter>
    </defs>
  );
}
