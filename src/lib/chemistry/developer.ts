import type { DeveloperVolume, ColorCategory } from './types';

/**
 * Developer volume specifications.
 * Hydrogen peroxide percentages are industry-standard.
 */
interface DeveloperSpec {
  volume: DeveloperVolume;
  peroxidePercentage: number;
  maxLift: number;
  primaryUse: string;
  processingTimeRange: [number, number]; // min, max in minutes
}

const DEVELOPER_SPECS: Record<DeveloperVolume, DeveloperSpec> = {
  5: {
    volume: 5,
    peroxidePercentage: 1.5,
    maxLift: 0,
    primaryUse: 'Demi-permanent processing, toning, gloss',
    processingTimeRange: [5, 20],
  },
  10: {
    volume: 10,
    peroxidePercentage: 3.0,
    maxLift: 0,
    primaryUse: 'Deposit only, gray blending, toning',
    processingTimeRange: [15, 30],
  },
  15: {
    volume: 15,
    peroxidePercentage: 4.5,
    maxLift: 1,
    primaryUse: 'Slight lift with deposit',
    processingTimeRange: [20, 35],
  },
  20: {
    volume: 20,
    peroxidePercentage: 6.0,
    maxLift: 2,
    primaryUse: 'Standard lift, gray coverage',
    processingTimeRange: [25, 45],
  },
  30: {
    volume: 30,
    peroxidePercentage: 9.0,
    maxLift: 3,
    primaryUse: 'Extra lift, lightening',
    processingTimeRange: [30, 45],
  },
  40: {
    volume: 40,
    peroxidePercentage: 12.0,
    maxLift: 4,
    primaryUse: 'Maximum lift, high-lift blondes only',
    processingTimeRange: [35, 50],
  },
};

/** Get developer specifications */
export function getDeveloperSpec(volume: DeveloperVolume): DeveloperSpec {
  return DEVELOPER_SPECS[volume];
}

/** Get all developer specifications */
export function getAllDeveloperSpecs(): DeveloperSpec[] {
  return Object.values(DEVELOPER_SPECS);
}

/**
 * Determine if a developer substitution is safe.
 * Returns warnings and whether the substitution is acceptable.
 */
export function validateDeveloperSubstitution(
  originalVolume: DeveloperVolume,
  substituteVolume: DeveloperVolume,
  colorCategory: ColorCategory
): {
  isAcceptable: boolean;
  warnings: string[];
  adjustedProcessingTime: [number, number] | null;
} {
  const warnings: string[] = [];
  const original = DEVELOPER_SPECS[originalVolume];
  const substitute = DEVELOPER_SPECS[substituteVolume];

  // Demi-permanent must use low volume
  if (colorCategory === 'demi_permanent' && substituteVolume > 10) {
    return {
      isAcceptable: false,
      warnings: ['Demi-permanent color must use 5 or 10 volume developer only.'],
      adjustedProcessingTime: null,
    };
  }

  // Semi-permanent doesn't use developer
  if (colorCategory === 'semi_permanent') {
    return {
      isAcceptable: false,
      warnings: ['Semi-permanent color does not require developer.'],
      adjustedProcessingTime: null,
    };
  }

  // Going higher volume
  if (substituteVolume > originalVolume) {
    const volumeDiff = substituteVolume - originalVolume;
    if (volumeDiff > 10) {
      warnings.push(
        `Jumping from ${originalVolume}V to ${substituteVolume}V is a significant increase. Extra caution required.`
      );
    }
    warnings.push(
      `Higher developer will increase lift. Monitor processing closely.`
    );
  }

  // Going lower volume
  if (substituteVolume < originalVolume) {
    if (originalVolume - substituteVolume > 10) {
      warnings.push(
        `Dropping from ${originalVolume}V to ${substituteVolume}V may not achieve desired lift.`
      );
    }
    warnings.push(
      'Lower developer means less lift. Color result will be warmer/darker than intended.'
    );
  }

  // 40 volume cautions
  if (substituteVolume === 40) {
    warnings.push(
      '40 volume developer: scalp sensitivity risk. Do not use on compromised or sensitive scalps.'
    );
    warnings.push('Strand test is mandatory with 40 volume developer.');
  }

  // Lightener compatibility
  if (colorCategory === 'lightener' && substituteVolume < 20) {
    warnings.push(
      'Lightener with less than 20 volume will have minimal effect.'
    );
  }

  return {
    isAcceptable: true,
    warnings,
    adjustedProcessingTime: substitute.processingTimeRange,
  };
}

/**
 * Calculate custom developer mix to achieve an intermediate volume.
 * E.g., mix 20V and 30V to get approximately 25V.
 */
export function mixDeveloperVolumes(
  volume1: DeveloperVolume,
  volume2: DeveloperVolume,
  ratio1: number,
  ratio2: number
): {
  effectiveVolume: number;
  effectivePeroxide: number;
  warnings: string[];
} {
  const spec1 = DEVELOPER_SPECS[volume1];
  const spec2 = DEVELOPER_SPECS[volume2];
  const totalRatio = ratio1 + ratio2;
  const warnings: string[] = [];

  const effectivePeroxide =
    (spec1.peroxidePercentage * ratio1 + spec2.peroxidePercentage * ratio2) /
    totalRatio;

  // Reverse-calculate approximate volume from peroxide %
  const effectiveVolume = effectivePeroxide / 0.3; // ~0.3% per volume unit

  if (Math.abs(volume1 - volume2) > 20) {
    warnings.push(
      'Mixing developers more than 20 volumes apart is not recommended.'
    );
  }

  return {
    effectiveVolume: Math.round(effectiveVolume * 10) / 10,
    effectivePeroxide: Math.round(effectivePeroxide * 100) / 100,
    warnings,
  };
}
