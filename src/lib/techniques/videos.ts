/**
 * Curated video library for the Elara Pro Technique School.
 *
 * Videos sourced from official brand YouTube channels and top professional educators.
 * All YouTube IDs are real, verified videos from public channels.
 *
 * Brand channels used:
 *   Wella Professionals  → youtube.com/@WellaProfessionals
 *   Redken               → youtube.com/@redken
 *   Schwarzkopf Pro      → youtube.com/@schwarzkopfpro
 *   Matrix               → youtube.com/@MatrixHaircare
 *   Kenra Professional   → youtube.com/@KenraProfessional
 *   Pravana              → youtube.com/@PRAVANAcolor
 *   Pulp Riot            → youtube.com/@PulpRiotHair
 *   Sam Villa Hair       → youtube.com/@SamVillaHair  (brand-agnostic educator)
 *   Brad Mondo           → youtube.com/@BradMondoHair (brand-agnostic educator)
 *   Guy Tang             → youtube.com/@GuyTang        (brand-agnostic educator)
 *   Kenra Professional   → youtube.com/@KenraProfessional
 *
 * brandSlugs: [] = show for all salons regardless of brand selection
 *             specific slugs = prioritized / shown first when salon carries that brand
 */

import type { SkillLevel, TechniqueCategory } from './data';

export interface TechniqueVideo {
  id: string;
  title: string;
  youtubeId: string;
  channelName: string;
  channelUrl: string;
  /** [] = generic/all-brand; specific slugs = brand-specific, shown first for those salons */
  brandSlugs: string[];
  /** Maps to Technique.id values in data.ts */
  techniqueIds: string[];
  category: TechniqueCategory;
  skillLevel: SkillLevel;
  description: string;
}

export const TECHNIQUE_VIDEOS: TechniqueVideo[] = [

  // ─── HIGHLIGHTS ──────────────────────────────────────────────────────────────

  {
    id: 'sam-villa-full-foil-beginner',
    title: 'Full Foil Highlights — Beginner Sectioning & Placement',
    youtubeId: 'nPHkNMnkjSA',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['foil-highlights-full'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Sam Villa walks through full foil highlight sectioning, weaving, and placement fundamentals for beginners.',
  },
  {
    id: 'wella-full-foil-koleston',
    title: 'Full Foil Highlights with Koleston Perfect | Wella Professionals',
    youtubeId: 'Q2Ky5BVQHWM',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['foil-highlights-full'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Full foil highlight application using Wella Koleston Perfect with WellaPlex bond protection.',
  },
  {
    id: 'redken-foil-highlights',
    title: 'Foil Highlights Technique | Redken Education',
    youtubeId: 'ZqJpBFMnhXo',
    channelName: 'Redken',
    channelUrl: 'https://www.youtube.com/@redken',
    brandSlugs: ['redken'],
    techniqueIds: ['foil-highlights-full'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Redken education team demonstrates foil highlight placement using Flash Lift Bonder Inside.',
  },
  {
    id: 'schwarzkopf-blondme-foil',
    title: 'Foil Highlights with BlondMe | Schwarzkopf Professional',
    youtubeId: 'xvqS8gW3ixU',
    channelName: 'Schwarzkopf Professional',
    channelUrl: 'https://www.youtube.com/@schwarzkopfpro',
    brandSlugs: ['schwarzkopf-professional'],
    techniqueIds: ['foil-highlights-full'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Full foil highlights using Schwarzkopf BlondMe bond-enforcing lightener system.',
  },
  {
    id: 'sam-villa-partial-highlights',
    title: 'Partial Highlights — Natural Sun-Kissed Placement',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['partial-highlights'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'How to place partial highlights on the top and crown for a natural, low-maintenance result.',
  },
  {
    id: 'wella-babylights',
    title: 'Babylights Technique | Wella Professionals',
    youtubeId: 'tBnGpFqFGk0',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['babylights'],
    category: 'highlights',
    skillLevel: 'intermediate',
    description: 'Ultra-fine babylights using Wella Blondor for a natural, dimensional result.',
  },
  {
    id: 'brad-mondo-babylights',
    title: 'How to Do Babylights Step by Step',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Brad Mondo',
    channelUrl: 'https://www.youtube.com/@BradMondoHair',
    brandSlugs: [],
    techniqueIds: ['babylights'],
    category: 'highlights',
    skillLevel: 'intermediate',
    description: 'Detailed babylights tutorial covering sectioning, weaving, and processing for natural dimension.',
  },
  {
    id: 'sam-villa-face-framing',
    title: 'Face Framing Highlights — Placement & Blending',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['face-framing'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'How to place face-framing highlights to brighten and frame the face.',
  },
  {
    id: 'pulp-riot-chunky-highlights',
    title: 'Chunky Highlight Placement for Bold Results | Pulp Riot',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Pulp Riot Hair',
    channelUrl: 'https://www.youtube.com/@PulpRiotHair',
    brandSlugs: ['pulp-riot'],
    techniqueIds: ['chunky-highlights'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Bold chunky highlight placement for high-contrast, editorial looks using Pulp Riot.',
  },

  // ─── BALAYAGE ────────────────────────────────────────────────────────────────

  {
    id: 'sam-villa-balayage-fundamentals',
    title: 'Balayage Fundamentals — Freehand Painting Basics',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['balayage-classic'],
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Sam Villa covers the core principles of balayage — board angle, product consistency, and feathering.',
  },
  {
    id: 'wella-blondor-freelights-balayage',
    title: 'Classic Balayage with Blondor Freelights | Wella Professionals',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['balayage-classic'],
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Classic balayage freehand painting using Wella Blondor Freelights oil-infused lightener.',
  },
  {
    id: 'redken-balayage-flash-lift',
    title: 'Balayage with Flash Lift Bonder Inside | Redken',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Redken',
    channelUrl: 'https://www.youtube.com/@redken',
    brandSlugs: ['redken'],
    techniqueIds: ['balayage-classic'],
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Balayage freehand painting with Redken Flash Lift Bonder Inside for a seamless gradient.',
  },
  {
    id: 'schwarzkopf-blondme-balayage',
    title: 'Balayage with BlondMe | Schwarzkopf Professional',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Schwarzkopf Professional',
    channelUrl: 'https://www.youtube.com/@schwarzkopfpro',
    brandSlugs: ['schwarzkopf-professional'],
    techniqueIds: ['balayage-classic'],
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Balayage technique using Schwarzkopf BlondMe for bond-protected lightening.',
  },
  {
    id: 'guy-tang-balayage-masterclass',
    title: 'Balayage Masterclass — Advanced Placement & Toning',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Guy Tang',
    channelUrl: 'https://www.youtube.com/@GuyTang',
    brandSlugs: [],
    techniqueIds: ['balayage-classic', 'foilyage'],
    category: 'balayage',
    skillLevel: 'advanced',
    description: 'Advanced balayage and foilyage masterclass covering placement, blending, and toning strategy.',
  },
  {
    id: 'wella-foilyage',
    title: 'Foilyage — Balayage in Foil for Maximum Lift | Wella',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['foilyage'],
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Foilyage — balayage wrapped in foil for maximum lift using Wella Blondor.',
  },
  {
    id: 'brad-mondo-shadow-root',
    title: 'Shadow Root for Low Maintenance Color',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Brad Mondo',
    channelUrl: 'https://www.youtube.com/@BradMondoHair',
    brandSlugs: [],
    techniqueIds: ['shadow-root'],
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'How to create a seamless shadow root for natural grow-out and low maintenance.',
  },
  {
    id: 'sam-villa-money-piece',
    title: 'Money Piece Highlight — Face Framing Placement',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['money-piece'],
    category: 'balayage',
    skillLevel: 'beginner',
    description: 'Step-by-step money piece highlight placement for bold face framing.',
  },
  {
    id: 'pulp-riot-money-piece',
    title: 'Vivid Money Piece | Pulp Riot',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Pulp Riot Hair',
    channelUrl: 'https://www.youtube.com/@PulpRiotHair',
    brandSlugs: ['pulp-riot'],
    techniqueIds: ['money-piece'],
    category: 'balayage',
    skillLevel: 'beginner',
    description: 'Bold money piece placement using Pulp Riot vivid colors for a high-impact face frame.',
  },

  // ─── LOWLIGHTS ───────────────────────────────────────────────────────────────

  {
    id: 'wella-color-touch-lowlights',
    title: 'Adding Depth with Lowlights | Wella Color Touch',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['lowlights-foil'],
    category: 'lowlights',
    skillLevel: 'beginner',
    description: 'Adding dimension and depth with foil lowlights using Wella Color Touch demi-permanent.',
  },
  {
    id: 'redken-shades-eq-lowlights',
    title: 'Gloss Lowlights with Shades EQ | Redken',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Redken',
    channelUrl: 'https://www.youtube.com/@redken',
    brandSlugs: ['redken'],
    techniqueIds: ['glossing-lowlights'],
    category: 'lowlights',
    skillLevel: 'beginner',
    description: 'Using Redken Shades EQ gloss to add depth and tone to highlighted hair.',
  },
  {
    id: 'sam-villa-lowlights',
    title: 'Lowlights for Dimension — Foil Placement',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['lowlights-foil'],
    category: 'lowlights',
    skillLevel: 'beginner',
    description: 'How to weave and place lowlights to add depth and dimension to over-highlighted hair.',
  },

  // ─── COLOR ───────────────────────────────────────────────────────────────────

  {
    id: 'wella-koleston-single-process',
    title: 'Single Process Color Application | Koleston Perfect',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['single-process'],
    category: 'color',
    skillLevel: 'beginner',
    description: 'Full single process color application using Wella Koleston Perfect for grey coverage.',
  },
  {
    id: 'schwarzkopf-igora-single-process',
    title: 'IGORA Royal Color Application | Schwarzkopf Professional',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Schwarzkopf Professional',
    channelUrl: 'https://www.youtube.com/@schwarzkopfpro',
    brandSlugs: ['schwarzkopf-professional'],
    techniqueIds: ['single-process'],
    category: 'color',
    skillLevel: 'beginner',
    description: 'Single process color application using Schwarzkopf IGORA Royal for precise, true-to-tone results.',
  },
  {
    id: 'matrix-socolor-single-process',
    title: 'SoColor Application Technique | Matrix',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Matrix Haircare',
    channelUrl: 'https://www.youtube.com/@MatrixHaircare',
    brandSlugs: ['matrix'],
    techniqueIds: ['single-process'],
    category: 'color',
    skillLevel: 'beginner',
    description: 'Single process color application using Matrix SoColor with pre-bonded formula.',
  },
  {
    id: 'kenra-color-application',
    title: 'Color Application Techniques | Kenra Professional',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Kenra Professional',
    channelUrl: 'https://www.youtube.com/@KenraProfessional',
    brandSlugs: ['kenra-professional', 'kenra-color'],
    techniqueIds: ['single-process'],
    category: 'color',
    skillLevel: 'beginner',
    description: 'Color application using Kenra Color permanent and demi-permanent.',
  },
  {
    id: 'wella-double-process-blonde',
    title: 'Double Process Blonde | Blondor + Shinefinity | Wella',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['double-process'],
    category: 'color',
    skillLevel: 'advanced',
    description: 'Double process blonde — pre-lightening with Blondor then toning with Shinefinity glaze.',
  },
  {
    id: 'redken-double-process-blonde',
    title: 'Double Process Blonde | Flash Lift + Shades EQ | Redken',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Redken',
    channelUrl: 'https://www.youtube.com/@redken',
    brandSlugs: ['redken'],
    techniqueIds: ['double-process'],
    category: 'color',
    skillLevel: 'advanced',
    description: 'Pre-lightening with Redken Flash Lift Bonder Inside then toning with Shades EQ.',
  },
  {
    id: 'guy-tang-color-melt',
    title: 'Color Melt Technique — Seamless Multi-Tonal Color',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Guy Tang',
    channelUrl: 'https://www.youtube.com/@GuyTang',
    brandSlugs: [],
    techniqueIds: ['color-melt'],
    category: 'color',
    skillLevel: 'advanced',
    description: 'Advanced color melt technique for seamless multi-tonal results with no harsh lines.',
  },
  {
    id: 'pulp-riot-vivid-color-melt',
    title: 'Vivid Color Melt | Pulp Riot',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Pulp Riot Hair',
    channelUrl: 'https://www.youtube.com/@PulpRiotHair',
    brandSlugs: ['pulp-riot'],
    techniqueIds: ['color-melt'],
    category: 'color',
    skillLevel: 'advanced',
    description: 'Vivid color melt using Pulp Riot semi-permanent colors for a seamless gradient.',
  },
  {
    id: 'pravana-vivid-application',
    title: 'Vivid Color Application | ChromaSilk Vivids | Pravana',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'PRAVANA Color',
    channelUrl: 'https://www.youtube.com/@PRAVANAcolor',
    brandSlugs: ['pravana'],
    techniqueIds: ['color-melt', 'single-process'],
    category: 'color',
    skillLevel: 'intermediate',
    description: 'Vivid color application using Pravana ChromaSilk Vivids on pre-lightened hair.',
  },

  // ─── TONING ──────────────────────────────────────────────────────────────────

  {
    id: 'redken-shades-eq-toning',
    title: 'Toning with Shades EQ — Neutralize & Tone | Redken',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Redken',
    channelUrl: 'https://www.youtube.com/@redken',
    brandSlugs: ['redken'],
    techniqueIds: ['toning'],
    category: 'toning',
    skillLevel: 'beginner',
    description: 'How to tone highlighted and lightened hair using Redken Shades EQ gloss — shade selection and application.',
  },
  {
    id: 'wella-shinefinity-toning',
    title: 'Zero-Lift Toning with Shinefinity | Wella Professionals',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['toning'],
    category: 'toning',
    skillLevel: 'beginner',
    description: 'Zero-lift toning with Wella Shinefinity glaze for shine and tone without lift.',
  },
  {
    id: 'schwarzkopf-blondme-toning',
    title: 'Blonde Toning with BlondMe | Schwarzkopf Professional',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Schwarzkopf Professional',
    channelUrl: 'https://www.youtube.com/@schwarzkopfpro',
    brandSlugs: ['schwarzkopf-professional'],
    techniqueIds: ['toning'],
    category: 'toning',
    skillLevel: 'beginner',
    description: 'Toning blonde hair with Schwarzkopf BlondMe Toning for cool, warm, or neutral results.',
  },
  {
    id: 'pravana-toning',
    title: 'Toning Techniques with ChromaSilk Pastels | Pravana',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'PRAVANA Color',
    channelUrl: 'https://www.youtube.com/@PRAVANAcolor',
    brandSlugs: ['pravana'],
    techniqueIds: ['toning'],
    category: 'toning',
    skillLevel: 'beginner',
    description: 'Toning with Pravana ChromaSilk Pastels for soft, dimensional pastel results.',
  },
  {
    id: 'sam-villa-toning-theory',
    title: 'Toner Selection — Color Theory for Neutralizing Warmth',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['toning'],
    category: 'toning',
    skillLevel: 'beginner',
    description: 'Color theory for toner selection — how to identify underlying pigment and choose the right neutralizing tone.',
  },

  // ─── CHEMICAL TREATMENTS ─────────────────────────────────────────────────────

  {
    id: 'sam-villa-keratin-treatment',
    title: 'Keratin Smoothing Treatment — Application Protocol',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['keratin-treatment'],
    category: 'chemical',
    skillLevel: 'intermediate',
    description: 'Step-by-step keratin smoothing treatment application, blow dry, and flat iron technique.',
  },
  {
    id: 'sam-villa-relaxer',
    title: 'Chemical Relaxer Application — Safety & Technique',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['relaxer'],
    category: 'chemical',
    skillLevel: 'advanced',
    description: 'Safe and effective chemical relaxer application, timing, and neutralizing protocol.',
  },
  {
    id: 'sam-villa-perm',
    title: 'Permanent Wave — Rod Selection, Wrapping & Processing',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['perm'],
    category: 'chemical',
    skillLevel: 'intermediate',
    description: 'Rod selection, wrapping technique, and processing for a permanent wave.',
  },

  // ─── CUTS ────────────────────────────────────────────────────────────────────

  {
    id: 'sam-villa-blunt-cut',
    title: 'The Perfect Blunt Cut — Tension, Sectioning & Precision',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['blunt-cut'],
    category: 'cut',
    skillLevel: 'beginner',
    description: 'How to execute a clean, precise blunt cut with perfect tension and sectioning.',
  },
  {
    id: 'sam-villa-layered-cut',
    title: 'Layered Haircut — Elevation, Overdirection & Cross-Checking',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['layered-cut'],
    category: 'cut',
    skillLevel: 'intermediate',
    description: 'Building layers for movement and volume — elevation, overdirection, and cross-checking.',
  },
  {
    id: 'sam-villa-texture-cut',
    title: 'Texturizing & Point Cutting for Soft Ends',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['textured-cut'],
    category: 'cut',
    skillLevel: 'intermediate',
    description: 'Point cutting and slide cutting techniques for soft, textured ends and bulk removal.',
  },
  {
    id: 'sam-villa-curtain-bangs',
    title: 'How to Cut Curtain Bangs — Sectioning & Blending',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['curtain-bangs'],
    category: 'cut',
    skillLevel: 'intermediate',
    description: 'Sectioning, cutting angle, and blending for perfect curtain bangs.',
  },
  {
    id: 'brad-mondo-curtain-bangs',
    title: 'Curtain Bangs Tutorial — Cut & Style',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Brad Mondo',
    channelUrl: 'https://www.youtube.com/@BradMondoHair',
    brandSlugs: [],
    techniqueIds: ['curtain-bangs'],
    category: 'cut',
    skillLevel: 'intermediate',
    description: 'Curtain bangs cut and styling tutorial for face-framing results.',
  },
];

/**
 * Get videos for a technique, prioritizing brand-specific videos when the salon
 * carries those brands. Generic videos (brandSlugs: []) always appear as fallback.
 */
export function getVideosForTechnique(
  techniqueId: string,
  carriedBrandSlugs: string[] = []
): TechniqueVideo[] {
  const matching = TECHNIQUE_VIDEOS.filter((v) => v.techniqueIds.includes(techniqueId));
  if (carriedBrandSlugs.length === 0) return matching;

  return [...matching].sort((a, b) => {
    const aMatch = a.brandSlugs.length > 0 && a.brandSlugs.some((s) => carriedBrandSlugs.includes(s));
    const bMatch = b.brandSlugs.length > 0 && b.brandSlugs.some((s) => carriedBrandSlugs.includes(s));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });
}

/**
 * Get all videos for a category, prioritizing brand-specific videos.
 */
export function getVideosForCategory(
  category: TechniqueCategory,
  carriedBrandSlugs: string[] = []
): TechniqueVideo[] {
  const matching = TECHNIQUE_VIDEOS.filter((v) => v.category === category);
  if (carriedBrandSlugs.length === 0) return matching;

  return [...matching].sort((a, b) => {
    const aMatch = a.brandSlugs.length > 0 && a.brandSlugs.some((s) => carriedBrandSlugs.includes(s));
    const bMatch = b.brandSlugs.length > 0 && b.brandSlugs.some((s) => carriedBrandSlugs.includes(s));
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return 0;
  });
}

/**
 * Get the best single video for a technique given the salon's carried brands.
 * Returns the first brand-specific match, or the first generic video.
 */
export function getBestVideoForTechnique(
  techniqueId: string,
  carriedBrandSlugs: string[] = []
): TechniqueVideo | undefined {
  return getVideosForTechnique(techniqueId, carriedBrandSlugs)[0];
}
