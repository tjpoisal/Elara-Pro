/**
 * Elara Pro — Best Practices, Sanitation & Service Reminders
 * Comprehensive library covering every phase of a salon service.
 * Used by the ServiceReminders component and Elara AI context.
 */

export type ReminderCategory =
  | 'sanitation'
  | 'workspace'
  | 'client_protection'
  | 'chemical_prep'
  | 'application'
  | 'processing'
  | 'cleansing'
  | 'treatment'
  | 'finishing'
  | 'allergy_safety';

export type ReminderPriority = 'critical' | 'high' | 'standard';

export interface Reminder {
  id: string;
  category: ReminderCategory;
  priority: ReminderPriority;
  icon: string;
  title: string;
  detail: string;
  /** Service types this applies to — empty = all services */
  serviceTypes?: string[];
}

// ─── SANITATION ───────────────────────────────────────────────────────────────
export const SANITATION_REMINDERS: Reminder[] = [
  {
    id: 'san-01',
    category: 'sanitation',
    priority: 'critical',
    icon: '🧼',
    title: 'Wash hands before every client',
    detail: 'Wash with soap and water for at least 20 seconds before touching any client, tools, or products. Repeat after removing gloves.',
  },
  {
    id: 'san-02',
    category: 'sanitation',
    priority: 'critical',
    icon: '🧤',
    title: 'Wear gloves for all chemical services',
    detail: 'Nitrile gloves required for all color, bleach, relaxer, perm, and keratin applications. Change gloves between clients and when switching chemicals.',
  },
  {
    id: 'san-03',
    category: 'sanitation',
    priority: 'critical',
    icon: '🪒',
    title: 'Disinfect all tools between clients',
    detail: 'Combs, brushes, clips, foils, and bowls must be cleaned of all product residue then fully submerged in EPA-registered disinfectant for the manufacturer\'s required contact time (typically 10 minutes). Rinse and air dry.',
  },
  {
    id: 'san-04',
    category: 'sanitation',
    priority: 'high',
    icon: '🪑',
    title: 'Disinfect chair and cape between clients',
    detail: 'Wipe down the styling chair, headrest, armrests, and shampoo bowl with an EPA-registered disinfectant spray. Use a fresh cape or neck strip for every client — never reuse.',
  },
  {
    id: 'san-05',
    category: 'sanitation',
    priority: 'high',
    icon: '🧽',
    title: 'Clean mixing bowls immediately after use',
    detail: 'Rinse bowls and brushes immediately after mixing to prevent product from hardening. Wash with warm water and dish soap, then disinfect before next use.',
  },
  {
    id: 'san-06',
    category: 'sanitation',
    priority: 'standard',
    icon: '🗑️',
    title: 'Dispose of single-use items properly',
    detail: 'Foils, gloves, neck strips, and cotton coils are single-use only. Dispose in a covered waste bin. Never reuse foils between clients.',
  },
  {
    id: 'san-07',
    category: 'sanitation',
    priority: 'standard',
    icon: '💧',
    title: 'Flush shampoo bowl between clients',
    detail: 'Run hot water through the shampoo bowl for 30 seconds and wipe the basin, faucet, and spray nozzle with disinfectant between every client.',
  },
  {
    id: 'san-08',
    category: 'sanitation',
    priority: 'standard',
    icon: '🧴',
    title: 'Never double-dip applicator brushes',
    detail: 'Once a brush has touched hair, do not return it to the product container. Use a spatula or pour product into a separate bowl to prevent cross-contamination.',
  },
];

// ─── WORKSPACE ────────────────────────────────────────────────────────────────
export const WORKSPACE_REMINDERS: Reminder[] = [
  {
    id: 'ws-01',
    category: 'workspace',
    priority: 'high',
    icon: '✨',
    title: 'Clear and reset your station before every client',
    detail: 'Remove all products, tools, and debris from the previous service. A clean station signals professionalism and puts the guest at ease the moment they sit down.',
  },
  {
    id: 'ws-02',
    category: 'workspace',
    priority: 'high',
    icon: '🪞',
    title: 'Clean the mirror before seating your client',
    detail: 'Wipe the mirror with glass cleaner. A spotless mirror is the first thing a guest sees — it sets the tone for the entire experience.',
  },
  {
    id: 'ws-03',
    category: 'workspace',
    priority: 'standard',
    icon: '🗂️',
    title: 'Pre-stage all tools and products',
    detail: 'Set out everything you need before the client arrives: bowls, brushes, developer, color, foils, clips, timer. Searching for tools mid-service breaks the flow and feels unprofessional.',
  },
  {
    id: 'ws-04',
    category: 'workspace',
    priority: 'standard',
    icon: '🌿',
    title: 'Keep the floor swept throughout the service',
    detail: 'Sweep hair clippings immediately after cutting. A cluttered floor is a slip hazard and detracts from the guest experience.',
  },
  {
    id: 'ws-05',
    category: 'workspace',
    priority: 'standard',
    icon: '🧺',
    title: 'Keep used towels out of sight',
    detail: 'Place used towels directly into a covered hamper — never drape them over the chair or leave them on the counter. Fresh, folded towels should always be visible.',
  },
  {
    id: 'ws-06',
    category: 'workspace',
    priority: 'standard',
    icon: '💡',
    title: 'Check your lighting before color work',
    detail: 'Good lighting is non-negotiable for accurate color assessment. Ensure your station light is working and positioned to illuminate the hair without casting shadows.',
  },
  {
    id: 'ws-07',
    category: 'workspace',
    priority: 'standard',
    icon: '🎵',
    title: 'Set the ambiance intentionally',
    detail: 'Music volume should allow easy conversation. Scent from products should be managed with ventilation. The guest\'s sensory experience is part of the service.',
  },
  {
    id: 'ws-08',
    category: 'workspace',
    priority: 'high',
    icon: '📱',
    title: 'Phone away during the service',
    detail: 'Personal phone use during a client service is unprofessional. Use Elara Pro on your work device for formulas and timers — keep personal scrolling for breaks.',
  },
];

// ─── CLIENT PROTECTION ────────────────────────────────────────────────────────
export const CLIENT_PROTECTION_REMINDERS: Reminder[] = [
  {
    id: 'cp-01',
    category: 'client_protection',
    priority: 'critical',
    icon: '🛡️',
    title: 'Apply barrier cream to the hairline',
    detail: 'Apply a thin layer of petroleum jelly, Vaseline, or a dedicated barrier cream (Manic Panic Barrier Cream, Wella Skin Protection Cream) along the entire hairline, ears, and nape before any color application. This prevents staining and protects sensitive skin.',
    serviceTypes: ['color', 'highlights', 'balayage', 'color+cut', 'highlights+cut'],
  },
  {
    id: 'cp-02',
    category: 'client_protection',
    priority: 'critical',
    icon: '🧣',
    title: 'Use a color-safe cape and neck strip',
    detail: 'Always use a fresh neck strip under the cape. For color services, use a waterproof or color-resistant cape. Never let the cape touch bare skin — the neck strip is the barrier.',
    serviceTypes: ['color', 'highlights', 'balayage', 'chemical', 'color+cut', 'highlights+cut'],
  },
  {
    id: 'cp-03',
    category: 'client_protection',
    priority: 'high',
    icon: '👁️',
    title: 'Protect eyes during rinsing',
    detail: 'Instruct the client to keep eyes closed during rinsing. Use a shampoo shield or your hand to direct water away from the face. Have a damp cloth ready for any splashes.',
  },
  {
    id: 'cp-04',
    category: 'client_protection',
    priority: 'high',
    icon: '🌡️',
    title: 'Check water temperature before rinsing',
    detail: 'Always test water temperature on your wrist before directing it to the client\'s scalp. Water should be warm — never hot. Ask the client if the temperature is comfortable.',
  },
  {
    id: 'cp-05',
    category: 'client_protection',
    priority: 'high',
    icon: '🩹',
    title: 'Check for scalp abrasions before chemical services',
    detail: 'Visually inspect and gently palpate the scalp before applying any chemical. Do not proceed with color, bleach, relaxer, or perm on broken, irritated, or abraded skin.',
    serviceTypes: ['color', 'highlights', 'balayage', 'chemical', 'color+cut', 'highlights+cut'],
  },
  {
    id: 'cp-06',
    category: 'client_protection',
    priority: 'standard',
    icon: '🧻',
    title: 'Keep cotton coil at the hairline during processing',
    detail: 'After applying color, place a cotton coil along the entire hairline to catch any drips or seepage. Check and replace if saturated during processing.',
    serviceTypes: ['color', 'highlights', 'color+cut'],
  },
  {
    id: 'cp-07',
    category: 'client_protection',
    priority: 'standard',
    icon: '🪴',
    title: 'Seat client comfortably before starting',
    detail: 'Adjust chair height so you can work without straining. Ensure the client\'s neck is properly supported at the shampoo bowl. Ask about any neck or back issues before reclining.',
  },
];

// ─── CHEMICAL PREP ────────────────────────────────────────────────────────────
export const CHEMICAL_PREP_REMINDERS: Reminder[] = [
  {
    id: 'prep-01',
    category: 'chemical_prep',
    priority: 'critical',
    icon: '⚗️',
    title: 'Read the manufacturer instructions before mixing',
    detail: 'Even if you\'ve used a product hundreds of times, formulations change. Check the current mixing ratio, developer volume, and processing time on the insert or manufacturer website.',
    serviceTypes: ['color', 'highlights', 'balayage', 'chemical', 'color+cut', 'highlights+cut'],
  },
  {
    id: 'prep-02',
    category: 'chemical_prep',
    priority: 'critical',
    icon: '⚖️',
    title: 'Weigh product by grams, not volume',
    detail: 'Use a digital scale for all color mixing. Volume measurements are inaccurate — gram weights ensure consistent results and reduce waste. Tare the bowl before adding each component.',
    serviceTypes: ['color', 'highlights', 'balayage', 'color+cut', 'highlights+cut'],
  },
  {
    id: 'prep-03',
    category: 'chemical_prep',
    priority: 'critical',
    icon: '🚫',
    title: 'Never mix incompatible chemicals',
    detail: 'Do not mix bleach with permanent color, metallic dyes with peroxide, or different developer brands without testing. Check the client\'s chemical history — relaxer + bleach requires a minimum 2-week gap and strand test.',
  },
  {
    id: 'prep-04',
    category: 'chemical_prep',
    priority: 'high',
    icon: '🧪',
    title: 'Perform a strand test for new formulas',
    detail: 'Always strand test when: using a new formula, the client has unknown chemical history, doing a color correction, or lifting more than 3 levels. Process the strand test for the full recommended time.',
  },
  {
    id: 'prep-05',
    category: 'chemical_prep',
    priority: 'high',
    icon: '⏱️',
    title: 'Mix color immediately before use',
    detail: 'Color begins oxidizing the moment developer is added. Mix only what you need and apply immediately. Discard any unused mixed color — never store mixed color for later use.',
    serviceTypes: ['color', 'highlights', 'balayage', 'color+cut', 'highlights+cut'],
  },
  {
    id: 'prep-06',
    category: 'chemical_prep',
    priority: 'standard',
    icon: '🌡️',
    title: 'Use room-temperature developer',
    detail: 'Cold developer slows processing; warm developer accelerates it unpredictably. Store developer at room temperature and never microwave or heat it.',
  },
];

// ─── APPLICATION ──────────────────────────────────────────────────────────────
export const APPLICATION_REMINDERS: Reminder[] = [
  {
    id: 'app-01',
    category: 'application',
    priority: 'critical',
    icon: '📐',
    title: 'Take clean, consistent sections',
    detail: 'Precise sectioning is the foundation of even color. Use a rat-tail comb for clean parts. Inconsistent sections cause uneven saturation, hot spots, and missed areas.',
  },
  {
    id: 'app-02',
    category: 'application',
    priority: 'high',
    icon: '🖌️',
    title: 'Apply roots last on virgin hair',
    detail: 'On a full-head color, apply mid-lengths and ends first (they need more time), then apply roots in the last 10–15 minutes. Body heat accelerates root processing.',
    serviceTypes: ['color', 'color+cut'],
  },
  {
    id: 'app-03',
    category: 'application',
    priority: 'high',
    icon: '💧',
    title: 'Ensure full saturation without overloading',
    detail: 'Every strand must be coated, but excess product drips and causes scalp irritation. Use the back of the brush to press product through the section after applying.',
  },
  {
    id: 'app-04',
    category: 'application',
    priority: 'high',
    icon: '🔄',
    title: 'Work in a consistent pattern',
    detail: 'Always work in the same direction (typically nape to crown, or crown to nape) to track timing accurately. Note your start time when you begin the first section.',
  },
  {
    id: 'app-05',
    category: 'application',
    priority: 'standard',
    icon: '📏',
    title: 'Keep foil sections thin and even',
    detail: 'Foil sections should be no thicker than 1/8 inch for fine hair, 1/4 inch for medium/coarse. Thick sections don\'t lift evenly and can cause banding.',
    serviceTypes: ['highlights', 'highlights+cut'],
  },
  {
    id: 'app-06',
    category: 'application',
    priority: 'standard',
    icon: '🌊',
    title: 'Balayage: paint with the hair\'s natural fall',
    detail: 'Hold the section at its natural fall angle. Paint from mid-shaft to ends with a sweeping motion, concentrating product on the surface. Avoid painting the scalp.',
    serviceTypes: ['balayage', 'highlights+cut'],
  },
];

// ─── PROCESSING ───────────────────────────────────────────────────────────────
export const PROCESSING_REMINDERS: Reminder[] = [
  {
    id: 'proc-01',
    category: 'processing',
    priority: 'critical',
    icon: '⏰',
    title: 'Set a timer immediately after last application',
    detail: 'Start your timer the moment you finish applying the last section — not when you started. Check the hair at the midpoint and again at the recommended time. Never leave a client unattended during chemical processing.',
  },
  {
    id: 'proc-02',
    category: 'processing',
    priority: 'critical',
    icon: '👀',
    title: 'Check the scalp every 10 minutes',
    detail: 'Inspect the scalp for signs of irritation, burning, or excessive heat. Ask the client if they feel any discomfort. If the client reports burning, rinse immediately regardless of processing time.',
  },
  {
    id: 'proc-03',
    category: 'processing',
    priority: 'high',
    icon: '🌡️',
    title: 'Monitor heat application carefully',
    detail: 'Heat accelerates processing by approximately 50%. If using a dryer or heat lamp, reduce processing time accordingly and check more frequently. Never use heat with bleach on previously lightened hair.',
    serviceTypes: ['color', 'highlights', 'balayage', 'color+cut', 'highlights+cut'],
  },
  {
    id: 'proc-04',
    category: 'processing',
    priority: 'high',
    icon: '🔍',
    title: 'Strand test to check lift progress',
    detail: 'At the midpoint of processing, unwrap one foil or wipe a small section clean to check lift. The hair should be lifting evenly. If not lifting enough, do not add more time beyond the manufacturer maximum.',
    serviceTypes: ['highlights', 'balayage', 'highlights+cut'],
  },
  {
    id: 'proc-05',
    category: 'processing',
    priority: 'standard',
    icon: '🚿',
    title: 'Never exceed maximum processing time',
    detail: 'More time does not equal more lift after the developer is exhausted. Overprocessing causes breakage, not additional lightening. If the desired result isn\'t achieved, schedule a follow-up service.',
  },
];

// ─── CLEANSING & NEUTRALIZING ─────────────────────────────────────────────────
export const CLEANSING_REMINDERS: Reminder[] = [
  {
    id: 'cln-01',
    category: 'cleansing',
    priority: 'critical',
    icon: '🚿',
    title: 'Rinse thoroughly until water runs clear',
    detail: 'Incomplete rinsing leaves developer active in the hair, causing continued oxidation and potential damage. Rinse for a minimum of 3–5 minutes, working product out from roots to ends.',
  },
  {
    id: 'cln-02',
    category: 'cleansing',
    priority: 'critical',
    icon: '⚗️',
    title: 'Neutralize after relaxers and perms',
    detail: 'Apply neutralizing shampoo immediately after rinsing a relaxer or perm. Work through the hair in sections, leave for the manufacturer\'s recommended time, then rinse. Repeat the neutralizing shampoo application.',
    serviceTypes: ['chemical'],
  },
  {
    id: 'cln-03',
    category: 'cleansing',
    priority: 'high',
    icon: '🧴',
    title: 'Use a color-safe shampoo for the first wash',
    detail: 'After rinsing color, use a sulfate-free, color-safe shampoo. Avoid clarifying or chelating shampoos immediately after color — they strip the cuticle and fade color rapidly.',
    serviceTypes: ['color', 'highlights', 'balayage', 'color+cut', 'highlights+cut'],
  },
  {
    id: 'cln-04',
    category: 'cleansing',
    priority: 'high',
    icon: '🌡️',
    title: 'Finish with a cool water rinse',
    detail: 'After shampooing, rinse with cool water to close the cuticle, seal in color, and add shine. This is especially important after lightening services.',
  },
  {
    id: 'cln-05',
    category: 'cleansing',
    priority: 'standard',
    icon: '🧼',
    title: 'Remove barrier cream and stains before shampooing',
    detail: 'Wipe away barrier cream from the hairline with a damp towel before shampooing. For any color stains on skin, apply a small amount of color remover or rubbing alcohol on a cotton pad and gently wipe.',
  },
];

// ─── TREATMENTS ───────────────────────────────────────────────────────────────
export const TREATMENT_REMINDERS: Reminder[] = [
  {
    id: 'trt-01',
    category: 'treatment',
    priority: 'high',
    icon: '💊',
    title: 'Apply bond builder during lightening services',
    detail: 'Add Olaplex No.1, Wellaplex, or equivalent bond multiplier to bleach and color when lifting 3+ levels. This significantly reduces breakage and improves elasticity. Follow manufacturer dosing — more is not better.',
    serviceTypes: ['highlights', 'balayage', 'highlights+cut'],
  },
  {
    id: 'trt-02',
    category: 'treatment',
    priority: 'high',
    icon: '🫧',
    title: 'Use a protein treatment on damaged or porous hair',
    detail: 'High-porosity or damaged hair benefits from a protein treatment before color. Apply, process for 5 minutes, rinse, then proceed with color. This fills gaps in the cuticle for more even color uptake.',
  },
  {
    id: 'trt-03',
    category: 'treatment',
    priority: 'high',
    icon: '💧',
    title: 'Deep condition after every chemical service',
    detail: 'Apply a professional conditioning treatment after every color, bleach, relaxer, or perm service. Leave on for the recommended time under heat if available. This is not optional — it\'s part of the service.',
  },
  {
    id: 'trt-04',
    category: 'treatment',
    priority: 'standard',
    icon: '🌿',
    title: 'Apply a scalp treatment if irritation is present',
    detail: 'If the client\'s scalp shows redness or sensitivity after rinsing, apply a soothing scalp serum (tea tree, aloe, or brand-specific scalp treatment) before styling.',
  },
  {
    id: 'trt-05',
    category: 'treatment',
    priority: 'standard',
    icon: '✨',
    title: 'Use a gloss or toner to refine the result',
    detail: 'A clear or tinted gloss after color adds shine, neutralizes unwanted tones, and extends color longevity. Process for 5–20 minutes depending on the product. This elevates every color service.',
    serviceTypes: ['color', 'highlights', 'balayage', 'color+cut', 'highlights+cut'],
  },
];

// ─── FINISHING ────────────────────────────────────────────────────────────────
export const FINISHING_REMINDERS: Reminder[] = [
  {
    id: 'fin-01',
    category: 'finishing',
    priority: 'high',
    icon: '🌬️',
    title: 'Use heat protectant before blow-drying',
    detail: 'Apply a thermal protectant to damp hair before any heat styling. This is especially critical after chemical services. Distribute evenly from mid-lengths to ends.',
  },
  {
    id: 'fin-02',
    category: 'finishing',
    priority: 'high',
    icon: '💎',
    title: 'Finish with a shine serum or gloss spray',
    detail: 'A light shine serum or finishing spray seals the cuticle, adds luminosity, and makes color pop. Apply to dry hair, focusing on the mid-lengths and ends. Avoid the roots to prevent weighing down fine hair.',
  },
  {
    id: 'fin-03',
    category: 'finishing',
    priority: 'standard',
    icon: '🛍️',
    title: 'Recommend take-home products based on the service',
    detail: 'Every client should leave with a personalized product recommendation: color-safe shampoo, conditioner, bond maintenance (Olaplex No.3), and a heat protectant. Explain why each product supports their specific result.',
  },
  {
    id: 'fin-04',
    category: 'finishing',
    priority: 'standard',
    icon: '📅',
    title: 'Book the next appointment before the client leaves',
    detail: 'Color fades and roots grow. Book the follow-up service before the client leaves the chair — 4–6 weeks for root touch-ups, 8–12 weeks for highlights, 12–16 weeks for balayage.',
  },
  {
    id: 'fin-05',
    category: 'finishing',
    priority: 'standard',
    icon: '📸',
    title: 'Take an after photo in good lighting',
    detail: 'Photograph the finished result in natural or good artificial light. This documents your work, builds your portfolio, and gives the client a reference for their next visit.',
  },
  {
    id: 'fin-06',
    category: 'finishing',
    priority: 'standard',
    icon: '📋',
    title: 'Review home care instructions with the client',
    detail: 'Walk the client through: when to wash (wait 48–72 hours after color), water temperature (cool/lukewarm), products to use and avoid, and how to maintain their style at home.',
  },
];

// ─── ALL REMINDERS COMBINED ───────────────────────────────────────────────────
export const ALL_REMINDERS: Reminder[] = [
  ...SANITATION_REMINDERS,
  ...WORKSPACE_REMINDERS,
  ...CLIENT_PROTECTION_REMINDERS,
  ...CHEMICAL_PREP_REMINDERS,
  ...APPLICATION_REMINDERS,
  ...PROCESSING_REMINDERS,
  ...CLEANSING_REMINDERS,
  ...TREATMENT_REMINDERS,
  ...FINISHING_REMINDERS,
];

export const CATEGORY_META: Record<ReminderCategory, { label: string; icon: string; color: string }> = {
  sanitation:         { label: 'Sanitation',          icon: '🧼', color: '#4caf7d' },
  workspace:          { label: 'Workspace',            icon: '✨', color: '#5b9bd5' },
  client_protection:  { label: 'Client Protection',   icon: '🛡️', color: '#c4956a' },
  chemical_prep:      { label: 'Chemical Prep',        icon: '⚗️', color: '#e8a948' },
  application:        { label: 'Application',          icon: '🖌️', color: '#b8a9d4' },
  processing:         { label: 'Processing',           icon: '⏱️', color: '#d4a97a' },
  cleansing:          { label: 'Cleansing',            icon: '🚿', color: '#8899b8' },
  treatment:          { label: 'Treatments',           icon: '💊', color: '#4caf7d' },
  finishing:          { label: 'Finishing',            icon: '💎', color: '#c4956a' },
  allergy_safety:     { label: 'Allergy Safety',       icon: '⚠️', color: '#d94f4f' },
};

export const PRIORITY_META: Record<ReminderPriority, { label: string; color: string }> = {
  critical: { label: 'Critical',  color: '#d94f4f' },
  high:     { label: 'High',      color: '#e8a948' },
  standard: { label: 'Standard',  color: '#4caf7d' },
};

/** Get reminders relevant to a specific service type and category */
export function getRemindersFor(
  serviceType: string,
  categories?: ReminderCategory[]
): Reminder[] {
  return ALL_REMINDERS.filter((r) => {
    const matchesService = !r.serviceTypes || r.serviceTypes.includes(serviceType);
    const matchesCategory = !categories || categories.includes(r.category);
    return matchesService && matchesCategory;
  });
}

/** Get reminders in service-phase order for a given service type */
export function getServiceChecklist(serviceType: string): {
  phase: string;
  icon: string;
  reminders: Reminder[];
}[] {
  const phases: { phase: string; icon: string; categories: ReminderCategory[] }[] = [
    { phase: 'Before the Client Arrives',  icon: '🏠', categories: ['sanitation', 'workspace'] },
    { phase: 'Client Protection',          icon: '🛡️', categories: ['client_protection'] },
    { phase: 'Chemical Preparation',       icon: '⚗️', categories: ['chemical_prep'] },
    { phase: 'Application',               icon: '🖌️', categories: ['application'] },
    { phase: 'Processing',                icon: '⏱️', categories: ['processing'] },
    { phase: 'Cleansing & Neutralizing',  icon: '🚿', categories: ['cleansing'] },
    { phase: 'Treatments',                icon: '💊', categories: ['treatment'] },
    { phase: 'Finishing & Retail',        icon: '💎', categories: ['finishing'] },
  ];

  return phases
    .map(({ phase, icon, categories }) => ({
      phase,
      icon,
      reminders: getRemindersFor(serviceType, categories),
    }))
    .filter((p) => p.reminders.length > 0);
}
