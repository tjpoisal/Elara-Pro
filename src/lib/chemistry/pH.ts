import type { ColorCategory, DeveloperVolume, PhPrediction } from './types';

/**
 * Typical pH ranges for hair color product categories.
 * These are industry-standard ranges based on product chemistry.
 */
const PRODUCT_PH_RANGES: Record<ColorCategory, [number, number]> = {
  permanent: [9.0, 11.0],
  demi_permanent: [6.5, 8.5],
  semi_permanent: [3.5, 5.5],
  lightener: [8.5, 10.5],
  toner: [6.0, 8.0],
  gloss: [3.0, 5.0],
};

/**
 * Developer pH values by volume.
 * Higher volume = higher pH (more alkaline).
 */
const DEVELOPER_PH: Record<DeveloperVolume, number> = {
  5: 3.0,
  10: 3.5,
  15: 3.5,
  20: 3.8,
  30: 4.0,
  40: 4.2,
};

/**
 * When color and developer mix, the pH reaches an intermediate value.
 * This is a simplified but accurate model for salon use.
 */
export function predictMixedPH(
  colorCategory: ColorCategory,
  developerVolume: DeveloperVolume,
  mixingRatioColor: number,
  mixingRatioDeveloper: number
): PhPrediction {
  const warnings: string[] = [];
  const colorPHRange = PRODUCT_PH_RANGES[colorCategory];
  const developerPH = DEVELOPER_PH[developerVolume];

  // Use midpoint of the color pH range as estimate
  const colorPH = (colorPHRange[0] + colorPHRange[1]) / 2;

  // Weighted average based on mixing ratio
  const totalParts = mixingRatioColor + mixingRatioDeveloper;
  const estimatedPH =
    (colorPH * mixingRatioColor + developerPH * mixingRatioDeveloper) /
    totalParts;

  // Round to 1 decimal
  const roundedPH = Math.round(estimatedPH * 10) / 10;

  // Categorize
  let category: PhPrediction['category'];
  let safetyLevel: PhPrediction['safetyLevel'];

  if (roundedPH < 4.5) {
    category = 'acidic';
    safetyLevel = 'safe';
  } else if (roundedPH < 7.0) {
    category = 'neutral';
    safetyLevel = 'safe';
  } else if (roundedPH < 9.5) {
    category = 'alkaline';
    safetyLevel = 'caution';
    warnings.push('Alkaline pH — cuticle will be opened. Ensure proper aftercare.');
  } else {
    category = 'high_alkaline';
    safetyLevel = roundedPH > 11 ? 'danger' : 'warning';
    warnings.push(
      'High alkaline pH — significant cuticle swelling. Monitor processing time closely.'
    );
    if (roundedPH > 11) {
      warnings.push(
        'pH above 11 carries risk of chemical damage. Do not exceed maximum processing time.'
      );
    }
  }

  // Specific warnings
  if (colorCategory === 'permanent' && developerVolume >= 30) {
    warnings.push(
      'Permanent color with high-volume developer creates highly alkaline mixture. Scalp protection recommended.'
    );
  }

  if (colorCategory === 'lightener' && developerVolume >= 40) {
    warnings.push(
      'Lightener with 40 volume: maximum alkalinity. Frequent strand checks required.'
    );
  }

  return {
    estimatedPH: roundedPH,
    category,
    safetyLevel,
    warnings,
  };
}

/**
 * Get the pH range for a product category.
 */
export function getProductPHRange(
  category: ColorCategory
): { min: number; max: number } {
  const range = PRODUCT_PH_RANGES[category];
  return { min: range[0], max: range[1] };
}

/**
 * Determine if a post-treatment is needed based on the service pH.
 * Hair's natural pH is 4.5-5.5. Services above pH 7 need acidifying treatment.
 */
export function recommendPostTreatment(servicePH: number): {
  needsTreatment: boolean;
  treatmentType: string;
  urgency: 'optional' | 'recommended' | 'required';
} {
  if (servicePH <= 5.5) {
    return {
      needsTreatment: false,
      treatmentType: 'None required — pH within natural range',
      urgency: 'optional',
    };
  }

  if (servicePH <= 7.5) {
    return {
      needsTreatment: true,
      treatmentType: 'Acidifying rinse or conditioner to restore pH balance',
      urgency: 'recommended',
    };
  }

  return {
    needsTreatment: true,
    treatmentType:
      'Acid-based bond repair treatment required. Follow with pH-balancing conditioner.',
    urgency: 'required',
  };
}
