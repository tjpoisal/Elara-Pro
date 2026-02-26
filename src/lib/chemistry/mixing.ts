import type { MixingResult, FormulaProduct } from './types';

/**
 * Standard mixing ratios by product type.
 * Format: "color:developer"
 */
const STANDARD_RATIOS: Record<string, [number, number]> = {
  'permanent': [1, 1],        // 1:1
  'demi_permanent': [1, 1],   // 1:1
  'lightener': [1, 2],        // 1:2
  'high_lift': [1, 2],        // 1:2
  'gloss': [1, 1],            // 1:1
  'toner': [1, 1.5],          // 1:1.5
  'clay_lightener': [1, 1],   // 1:1
};

/**
 * Parse a mixing ratio string like "1:2" into parts.
 */
export function parseMixingRatio(ratio: string): [number, number] {
  const parts = ratio.split(':').map(Number);
  if (parts.length === 2 && parts[0] !== undefined && parts[1] !== undefined && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return [parts[0], parts[1]];
  }
  return [1, 1]; // Default 1:1
}

/**
 * Calculate the total amount of formula needed based on hair length and density.
 * Returns recommended total grams of mixed formula.
 */
export function calculateTotalAmount(
  hairLength: 'short' | 'medium' | 'long' | 'extra_long',
  hairDensity: 'thin' | 'medium' | 'thick',
  isFullHead: boolean
): number {
  // Base amounts in grams for full head
  const lengthBase: Record<string, number> = {
    short: 60,
    medium: 90,
    long: 120,
    extra_long: 150,
  };

  const densityMultiplier: Record<string, number> = {
    thin: 0.75,
    medium: 1.0,
    thick: 1.35,
  };

  const base = lengthBase[hairLength] ?? 90;
  const multiplier = densityMultiplier[hairDensity] ?? 1.0;

  // Partial head (roots, highlights, etc.) uses roughly 60% of full head
  const coverage = isFullHead ? 1.0 : 0.6;

  return Math.round(base * multiplier * coverage);
}

/**
 * Calculate the mixing breakdown for a formula.
 * This is the core mixing calculation used in the formula builder.
 */
export function calculateMixing(
  products: FormulaProduct[],
  mixingRatio: string,
  totalDesiredGrams: number,
  developerCostPerGram: number
): MixingResult {
  const [colorParts, devParts] = parseMixingRatio(mixingRatio);
  const totalParts = colorParts + devParts;

  // Total grams split between color and developer
  const colorGrams = Math.round((totalDesiredGrams * colorParts) / totalParts);
  const developerGrams = totalDesiredGrams - colorGrams;

  // Calculate each product's share of the color portion
  const totalProductWeight = products.reduce((sum, p) => sum + p.amountGrams, 0);
  const scaleFactor = totalProductWeight > 0 ? colorGrams / totalProductWeight : 1;

  const productBreakdown = products.map((p) => {
    const grams = Math.round(p.amountGrams * scaleFactor * 10) / 10;
    return {
      name: `${p.productName} ${p.shade}`,
      grams,
      percentage: Math.round((grams / totalDesiredGrams) * 100),
    };
  });

  // Add developer to breakdown
  productBreakdown.push({
    name: 'Developer',
    grams: developerGrams,
    percentage: Math.round((developerGrams / totalDesiredGrams) * 100),
  });

  // Estimated cost
  const estimatedCost = developerGrams * developerCostPerGram;

  return {
    totalGrams: totalDesiredGrams,
    colorGrams,
    developerGrams,
    ratioDisplay: `${colorParts}:${devParts}`,
    productBreakdown,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
  };
}

/**
 * Calculate how much product to deduct from inventory after a service.
 * Accounts for typical waste (10% industry standard).
 */
export function calculateInventoryDeduction(
  formulaGrams: number,
  wastePercentage: number = 10
): {
  usedGrams: number;
  wasteGrams: number;
  totalDeductionGrams: number;
} {
  const wasteGrams = Math.round((formulaGrams * wastePercentage) / 100);
  return {
    usedGrams: formulaGrams,
    wasteGrams,
    totalDeductionGrams: formulaGrams + wasteGrams,
  };
}

/**
 * Calculate the cost of a formula based on product prices.
 */
export function calculateFormulaCost(
  products: Array<{
    gramsUsed: number;
    pricePerUnit: number;
    unitSizeGrams: number;
  }>
): {
  totalCost: number;
  costBreakdown: Array<{ costPerGram: number; totalCost: number }>;
} {
  const costBreakdown = products.map((p) => {
    const costPerGram = p.pricePerUnit / p.unitSizeGrams;
    const totalCost = Math.round(costPerGram * p.gramsUsed * 100) / 100;
    return { costPerGram: Math.round(costPerGram * 1000) / 1000, totalCost };
  });

  const totalCost = costBreakdown.reduce((sum, c) => sum + c.totalCost, 0);

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    costBreakdown,
  };
}

/**
 * Suggest optimal pricing for a service based on product cost and desired margin.
 */
export function calculateServicePricing(
  productCost: number,
  laborMinutes: number,
  laborRatePerHour: number,
  targetMarginPercent: number
): {
  suggestedPrice: number;
  laborCost: number;
  profitMargin: number;
  breakdown: {
    product: number;
    labor: number;
    overhead: number;
    profit: number;
  };
} {
  const laborCost = (laborMinutes / 60) * laborRatePerHour;
  const baseCost = productCost + laborCost;
  const overhead = baseCost * 0.15; // 15% overhead
  const totalCost = baseCost + overhead;
  const suggestedPrice = totalCost / (1 - targetMarginPercent / 100);
  const profit = suggestedPrice - totalCost;

  return {
    suggestedPrice: Math.round(suggestedPrice * 100) / 100,
    laborCost: Math.round(laborCost * 100) / 100,
    profitMargin: Math.round((profit / suggestedPrice) * 100),
    breakdown: {
      product: Math.round(productCost * 100) / 100,
      labor: Math.round(laborCost * 100) / 100,
      overhead: Math.round(overhead * 100) / 100,
      profit: Math.round(profit * 100) / 100,
    },
  };
}
