import type { ColorCategory, SafetyCheck } from './types';

/**
 * Known incompatible chemical combinations in hair coloring.
 * These are ABSOLUTE rules that must never be overridden.
 */
const INCOMPATIBLE_COMBINATIONS: Array<{
  chemicals: [string, string];
  reason: string;
  riskLevel: SafetyCheck['riskLevel'];
}> = [
  {
    chemicals: ['metallic_salt_dye', 'permanent_color'],
    reason:
      'Metallic salts react violently with hydrogen peroxide. Can cause hair breakage, melting, and scalp burns.',
    riskLevel: 'critical',
  },
  {
    chemicals: ['metallic_salt_dye', 'lightener'],
    reason:
      'Metallic salts + bleach reaction can generate extreme heat and destroy hair.',
    riskLevel: 'critical',
  },
  {
    chemicals: ['henna_compound', 'permanent_color'],
    reason:
      'Compound henna (contains metallic salts) is incompatible with oxidative color. Pure henna may be compatible but requires strand test.',
    riskLevel: 'high',
  },
  {
    chemicals: ['relaxer', 'lightener'],
    reason:
      'Relaxed hair is chemically compromised. Lightening over relaxer can cause severe breakage.',
    riskLevel: 'high',
  },
  {
    chemicals: ['keratin_treatment', 'lightener'],
    reason:
      'Recent keratin treatment may react unpredictably with lightener. Wait minimum 2 weeks.',
    riskLevel: 'medium',
  },
];

/**
 * Check chemical compatibility between products/services.
 */
export function checkChemicalCompatibility(
  existingChemicals: string[],
  proposedService: string
): SafetyCheck {
  const warnings: string[] = [];
  const contraindications: string[] = [];
  const requiredPrecautions: string[] = [];
  let worstRiskLevel: SafetyCheck['riskLevel'] = 'none';
  let isCompatible = true;

  const riskOrder: SafetyCheck['riskLevel'][] = [
    'none',
    'low',
    'medium',
    'high',
    'critical',
  ];

  for (const combo of INCOMPATIBLE_COMBINATIONS) {
    const [chem1, chem2] = combo.chemicals;
    const hasConflict =
      (existingChemicals.includes(chem1) && proposedService === chem2) ||
      (existingChemicals.includes(chem2) && proposedService === chem1);

    if (hasConflict) {
      warnings.push(combo.reason);
      contraindications.push(
        `${chem1} + ${chem2}: ${combo.riskLevel} risk`
      );

      if (
        riskOrder.indexOf(combo.riskLevel) >
        riskOrder.indexOf(worstRiskLevel)
      ) {
        worstRiskLevel = combo.riskLevel;
      }

      if (combo.riskLevel === 'critical' || combo.riskLevel === 'high') {
        isCompatible = false;
      }
    }
  }

  // Standard precautions for all color services
  requiredPrecautions.push('Perform patch test 48 hours before service');
  requiredPrecautions.push('Check for scalp irritation before applying product');
  requiredPrecautions.push('Wear gloves throughout the service');

  if (proposedService === 'lightener') {
    requiredPrecautions.push('Apply scalp protector before lightener application');
    requiredPrecautions.push('Do not apply lightener to irritated or broken skin');
  }

  return {
    isCompatible,
    riskLevel: worstRiskLevel,
    warnings,
    contraindications,
    requiredPrecautions,
  };
}

/**
 * Validate that a patch test is current and valid.
 */
export function validatePatchTest(
  patchTestDate: Date | null,
  serviceDateDate: Date,
  patchTestResult: string | null
): {
  isValid: boolean;
  canProceed: boolean;
  message: string;
} {
  if (!patchTestDate || !patchTestResult) {
    return {
      isValid: false,
      canProceed: false,
      message: 'No patch test on record. A 48-hour patch test is required before service.',
    };
  }

  const hoursSincePatch =
    (serviceDateDate.getTime() - patchTestDate.getTime()) / (1000 * 60 * 60);

  if (hoursSincePatch < 48) {
    return {
      isValid: false,
      canProceed: false,
      message: `Patch test performed ${Math.round(hoursSincePatch)} hours ago. Must wait full 48 hours.`,
    };
  }

  // Patch tests expire after 6 months (industry standard)
  const daysSincePatch = hoursSincePatch / 24;
  if (daysSincePatch > 180) {
    return {
      isValid: false,
      canProceed: false,
      message: 'Patch test expired (over 6 months old). New patch test required.',
    };
  }

  if (patchTestResult === 'negative') {
    return {
      isValid: true,
      canProceed: true,
      message: 'Patch test valid and negative. Safe to proceed.',
    };
  }

  if (
    patchTestResult === 'mild_reaction' ||
    patchTestResult === 'moderate_reaction'
  ) {
    return {
      isValid: true,
      canProceed: false,
      message: `Patch test showed ${patchTestResult.replace('_', ' ')}. Do NOT proceed with this product.`,
    };
  }

  return {
    isValid: true,
    canProceed: false,
    message: 'Patch test showed reaction. Service cannot proceed with this product.',
  };
}

/**
 * Check exposure limits for chemical safety logging.
 * Based on OSHA guidelines for salon chemicals.
 */
export function checkExposureLimits(
  chemicalName: string,
  durationMinutes: number,
  hasVentilation: boolean,
  hasGloves: boolean
): {
  withinLimits: boolean;
  recommendations: string[];
  urgency: 'ok' | 'caution' | 'warning' | 'immediate_action';
} {
  const recommendations: string[] = [];
  let urgency: 'ok' | 'caution' | 'warning' | 'immediate_action' = 'ok';

  // General exposure time limits
  if (durationMinutes > 240) {
    urgency = 'warning';
    recommendations.push(
      'Extended chemical exposure (4+ hours). Take a 15-minute break in fresh air.'
    );
  } else if (durationMinutes > 120) {
    urgency = 'caution';
    recommendations.push(
      'Consider a short break for fresh air after 2 hours of chemical work.'
    );
  }

  if (!hasVentilation) {
    urgency = urgency === 'ok' ? 'caution' : urgency;
    recommendations.push(
      'Ensure adequate ventilation. Open windows or use exhaust fans.'
    );
  }

  if (!hasGloves) {
    urgency = 'warning';
    recommendations.push(
      'Always wear nitrile gloves when handling hair color chemicals.'
    );
  }

  // Lightener/bleach-specific
  if (
    chemicalName.toLowerCase().includes('lightener') ||
    chemicalName.toLowerCase().includes('bleach')
  ) {
    if (durationMinutes > 60 && !hasVentilation) {
      urgency = 'warning';
      recommendations.push(
        'Lightener dust exposure without ventilation — risk of respiratory irritation.'
      );
    }
  }

  const isWithinLimits = urgency === 'ok' || urgency === 'caution' || urgency === 'warning';

  return {
    withinLimits: isWithinLimits,
    recommendations,
    urgency,
  };
}
