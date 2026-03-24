import Anthropic from '@anthropic-ai/sdk';

const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const MODEL = 'claude-sonnet-4-6' as const;

export type ProductLineCategory =
  | 'permanent'
  | 'demi_permanent'
  | 'semi_permanent'
  | 'lightener'
  | 'developer'
  | 'toner'
  | 'gloss'
  | 'additive'
  | 'treatment'
  | 'other';

export interface DiscoveredProductLine {
  name: string;
  slug: string;
  category: ProductLineCategory;
  defaultMixingRatio?: string;
  defaultProcessingTime?: number;
  description: string;
  phRange?: string;
}

export interface DiscoveredBrand {
  name: string;
  slug: string;
  website: string;
  description: string;
  distributedInUS: boolean;
  professionalOnly: boolean;
  lines: DiscoveredProductLine[];
  confidence: number; // 0–1, how confident Claude is in the data
  sources: string[];  // URLs or references Claude used
  notes: string;      // anything the stylist should know
}

/**
 * Ask Claude to research a hair brand it doesn't know about in the catalog.
 * Uses Claude's training knowledge — no live web search.
 * Returns structured brand + product line data ready to insert into the DB.
 */
export async function discoverBrand(brandName: string): Promise<DiscoveredBrand> {
  const client = getClient();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are an expert in professional hair color and care products. A stylist has asked about a brand called "${brandName}" that is not yet in our database.

Research everything you know about this brand and return ONLY valid JSON matching this exact schema. Be as thorough as possible with product lines — include every line you know about.

{
  "name": "Official brand name",
  "slug": "url-safe-lowercase-slug",
  "website": "https://official-website.com",
  "description": "1-2 sentence brand overview",
  "distributedInUS": true or false,
  "professionalOnly": true or false (salon-only vs retail),
  "lines": [
    {
      "name": "Product Line Name",
      "slug": "product-line-slug",
      "category": one of: "permanent" | "demi_permanent" | "semi_permanent" | "lightener" | "developer" | "toner" | "gloss" | "additive" | "treatment" | "other",
      "defaultMixingRatio": "1:1" or "1:2" etc (omit if not applicable),
      "defaultProcessingTime": number in minutes (omit if not applicable),
      "description": "What this line does",
      "phRange": "pH range if known (omit if unknown)"
    }
  ],
  "confidence": 0.0 to 1.0 (how confident you are in this data),
  "sources": ["any reference URLs or sources you know of"],
  "notes": "Anything important a stylist should know — availability, discontinued lines, special techniques, etc."
}

If you have no knowledge of this brand, return:
{
  "name": "${brandName}",
  "slug": "",
  "website": "",
  "description": "",
  "distributedInUS": false,
  "professionalOnly": false,
  "lines": [],
  "confidence": 0,
  "sources": [],
  "notes": "No information found for this brand. It may be very new, regional, or not a professional hair brand."
}`,
      },
    ],
  });

  const textContent = response.content.find((c) => c.type === 'text');
  if (!textContent || textContent.type !== 'text') {
    throw new Error('No response from Claude');
  }

  // Strip markdown code fences if present
  const raw = textContent.text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();

  try {
    return JSON.parse(raw) as DiscoveredBrand;
  } catch {
    throw new Error(`Failed to parse brand discovery response: ${raw.slice(0, 200)}`);
  }
}

/**
 * Generate a slug from a brand name.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
