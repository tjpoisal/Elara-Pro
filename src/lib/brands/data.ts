/**
 * Professional hair color and care brands distributed in the United States.
 * This is the master brand/product-line catalog used during onboarding.
 */

export interface BrandSeed {
  name: string;
  slug: string;
  website: string;
  logoUrl?: string;
  lines: ProductLineSeed[];
}

export interface ProductLineSeed {
  name: string;
  slug: string;
  category: 'permanent' | 'demi_permanent' | 'semi_permanent' | 'lightener' | 'developer' | 'toner' | 'gloss' | 'additive' | 'treatment' | 'other';
  defaultMixingRatio?: string;
  defaultProcessingTime?: number;
  description?: string;
}

export const US_PROFESSIONAL_BRANDS: BrandSeed[] = [
  {
    name: 'Wella Professionals',
    slug: 'wella-professionals',
    website: 'https://www.wella.com',
    lines: [
      { name: 'Koleston Perfect', slug: 'koleston-perfect', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color with WellaPlex technology' },
      { name: 'Color Touch', slug: 'color-touch', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Demi-permanent with shine and grey blending' },
      { name: 'Illumina Color', slug: 'illumina-color', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Micro-light technology for luminous results' },
      { name: 'Shinefinity', slug: 'shinefinity', category: 'gloss', defaultMixingRatio: '1:2', defaultProcessingTime: 10, description: 'Zero-lift glaze for shine and tone' },
      { name: 'Blondor', slug: 'blondor', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Multi-blonde lightening system' },
      { name: 'Blondor Freelights', slug: 'blondor-freelights', category: 'lightener', defaultMixingRatio: '1:1', defaultProcessingTime: 50, description: 'Oil-infused lightener for balayage' },
      { name: 'Wellaplex', slug: 'wellaplex', category: 'additive', description: 'Bond strengthening additive' },
      { name: 'EIMI', slug: 'eimi', category: 'treatment', description: 'Styling and finishing line' },
    ],
  },
  {
    name: 'Redken',
    slug: 'redken',
    website: 'https://www.redken.com',
    lines: [
      { name: 'Shades EQ', slug: 'shades-eq', category: 'gloss', defaultMixingRatio: '1:1', defaultProcessingTime: 20, description: 'Acid-based demi-permanent gloss' },
      { name: 'Color Fusion', slug: 'color-fusion', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color with Amino-Amine technology' },
      { name: 'Color Gels Lacquers', slug: 'color-gels-lacquers', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent gel color' },
      { name: 'Flash Lift', slug: 'flash-lift', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'High-performance lightener up to 8 levels' },
      { name: 'Flash Lift Bonder Inside', slug: 'flash-lift-bonder', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightener with built-in bond protection' },
      { name: 'Acidic Bonding Concentrate', slug: 'abc', category: 'treatment', description: 'Bond repair treatment system' },
    ],
  },
  {
    name: 'Schwarzkopf Professional',
    slug: 'schwarzkopf-professional',
    website: 'https://www.schwarzkopf-professional.com',
    lines: [
      { name: 'IGORA Royal', slug: 'igora-royal', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Professional permanent color' },
      { name: 'IGORA Vibrance', slug: 'igora-vibrance', category: 'demi_permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 20, description: 'Demi-permanent with shine' },
      { name: 'IGORA Vario Blond', slug: 'igora-vario-blond', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Versatile lightening system' },
      { name: 'BlondMe', slug: 'blondme', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Bond-enforcing blonde system' },
      { name: 'BlondMe Toning', slug: 'blondme-toning', category: 'toner', defaultMixingRatio: '1:1', defaultProcessingTime: 20, description: 'Toning for blonde hair' },
      { name: 'Chroma ID', slug: 'chroma-id', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Bonding color mask' },
      { name: 'Fibre Clinix', slug: 'fibre-clinix', category: 'treatment', description: 'Customizable treatment system' },
    ],
  },
  {
    name: "L'Oréal Professionnel",
    slug: 'loreal-professionnel',
    website: 'https://www.lorealprofessionnel.com',
    lines: [
      { name: 'INOA', slug: 'inoa', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Oil-based ammonia-free permanent color' },
      { name: 'Majirel', slug: 'majirel', category: 'permanent', defaultMixingRatio: '1:1.5', defaultProcessingTime: 35, description: 'Classic permanent color with Ionène G' },
      { name: 'Dia Light', slug: 'dia-light', category: 'gloss', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Acidic demi-permanent gloss' },
      { name: 'Dia Richesse', slug: 'dia-richesse', category: 'demi_permanent', defaultMixingRatio: '1:1.5', defaultProcessingTime: 20, description: 'Demi-permanent with shine' },
      { name: 'Blond Studio', slug: 'blond-studio', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightening system for blondes' },
      { name: 'Platifiant', slug: 'platifiant', category: 'toner', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Neutralizing toner' },
      { name: 'Serie Expert', slug: 'serie-expert', category: 'treatment', description: 'Professional care line' },
    ],
  },
  {
    name: 'Matrix',
    slug: 'matrix',
    website: 'https://www.matrix.com',
    lines: [
      { name: 'SoColor', slug: 'socolor', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color with pre-bonding complex' },
      { name: 'ColorSync', slug: 'colorsync', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Alkaline demi-permanent' },
      { name: 'Light Master', slug: 'light-master', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'High-lift lightener' },
      { name: 'Biolage ColorBalm', slug: 'biolage-colorbalm', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Color depositing conditioner' },
      { name: 'Total Results', slug: 'total-results', category: 'treatment', description: 'Professional care line' },
    ],
  },
  {
    name: 'Kenra Professional',
    slug: 'kenra-professional',
    website: 'https://www.kenra.com',
    lines: [
      { name: 'Kenra Platinum Silkening Mist', slug: 'kenra-platinum', category: 'treatment', description: 'Platinum styling line' },
      { name: 'Kenra Color Permanent', slug: 'kenra-color-permanent', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color' },
      { name: 'Kenra Color Demi', slug: 'kenra-color-demi', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Demi-permanent color' },
      { name: 'Kenra Lightener', slug: 'kenra-lightener', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Professional lightener' },
    ],
  },
  {
    name: 'Joico',
    slug: 'joico',
    website: 'https://www.joico.com',
    lines: [
      { name: 'LumiShine', slug: 'lumishine', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color with SmartRelease technology' },
      { name: 'LumiShine Demi', slug: 'lumishine-demi', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Demi-permanent with shine' },
      { name: 'Blonde Life', slug: 'blonde-life', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Brightening lightener' },
      { name: 'Color Intensity', slug: 'color-intensity', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Vivid semi-permanent color' },
      { name: 'K-PAK', slug: 'k-pak', category: 'treatment', description: 'Reconstructing treatment line' },
    ],
  },
  {
    name: 'Pravana',
    slug: 'pravana',
    website: 'https://www.pravana.com',
    lines: [
      { name: 'ChromaSilk', slug: 'chromasilk', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color with silk and keratin' },
      { name: 'ChromaSilk Vivids', slug: 'chromasilk-vivids', category: 'semi_permanent', defaultProcessingTime: 30, description: 'Vivid direct dye colors' },
      { name: 'ChromaSilk Pastels', slug: 'chromasilk-pastels', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Pastel direct dye colors' },
      { name: 'The Perfect Blonde', slug: 'perfect-blonde', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightener with purple pigment' },
      { name: 'Nevo', slug: 'nevo', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Demi-permanent color' },
    ],
  },
  {
    name: 'Pulp Riot',
    slug: 'pulp-riot',
    website: 'https://www.pulpriot.com',
    lines: [
      { name: 'Pulp Riot Semi-Permanent', slug: 'pulp-riot-semi', category: 'semi_permanent', defaultProcessingTime: 30, description: 'Vivid semi-permanent direct dye' },
      { name: 'Pulp Riot Faction8', slug: 'faction8', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color' },
      { name: 'Pulp Riot Blank Canvas', slug: 'blank-canvas', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightener for vivid prep' },
      { name: 'Pulp Riot Toner', slug: 'pulp-riot-toner', category: 'toner', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Toning for vivid and natural results' },
    ],
  },
  {
    name: 'Olaplex',
    slug: 'olaplex',
    website: 'https://www.olaplex.com',
    lines: [
      { name: 'No.1 Bond Multiplier', slug: 'no1-bond-multiplier', category: 'additive', description: 'In-salon bond building additive' },
      { name: 'No.2 Bond Perfector', slug: 'no2-bond-perfector', category: 'treatment', description: 'In-salon bond perfecting treatment' },
      { name: 'No.3 Hair Perfector', slug: 'no3-hair-perfector', category: 'treatment', description: 'At-home bond building treatment' },
      { name: 'No.4 Bond Maintenance Shampoo', slug: 'no4-shampoo', category: 'treatment', description: 'Bond maintenance shampoo' },
      { name: 'No.5 Bond Maintenance Conditioner', slug: 'no5-conditioner', category: 'treatment', description: 'Bond maintenance conditioner' },
    ],
  },
  {
    name: 'Goldwell',
    slug: 'goldwell',
    website: 'https://www.goldwell.com',
    lines: [
      { name: 'Topchic', slug: 'topchic', category: 'permanent', defaultMixingRatio: '1:1.5', defaultProcessingTime: 35, description: 'Permanent color with Colorance technology' },
      { name: 'Colorance', slug: 'colorance', category: 'demi_permanent', defaultMixingRatio: '1:1.5', defaultProcessingTime: 20, description: 'Demi-permanent with shine' },
      { name: 'Oxycur Platin', slug: 'oxycur-platin', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Dust-free lightener' },
      { name: 'Elumen', slug: 'elumen', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Direct dye without developer' },
      { name: 'Nectaya', slug: 'nectaya', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Ammonia-free permanent color' },
      { name: 'Dualsenses', slug: 'dualsenses', category: 'treatment', description: 'Professional care line' },
    ],
  },
  {
    name: 'Paul Mitchell',
    slug: 'paul-mitchell',
    website: 'https://www.paulmitchell.com',
    lines: [
      { name: 'The Color', slug: 'the-color', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color with keratin' },
      { name: 'The Color XG', slug: 'the-color-xg', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color with extra grey coverage' },
      { name: 'Pop XG', slug: 'pop-xg', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Vivid semi-permanent' },
      { name: 'Inkworks', slug: 'inkworks', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Direct dye vivid colors' },
      { name: 'Synchro Lift', slug: 'synchro-lift', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Professional lightener' },
      { name: 'Tea Tree', slug: 'tea-tree', category: 'treatment', description: 'Tea tree care line' },
    ],
  },
  {
    name: 'Aveda',
    slug: 'aveda',
    website: 'https://www.aveda.com',
    lines: [
      { name: 'Full Spectrum', slug: 'full-spectrum', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Plant-powered permanent color' },
      { name: 'Full Spectrum Demi+', slug: 'full-spectrum-demi', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Demi-permanent with plant pigments' },
      { name: 'Blue Malva', slug: 'blue-malva', category: 'treatment', description: 'Color-enhancing shampoo' },
      { name: 'Botanical Repair', slug: 'botanical-repair', category: 'treatment', description: 'Plant-based bond repair' },
    ],
  },
  {
    name: 'Framesi',
    slug: 'framesi',
    website: 'https://www.framesi.com',
    lines: [
      { name: 'Framcolor Futura', slug: 'framcolor-futura', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color' },
      { name: 'Framcolor 2001', slug: 'framcolor-2001', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color for grey coverage' },
      { name: 'Morphosis', slug: 'morphosis', category: 'treatment', description: 'Restructuring treatment line' },
    ],
  },
  {
    name: 'Keune',
    slug: 'keune',
    website: 'https://www.keune.com',
    lines: [
      { name: 'Tinta Color', slug: 'tinta-color', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color' },
      { name: 'Tinta Color Demi', slug: 'tinta-demi', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Demi-permanent' },
      { name: 'Ultimate Blonde', slug: 'ultimate-blonde', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightening system' },
      { name: 'So Pure', slug: 'so-pure', category: 'treatment', description: 'Natural care line' },
    ],
  },
  {
    name: 'Aloxxi',
    slug: 'aloxxi',
    website: 'https://www.aloxxi.com',
    lines: [
      { name: 'Chroma 8', slug: 'chroma-8', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color' },
      { name: 'Chroma 6', slug: 'chroma-6', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Demi-permanent' },
      { name: 'Intrinsic Lightener', slug: 'intrinsic-lightener', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightener' },
    ],
  },
  {
    name: 'Oway',
    slug: 'oway',
    website: 'https://www.oway.it',
    lines: [
      { name: 'Hcolor', slug: 'hcolor', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Organic permanent color' },
      { name: 'Hbleach', slug: 'hbleach', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Organic lightener' },
      { name: 'Hgloss', slug: 'hgloss', category: 'gloss', defaultMixingRatio: '1:2', defaultProcessingTime: 15, description: 'Organic gloss' },
    ],
  },
  {
    name: 'Davines',
    slug: 'davines',
    website: 'https://www.davines.com',
    lines: [
      { name: 'A New Colour', slug: 'a-new-colour', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Sustainable permanent color' },
      { name: 'A New Gloss', slug: 'a-new-gloss', category: 'gloss', defaultMixingRatio: '1:2', defaultProcessingTime: 15, description: 'Sustainable gloss' },
      { name: 'NOUNOU', slug: 'nounou', category: 'treatment', description: 'Nourishing care line' },
      { name: 'MOMO', slug: 'momo', category: 'treatment', description: 'Moisturizing care line' },
    ],
  },
  {
    name: 'Moroccanoil',
    slug: 'moroccanoil',
    website: 'https://www.moroccanoil.com',
    lines: [
      { name: 'Moroccanoil Color', slug: 'moroccanoil-color', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Argan oil-infused permanent color' },
      { name: 'Moroccanoil Treatment', slug: 'moroccanoil-treatment', category: 'treatment', description: 'Argan oil treatment' },
      { name: 'Blonde Perfecting Purple Shampoo', slug: 'blonde-perfecting', category: 'treatment', description: 'Toning shampoo for blondes' },
    ],
  },
  {
    name: 'Bumble and bumble',
    slug: 'bumble-and-bumble',
    website: 'https://www.bumbleandbumble.com',
    lines: [
      { name: 'Color Minded', slug: 'color-minded', category: 'treatment', description: 'Color-protecting care line' },
      { name: 'Hairdresser\'s Invisible Oil', slug: 'invisible-oil', category: 'treatment', description: 'Lightweight oil treatment' },
    ],
  },
  {
    name: 'Nioxin',
    slug: 'nioxin',
    website: 'https://www.nioxin.com',
    lines: [
      { name: 'System 1', slug: 'nioxin-system-1', category: 'treatment', description: 'Natural hair, light thinning' },
      { name: 'System 2', slug: 'nioxin-system-2', category: 'treatment', description: 'Natural hair, progressed thinning' },
      { name: 'System 3', slug: 'nioxin-system-3', category: 'treatment', description: 'Color-treated hair, light thinning' },
      { name: 'System 4', slug: 'nioxin-system-4', category: 'treatment', description: 'Color-treated hair, progressed thinning' },
    ],
  },
  {
    name: 'Pureology',
    slug: 'pureology',
    website: 'https://www.pureology.com',
    lines: [
      { name: 'Hydrate', slug: 'pureology-hydrate', category: 'treatment', description: 'Hydrating care for color-treated hair' },
      { name: 'Strength Cure', slug: 'strength-cure', category: 'treatment', description: 'Strengthening care for color-treated hair' },
      { name: 'Color Fanatic', slug: 'color-fanatic', category: 'treatment', description: 'Multi-tasking leave-in treatment' },
    ],
  },
  {
    name: 'Sexy Hair',
    slug: 'sexy-hair',
    website: 'https://www.sexyhair.com',
    lines: [
      { name: 'Color Sexy Hair', slug: 'color-sexy-hair', category: 'treatment', description: 'Color-protecting care line' },
      { name: 'Healthy Sexy Hair', slug: 'healthy-sexy-hair', category: 'treatment', description: 'Strengthening care line' },
    ],
  },
  {
    name: 'Rusk',
    slug: 'rusk',
    website: 'https://www.rusk.com',
    lines: [
      { name: 'Deepshine', slug: 'deepshine', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color with argan oil' },
      { name: 'Deepshine Demi', slug: 'deepshine-demi', category: 'demi_permanent', defaultMixingRatio: '1:2', defaultProcessingTime: 20, description: 'Demi-permanent' },
      { name: 'Deepshine Lightener', slug: 'deepshine-lightener', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightener' },
    ],
  },
  {
    name: 'Tressa',
    slug: 'tressa',
    website: 'https://www.tressa.com',
    lines: [
      { name: 'Watercolors', slug: 'watercolors', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Semi-permanent color' },
      { name: 'Colourage', slug: 'colourage', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Permanent color' },
    ],
  },
  {
    name: 'Celeb Luxury',
    slug: 'celeb-luxury',
    website: 'https://www.celebluxury.com',
    lines: [
      { name: 'Viral Colorwash', slug: 'viral-colorwash', category: 'semi_permanent', defaultProcessingTime: 10, description: 'Color-depositing shampoo' },
      { name: 'Gem Lites', slug: 'gem-lites', category: 'semi_permanent', defaultProcessingTime: 20, description: 'Vivid semi-permanent' },
    ],
  },
  {
    name: 'Arctic Fox',
    slug: 'arctic-fox',
    website: 'https://www.arcticfoxhaircolor.com',
    lines: [
      { name: 'Arctic Fox Semi-Permanent', slug: 'arctic-fox-semi', category: 'semi_permanent', defaultProcessingTime: 30, description: 'Vegan semi-permanent vivid color' },
      { name: 'Bleach Please', slug: 'bleach-please', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightener kit' },
    ],
  },
  {
    name: 'Manic Panic',
    slug: 'manic-panic',
    website: 'https://www.manicpanic.com',
    lines: [
      { name: 'Classic High Voltage', slug: 'classic-high-voltage', category: 'semi_permanent', defaultProcessingTime: 30, description: 'Vegan semi-permanent vivid color' },
      { name: 'Amplified', slug: 'amplified', category: 'semi_permanent', defaultProcessingTime: 30, description: 'Long-lasting vivid color' },
    ],
  },
  {
    name: 'Overtone',
    slug: 'overtone',
    website: 'https://www.overtone.co',
    lines: [
      { name: 'Coloring Conditioner', slug: 'overtone-coloring-conditioner', category: 'semi_permanent', defaultProcessingTime: 15, description: 'Color-depositing conditioner' },
      { name: 'Daily Conditioner', slug: 'overtone-daily', category: 'treatment', description: 'Color-maintaining daily conditioner' },
    ],
  },
  {
    name: 'Kenra Color',
    slug: 'kenra-color',
    website: 'https://www.kenra.com',
    lines: [
      { name: 'Kenra Platinum Silkening Mist', slug: 'kenra-silkening', category: 'treatment', description: 'Platinum finishing mist' },
    ],
  },
  {
    name: 'Scruples',
    slug: 'scruples',
    website: 'https://www.scruples.com',
    lines: [
      { name: 'Chromatics', slug: 'chromatics', category: 'permanent', defaultMixingRatio: '1:1', defaultProcessingTime: 35, description: 'Oil-in-cream permanent color' },
      { name: 'Blazing Highlights', slug: 'blazing-highlights', category: 'lightener', defaultMixingRatio: '1:2', defaultProcessingTime: 50, description: 'Lightener for highlights' },
    ],
  },
  {
    name: 'Biolage',
    slug: 'biolage',
    website: 'https://www.biolage.com',
    lines: [
      { name: 'ColorLast', slug: 'colorlast', category: 'treatment', description: 'Color-protecting care line' },
      { name: 'HydraSource', slug: 'hydrasource', category: 'treatment', description: 'Hydrating care line' },
    ],
  },
  {
    name: 'Wella Care',
    slug: 'wella-care',
    website: 'https://www.wella.com',
    lines: [
      { name: 'Invigo Color Brilliance', slug: 'invigo-color-brilliance', category: 'treatment', description: 'Color-protecting care' },
      { name: 'Invigo Blonde Recharge', slug: 'invigo-blonde-recharge', category: 'treatment', description: 'Blonde-refreshing care' },
      { name: 'Fusion', slug: 'fusion', category: 'treatment', description: 'Intense repair treatment' },
    ],
  },
  {
    name: 'UNITE Eurotherapy',
    slug: 'unite-eurotherapy',
    website: 'https://www.unitehair.com',
    lines: [
      { name: '7SECONDS Detangler', slug: 'unite-7seconds', category: 'treatment', description: 'Leave-in detangler and conditioner' },
      { name: 'BLONDA Toning Shampoo', slug: 'unite-blonda-shampoo', category: 'treatment', description: 'Purple toning shampoo for blondes' },
      { name: 'BLONDA Toning Conditioner', slug: 'unite-blonda-conditioner', category: 'treatment', description: 'Purple toning conditioner for blondes' },
      { name: 'BLONDA Toning Gloss', slug: 'unite-blonda-gloss', category: 'gloss', defaultMixingRatio: '1:2', defaultProcessingTime: 15, description: 'Toning gloss for blonde maintenance' },
      { name: 'EUROTHERAPY Moisture Shampoo', slug: 'unite-eurotherapy-moisture', category: 'treatment', description: 'Hydrating shampoo for dry hair' },
      { name: 'EUROTHERAPY Moisture Conditioner', slug: 'unite-eurotherapy-moisture-cond', category: 'treatment', description: 'Hydrating conditioner for dry hair' },
      { name: 'GO365 Nourish & Repair', slug: 'unite-go365', category: 'treatment', description: 'Nourishing repair treatment' },
      { name: 'SMOOTH Shampoo', slug: 'unite-smooth-shampoo', category: 'treatment', description: 'Smoothing shampoo for frizz control' },
      { name: 'SMOOTH Conditioner', slug: 'unite-smooth-conditioner', category: 'treatment', description: 'Smoothing conditioner for frizz control' },
      { name: 'BOING Curl Defining Cream', slug: 'unite-boing', category: 'treatment', description: 'Curl defining and enhancing cream' },
      { name: 'TEXTURIZA Spray', slug: 'unite-texturiza', category: 'other', description: 'Texturizing spray for volume and grit' },
      { name: 'ELEVATE Thickening Shampoo', slug: 'unite-elevate', category: 'treatment', description: 'Volumizing shampoo for fine hair' },
    ],
  },
];

/** Get all brand slugs for quick lookup */
export const ALL_BRAND_SLUGS = US_PROFESSIONAL_BRANDS.map((b) => b.slug);

/** Find a brand by slug */
export function getBrandBySlug(slug: string): BrandSeed | undefined {
  return US_PROFESSIONAL_BRANDS.find((b) => b.slug === slug);
}

/** Get all color brands (exclude care-only brands) */
export function getColorBrands(): BrandSeed[] {
  return US_PROFESSIONAL_BRANDS.filter((b) =>
    b.lines.some((l) =>
      ['permanent', 'demi_permanent', 'semi_permanent', 'lightener', 'toner', 'gloss'].includes(l.category)
    )
  );
}
