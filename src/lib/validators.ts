/**
 * Zod validation schemas for all API routes.
 */
import { z } from 'zod/v4';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  salonName: z.string().min(1).max(255),
  phone: z.string().max(30).optional(),
  licenseNumber: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ─── Clients ──────────────────────────────────────────────────────────────────

export const createClientSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().max(30).optional(),
  naturalLevel: z.number().int().min(1).max(10).optional(),
  naturalTone: z.string().max(50).optional(),
  grayPercentage: z.number().int().min(0).max(100).optional(),
  hairTexture: z.string().max(50).optional(),
  hairDensity: z.string().max(50).optional(),
  hairPorosity: z.enum(['low', 'normal', 'high']).optional(),
  scalpCondition: z.string().max(100).optional(),
  allergies: z.string().optional(),
  notes: z.string().optional(),
});

// ─── Consultations ────────────────────────────────────────────────────────────

export const createConsultationSchema = z.object({
  clientId: z.string().uuid().optional(),
  rawNotes: z.string().optional(),
  currentLevel: z.number().int().min(1).max(10).optional(),
  currentTone: z.string().max(50).optional(),
  targetLevel: z.number().int().min(1).max(10).optional(),
  targetTone: z.string().max(50).optional(),
  grayPercentage: z.number().int().min(0).max(100).optional(),
  scalpCondition: z.string().max(100).optional(),
  hairCondition: z.string().max(100).optional(),
  porosityLevel: z.enum(['low', 'normal', 'high']).optional(),
  previousChemical: z.string().optional(),
  desiredResult: z.string().optional(),
});

export const parseNotesSchema = z.object({
  rawNotes: z.string().min(1),
});

// ─── Formulas ─────────────────────────────────────────────────────────────────

const formulaProductSchema = z.object({
  productId: z.string().uuid(),
  amountGrams: z.number().positive(),
});

const formulaZoneSchema = z.object({
  zoneType: z.enum(['roots', 'midshaft', 'ends', 'full_head', 'highlights', 'lowlights', 'balayage', 'gloss', 'toner', 'custom']),
  zoneName: z.string().max(100).optional(),
  developerVolume: z.number().int().optional(),
  mixingRatio: z.string().max(20).optional(),
  processingTime: z.number().int().optional(),
  heatRequired: z.boolean().optional(),
  applicationMethod: z.string().max(100).optional(),
  products: z.array(formulaProductSchema),
});

export const createFormulaSchema = z.object({
  name: z.string().min(1).max(255),
  consultationId: z.string().uuid().optional(),
  clientId: z.string().uuid().optional(),
  notes: z.string().optional(),
  isTemplate: z.boolean().optional(),
  zones: z.array(formulaZoneSchema).min(1),
});

// ─── Inventory ────────────────────────────────────────────────────────────────

export const inventoryAdjustSchema = z.object({
  inventoryItemId: z.string().uuid(),
  amountGrams: z.number().positive(),
  usageType: z.enum(['service', 'waste', 'expired', 'restock', 'adjustment']),
  serviceId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export const barcodeLookupSchema = z.object({
  upc: z.string().min(8).max(14),
});

// ─── Voice ────────────────────────────────────────────────────────────────────

export const voiceLogSchema = z.object({
  transcription: z.string().optional(),
  durationSeconds: z.number().int().optional(),
  wakeWord: z.string().max(50).optional(),
  parsedIntent: z.record(z.string(), z.unknown()).optional(),
  actionTaken: z.string().max(255).optional(),
});

// ─── Stripe ───────────────────────────────────────────────────────────────────

export const createCheckoutSchema = z.object({
  tier: z.string().min(1),
  billingPeriod: z.enum(['monthly', 'annual']),
});
