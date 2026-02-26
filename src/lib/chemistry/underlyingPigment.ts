import type { HairLevel, UnderlyingPigment } from './types';

/**
 * Underlying Pigment Map
 *
 * When hair is lightened, the melanin is broken down in a specific order,
 * exposing underlying warm pigments. This map is industry-standard and
 * 100% deterministic — it never changes and must never be AI-generated.
 *
 * Level 1-3: Red pigments dominate
 * Level 4-5: Red-orange pigments
 * Level 6-7: Orange-yellow pigments
 * Level 8-10: Yellow to pale yellow pigments
 */
const UNDERLYING_PIGMENT_MAP: Record<HairLevel, UnderlyingPigment> = {
  1: {
    level: 1,
    pigmentName: 'Deep Red',
    hexColor: '#2D0A0A',
    warmthIntensity: 10,
    dominantWavelength: 'red',
  },
  2: {
    level: 2,
    pigmentName: 'Red',
    hexColor: '#5C1A1A',
    warmthIntensity: 9,
    dominantWavelength: 'red',
  },
  3: {
    level: 3,
    pigmentName: 'Red-Orange',
    hexColor: '#8B2500',
    warmthIntensity: 8,
    dominantWavelength: 'red',
  },
  4: {
    level: 4,
    pigmentName: 'Orange-Red',
    hexColor: '#B33A00',
    warmthIntensity: 7,
    dominantWavelength: 'orange',
  },
  5: {
    level: 5,
    pigmentName: 'Orange',
    hexColor: '#CC5500',
    warmthIntensity: 6,
    dominantWavelength: 'orange',
  },
  6: {
    level: 6,
    pigmentName: 'Orange-Yellow',
    hexColor: '#E07020',
    warmthIntensity: 5,
    dominantWavelength: 'orange',
  },
  7: {
    level: 7,
    pigmentName: 'Yellow-Orange',
    hexColor: '#F0A030',
    warmthIntensity: 4,
    dominantWavelength: 'yellow',
  },
  8: {
    level: 8,
    pigmentName: 'Yellow',
    hexColor: '#F5C040',
    warmthIntensity: 3,
    dominantWavelength: 'yellow',
  },
  9: {
    level: 9,
    pigmentName: 'Light Yellow',
    hexColor: '#F8D860',
    warmthIntensity: 2,
    dominantWavelength: 'pale_yellow',
  },
  10: {
    level: 10,
    pigmentName: 'Pale Yellow',
    hexColor: '#FBE8A0',
    warmthIntensity: 1,
    dominantWavelength: 'pale_yellow',
  },
};

/** Get the underlying pigment exposed at a given hair level */
export function getUnderlyingPigment(level: HairLevel): UnderlyingPigment {
  return UNDERLYING_PIGMENT_MAP[level];
}

/** Get all underlying pigments (for UI display) */
export function getAllUnderlyingPigments(): UnderlyingPigment[] {
  return Object.values(UNDERLYING_PIGMENT_MAP);
}

/**
 * Determine what pigments will be exposed when lifting from startLevel to targetLevel.
 * Returns the pigment at the target level (what you'll see after lifting).
 */
export function getExposedPigmentAfterLift(
  startLevel: HairLevel,
  targetLevel: HairLevel
): UnderlyingPigment | null {
  if (targetLevel <= startLevel) return null;
  return UNDERLYING_PIGMENT_MAP[targetLevel];
}

/**
 * Get the warmth that needs to be neutralized when lifting to a target level.
 * Higher values mean more warm pigment to counteract.
 */
export function getWarmthToNeutralize(targetLevel: HairLevel): number {
  return UNDERLYING_PIGMENT_MAP[targetLevel].warmthIntensity;
}

/**
 * Suggest neutralizing tones based on the exposed underlying pigment.
 * This is pure color theory — warm pigments are neutralized by their complements.
 */
export function suggestNeutralizingTone(
  exposedPigment: UnderlyingPigment
): string[] {
  switch (exposedPigment.dominantWavelength) {
    case 'red':
      return ['green', 'ash', 'blue-green'];
    case 'orange':
      return ['blue', 'ash-blue', 'violet-blue'];
    case 'yellow':
      return ['violet', 'blue-violet', 'ash'];
    case 'pale_yellow':
      return ['violet', 'pearl', 'silver'];
  }
}
