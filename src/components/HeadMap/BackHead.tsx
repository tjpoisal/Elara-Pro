import { type SectionPlacement, TECHNIQUE_META } from './types';

interface Props {
  placements: SectionPlacement[];
  onSectionClick: (sectionId: string) => void;
  hoveredSection: string | null;
  onSectionHover: (id: string | null) => void;
}

const BACK_SECTIONS = [
  // ── Crown ────────────────────────────────────────────────────────────────────
  { id: 'b_crown',        label: 'Crown',     lx: 160, ly: 72,
    d: 'M105,100 Q130,58 160,50 Q190,58 215,100 Q195,92 160,88 Q125,92 105,100 Z' },

  // ── Top back ─────────────────────────────────────────────────────────────────
  { id: 'b_top_left',     label: 'Top L',     lx: 128, ly: 118,
    d: 'M105,100 Q125,92 160,88 L158,135 Q138,132 110,122 Z' },
  { id: 'b_top_right',    label: 'Top R',     lx: 192, ly: 118,
    d: 'M160,88 Q195,92 215,100 L210,122 Q182,132 162,135 Z' },

  // ── Upper back ────────────────────────────────────────────────────────────────
  { id: 'b_upper_left',   label: 'Upper L',   lx: 118, ly: 152,
    d: 'M110,122 L158,135 L156,165 Q134,162 108,150 Z' },
  { id: 'b_upper_right',  label: 'Upper R',   lx: 202, ly: 152,
    d: 'M162,135 L210,122 L212,150 Q186,162 164,165 Z' },

  // ── Occipital sides ───────────────────────────────────────────────────────────
  { id: 'b_occ_left',     label: 'Occ L',     lx: 100, ly: 168,
    d: 'M82,140 Q90,128 105,100 L110,122 L108,150 Q94,158 86,170 Z' },
  { id: 'b_occ_right',    label: 'Occ R',     lx: 220, ly: 168,
    d: 'M238,140 Q230,128 215,100 L210,122 L212,150 Q226,158 234,170 Z' },

  // ── Mid back ─────────────────────────────────────────────────────────────────
  { id: 'b_mid_left',     label: 'Mid L',     lx: 118, ly: 185,
    d: 'M108,150 L156,165 L154,195 Q132,192 106,180 Z' },
  { id: 'b_mid_right',    label: 'Mid R',     lx: 202, ly: 185,
    d: 'M164,165 L212,150 L214,180 Q188,192 166,195 Z' },

  // ── Lower back ────────────────────────────────────────────────────────────────
  { id: 'b_lower_left',   label: 'Lower L',   lx: 112, ly: 210,
    d: 'M106,180 L154,195 L152,218 Q130,215 104,202 Z' },
  { id: 'b_lower_right',  label: 'Lower R',   lx: 208, ly: 210,
    d: 'M166,195 L214,180 L216,202 Q190,215 168,218 Z' },

  // ── Nape ─────────────────────────────────────────────────────────────────────
  { id: 'b_nape_left',    label: 'Nape L',    lx: 104, ly: 225,
    d: 'M86,170 Q94,158 108,150 L106,180 L104,202 Q94,210 88,222 Z' },
  { id: 'b_nape_right',   label: 'Nape R',    lx: 216, ly: 225,
    d: 'M234,170 Q226,158 212,150 L214,180 L216,202 Q226,210 232,222 Z' },
  { id: 'b_nape_center',  label: 'Nape',      lx: 160, ly: 228,
    d: 'M104,202 L152,218 L160,232 L168,218 L216,202 Q205,228 160,235 Q115,228 104,202 Z' },
] as const;

function getPlacement(placements: SectionPlacement[], id: string): SectionPlacement | undefined {
  return placements.find((p) => p.sectionId === id && p.view === 'back');
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

export function BackHead({ placements, onSectionClick, hoveredSection, onSectionHover }: Props) {
  return (
    <g id="back-head">
      {/* Neck */}
      <path d="M138,235 Q140,248 142,260 L178,260 Q180,248 182,235 Q170,240 160,240 Q150,240 138,235 Z"
        fill="url(#skin-gradient)" stroke="#c4a882" strokeWidth="0.5" />

      {/* Head shape */}
      <ellipse cx="160" cy="155" rx="82" ry="105"
        fill="url(#hair-base)" stroke="#3d2b1f" strokeWidth="1" filter="url(#head-shadow)" />

      {/* Clickable sections */}
      {BACK_SECTIONS.map((sec) => {
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
            <path d={sec.d} fill="url(#hair-base)" />

            {meta && tech !== 'none' && (
              <path d={sec.d} fill={`url(#pat-${tech})`} fillOpacity={meta.opacity} />
            )}

            {placement?.color && tech !== 'none' && (
              <path d={sec.d} fill={placement.color} fillOpacity={0.4} />
            )}

            {isHovered && (
              <path d={sec.d} fill="white" fillOpacity={0.15}
                stroke="#c4956a" strokeWidth="1.5" strokeDasharray="3,2" />
            )}

            <path d={sec.d} fill="none"
              stroke={placement && tech !== 'none' ? '#c4956a' : '#4a3a2a'}
              strokeWidth={placement && tech !== 'none' ? 1.2 : 0.5}
              strokeOpacity={0.6}
            />

            {placement?.direction !== undefined && tech !== 'none' && (
              <DirectionArrow cx={sec.lx} cy={sec.ly} angle={placement.direction} />
            )}

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

      {/* Ear stubs */}
      <ellipse cx="78" cy="162" rx="8" ry="12" fill="url(#skin-gradient)" stroke="#c4a882" strokeWidth="0.8" />
      <ellipse cx="242" cy="162" rx="8" ry="12" fill="url(#skin-gradient)" stroke="#c4a882" strokeWidth="0.8" />
    </g>
  );
}
