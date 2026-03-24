/**
 * Curated video library for the Elara Pro Technique School.
 * Videos sourced from official brand YouTube channels and top professional educators.
 * brandSlugs: [] = generic/all-brand; specific slugs = prioritized when that brand is selected.
 */

import type { SkillLevel, TechniqueCategory } from './data';

export interface TechniqueVideo {
  id: string;
  title: string;
  youtubeId: string;
  channelName: string;
  channelUrl: string;
  brandSlugs: string[];       // [] = show for all; specific slugs = brand-specific
  techniqueIds: string[];     // maps to Technique.id in data.ts
  category: TechniqueCategory;
  skillLevel: SkillLevel;
  description: string;
}

export const TECHNIQUE_VIDEOS: TechniqueVideo[] = [

  // ─── HIGHLIGHTS ──────────────────────────────────────────────────────────────

  {
    id: 'wella-full-foil-highlights',
    title: 'Full Foil Highlights with Koleston Perfect',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['foil-highlights-full'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Step-by-step full foil highlight application using Wella Koleston Perfect.',
  },
  {
    id: 'redken-full-foil-highlights',
    title: 'Full Head Foil Highlights | Redken',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Redken',
    channelUrl: 'https://www.youtube.com/@redken',
    brandSlugs: ['redken'],
    techniqueIds: ['foil-highlights-full'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Full foil highlight technique using Redken Flash Lift.',
  },
  {
    id: 'schwarzkopf-full-foil',
    title: 'Full Foil Highlights | BlondMe',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Schwarzkopf Professional',
    channelUrl: 'https://www.youtube.com/@schwarzkopfpro',
    brandSlugs: ['schwarzkopf-professional'],
    techniqueIds: ['foil-highlights-full'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Full foil highlights using Schwarzkopf BlondMe bond-enforcing lightener.',
  },
  {
    id: 'generic-partial-highlights',
    title: 'Partial Highlights for Beginners',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['partial-highlights'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'How to place partial highlights for a natural sun-kissed look.',
  },
  {
    id: 'wella-babylights',
    title: 'Babylights Technique | Wella Professionals',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['babylights'],
    category: 'highlights',
    skillLevel: 'intermediate',
    description: 'Ultra-fine babylights using Wella Blondor for a natural, dimensional result.',
  },
  {
    id: 'generic-babylights',
    title: 'How to Do Babylights Step by Step',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Brad Mondo',
    channelUrl: 'https://www.youtube.com/@BradMondoHair',
    brandSlugs: [],
    techniqueIds: ['babylights'],
    category: 'highlights',
    skillLevel: 'intermediate',
    description: 'Detailed babylights tutorial covering sectioning, weaving, and processing.',
  },
  {
    id: 'generic-face-framing',
    title: 'Face Framing Highlights Tutorial',
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
    title: 'Chunky Highlight Placement | Pulp Riot',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Pulp Riot Hair',
    channelUrl: 'https://www.youtube.com/@PulpRiotHair',
    brandSlugs: ['pulp-riot'],
    techniqueIds: ['chunky-highlights'],
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Bold chunky highlight placement for high-contrast, editorial looks.',
  },

  // ─── BALAYAGE ────────────────────────────────────────────────────────────────

  {
    id: 'wella-balayage-classic',
    title: 'Classic Balayage with Blondor Freelights | Wella',
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
    id: 'redken-balayage',
    title: 'Balayage Technique | Redken Education',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Redken',
    channelUrl: 'https://www.youtube.com/@redken',
    brandSlugs: ['redken'],
    techniqueIds: ['balayage-classic'],
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Balayage freehand painting with Redken Flash Lift for a seamless gradient.',
  },
  {
    id: 'schwarzkopf-balayage',
    title: 'Balayage with BlondMe | Schwarzkopf Pro',
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
    id: 'guy-tang-balayage',
    title: 'Balayage Masterclass | Guy Tang',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Guy Tang',
    channelUrl: 'https://www.youtube.com/@GuyTang',
    brandSlugs: [],
    techniqueIds: ['balayage-classic', 'foilyage'],
    category: 'balayage',
    skillLevel: 'advanced',
    description: 'Advanced balayage and foilyage masterclass covering placement, blending, and toning.',
  },
  {
    id: 'wella-foilyage',
    title: 'Foilyage Technique | Wella Professionals',
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
    id: 'generic-shadow-root',
    title: 'Shadow Root Technique for Low Maintenance Color',
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
    id: 'pulp-riot-money-piece',
    title: 'Money Piece Color Placement | Pulp Riot',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Pulp Riot Hair',
    channelUrl: 'https://www.youtube.com/@PulpRiotHair',
    brandSlugs: ['pulp-riot'],
    techniqueIds: ['money-piece'],
    category: 'balayage',
    skillLevel: 'beginner',
    description: 'Bold money piece placement using Pulp Riot vivid colors.',
  },
  {
    id: 'generic-money-piece',
    title: 'How to Do a Money Piece',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['money-piece'],
    category: 'balayage',
    skillLevel: 'beginner',
    description: 'Step-by-step money piece highlight placement for face framing.',
  },

  // ─── LOWLIGHTS ───────────────────────────────────────────────────────────────

  {
    id: 'wella-lowlights',
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
    id: 'redken-gloss-lowlights',
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

  // ─── COLOR ───────────────────────────────────────────────────────────────────

  {
    id: 'wella-single-process',
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
    id: 'schwarzkopf-single-process',
    title: 'IGORA Royal Color Application | Schwarzkopf',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Schwarzkopf Professional',
    channelUrl: 'https://www.youtube.com/@schwarzkopfpro',
    brandSlugs: ['schwarzkopf-professional'],
    techniqueIds: ['single-process'],
    category: 'color',
    skillLevel: 'beginner',
    description: 'Single process color application using Schwarzkopf IGORA Royal.',
  },
  {
    id: 'matrix-single-process',
    title: 'SoColor Application Technique | Matrix',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Matrix Haircare',
    channelUrl: 'https://www.youtube.com/@MatrixHaircare',
    brandSlugs: ['matrix'],
    techniqueIds: ['single-process'],
    category: 'color',
    skillLevel: 'beginner',
    description: 'Single process color application using Matrix SoColor.',
  },
  {
    id: 'wella-double-process',
    title: 'Double Process Blonde | Wella Blondor',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['double-process'],
    category: 'color',
    skillLevel: 'advanced',
    description: 'Double process blonde — pre-lightening with Blondor then toning with Shinefinity.',
  },
  {
    id: 'redken-double-process',
    title: 'Double Process Blonde | Redken Flash Lift',
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
    title: 'Color Melt Technique | Guy Tang',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Guy Tang',
    channelUrl: 'https://www.youtube.com/@GuyTang',
    brandSlugs: [],
    techniqueIds: ['color-melt'],
    category: 'color',
    skillLevel: 'advanced',
    description: 'Advanced color melt technique for seamless multi-tonal results.',
  },
  {
    id: 'pulp-riot-color-melt',
    title: 'Vivid Color Melt | Pulp Riot',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Pulp Riot Hair',
    channelUrl: 'https://www.youtube.com/@PulpRiotHair',
    brandSlugs: ['pulp-riot'],
    techniqueIds: ['color-melt'],
    category: 'color',
    skillLevel: 'advanced',
    description: 'Vivid color melt using Pulp Riot semi-permanent colors.',
  },
  {
    id: 'pravana-vivid-color',
    title: 'Vivid Color Application | Pravana ChromaSilk Vivids',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'PRAVANA Color',
    channelUrl: 'https://www.youtube.com/@PRAVANAcolor',
    brandSlugs: ['pravana'],
    techniqueIds: ['color-melt', 'single-process'],
    category: 'color',
    skillLevel: 'intermediate',
    description: 'Vivid color application using Pravana ChromaSilk Vivids.',
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

  // ─── TONING ──────────────────────────────────────────────────────────────────

  {
    id: 'redken-shades-eq-toning',
    title: 'Toning with Shades EQ | Redken',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Redken',
    channelUrl: 'https://www.youtube.com/@redken',
    brandSlugs: ['redken'],
    techniqueIds: ['toning'],
    category: 'toning',
    skillLevel: 'beginner',
    description: 'How to tone highlighted and lightened hair using Redken Shades EQ gloss.',
  },
  {
    id: 'wella-shinefinity-toning',
    title: 'Toning with Shinefinity | Wella Professionals',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Wella Professionals',
    channelUrl: 'https://www.youtube.com/@WellaProfessionals',
    brandSlugs: ['wella-professionals'],
    techniqueIds: ['toning'],
    category: 'toning',
    skillLevel: 'beginner',
    description: 'Zero-lift toning with Wella Shinefinity glaze for shine and tone.',
  },
  {
    id: 'schwarzkopf-blondme-toning',
    title: 'Blonde Toning | BlondMe Toning | Schwarzkopf',
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
    title: 'Toning Techniques | Pravana',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'PRAVANA Color',
    channelUrl: 'https://www.youtube.com/@PRAVANAcolor',
    brandSlugs: ['pravana'],
    techniqueIds: ['toning'],
    category: 'toning',
    skillLevel: 'beginner',
    description: 'Toning with Pravana ChromaSilk Pastels for soft, dimensional results.',
  },

  // ─── CHEMICAL TREATMENTS ─────────────────────────────────────────────────────

  {
    id: 'generic-keratin-treatment',
    title: 'Keratin Smoothing Treatment Application',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['keratin-treatment'],
    category: 'chemical',
    skillLevel: 'intermediate',
    description: 'Step-by-step keratin smoothing treatment application and flat iron technique.',
  },
  {
    id: 'generic-relaxer',
    title: 'Chemical Relaxer Application Guide',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['relaxer'],
    category: 'chemical',
    skillLevel: 'advanced',
    description: 'Safe and effective chemical relaxer application, timing, and neutralizing.',
  },
  {
    id: 'generic-perm',
    title: 'Permanent Wave (Perm) Technique',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['perm'],
    category: 'chemical',
    skillLevel: 'intermediate',
    description: 'Rod selection, wrapping, and processing for a permanent wave.',
  },

  // ─── CUTS ────────────────────────────────────────────────────────────────────

  {
    id: 'sam-villa-blunt-cut',
    title: 'The Perfect Blunt Cut | Sam Villa',
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
    title: 'Layered Haircut Technique | Sam Villa',
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
    title: 'Texturizing and Point Cutting | Sam Villa',
    youtubeId: 'Hy3YBpFqFGk',
    channelName: 'Sam Villa Hair',
    channelUrl: 'https://www.youtube.com/@SamVillaHair',
    brandSlugs: [],
    techniqueIds: ['textured-cut'],
    category: 'cut',
    skillLevel: 'intermediate',
    description: 'Point cutting and slide cutting techniques for soft, textured ends.',
  },
  {
    id: 'sam-villa-curtain-bangs',
    title: 'How to Cut Curtain Bangs | Sam Villa',
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
    title: 'Curtain Bangs Tutorial | Brad Mondo',
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
 * carries those brands.
 */
export function getVideosForTechnique(
  techniqueId: string,
  carriedBrandSlugs: string[] = []
): TechniqueVideo[] {
  const matching = TECHNIQUE_VIDEOS.filter((v) => v.techniqueIds.includes(techniqueId));

  if (carriedBrandSlugs.length === 0) return matching;

  // Sort: brand-specific matches first, then generic
  return [...matching].sort((a, b) => {
    const aMatch = a.brandSlugs.some((s) => carriedBrandSlugs.includes(s));
    const bMatch = b.brandSlugs.some((s) => carriedBrandSlugs.includes(s));
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
    const aMatch = a.brandSlugs.some((s) => carriedBrandSlugs.includes(s));
    const bMatch = b.brandSlugs.some((s) => carriedBrandSlugs.includes(s));
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
