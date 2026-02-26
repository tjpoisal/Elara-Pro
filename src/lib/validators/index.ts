import { z } from 'zod/v4';

// Auth
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  salonName: z.string().min(1).max(255),
});

// Client
export const createClientSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.email().optional(),
  phone: z.string().max(30).optional(),
  naturalLevel: z.number().int().min(1).max(10).optional(),
  naturalTone: z.string().max(50).optional(),
  grayPercentage: z.number().int().min(0).max(100).optional(),
  hairTexture: z.enum(['fine', 'medium', 'coarse']).optional(),
  hairDensity: z.enum(['thin', 'medium', 'thick']).optional(),
  hairPorosity: z.enum(['low', 'medium', 'high']).optional(),
  scalpCondition: z.string().max(100).optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

// Consultation
export const createConsultationSchema = z.object({
  clientId: z.string().uuid(),
  rawNotes: z.string().optional(),
  currentLevel: z.number().int().min(1).max(10).optional(),
  currentTone: z.string().max(50).optional(),
  targetLevel: z.number().int().min(1).max(10).optional(),
  targetTone: z.string().max(50).optional(),
  grayPercentage: z.number().int().min(0).max(100).optional(),
  scalpCondition: z.string().max(100).optional(),
  hairCondition: z.string().max(100).optional(),
  porosityLevel: z.enum(['low', 'medium', 'high']).optional(),
  previousChemical: z.string().optional(),
  desiredResult: z.string().optional(),
});

// Formula
export const createFormulaSchema = z.object({
  consultationId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  zones: z.array(
    z.object({
      zoneType: z.enum([
        'roots', 'midshaft', 'ends', 'full_head', 'highlights',
        'lowlights', 'balayage', 'gloss', 'toner', 'custom',
      ]),
      zoneName: z.string().max(100).optional(),
      developerVolume: z.number().int().optional(),
      mixingRatio: z.string().max(20).optional(),
      processingTime: z.number().int().optional(),
      heatRequired: z.boolean().optional(),
      applicationMethod: z.string().max(100).optional(),
      products: z.array(
        z.object({
          productId: z.string().uuid(),
          amountGrams: z.number().positive(),
        })
      ),
    })
  ),
  notes: z.string().optional(),
  isTemplate: z.boolean().optional(),
});

// Inventory
export const inventoryAdjustSchema = z.object({
  inventoryItemId: z.string().uuid(),
  amountGrams: z.number(),
  usageType: z.enum(['service', 'waste', 'restock', 'adjustment', 'expired']),
  notes: z.string().optional(),
  serviceId: z.string().uuid().optional(),
});

export const barcodeLookupSchema = z.object({
  upc: z.string().min(8).max(14),
});

// Service
export const createServiceSchema = z.object({
  clientId: z.string().uuid(),
  formulaId: z.string().uuid().optional(),
  serviceType: z.string().min(1).max(100),
  scheduledAt: z.string().datetime().optional(),
  price: z.number().positive().optional(),
  notes: z.string().optional(),
});

// Timer
export const createTimerSchema = z.object({
  serviceId: z.string().uuid(),
  label: z.string().min(1).max(255),
  durationSeconds: z.number().int().positive(),
  alertAtSeconds: z.number().int().positive().optional(),
});

// Patch Test
export const createPatchTestSchema = z.object({
  clientId: z.string().uuid(),
  productsTested: z.array(z.string()),
  applicationSite: z.string().min(1).max(100),
  checkAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
  notes: z.string().optional(),
});

// AI
export const parseNotesSchema = z.object({
  rawNotes: z.string().min(1).max(5000),
});

// Voice
export const voiceLogSchema = z.object({
  transcription: z.string(),
  durationSeconds: z.number().int().optional(),
  wakeWord: z.string().max(50).optional(),
});

// Billing
export const createCheckoutSchema = z.object({
  tier: z.enum(['pro', 'elite', 'salon']),
  billingPeriod: z.enum(['monthly', 'annual']),
});

// Settings
export const updateSettingsSchema = z.object({
  salonName: z.string().min(1).max(255).optional(),
  address: z.string().optional(),
  phone: z.string().max(30).optional(),
  email: z.email().optional(),
  website: z.string().max(255).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;
export type CreateFormulaInput = z.infer<typeof createFormulaSchema>;
export type InventoryAdjustInput = z.infer<typeof inventoryAdjustSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type ParseNotesInput = z.infer<typeof parseNotesSchema>;
