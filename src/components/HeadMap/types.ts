export type TechniqueType =
  | 'foil_highlight'
  | 'foil_lowlight'
  | 'balayage'
  | 'babylight'
  | 'toner'
  | 'root_color'
  | 'gloss'
  | 'bleach'
  | 'color_melt'
  | 'none';

export type HeadView = 'front' | 'back' | 'left' | 'right' | 'top';

export interface SectionPlacement {
  sectionId: string;
  view: HeadView;
  technique: TechniqueType;
  /** Direction arrow angle in degrees (0 = up, 90 = right) */
  direction?: number;
  /** Color swatch hex */
  color?: string;
  /** Formula zone label e.g. "Zone 1" */
  zoneLabel?: string;
  notes?: string;
}

export interface HeadMapState {
  placements: SectionPlacement[];
  activeTechnique: TechniqueType;
  activeColor: string;
  activeZoneLabel: string;
  activeView: HeadView;
}

export const TECHNIQUE_META: Record<TechniqueType, {
  label: string;
  color: string;
  pattern: 'solid' | 'stripe' | 'diagonal' | 'dots' | 'wave';
  opacity: number;
}> = {
  foil_highlight:  { label: 'Foil Highlight',  color: '#f5e6c8', pattern: 'stripe',   opacity: 0.85 },
  foil_lowlight:   { label: 'Foil Lowlight',   color: '#8b6f47', pattern: 'stripe',   opacity: 0.75 },
  balayage:        { label: 'Balayage',         color: '#d4a97a', pattern: 'diagonal', opacity: 0.70 },
  babylight:       { label: 'Babylight',        color: '#fdf3e0', pattern: 'dots',     opacity: 0.80 },
  toner:           { label: 'Toner',            color: '#b8a9d4', pattern: 'solid',    opacity: 0.50 },
  root_color:      { label: 'Root Color',       color: '#4a3728', pattern: 'solid',    opacity: 0.80 },
  gloss:           { label: 'Gloss',            color: '#c4956a', pattern: 'wave',     opacity: 0.45 },
  bleach:          { label: 'Bleach/Lightener', color: '#fff8e7', pattern: 'solid',    opacity: 0.90 },
  color_melt:      { label: 'Color Melt',       color: '#e8c4a0', pattern: 'diagonal', opacity: 0.65 },
  none:            { label: 'Erase',            color: 'transparent', pattern: 'solid', opacity: 0 },
};
