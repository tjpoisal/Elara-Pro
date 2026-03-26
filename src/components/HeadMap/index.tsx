'use client';
/**
 * HeadMap — interactive SVG head section mapping tool.
 * Supports front/back views, technique painting, direction arrows,
 * zone labels, color swatches, and export to PNG.
 */
import { useState, useRef, useCallback } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { TechniquePatterns } from './patterns';
import { FrontHead } from './FrontHead';
import { BackHead } from './BackHead';
import {
  type TechniqueType,
  type HeadView,
  type SectionPlacement,
  TECHNIQUE_META,
} from './types';

export type { SectionPlacement, TechniqueType, HeadView };

interface HeadMapProps {
  /** Controlled placements — pass [] for uncontrolled */
  value?: SectionPlacement[];
  onChange?: (placements: SectionPlacement[]) => void;
  /** Zone labels available for assignment */
  zoneLabels?: string[];
  readOnly?: boolean;
  showBranding?: boolean;
}

const DIRECTION_PRESETS = [
  { label: '↑ Up',        angle: 0   },
  { label: '↗ Up-Right',  angle: 45  },
  { label: '→ Right',     angle: 90  },
  { label: '↘ Down-Right',angle: 135 },
  { label: '↓ Down',      angle: 180 },
  { label: '↙ Down-Left', angle: 225 },
  { label: '← Left',      angle: 270 },
  { label: '↖ Up-Left',   angle: 315 },
];

const PRESET_COLORS = [
  '#f5e6c8', '#d4a97a', '#c4956a', '#8b6f47', '#4a3728',
  '#b8a9d4', '#a8c4d4', '#d4b8a8', '#ffffff', '#2a1a10',
];

export function HeadMap({
  value,
  onChange,
  zoneLabels = [],
  readOnly = false,
  showBranding = true,
}: HeadMapProps) {
  const [internalPlacements, setInternalPlacements] = useState<SectionPlacement[]>([]);
  const placements = value ?? internalPlacements;

  const setPlacements = useCallback((next: SectionPlacement[]) => {
    if (onChange) onChange(next);
    else setInternalPlacements(next);
  }, [onChange]);

  const [activeView, setActiveView] = useState<HeadView>('front');
  const [activeTechnique, setActiveTechnique] = useState<TechniqueType>('foil_highlight');
  const [activeColor, setActiveColor] = useState<string>('');
  const [activeZoneLabel, setActiveZoneLabel] = useState<string>('');
  const [activeDirection, setActiveDirection] = useState<number | undefined>(undefined);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleSectionClick = useCallback((sectionId: string) => {
    if (readOnly) return;
    setSelectedSection(sectionId);

    setPlacements(
      activeTechnique === 'none'
        ? placements.filter((p) => !(p.sectionId === sectionId && p.view === activeView))
        : [
            ...placements.filter((p) => !(p.sectionId === sectionId && p.view === activeView)),
            {
              sectionId,
              view: activeView,
              technique: activeTechnique,
              direction: activeDirection,
              color: activeColor || undefined,
              zoneLabel: activeZoneLabel || undefined,
            },
          ]
    );
  }, [readOnly, activeTechnique, activeView, activeDirection, activeColor, activeZoneLabel, placements, setPlacements]);

  const clearAll = () => setPlacements(placements.filter((p) => p.view !== activeView));

  const exportPNG = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 640; canvas.height = 560;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, 640, 560);
      ctx.drawImage(img, 0, 0, 640, 560);
      const a = document.createElement('a');
      a.download = `elara-headmap-${activeView}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
  };

  const viewPlacements = placements.filter((p) => p.view === activeView);
  const placedCount = viewPlacements.filter((p) => p.technique !== 'none').length;

  const btnBase = css`
    padding: 0.4rem 0.75rem; border-radius: ${theme.radii.sm};
    font-size: 0.78rem; cursor: pointer; border: 1px solid ${theme.colors.borderDefault};
    background: transparent; color: ${theme.colors.textSecondary};
    transition: all 0.15s;
    &:hover { border-color: ${theme.colors.roseGold}; color: ${theme.colors.roseGold}; }
  `;

  return (
    <div className={css`
      background: ${theme.colors.obsidianMid};
      border: 1px solid ${theme.colors.borderDefault};
      border-radius: ${theme.radii.lg};
      overflow: hidden;
    `}>
      {/* ── Header ── */}
      <div className={css`
        padding: 0.875rem 1.25rem;
        background: ${theme.colors.obsidian};
        border-bottom: 1px solid ${theme.colors.borderDefault};
        display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;
      `}>
        <div className={css`display: flex; align-items: center; gap: 0.75rem;`}>
          <span className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.roseGold}; font-size: 0.95rem;`}>
            ✦ Head Map
          </span>
          <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
            {placedCount} section{placedCount !== 1 ? 's' : ''} mapped
          </span>
        </div>
        <div className={css`display: flex; gap: 0.5rem;`}>
          {/* View toggle */}
          {(['front', 'back'] as HeadView[]).map((v) => (
            <button key={v} onClick={() => setActiveView(v)}
              className={css`
                ${btnBase}
                border-color: ${activeView === v ? theme.colors.roseGold : theme.colors.borderDefault};
                background: ${activeView === v ? theme.colors.roseGold + '20' : 'transparent'};
                color: ${activeView === v ? theme.colors.roseGold : theme.colors.textSecondary};
                text-transform: capitalize;
              `}
            >{v}</button>
          ))}
          {!readOnly && (
            <>
              <button onClick={clearAll} className={css`${btnBase} color: ${theme.colors.error}; border-color: ${theme.colors.error}40; &:hover { background: ${theme.colors.error}15; }`}>
                Clear
              </button>
              <button onClick={exportPNG} className={btnBase}>Export PNG</button>
            </>
          )}
        </div>
      </div>

      <div className={css`display: grid; grid-template-columns: 1fr 280px; @media(max-width:700px){grid-template-columns:1fr;}`}>

        {/* ── SVG Canvas ── */}
        <div className={css`
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
          background: radial-gradient(ellipse at center, ${theme.colors.obsidianLight} 0%, ${theme.colors.obsidian} 100%);
          min-height: 340px;
        `}>
          <svg
            ref={svgRef}
            viewBox="60 25 200 250"
            width="100%"
            style={{ maxWidth: 360, maxHeight: 450 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <TechniquePatterns />

            {activeView === 'front' && (
              <FrontHead
                placements={placements}
                onSectionClick={handleSectionClick}
                hoveredSection={hoveredSection}
                onSectionHover={setHoveredSection}
              />
            )}
            {activeView === 'back' && (
              <BackHead
                placements={placements}
                onSectionClick={handleSectionClick}
                hoveredSection={hoveredSection}
                onSectionHover={setHoveredSection}
              />
            )}

            {/* Branding watermark */}
            {showBranding && (
              <text x="160" y="272" textAnchor="middle"
                fontSize="5.5" fill="url(#brand-gradient)" fillOpacity="0.6"
                fontFamily="'Playfair Display', serif" letterSpacing="1">
                ELARA PRO
              </text>
            )}
          </svg>
        </div>

        {/* ── Controls Panel ── */}
        {!readOnly && (
          <div className={css`
            border-left: 1px solid ${theme.colors.borderDefault};
            padding: 1rem;
            display: flex; flex-direction: column; gap: 1.25rem;
            overflow-y: auto; max-height: 480px;
          `}>

            {/* Technique picker */}
            <div>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.625rem;`}>
                Technique
              </p>
              <div className={css`display: flex; flex-direction: column; gap: 0.375rem;`}>
                {(Object.entries(TECHNIQUE_META) as [TechniqueType, typeof TECHNIQUE_META[TechniqueType]][]).map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTechnique(key)}
                    className={css`
                      display: flex; align-items: center; gap: 0.625rem;
                      padding: 0.5rem 0.75rem;
                      border-radius: ${theme.radii.sm};
                      border: 1px solid ${activeTechnique === key ? theme.colors.roseGold : theme.colors.borderDefault};
                      background: ${activeTechnique === key ? theme.colors.roseGold + '15' : 'transparent'};
                      cursor: pointer; text-align: left;
                      &:hover { border-color: ${theme.colors.roseGold}60; }
                    `}
                  >
                    <div className={css`
                      width: 18px; height: 18px; border-radius: 3px; flex-shrink: 0;
                      background: ${key === 'none' ? 'transparent' : meta.color};
                      border: 1px solid ${theme.colors.borderDefault};
                    `} />
                    <span className={css`color: ${activeTechnique === key ? theme.colors.roseGold : theme.colors.textSecondary}; font-size: 0.78rem;`}>
                      {meta.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color override */}
            {activeTechnique !== 'none' && (
              <div>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.625rem;`}>
                  Color Swatch
                </p>
                <div className={css`display: flex; flex-wrap: wrap; gap: 0.375rem; margin-bottom: 0.5rem;`}>
                  {PRESET_COLORS.map((c) => (
                    <button key={c} onClick={() => setActiveColor(activeColor === c ? '' : c)}
                      className={css`
                        width: 22px; height: 22px; border-radius: 4px;
                        background: ${c}; border: 2px solid ${activeColor === c ? theme.colors.roseGold : theme.colors.borderDefault};
                        cursor: pointer;
                      `}
                    />
                  ))}
                  <input type="color" value={activeColor || '#c4956a'}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className={css`width: 22px; height: 22px; border-radius: 4px; border: 1px solid ${theme.colors.borderDefault}; cursor: pointer; padding: 0;`}
                  />
                </div>
                {activeColor && (
                  <button onClick={() => setActiveColor('')}
                    className={css`color: ${theme.colors.textMuted}; font-size: 0.72rem; background: none; border: none; cursor: pointer; padding: 0;`}>
                    Clear color
                  </button>
                )}
              </div>
            )}

            {/* Direction */}
            {activeTechnique !== 'none' && (
              <div>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.625rem;`}>
                  Direction Arrow
                </p>
                <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 0.3rem;`}>
                  {DIRECTION_PRESETS.map((d) => (
                    <button key={d.angle} onClick={() => setActiveDirection(activeDirection === d.angle ? undefined : d.angle)}
                      className={css`
                        padding: 0.3rem 0.4rem; font-size: 0.72rem;
                        border-radius: ${theme.radii.sm};
                        border: 1px solid ${activeDirection === d.angle ? theme.colors.roseGold : theme.colors.borderDefault};
                        background: ${activeDirection === d.angle ? theme.colors.roseGold + '15' : 'transparent'};
                        color: ${activeDirection === d.angle ? theme.colors.roseGold : theme.colors.textSecondary};
                        cursor: pointer;
                      `}
                    >{d.label}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Zone label */}
            {activeTechnique !== 'none' && (
              <div>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.5rem;`}>
                  Zone Label
                </p>
                {zoneLabels.length > 0 ? (
                  <div className={css`display: flex; flex-wrap: wrap; gap: 0.375rem;`}>
                    <button onClick={() => setActiveZoneLabel('')}
                      className={css`
                        padding: 0.25rem 0.6rem; font-size: 0.72rem;
                        border-radius: ${theme.radii.sm};
                        border: 1px solid ${!activeZoneLabel ? theme.colors.roseGold : theme.colors.borderDefault};
                        background: ${!activeZoneLabel ? theme.colors.roseGold + '15' : 'transparent'};
                        color: ${!activeZoneLabel ? theme.colors.roseGold : theme.colors.textSecondary};
                        cursor: pointer;
                      `}>None</button>
                    {zoneLabels.map((z) => (
                      <button key={z} onClick={() => setActiveZoneLabel(activeZoneLabel === z ? '' : z)}
                        className={css`
                          padding: 0.25rem 0.6rem; font-size: 0.72rem;
                          border-radius: ${theme.radii.sm};
                          border: 1px solid ${activeZoneLabel === z ? theme.colors.roseGold : theme.colors.borderDefault};
                          background: ${activeZoneLabel === z ? theme.colors.roseGold + '15' : 'transparent'};
                          color: ${activeZoneLabel === z ? theme.colors.roseGold : theme.colors.textSecondary};
                          cursor: pointer;
                        `}>{z}</button>
                    ))}
                  </div>
                ) : (
                  <input
                    value={activeZoneLabel}
                    onChange={(e) => setActiveZoneLabel(e.target.value)}
                    placeholder="e.g. Zone 1"
                    className={css`
                      width: 100%; padding: 0.4rem 0.625rem;
                      background: ${theme.colors.obsidian};
                      border: 1px solid ${theme.colors.borderDefault};
                      border-radius: ${theme.radii.sm};
                      color: ${theme.colors.warmCream}; font-size: 0.8rem;
                      box-sizing: border-box;
                      &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
                    `}
                  />
                )}
              </div>
            )}

            {/* Legend */}
            <div className={css`border-top: 1px solid ${theme.colors.borderDefault}; padding-top: 1rem;`}>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; margin: 0 0 0.625rem;`}>
                Legend
              </p>
              {viewPlacements.filter((p) => p.technique !== 'none').map((p) => {
                const meta = TECHNIQUE_META[p.technique];
                return (
                  <div key={`${p.sectionId}-${p.view}`}
                    className={css`display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem;`}>
                    <div className={css`width: 12px; height: 12px; border-radius: 2px; background: ${p.color || meta.color}; flex-shrink: 0;`} />
                    <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.72rem;`}>
                      {p.sectionId.replace(/_/g, ' ')}
                      {p.zoneLabel ? ` — ${p.zoneLabel}` : ''}
                      {' · '}{meta.label}
                    </span>
                  </div>
                );
              })}
              {viewPlacements.filter((p) => p.technique !== 'none').length === 0 && (
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
                  Click sections to map placement
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
