import { type SectionPlacement, type TechniqueType, TECHNIQUE_META } from './types';

interface Props {
  placements: SectionPlacement[];
  onSectionClick: (sectionId: string) => void;
  hoveredSection: string | null;
  onSectionHover: (id: string | null) => void;
}

// Each section: id, SVG path, label, label position
const FRONT_SECTIONS = [
  // ── Crown / Top ──────────────────────────────────────────────────────────────
  { id: 'crown',         label: 'Crown',          lx: 160, ly: 68,
    d: 'M100,95 Q130,55 160,48 Q190,55 220,95 Q200,88 160,85 Q120,88 100,95 Z' },

  // ── Front hairline band ───────────────────────────────────────────────────────
  { id: 'hairline_front', label: 'Hairline',       lx: 160, ly: 108,
    d: 'M100,95 Q120,88 160,85 Q200,88 220,95 L215,118 Q190,112 160,110 Q130,112 105,118 Z' },

  // ── Top sections (left / right of part) ──────────────────────────────────────
  { id: 'top_left',      label: 'Top L',           lx: 128, ly: 130,
    d: 'M105,118 Q130,112 160,110 L158,148 Q138,145 112,140 Z' },
  { id: 'top_right',     label: 'Top R',           lx: 192, ly: 130,
    d: 'M160,110 Q190,112 215,118 L208,140 Q182,145 162,148 Z' },

  // ── Temple sections ───────────────────────────────────────────────────────────
  { id: 'temple_left',   label: 'Temple L',        lx: 96,  ly: 148,
    d: 'M100,95 L105,118 L112,140 Q98,148 88,158 Q82,140 84,118 Z' },
  { id: 'temple_right',  label: 'Temple R',        lx: 224, ly: 148,
    d: 'M220,95 L215,118 L208,140 Q222,148 232,158 Q238,140 236,118 Z' },

  // ── Mid sections ─────────────────────────────────────────────────────────────
  { id: 'mid_left',      label: 'Mid L',           lx: 122, ly: 165,
    d: 'M112,140 L158,148 L156,178 Q136,175 114,168 Z' },
  { id: 'mid_right',     label: 'Mid R',           lx: 198, ly: 165,
    d: 'M162,148 L208,140 L206,168 Q184,175 164,178 Z' },

  // ── Side sections ─────────────────────────────────────────────────────────────
  { id: 'side_left',     label: 'Side L',          lx: 94,  ly: 178,
    d: 'M88,158 Q98,148 112,140 L114,168 Q100,175 90,185 Z' },
  { id: 'side_right',    label: 'Side R',          lx: 226, ly: 178,
    d: 'M232,158 Q222,148 208,140 L206,168 Q220,175 230,185 Z' },

  // ── Lower sections ────────────────────────────────────────────────────────────
  { id: 'lower_left',    label: 'Lower L',         lx: 120, ly: 195,
    d: 'M114,168 L156,178 L154,205 Q134,202 110,192 Z' },
  { id: 'lower_right',   label: 'Lower R',         lx: 200, ly: 195,
    d: 'M164,178 L206,168 L210,192 Q186,202 166,205 Z' },

  // ── Nape sides ────────────────────────────────────────────────────────────────
  { id: 'nape_left',     label: 'Nape L',          lx: 100, ly: 210,
    d: 'M90,185 Q100,175 114,168 L110,192 Q98,200 92,212 Z' },
  { id: 'nape_right',    label: 'Nape R',          lx: 220, ly: 210,
    d: 'M230,185 Q220,175 206,168 L210,192 Q222,200 228,212 Z' },

  // ── Nape center ───────────────────────────────────────────────────────────────
  { id: 'nape_center',   label: 'Nape',            lx: 160, ly: 218,
    d: 'M110,192 L154,205 L160,220 L166,205 L210,192 Q200,215 160,225 Q120,215 110,192 Z' },
] as const;

type SectionId = typeof FRONT_SECTIONS[number]['id'];

function getPlacement(placements: SectionPlacement[], id: string): SectionPlacement | undefined {
  return placements.find((p) => p.sectionId === id && p.view === 'front');
}

function DirectionArrow({ cx, cy, angle }: { cx: number; cy: number; angle: number }) {
  const rad = (angle - 90) * (Math.PI / 180);
  const len = 12;
  const x2 = cx + Math.cos(rad) * len;
  const y2 = cy + Math.sin(rad) * len;
  const hx = cx + Math.cos(rad) * (len - 5);
  const hy = cy + Math.sin(rad) * (len - 5);
  const perp = rad + Math.PI / 2;
  return (
    <g>
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="white" strokeWidth="1.5" strokeOpacity="0.9" />
      <polygon
        points={`${x2},${y2} ${hx + Math.cos(perp) * 3},${hy + Math.sin(perp) * 3} ${hx - Math.cos(perp) * 3},${hy - Math.sin(perp) * 3}`}
        fill="white" fillOpacity="0.9"
      />
    </g>
  );
}

export function FrontHead({ placements, onSectionClick, hoveredSection, onSectionHover }: Props) {
  return (
    <g id="front-head">
      {/* ── Neck ── */}
      <path d="M138,225 Q140,240 142,255 L178,255 Q180,240 182,225 Q170,230 160,230 Q150,230 138,225 Z"
        fill="url(#skin-gradient)" stroke="#c4a882" strokeWidth="0.5" />

      {/* ── Head shape ── */}
      <ellipse cx="160" cy="155" rx="82" ry="100"
        fill="url(#skin-gradient)" stroke="#c4a882" strokeWidth="1" filter="url(#head-shadow)" />

      {/* ── Hair base (covers top of head) ── */}
      <path d="M78,130 Q80,80 100,60 Q130,35 160,30 Q190,35 220,60 Q240,80 242,130 Q230,110 220,95 Q190,55 160,48 Q130,55 100,95 Q90,110 78,130 Z"
        fill="url(#hair-base)" />

      {/* ── Clickable hair sections ── */}
      {FRONT_SECTIONS.map((sec) => {
        const placement = getPlacement(placements, sec.id);
        const isHovered = hoveredSection === sec.id;
        const tech = placement?.technique;
        const meta = tech ? TECHNIQUE_META[tech] : null;

        return (
          <g key={sec.id} style={{ cursor: 'pointer' }}
            onClick={() => onSectionClick(sec.id)}
            onMouseEnter={() => onSectionHover(sec.id)}
            onMouseLeave={() => onSectionHover(null)}
          >
            {/* Base hair fill */}
            <path d={sec.d} fill="url(#hair-base)" />

            {/* Technique overlay */}
            {meta && tech !== 'none' && (
              <path d={sec.d}
                fill={`url(#pat-${tech})`}
                fillOpacity={meta.opacity}
                style={{ mixBlendMode: 'multiply' }}
              />
            )}

            {/* Custom color override */}
            {placement?.color && tech !== 'none' && (
              <path d={sec.d} fill={placement.color} fillOpacity={0.4} />
            )}

            {/* Hover highlight */}
            {isHovered && (
              <path d={sec.d} fill="white" fillOpacity={0.15}
                stroke="#c4956a" strokeWidth="1.5" strokeDasharray="3,2" />
            )}

            {/* Section border */}
            <path d={sec.d} fill="none"
              stroke={placement && tech !== 'none' ? '#c4956a' : '#4a3a2a'}
              strokeWidth={placement && tech !== 'none' ? 1.2 : 0.5}
              strokeOpacity={0.6}
            />

            {/* Direction arrow */}
            {placement?.direction !== undefined && tech !== 'none' && (
              <DirectionArrow cx={sec.lx} cy={sec.ly} angle={placement.direction} />
            )}

            {/* Zone label badge */}
            {placement?.zoneLabel && tech !== 'none' && (
              <g>
                <rect x={sec.lx - 14} y={sec.ly - 8} width={28} height={12}
                  rx="3" fill="#1a1a2e" fillOpacity="0.85" />
                <text x={sec.lx} y={sec.ly + 1}
                  textAnchor="middle" fontSize="7" fill="#c4956a" fontFamily="Inter, sans-serif" fontWeight="600">
                  {placement.zoneLabel}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* ── Face features ── */}
      {/* Eyebrows */}
      <path d="M128,148 Q136,144 144,146" stroke="#6b4c2a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M176,146 Q184,144 192,148" stroke="#6b4c2a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="136" cy="155" rx="9" ry="6" fill="white" stroke="#c4a882" strokeWidth="0.5" />
      <ellipse cx="184" cy="155" rx="9" ry="6" fill="white" stroke="#c4a882" strokeWidth="0.5" />
      <circle cx="136" cy="155" r="4" fill="#5a3e28" />
      <circle cx="184" cy="155" r="4" fill="#5a3e28" />
      <circle cx="137.5" cy="153.5" r="1.2" fill="white" />
      <circle cx="185.5" cy="153.5" r="1.2" fill="white" />
      {/* Nose */}
      <path d="M156,162 Q154,175 150,180 Q155,183 160,182 Q165,183 170,180 Q166,175 164,162"
        stroke="#c4a882" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* Lips */}
      <path d="M148,192 Q155,188 160,190 Q165,188 172,192 Q165,198 160,197 Q155,198 148,192 Z"
        fill="#d4907a" stroke="#c4806a" strokeWidth="0.5" />
      <path d="M148,192 Q160,195 172,192" stroke="#c4806a" strokeWidth="0.5" fill="none" />
      {/* Ears */}
      <ellipse cx="78" cy="162" rx="8" ry="12" fill="url(#skin-gradient)" stroke="#c4a882" strokeWidth="0.8" />
      <ellipse cx="242" cy="162" rx="8" ry="12" fill="url(#skin-gradient)" stroke="#c4a882" strokeWidth="0.8" />
    </g>
  );
}
