/**
 * Hair color chemistry knowledge base.
 * Sourced from: Milady Standard Cosmetology, cosmetic chemistry literature,
 * brand technical education materials.
 * Each entry becomes one searchable chunk in the vector DB.
 */
export const CHEMISTRY_KNOWLEDGE = [
  {
    title: 'Hair Color Levels — The Level System',
    category: 'chemistry',
    source: 'milady',
    content: `The level system is a numerical scale from 1 to 10 used to identify the lightness or darkness of a hair color. Level 1 is the darkest (black) and level 10 is the lightest (lightest blonde). Each level represents one unit of lift or deposit. The natural hair color level is determined by the amount of melanin present. Eumelanin produces brown and black tones; pheomelanin produces red and yellow tones. Most natural hair contains both types in varying ratios.`,
    metadata: { chapter: 'Color Theory', topic: 'level_system' },
  },
  {
    title: 'Developer Volumes and Lift',
    category: 'chemistry',
    source: 'milady',
    content: `Developer (hydrogen peroxide) volumes determine the degree of lift and color deposit:
- 10 Volume (3%): Deposit only, no lift. Used for toning, glossing, refreshing color, gray coverage on resistant hair with permanent color.
- 20 Volume (6%): 1-2 levels of lift. Standard for gray coverage, color-on-color, most permanent color applications.
- 30 Volume (9%): 2-3 levels of lift. Used for lightening dark hair, high-lift color.
- 40 Volume (12%): 3-4 levels of lift. Maximum lift with permanent color. Not recommended for scalp applications on sensitive scalps.
- 50 Volume (15%): Used only with bleach/lightener, never with permanent color. Risk of scalp damage.
Higher volumes increase processing speed and lift but also increase damage risk. Always match developer volume to the desired result and hair condition.`,
    metadata: { chapter: 'Developer Chemistry', topic: 'developer_volumes' },
  },
  {
    title: 'Underlying Pigment — Exposed Pigment Chart',
    category: 'chemistry',
    source: 'milady',
    content: `When hair is lightened, it passes through a series of underlying pigment stages. Understanding these is critical for color correction and achieving target tones:
- Level 1-2 (Black): Underlying pigment = Black/Blue-Black
- Level 3 (Dark Brown): Underlying pigment = Brown
- Level 4 (Medium Brown): Underlying pigment = Red-Brown
- Level 5 (Light Brown): Underlying pigment = Red
- Level 6 (Dark Blonde): Underlying pigment = Red-Orange
- Level 7 (Medium Blonde): Underlying pigment = Orange
- Level 8 (Light Blonde): Underlying pigment = Yellow-Orange
- Level 9 (Very Light Blonde): Underlying pigment = Yellow
- Level 10 (Lightest Blonde): Underlying pigment = Pale Yellow
To neutralize unwanted warmth, use the complementary color on the color wheel: violet neutralizes yellow, blue neutralizes orange, green neutralizes red.`,
    metadata: { chapter: 'Color Correction', topic: 'underlying_pigment' },
  },
  {
    title: 'Rule of 11 and Rule of 12 — Developer Selection',
    category: 'chemistry',
    source: 'milady',
    content: `The Rule of 11 (for permanent color) and Rule of 12 (for high-lift color) help determine the correct developer volume:
Rule of 11: Target level + Developer volume level = 11. Example: lifting from level 5 to level 8 requires 3 levels of lift. 8 + 3 = 11, so use 30 volume developer.
Rule of 12: Used with high-lift color. Target level + Developer = 12. High-lift colors require 40 volume developer and extended processing time (up to 60 minutes).
These rules apply to permanent oxidative color only. They do not apply to bleach/lightener, which has its own lift capacity based on formulation.`,
    metadata: { chapter: 'Developer Selection', topic: 'rule_of_11_12' },
  },
  {
    title: 'Hair Porosity and Color Processing',
    category: 'chemistry',
    source: 'milady',
    content: `Porosity refers to the hair's ability to absorb and retain moisture and chemicals. It directly affects color processing time and results:
- Low Porosity: Cuticle is tightly closed. Color takes longer to penetrate, may process unevenly. Solution: use slightly higher developer, add heat, or use a pre-softener.
- Medium Porosity: Normal cuticle condition. Color processes predictably at standard times.
- High Porosity: Cuticle is raised or damaged. Color absorbs quickly but fades fast. Solution: use lower developer, reduce processing time, add a protein filler before color, use bond builders.
Chemical history (bleach, relaxer, keratin) increases porosity. Always assess porosity before formulating. High-porosity hair on ends is common — apply color to roots first, then pull through to ends in the last 5-10 minutes.`,
    metadata: { chapter: 'Hair Assessment', topic: 'porosity' },
  },
  {
    title: 'Gray Hair Coverage — Formulation Principles',
    category: 'chemistry',
    source: 'milady',
    content: `Gray hair lacks melanin and has a different cuticle structure, making it resistant to color penetration. Key principles:
- 0-25% gray: Standard permanent color formula works. No special adjustment needed.
- 25-50% gray: Add 10-15% natural/neutral base shade to the formula for better coverage.
- 50-75% gray: Use 50% natural base + 50% target shade. Consider 20 volume developer minimum.
- 75-100% gray (resistant): Use 100% natural base for first application, or a pre-softener. Some stylists use a 1:1 mix of natural base and target shade.
Resistant gray often has a hard, glassy cuticle. Pre-softening with 10 volume developer for 5-10 minutes before color application dramatically improves coverage. Always use permanent color (not demi) for full gray coverage.`,
    metadata: { chapter: 'Gray Coverage', topic: 'gray_formulation' },
  },
  {
    title: 'pH Scale and Hair Chemistry',
    category: 'chemistry',
    source: 'milady',
    content: `The pH scale runs from 0 (most acidic) to 14 (most alkaline). Hair and scalp have a natural pH of 4.5-5.5 (slightly acidic). Understanding pH is critical for chemical services:
- Permanent color: pH 9-11 (alkaline). Opens cuticle for color penetration.
- Developer (H2O2): pH 3-4 (acidic). Activates oxidation.
- Mixed color: pH 7-9. Alkaline enough to lift and deposit.
- Toners/glosses: pH 5-7. Slightly acidic to deposit without lift.
- Shampoo: pH 4.5-5.5 (color-safe) or 7-8 (clarifying).
- Conditioner: pH 3-4. Closes cuticle, seals color.
After any chemical service, use an acidic rinse or low-pH conditioner to close the cuticle and lock in color. Avoid alkaline shampoos which strip color and raise the cuticle.`,
    metadata: { chapter: 'pH Chemistry', topic: 'ph_scale' },
  },
  {
    title: 'Bleach and Lightener Chemistry',
    category: 'chemistry',
    source: 'milady',
    content: `Bleach (lightener) works by oxidizing melanin molecules, breaking them down and removing color. Key facts:
- Bleach contains persulfate salts (ammonium, potassium, or sodium persulfate) as boosters.
- Mixed with developer, it creates a highly alkaline, oxidizing environment (pH 9-11).
- Lift capacity: On-scalp bleach with 20vol = 3-4 levels. Off-scalp with 40vol = 5-7 levels.
- Processing time: 20-50 minutes depending on starting level, target, and heat.
- Bond damage: Bleach breaks disulfide bonds in the cortex. Bond builders (Olaplex, Wellaplex, FIBREPLEX) protect these bonds during processing.
- Never use 50 volume developer with bleach on scalp — risk of chemical burns.
- Bleach on previously bleached hair: Use lower developer (10-20vol), shorter time, always strand test.
- Bleach on relaxed hair: Minimum 2-week gap. High breakage risk. Strand test mandatory.`,
    metadata: { chapter: 'Lightener Chemistry', topic: 'bleach' },
  },
  {
    title: 'Bond Builders — Olaplex, Wellaplex, FIBREPLEX',
    category: 'chemistry',
    source: 'elara_internal',
    content: `Bond builders protect and rebuild disulfide bonds broken during chemical services. They are not conditioning treatments — they work at the molecular level.
Olaplex: Active ingredient bis-aminopropyl diglycol dimaleate. No.1 Bond Multiplier added to bleach/color in-salon. No.2 Bond Perfector applied after rinsing. No.3 Hair Perfector is take-home maintenance.
Wellaplex: Two-step in-salon system. No.1 Bond Maker added to color/bleach. No.2 Bond Sealer applied after rinsing.
FIBREPLEX (Schwarzkopf): Maleic acid-based. Step 1 added to color. Step 2 applied after rinsing.
Dosing: Follow manufacturer instructions exactly — more is not better. Olaplex No.1 is typically 3-4 pumps per 60g of bleach.
When to use: Any lightening service, color correction, bleach on previously chemically treated hair, high-lift color. Recommended for all bleach services regardless of hair condition.`,
    metadata: { topic: 'bond_builders', brands: ['olaplex', 'wella', 'schwarzkopf'] },
  },
  {
    title: 'Color Correction Principles',
    category: 'chemistry',
    source: 'milady',
    content: `Color correction requires understanding color theory, underlying pigment, and the current state of the hair. Key principles:
1. Fill before you lift: If hair is over-lightened and you want to go darker, you must fill the hair with the missing underlying pigment first. Use a filler in the missing pigment color (e.g., orange/red filler for level 6-7 target).
2. Neutralize before you tone: Remove unwanted warmth with a toner or gloss before applying target color.
3. Never go more than 2 levels darker in one session on bleached hair — it will look flat and muddy.
4. Color does not lift color: Permanent color cannot lighten previously colored hair. Only bleach can lift artificial pigment.
5. The 50% rule: When mixing a toner, use 50% target shade + 50% neutral/natural to avoid over-toning.
6. Strand test always: Color correction is unpredictable. Always strand test before full application.`,
    metadata: { chapter: 'Color Correction', topic: 'correction_principles' },
  },
  {
    title: 'Mixing Ratios — Standard Formulation',
    category: 'chemistry',
    source: 'elara_internal',
    content: `Standard mixing ratios for professional hair color:
- Permanent color (most brands): 1:1 (color:developer) by weight. Example: 60g color + 60g developer = 120g total.
- High-lift color: 1:2 (color:developer). Example: 60g color + 120g developer.
- Bleach/lightener: 1:1.5 to 1:2 (bleach:developer) depending on consistency desired. Thicker for on-scalp, thinner for off-scalp.
- Demi-permanent/gloss: 1:1.5 to 1:2 (color:developer) with low-volume developer (5-10vol).
- Toner: 1:2 (toner:developer) with 10-20vol developer.
Always weigh by grams, not volume. A digital scale is essential for accurate formulation. Tare the bowl before adding each component. Mixing ratios affect processing time, lift, and deposit — deviating from manufacturer specs can cause unpredictable results.`,
    metadata: { topic: 'mixing_ratios' },
  },
];
