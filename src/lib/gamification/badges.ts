/**
 * Badge definitions and award logic.
 * Call checkAndAwardBadges() after any action that might unlock one.
 */
import { db } from '@/lib/db';
import { badges, userBadges, xpEvents, stylistXp } from '@/lib/db/schema';
import { eq, and, count, sql } from 'drizzle-orm';
import { awardXp } from './xp';

export interface BadgeDef {
  slug: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: string;
  xpReward: number;
  criteria: { type: string; threshold: number };
}

export const BADGE_DEFINITIONS: BadgeDef[] = [
  // Formula badges
  { slug: 'first_formula',      name: 'First Mix',          icon: '🧪', tier: 'bronze',   category: 'formula',  xpReward: 50,  description: 'Created your first formula.',                criteria: { type: 'formulas_created', threshold: 1 } },
  { slug: 'formula_10',         name: 'Color Chemist',       icon: '⚗️',  tier: 'silver',   category: 'formula',  xpReward: 100, description: 'Created 10 formulas.',                       criteria: { type: 'formulas_created', threshold: 10 } },
  { slug: 'formula_50',         name: 'Master Formulator',   icon: '🏆', tier: 'gold',     category: 'formula',  xpReward: 250, description: 'Created 50 formulas.',                       criteria: { type: 'formulas_created', threshold: 50 } },
  { slug: 'formula_100',        name: 'Color Architect',     icon: '💎', tier: 'platinum', category: 'formula',  xpReward: 500, description: 'Created 100 formulas.',                      criteria: { type: 'formulas_created', threshold: 100 } },
  // Client badges
  { slug: 'first_client',       name: 'First Client',        icon: '👤', tier: 'bronze',   category: 'client',   xpReward: 50,  description: 'Added your first client.',                   criteria: { type: 'clients_added', threshold: 1 } },
  { slug: 'client_10',          name: 'Growing Clientele',   icon: '👥', tier: 'silver',   category: 'client',   xpReward: 100, description: 'Added 10 clients.',                          criteria: { type: 'clients_added', threshold: 10 } },
  { slug: 'client_50',          name: 'Salon Star',          icon: '⭐', tier: 'gold',     category: 'client',   xpReward: 300, description: 'Added 50 clients.',                          criteria: { type: 'clients_added', threshold: 50 } },
  // Safety badges
  { slug: 'patch_test_pro',     name: 'Safety First',        icon: '🛡️',  tier: 'silver',   category: 'safety',   xpReward: 150, description: 'Recorded 10 patch tests.',                   criteria: { type: 'patch_tests', threshold: 10 } },
  { slug: 'consent_champion',   name: 'Consent Champion',    icon: '✍️',  tier: 'bronze',   category: 'safety',   xpReward: 75,  description: 'Collected 5 digital consent forms.',         criteria: { type: 'consents_signed', threshold: 5 } },
  // Streak badges
  { slug: 'streak_7',           name: 'Week Warrior',        icon: '🔥', tier: 'bronze',   category: 'streak',   xpReward: 75,  description: '7-day activity streak.',                     criteria: { type: 'streak', threshold: 7 } },
  { slug: 'streak_30',          name: 'Monthly Maven',       icon: '🌟', tier: 'gold',     category: 'streak',   xpReward: 200, description: '30-day activity streak.',                    criteria: { type: 'streak', threshold: 30 } },
  { slug: 'streak_100',         name: 'Unstoppable',         icon: '💫', tier: 'diamond',  category: 'streak',   xpReward: 750, description: '100-day activity streak.',                   criteria: { type: 'streak', threshold: 100 } },
  // School / CEU
  { slug: 'first_ceu',          name: 'Lifelong Learner',    icon: '📚', tier: 'bronze',   category: 'school',   xpReward: 60,  description: 'Logged your first CEU credit.',              criteria: { type: 'ceu_logged', threshold: 1 } },
  { slug: 'ceu_10',             name: 'Education Advocate',  icon: '🎓', tier: 'gold',     category: 'school',   xpReward: 300, description: 'Logged 10 CEU credits.',                     criteria: { type: 'ceu_logged', threshold: 10 } },
  // Brand discovery
  { slug: 'brand_hunter',       name: 'Brand Hunter',        icon: '🔍', tier: 'silver',   category: 'formula',  xpReward: 100, description: 'Discovered a new brand via Elara.',          criteria: { type: 'brands_discovered', threshold: 1 } },
  // Level milestones
  { slug: 'level_5',            name: 'Rising Colorist',     icon: '🌱', tier: 'bronze',   category: 'level',    xpReward: 0,   description: 'Reached level 5.',                           criteria: { type: 'level', threshold: 5 } },
  { slug: 'level_10',           name: 'Color Pro',           icon: '🎨', tier: 'silver',   category: 'level',    xpReward: 0,   description: 'Reached level 10.',                          criteria: { type: 'level', threshold: 10 } },
  { slug: 'level_25',           name: 'Master Colorist',     icon: '👑', tier: 'gold',     category: 'level',    xpReward: 0,   description: 'Reached level 25.',                          criteria: { type: 'level', threshold: 25 } },
  { slug: 'level_50',           name: 'Color Legend',        icon: '🏅', tier: 'diamond',  category: 'level',    xpReward: 0,   description: 'Reached level 50.',                          criteria: { type: 'level', threshold: 50 } }