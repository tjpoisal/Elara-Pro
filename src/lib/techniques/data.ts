/**
 * Technique library — highlighting, color placement, and chemical service techniques
 * with skill level ratings and reference video links (YouTube).
 */

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'master';
export type TechniqueCategory = 'highlights' | 'lowlights' | 'balayage' | 'color' | 'chemical' | 'cut' | 'toning';

export interface Technique {
  id: string;
  name: string;
  category: TechniqueCategory;
  skillLevel: SkillLevel;
  description: string;
  bestFor: string[];
  placementNotes: string;
  processingNotes: string;
  videoUrl?: string; // YouTube embed URL
  videoTitle?: string;
  tags: string[];
}

export const TECHNIQUES: Technique[] = [
  // HIGHLIGHTS
  {
    id: 'foil-highlights-full',
    name: 'Full Foil Highlights',
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Traditional foil highlights placed throughout the entire head for maximum brightness and dimension.',
    bestFor: ['Clients wanting all-over brightness', 'Grey blending', 'First-time highlight clients'],
    placementNotes: 'Section hair into 4 quadrants. Work from nape to crown. Take 1/4" slices, weave or slice. Foil from root to end.',
    processingNotes: 'Check every 10 minutes. Lift to desired level before toning.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Full Foil Highlights Step-by-Step',
    tags: ['foil', 'highlights', 'full-head', 'brightness'],
  },
  {
    id: 'partial-highlights',
    name: 'Partial Highlights',
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Highlights placed only in the top and crown sections for a natural sun-kissed effect.',
    bestFor: ['Low-maintenance clients', 'Natural-looking results', 'Budget-conscious services'],
    placementNotes: 'Focus on top 2 sections (crown and top). Frame the face. Leave underneath natural.',
    processingNotes: 'Standard processing. Check at 30 minutes.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Partial Highlights Tutorial',
    tags: ['foil', 'highlights', 'partial', 'natural'],
  },
  {
    id: 'babylights',
    name: 'Babylights',
    category: 'highlights',
    skillLevel: 'intermediate',
    description: 'Very fine, delicate highlights that mimic the natural highlights of a child\'s hair. Ultra-fine weaves throughout.',
    bestFor: ['Natural-looking dimension', 'Fine hair', 'Clients wanting subtle brightness'],
    placementNotes: 'Take very thin 1/8" slices. Weave finely. Place throughout entire head. Use smaller foils.',
    processingNotes: 'Monitor closely — fine sections process faster. Check at 20 minutes.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Babylights Technique',
    tags: ['foil', 'highlights', 'fine', 'natural', 'babylights'],
  },
  {
    id: 'chunky-highlights',
    name: 'Chunky Highlights',
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Bold, wide highlight sections for a high-contrast, dramatic look.',
    bestFor: ['Bold looks', 'Clients wanting high contrast', 'Trendy styles'],
    placementNotes: 'Take wider 1/2"+ slices. Fewer sections overall. Strategic placement for maximum impact.',
    processingNotes: 'Standard processing. Wider sections may need slightly longer time.',
    tags: ['foil', 'highlights', 'bold', 'chunky', 'contrast'],
  },
  {
    id: 'face-framing',
    name: 'Face Framing Highlights',
    category: 'highlights',
    skillLevel: 'beginner',
    description: 'Highlights placed specifically around the face to brighten and frame features.',
    bestFor: ['Brightening the face', 'Low-maintenance add-on', 'Clients new to color'],
    placementNotes: 'Focus on front sections only. Take 2-4 sections on each side of the part. Blend into natural hair.',
    processingNotes: 'Standard processing. Can be done with balayage technique for softer result.',
    tags: ['highlights', 'face-framing', 'beginner', 'brightening'],
  },
  // BALAYAGE
  {
    id: 'balayage-classic',
    name: 'Classic Balayage',
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Freehand painting technique that creates a natural, sun-kissed gradient from roots to ends.',
    bestFor: ['Natural-looking color', 'Low-maintenance clients', 'Brunettes going lighter'],
    placementNotes: 'Section into 4 quadrants. Paint freehand from mid-shaft to ends, concentrating on ends. Use a board or foil for clean application. Feather the root area.',
    processingNotes: 'Open-air processing. Check every 10-15 minutes. Lift to pale yellow before toning.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Classic Balayage Tutorial',
    tags: ['balayage', 'freehand', 'natural', 'sun-kissed', 'gradient'],
  },
  {
    id: 'foilyage',
    name: 'Foilyage',
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Balayage technique wrapped in foil for more lift and a brighter result than open-air balayage.',
    bestFor: ['Clients wanting more lift', 'Darker starting levels', 'Brighter blonde results'],
    placementNotes: 'Paint balayage technique, then wrap in foil. Creates more heat and lift than open-air.',
    processingNotes: 'Check every 10 minutes. Foil creates more heat — monitor carefully.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Foilyage Step-by-Step',
    tags: ['balayage', 'foil', 'foilyage', 'lift', 'blonde'],
  },
  {
    id: 'shadow-root',
    name: 'Shadow Root',
    category: 'balayage',
    skillLevel: 'intermediate',
    description: 'Intentional darker root application that creates a seamless, natural-looking grow-out.',
    bestFor: ['Low-maintenance clients', 'Natural grow-out look', 'Adding depth to blondes'],
    placementNotes: 'Apply darker shade to roots 1-2 inches. Blend with a brush into the lighter mid-lengths. Feather the transition zone.',
    processingNotes: 'Process root color separately from lightened ends. Tone ends while root processes.',
    tags: ['shadow-root', 'balayage', 'low-maintenance', 'depth', 'root'],
  },
  {
    id: 'money-piece',
    name: 'Money Piece',
    category: 'balayage',
    skillLevel: 'beginner',
    description: 'Bold face-framing highlight sections that frame the face with a bright, contrasting color.',
    bestFor: ['Trendy looks', 'Face brightening', 'Add-on service'],
    placementNotes: 'Take 1-2 inch sections on each side of the part at the front hairline. Lighten to desired level. Can be done with foil or freehand.',
    processingNotes: 'Standard lightener processing. Tone to desired result.',
    tags: ['money-piece', 'face-framing', 'trendy', 'contrast'],
  },
  // LOWLIGHTS
  {
    id: 'lowlights-foil',
    name: 'Foil Lowlights',
    category: 'lowlights',
    skillLevel: 'beginner',
    description: 'Darker color woven into lighter hair using foils to add depth and dimension.',
    bestFor: ['Adding depth to over-highlighted hair', 'Dimension for blondes', 'Natural-looking color'],
    placementNotes: 'Weave or slice sections throughout. Apply darker shade. Alternate with highlights for dimension.',
    processingNotes: 'Process at room temperature. Check at 20 minutes. No lift needed — deposit only.',
    tags: ['lowlights', 'foil', 'depth', 'dimension'],
  },
  {
    id: 'glossing-lowlights',
    name: 'Gloss Lowlights',
    category: 'lowlights',
    skillLevel: 'beginner',
    description: 'Using a gloss or demi-permanent to add depth and tone without permanent commitment.',
    bestFor: ['Refreshing faded color', 'Adding shine', 'Toning highlights'],
    placementNotes: 'Apply gloss to selected sections or all-over. Can be used to tone highlights or add depth.',
    processingNotes: 'Process 10-20 minutes. No developer needed for some gloss products.',
    tags: ['gloss', 'lowlights', 'toning', 'shine'],
  },
  // COLOR TECHNIQUES
  {
    id: 'single-process',
    name: 'Single Process Color',
    category: 'color',
    skillLevel: 'beginner',
    description: 'All-over permanent or demi-permanent color application for full coverage or color change.',
    bestFor: ['Grey coverage', 'Color change', 'Refreshing faded color'],
    placementNotes: 'Apply root to ends for virgin hair. Roots only for retouch. Work in 4 quadrants.',
    processingNotes: 'Process 35-45 minutes for permanent. 20-30 for demi. Check grey coverage.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Single Process Color Application',
    tags: ['single-process', 'all-over', 'grey-coverage', 'permanent'],
  },
  {
    id: 'double-process',
    name: 'Double Process Blonde',
    category: 'color',
    skillLevel: 'advanced',
    description: 'Pre-lightening followed by toning to achieve platinum or high-lift blonde results.',
    bestFor: ['Platinum blonde', 'Dramatic color change', 'Dark to light transformations'],
    placementNotes: 'Step 1: Apply lightener all-over or in sections. Step 2: After rinsing, apply toner to achieve desired tone.',
    processingNotes: 'Lightener: check every 10 minutes. Do not exceed 50 minutes. Tone immediately after rinsing.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Double Process Blonde Tutorial',
    tags: ['double-process', 'platinum', 'blonde', 'lightener', 'toner'],
  },
  {
    id: 'color-melt',
    name: 'Color Melt',
    category: 'color',
    skillLevel: 'advanced',
    description: 'Seamless blending of multiple colors from root to end, creating a melted, gradient effect.',
    bestFor: ['Multi-tonal looks', 'Seamless transitions', 'Creative color'],
    placementNotes: 'Apply darkest shade at roots. Blend into mid-shade at mid-lengths. Lightest at ends. Use a brush to blend transition zones.',
    processingNotes: 'Process all shades simultaneously. Check every 10 minutes.',
    tags: ['color-melt', 'gradient', 'multi-tonal', 'creative'],
  },
  {
    id: 'toning',
    name: 'Toning / Gloss',
    category: 'toning',
    skillLevel: 'beginner',
    description: 'Applying a toner or gloss to neutralize unwanted warmth or add tone after lightening.',
    bestFor: ['After lightening services', 'Refreshing blonde', 'Adding shine and tone'],
    placementNotes: 'Apply all-over to damp hair after lightening. Ensure even saturation.',
    processingNotes: 'Process 10-20 minutes. Check tone development every 5 minutes.',
    tags: ['toner', 'gloss', 'neutralize', 'blonde', 'shine'],
  },
  // CHEMICAL TREATMENTS
  {
    id: 'keratin-treatment',
    name: 'Keratin Smoothing Treatment',
    category: 'chemical',
    skillLevel: 'intermediate',
    description: 'Protein treatment that smooths the cuticle and reduces frizz for 3-6 months.',
    bestFor: ['Frizzy hair', 'Curly hair wanting smoothness', 'Humidity protection'],
    placementNotes: 'Shampoo with clarifying shampoo. Apply treatment section by section. Blow dry. Flat iron at high heat.',
    processingNotes: 'Follow brand-specific instructions. Do not wash for 48-72 hours after.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Keratin Treatment Application',
    tags: ['keratin', 'smoothing', 'frizz', 'chemical'],
  },
  {
    id: 'relaxer',
    name: 'Chemical Relaxer',
    category: 'chemical',
    skillLevel: 'advanced',
    description: 'Permanently straightens curly or coily hair using sodium hydroxide or guanidine.',
    bestFor: ['Permanently straightening curly/coily hair', 'Manageability'],
    placementNotes: 'Apply base cream to scalp. Apply relaxer to new growth only for retouch. Work quickly and evenly.',
    processingNotes: 'Monitor every 5 minutes. Do not exceed manufacturer timing. Neutralize thoroughly.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoTitle: 'Relaxer Application Guide',
    tags: ['relaxer', 'straightening', 'chemical', 'curly'],
  },
  {
    id: 'perm',
    name: 'Permanent Wave (Perm)',
    category: 'chemical',
    skillLevel: 'intermediate',
    description: 'Chemical process that adds permanent curl or wave to straight hair.',
    bestFor: ['Adding curl/wave', 'Volume for fine hair', 'Body wave'],
    placementNotes: 'Section and wrap hair on rods. Apply waving solution. Process. Apply neutralizer.',
    processingNotes: 'Check curl development every 5 minutes. Do not over-process. Neutralize for full recommended time.',
    tags: ['perm', 'curl', 'wave', 'chemical'],
  },
  // CUT TECHNIQUES
  {
    id: 'blunt-cut',
    name: 'Blunt Cut',
    category: 'cut',
    skillLevel: 'beginner',
    description: 'Clean, straight cut with no graduation or layering. All hair falls to one length.',
    bestFor: ['Thick hair', 'Bob styles', 'Clean, polished look'],
    placementNotes: 'Section hair horizontally. Cut straight across. Use a guide line.',
    processingNotes: 'Cut on dry hair for precision. Wet for blunt bob.',
    tags: ['cut', 'blunt', 'one-length', 'bob'],
  },
  {
    id: 'layered-cut',
    name: 'Layered Cut',
    category: 'cut',
    skillLevel: 'intermediate',
    description: 'Graduated layers that add movement, volume, and texture.',
    bestFor: ['Adding movement', 'Reducing bulk', 'Long hair with shape'],
    placementNotes: 'Establish guide. Elevate sections to desired angle. Cut to guide.',
    processingNotes: 'Check balance throughout. Cross-check for evenness.',
    tags: ['cut', 'layers', 'movement', 'volume'],
  },
  {
    id: 'textured-cut',
    name: 'Textured / Point Cut',
    category: 'cut',
    skillLevel: 'intermediate',
    description: 'Cutting into the ends at an angle to create texture and remove bulk.',
    bestFor: ['Thick hair', 'Removing bulk', 'Soft, textured ends'],
    placementNotes: 'Point cut into ends at 45° angle. Slide cutting for softer texture.',
    processingNotes: 'Work on dry hair for best texture assessment.',
    tags: ['cut', 'texture', 'point-cut', 'bulk-removal'],
  },
  {
    id: 'curtain-bangs',
    name: 'Curtain Bangs',
    category: 'cut',
    skillLevel: 'intermediate',
    description: 'Center-parted bangs that frame the face and blend into layers.',
    bestFor: ['Face framing', 'Soft, romantic look', 'Versatile styling'],
    placementNotes: 'Section a triangle at the front. Part in center. Cut at an angle from center outward.',
    processingNotes: 'Cut dry for precision. Check symmetry.',
    tags: ['cut', 'bangs', 'curtain-bangs', 'face-framing'],
  },
];

/** Get techniques by category */
export function getTechniquesByCategory(category: TechniqueCategory): Technique[] {
  return TECHNIQUES.filter((t) => t.category === category);
}

/** Get techniques by skill level */
export function getTechniquesBySkillLevel(level: SkillLevel): Technique[] {
  return TECHNIQUES.filter((t) => t.skillLevel === level);
}

/** Get technique by ID */
export function getTechniqueById(id: string): Technique | undefined {
  return TECHNIQUES.find((t) => t.id === id);
}

/** Suggest techniques based on consultation data */
export function suggestTechniques(params: {
  serviceType: 'highlights' | 'balayage' | 'color' | 'chemical' | 'cut';
  currentLevel: number;
  targetLevel: number;
  stylistSkillLevel?: SkillLevel;
  hairLength?: 'short' | 'medium' | 'long';
  hairTexture?: 'fine' | 'medium' | 'coarse';
}): Technique[] {
  const { serviceType, currentLevel, targetLevel, stylistSkillLevel } = params;
  const levelsOfLift = targetLevel - currentLevel;

  let candidates = TECHNIQUES.filter((t) => t.category === serviceType);

  // Filter by skill level if specified
  if (stylistSkillLevel) {
    const skillOrder: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'master'];
    const maxIdx = skillOrder.indexOf(stylistSkillLevel);
    candidates = candidates.filter((t) => skillOrder.indexOf(t.skillLevel) <= maxIdx);
  }

  // For large lifts, suggest balayage or foilyage
  if (levelsOfLift >= 4 && serviceType === 'highlights') {
    candidates = candidates.filter((t) => t.tags.includes('foil') || t.tags.includes('balayage'));
  }

  return candidates;
}
