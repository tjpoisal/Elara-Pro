/**
 * POST /api/chat
 * Body: { messages: ChatMessage[]; context?: ElaraContext }
 *
 * Elara chat endpoint. Handles multi-turn conversation and
 * auto-triggers brand discovery when Elara detects an unknown brand.
 */
import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { chatWithElara, type ChatMessage, type ElaraContext } from '@/lib/ai/elara';
import { db } from '@/lib/db';
import { brands, productLines, salons } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { discoverBrand, slugify } from '@/lib/ai/brandDiscovery';
import { US_PROFESSIONAL_BRANDS } from '@/lib/brands/data';

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  let messages: ChatMessage[];
  let context: ElaraContext | undefined;

  try {
    const body = await request.json();
    messages = body.messages ?? [];
    context = body.context;
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  if (!messages.length) return errorResponse('messages array is required', 400);

  // Check trial / subscription status for AI access
  const [salon] = await db
    .select({ trialEndsAt: salons.trialEndsAt, subscriptionStatus: salons.subscriptionStatus, subscriptionTier: salons.subscriptionTier })
    .from(salons)
    .where(eq(salons.id, auth.salonId))
    .limit(1);

  if (salon) {
    const inTrial = salon.trialEndsAt && new Date(salon.trialEndsAt) > new Date();
    const isActive = salon.subscriptionStatus === 'active' || salon.subscriptionStatus === 'trialing';
    if (!inTrial && !isActive) {
      return errorResponse('Your free trial has ended. Upgrade to continue using Elara.', 402);
    }
  }

  try {
    const { reply, action } = await chatWithElara({ messages, context });

    // Handle embedded actions from Elara's response
    let actionResult: Record<string, unknown> | null = null;

    if (action?.action === 'discover_brand' && action.brandName) {
      const brandName = action.brandName;
      const candidateSlug = slugify(brandName);

      // Check static catalog
      const inStatic = US_PROFESSIONAL_BRANDS.find(
        (b) => b.slug === candidateSlug || b.name.toLowerCase() === brandName.toLowerCase()
      );

      if (inStatic) {
        actionResult = { type: 'brand_found', source: 'catalog', brand: inStatic };
      } else {
        // Check DB
        const [existing] = await db.select().from(brands).where(eq(brands.slug, candidateSlug)).limit(1);
        if (existing) {
          const lines = await db.select().from(productLines).where(eq(productLines.brandId, existing.id));
          actionResult = { type: 'brand_found', source: 'database', brand: { ...existing, lines } };
        } else {
          // Discover and save to global catalog
          try {
            const discovered = await discoverBrand(brandName);
            if (discovered.confidence >= 0.3 && discovered.lines.length > 0) {
              const slug = discovered.slug || slugify(discovered.name);
              const inserted = await db
                .insert(brands)
                .values({
                  name: discovered.name, slug,
                  website: discovered.website || null, logoUrl: null, isActive: true,
                  source: 'ai_discovered',
                  discoveredBySalonId: auth.salonId,
                  aiConfidence: String(discovered.confidence),
                  aiNotes: discovered.notes || null,
                })
                .onConflictDoNothing()
                .returning({ id: brands.id });

              if (inserted.length > 0 && inserted[0]) {
                await db.insert(productLines).values(
                  discovered.lines.map((line) => ({
                    brandId: inserted[0]!.id,
                    name: line.name,
                    slug: line.slug || slugify(line.name),
                    category: line.category,
                    defaultMixingRatio: line.defaultMixingRatio ?? null,
                    defaultProcessingTime: line.defaultProcessingTime ?? null,
                    phRange: line.phRange ?? null,
                    description: line.description ?? null,
                    isActive: true,
                  }))
                );
              }
              actionResult = {
                type: 'brand_discovered',
                source: 'ai',
                brand: discovered,
                savedToGlobalCatalog: inserted.length > 0,
              };
            } else {
              actionResult = { type: 'brand_not_found', brandName };
            }
          } catch {
            actionResult = { type: 'brand_discovery_failed', brandName };
          }
        }
      }
    }

    return jsonResponse({ reply, action, actionResult });
  } catch (err) {
    console.error('Elara chat error:', err);
    return errorResponse('Elara is unavailable right now. Please try again.', 500);
  }
}
