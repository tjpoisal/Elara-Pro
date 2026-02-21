import type { PorosityLevel, HairTexture, TimingResult, ColorCategory } from './types';

/**
 * Porosity adjustment factors for processing time.
 *
 * Low porosity: Cuticle is tight — color takes longer to penetrate.
 * Medium porosity: Normal — standard timing.
 * High porosity: Cuticle is open — color absorbs quickly, may process faster.
 */
const POROSITY_TIME_FACTORS: Record<PorosityLevel, number> = {
  low: 1.2,    // 20% longer processing
  medium: 1.0, // Standard timing
  high: 0.75,  // 25% shorter processing
};

/**
 * Texture adjustment factors.
 * Fine hair processes faster, coarse hair processes slower.
 */
const TEXTURE_TIME_FACTORS: Record<HairTexture, number> = {
  fine: 0.85,   // 15% faster
  medium: 1.0,  // Standard
  coarse: 1.15, // 15% slower
};

/**
 * Check interval recommendations based on porosity.
 * Higher porosity needs more frequent checks.
 */
const CHECK_INTERVALS: Record<PorosityLevel, number> = {
  low: 10,    // Check every 10 minutes
  medium: 10, // Check every 10 minutes
  high: 5,    // Check every 5 minutes (processes fast)
};

/**
 * Calculate porosity-adjusted processing time.
 */
export function calculateAdjustedTiming(
  baseTimeMinutes: number,
  porosity: PorosityLevel,
  texture: HairTexture,
  colorCategory: ColorCategory
): TimingResult {
  const warnings: string[] = [];
  const porosityFactor = POROSITY_TIME_FACTORS[porosity];
  const textureFactor = TEXTURE_TIME_FACTORS[texture];

  // Combined adjustment
  let adjustmentFactor = porosityFactor * textureFactor;

  // Category-specific overrides
  if (colorCategory === 'semi_permanent') {
    // Semi-permanent is gentler, less variation needed
    adjustmentFactor = 1 + (adjustmentFactor - 1) * 0.5;
  }

  if (colorCategory === 'lightener') {
    // Lightener on high porosity is risky — reduce time more aggressively
    if (porosity === 'high') {
      adjustmentFactor = 0.65;
      warnings.push(
        'High porosity + lightener: significant risk of over-processing. Monitor every 5 minutes.'
      );
    }
  }

  const adjustedTime = Math.round(baseTimeMinutes * adjustmentFactor);
  const checkInterval = CHECK_INTERVALS[porosity];

  // Safety warnings
  if (porosity === 'high') {
    warnings.push(
      'High porosity hair absorbs color quickly. Check results early and often.'
    );
    if (texture === 'fine') {
      warnings.push(
        'Fine + high porosity: very fast processing. Risk of over-saturation.'
      );
    }
  }

  if (porosity === 'low') {
    warnings.push(
      'Low porosity hair may need heat or longer processing for even results.'
    );
    if (texture === 'coarse') {
      warnings.push(
        'Coarse + low porosity: most resistant combination. Consider applying heat cap.'
      );
    }
  }

  // Maximum processing time safety cap
  const maxTime = getMaxProcessingTime(colorCategory);
  if (adjustedTime > maxTime) {
    warnings.push(
      `Adjusted time exceeds maximum safe processing time of ${maxTime} minutes. Capped at maximum.`
    );
  }

  return {
    baseTimeMinutes,
    adjustedTimeMinutes: Math.min(adjustedTime, maxTime),
    adjustmentFactor: Math.round(adjustmentFactor * 100) / 100,
    checkIntervalMinutes: checkInterval,
    warnings,
  };
}

/**
 * Maximum safe processing times by category.
 * NEVER exceed these — deterministic safety limits.
 */
function getMaxProcessingTime(category: ColorCategory): number {
  switch (category) {
    case 'permanent':
      return 45;
    case 'demi_permanent':
      return 30;
    case 'semi_permanent':
      return 30;
    case 'lightener':
      return 50;
    case 'toner':
      return 20;
    case 'gloss':
      return 20;
  }
}

/**
 * Determine porosity level from a strand test description.
 * Float test: drop hair in water.
 */
export function assessPorosityFromTest(
  floatTimeSeconds: number
): PorosityLevel {
  if (floatTimeSeconds > 120) return 'low'; // Still floating after 2 min
  if (floatTimeSeconds > 30) return 'medium'; // Sinks slowly
  return 'high'; // Sinks quickly
}

/**
 * Get preparation recommendations based on porosity.
 */
export function getPorosityPreparation(porosity: PorosityLevel): {
  preparation: string[];
  applicationTips: string[];
} {
  switch (porosity) {
    case 'low':
      return {
        preparation: [
          'Use a clarifying shampoo before service to remove buildup',
          'Apply light heat during processing (processing cap)',
          'Consider a porosity equalizer spray before color application',
        ],
        applicationTips: [
          'Apply to most resistant areas first',
          'Use a slightly warmer mixture temperature',
          'Ensure full saturation of product',
        ],
      };
    case 'medium':
      return {
        preparation: [
          'Standard preparation — shampoo if needed',
          'No special pre-treatment required',
        ],
        applicationTips: [
          'Standard application technique',
          'Apply root to ends for virgin applications',
        ],
      };
    case 'high':
      return {
        preparation: [
          'Apply protein filler or porosity equalizer before color',
          'Avoid clarifying — hair already absorbs readily',
          'Consider a bond-building pre-treatment',
        ],
        applicationTips: [
          'Apply to least porous areas first (usually roots)',
          'Use a lighter hand — less product needed',
          'Monitor for rapid color development',
          'Consider reducing developer volume by one step',
        ],
      };
  }
}
