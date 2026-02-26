/** Hair color levels from 1 (black) to 10 (lightest blonde) */
export type HairLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Common tone families */
export type ToneFamily =
  | 'natural'
  | 'ash'
  | 'gold'
  | 'copper'
  | 'red'
  | 'violet'
  | 'blue'
  | 'green'
  | 'mahogany'
  | 'chocolate'
  | 'pearl'
  | 'beige'
  | 'smoky';

/** Developer volumes */
export type DeveloperVolume = 5 | 10 | 15 | 20 | 30 | 40;

/** Porosity levels */
export type PorosityLevel = 'low' | 'medium' | 'high';

/** Hair texture types */
export type HairTexture = 'fine' | 'medium' | 'coarse';

/** Color category of product */
export type ColorCategory =
  | 'permanent'
  | 'demi_permanent'
  | 'semi_permanent'
  | 'lightener'
  | 'toner'
  | 'gloss';

/** Underlying pigment (exposed when lifting) */
export interface UnderlyingPigment {
  level: HairLevel;
  pigmentName: string;
  hexColor: string;
  warmthIntensity: number; // 0-10 scale
  dominantWavelength: 'red' | 'orange' | 'yellow' | 'pale_yellow';
}

/** Formula zone for mixing */
export interface FormulaZone {
  zoneType: string;
  products: FormulaProduct[];
  developerVolume: DeveloperVolume;
  mixingRatio: string;
  processingTimeMinutes: number;
}

/** Product in a formula with amount */
export interface FormulaProduct {
  productName: string;
  shade: string;
  level: number;
  amountGrams: number;
  category: ColorCategory;
}

/** Result of a lift calculation */
export interface LiftResult {
  startLevel: HairLevel;
  targetLevel: HairLevel;
  levelsOfLift: number;
  requiredDeveloperVolume: DeveloperVolume;
  exposedPigment: UnderlyingPigment;
  requiresPreLightening: boolean;
  warnings: string[];
}

/** pH prediction result */
export interface PhPrediction {
  estimatedPH: number;
  category: 'acidic' | 'neutral' | 'alkaline' | 'high_alkaline';
  safetyLevel: 'safe' | 'caution' | 'warning' | 'danger';
  warnings: string[];
}

/** Porosity-adjusted timing */
export interface TimingResult {
  baseTimeMinutes: number;
  adjustedTimeMinutes: number;
  adjustmentFactor: number;
  checkIntervalMinutes: number;
  warnings: string[];
}

/** Safety check result */
export interface SafetyCheck {
  isCompatible: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  contraindications: string[];
  requiredPrecautions: string[];
}

/** Mixing calculation result */
export interface MixingResult {
  totalGrams: number;
  colorGrams: number;
  developerGrams: number;
  ratioDisplay: string;
  productBreakdown: Array<{
    name: string;
    grams: number;
    percentage: number;
  }>;
  estimatedCost: number;
}
