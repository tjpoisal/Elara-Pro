import type { HairLevel, DeveloperVolume, LiftResult } from './types';
import { getUnderlyingPigment } from './underlyingPigment';

/**
 * Maximum levels of lift achievable per developer volume.
 * This is deterministic and based on industry standards.
 */
const DEVELOPER_LIFT_MAP: Record<DeveloperVolume, number> = {
  5: 0,   // Deposit only (demi-permanent processing)
  10: 0,  // Deposit only (grey blending, toning)
  15: 1,  // Half level to 1 level of lift
  20: 2,  // 1-2 levels of lift (standard)
  30: 3,  // 2-3 levels of lift
  40: 4,  // 3-4 levels of lift (high lift blondes)
};

/**
 * Rule of 11 (for standard permanent color):
 * Natural Level + Desired Level = 11
 * The result gives you the color level to select.
 *
 * Example: Natural level 5 wanting level 8 = use a level 6 color
 * (11 - 5 = 6)
 */
export function ruleOfEleven(naturalLevel: HairLevel): number {
  return 11 - naturalLevel;
}

/**
 * Rule of 12 (for high-lift color):
 * Used when the desired result is level 9 or 10.
 * Natural Level + Desired Level should approximate 12.
 */
export function ruleOfTwelve(naturalLevel: HairLevel): number {
  return 12 - naturalLevel;
}

/**
 * Calculate the contributing pigment level for color selection.
 * This is the core rule — the level of color you should select
 * to achieve a desired result.
 *
 * @param naturalLevel - The client's natural or starting hair level
 * @param desiredLevel - The target level
 * @param useHighLift - Whether to use the rule of 12 instead of 11
 */
export function calculateContributingPigment(
  naturalLevel: HairLevel,
  desiredLevel: HairLevel,
  useHighLift = false
): number {
  const rule = useHighLift ? 12 : 11;
  return rule - naturalLevel;
}

/**
 * Determine how many levels of lift are needed.
 */
export function calculateLevelsOfLift(
  startLevel: HairLevel,
  targetLevel: HairLevel
): number {
  return Math.max(0, targetLevel - startLevel);
}

/**
 * Determine the minimum developer volume required for a given lift.
 */
export function getMinimumDeveloperVolume(
  levelsOfLift: number
): DeveloperVolume {
  if (levelsOfLift <= 0) return 10;
  if (levelsOfLift <= 1) return 20;
  if (levelsOfLift <= 2) return 20;
  if (levelsOfLift <= 3) return 30;
  return 40;
}

/**
 * Full lift calculation — the primary function for color formulation.
 * Given a start and target level, calculates everything needed.
 */
export function calculateLift(
  startLevel: HairLevel,
  targetLevel: HairLevel
): LiftResult {
  const levelsOfLift = calculateLevelsOfLift(startLevel, targetLevel);
  const requiredDeveloperVolume = getMinimumDeveloperVolume(levelsOfLift);
  const exposedPigment = getUnderlyingPigment(targetLevel);
  const warnings: string[] = [];

  // Pre-lightening needed if more than 4 levels of lift
  const requiresPreLightening = levelsOfLift > 4;

  if (requiresPreLightening) {
    warnings.push(
      `${levelsOfLift} levels of lift required. Pre-lightening is recommended before depositing color.`
    );
  }

  if (levelsOfLift > 2 && startLevel <= 4) {
    warnings.push(
      'Lifting dark hair more than 2 levels requires careful monitoring. Underlying red/orange pigments will be exposed.'
    );
  }

  if (requiredDeveloperVolume >= 40) {
    warnings.push(
      '40 volume developer should be used with extreme caution. Perform strand test first.'
    );
  }

  // Virgin hair vs. previously colored hair consideration
  if (targetLevel < startLevel) {
    warnings.push(
      'Going darker does not require lift. Use 10 or 20 volume developer for deposit.'
    );
  }

  return {
    startLevel,
    targetLevel,
    levelsOfLift,
    requiredDeveloperVolume,
    exposedPigment,
    requiresPreLightening,
    warnings,
  };
}

/**
 * Calculate the expected deposit level when going darker.
 * No lift is involved — this is pure deposit.
 */
export function calculateDeposit(
  currentLevel: HairLevel,
  colorLevel: number
): { expectedResult: number; willBeWarmer: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const expectedResult = Math.min(currentLevel, colorLevel);
  const willBeWarmer = currentLevel > colorLevel + 2;

  if (willBeWarmer) {
    warnings.push(
      'Going more than 2 levels darker may require a filler to prevent ashy/muddy results.'
    );
  }

  if (colorLevel <= 3 && currentLevel >= 7) {
    warnings.push(
      'Dramatic darkening from blonde to dark. Use a warm filler at the target level first.'
    );
  }

  return { expectedResult, willBeWarmer, warnings };
}

/**
 * Calculate gray coverage requirements.
 * Industry standard: gray/white hair is level 10 with no pigment.
 */
export function calculateGrayCoverage(
  grayPercentage: number,
  targetLevel: HairLevel,
  naturalLevel: HairLevel
): {
  needsSpecialFormulation: boolean;
  recommendedBaseRatio: number;
  developerVolume: DeveloperVolume;
  processingTimeBoost: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  let recommendedBaseRatio = 0; // percentage of natural base shade to add
  let developerVolume: DeveloperVolume = 20;
  let processingTimeBoost = 0;

  if (grayPercentage <= 25) {
    recommendedBaseRatio = 0;
  } else if (grayPercentage <= 50) {
    recommendedBaseRatio = 25;
    warnings.push('25% natural base shade recommended for even coverage.');
  } else if (grayPercentage <= 75) {
    recommendedBaseRatio = 50;
    developerVolume = 20;
    processingTimeBoost = 5;
    warnings.push(
      '50% natural base shade recommended. Consider 5 extra minutes processing.'
    );
  } else {
    recommendedBaseRatio = 75;
    developerVolume = 20;
    processingTimeBoost = 10;
    warnings.push(
      '75%+ gray requires strong base ratio. Add 10 minutes processing time.'
    );
  }

  // Resistant gray needs higher developer
  if (grayPercentage > 50) {
    warnings.push(
      'Resistant gray may need 20 volume minimum. Do not use demi-permanent for full coverage.'
    );
  }

  return {
    needsSpecialFormulation: grayPercentage > 25,
    recommendedBaseRatio,
    developerVolume,
    processingTimeBoost,
    warnings,
  };
}
