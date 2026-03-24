import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { brands, productLines } from '@/lib/db/schema';
import { eq, sql } from 'drizzle-orm';
import { discoverBrand, slugify } from '@/lib/ai/brandDiscovery';
import { US_PROFESSIONAL_BRANDS } from '@/lib/brands/data';

/**
 * POST /api/brands/discover
 * Body: { brandName: string }
 *
 * Discovers an unknown brand via Claude and saves it to the GLOBAL catalog —
 * available to every salon on the platform, not just the requesting user.
 *
 * Flow:
 * 1. Check static seed catalog
 * 2. Check DB (already discovered by any user previously)
 * 3. Ask Claude to research the brand
 * 4. Upsert into global brands + product_lines tables
 * 5. Return result with clear "global catalog" messaging
 */
export async function POST(request: NextRequest) {
  // Any authenticated user can trigger a global catalog addition
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  let brandName: string;
  try {
    const body = await request.json();
    brandName = (body.brandName ?? '').trim();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  if (!brandName) return errorResponse('brandName is required', 400);

  const candidateSlug = slugify(brandName);

  // 1. Check static seed catalog — already available to everyone
  const inStatic = US_PROFESSIONAL_BRANDS.find(
    (b) =>
      b.slug === candidateSlug ||
      b.name.toLowerCase() === brandName.toLowerCase()
  );
  if (inStatic) {
    return jsonResponse({
      found: true,
      source: 'catalog',
      saved: false,
      brand: inStatic,
      message: `${inStatic.name} is already in the Elara Pro global catalog with ${inStatic.lines.length} product lines — available to all stylists.`,
    });
  }

  // 2. Check DB — may have been discovered by a different salon already
  const [existingInDb] = await db
    .select()
    .from(brands)
    .where(eq(brands.slug, candidateSlug))
    .limit(1);

  if (existingInDb) {
    const lines = await db
      .select()
      .from(productLines)
      .where(eq(productLines.brandId, existingInDb.id));

    return jsonResponse({
      found: true,
      source: 'database',
      saved: false,
      brand: { ...existingInDb, lines },
      message: `${existingInDb.name} was already added to the global catalog${existingInDb.source === 'ai_discovered' ? ' by another stylist' : ''} — it's available to everyone on Elara Pro.`,
    });
  }

  // 3. Ask Claude to research the brand
  let discovered;
  try {
    discovered = await discoverBrand(brandName);
  } catch (err) {
    return errorResponse(
      `Brand research failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      500
    );
  }

  // 4. Not enough info to save
  if (discovered.confidence === 0 || discovered.lines.length === 0) {
    return jsonResponse({
      found: false,
      source: 'ai',
      saved: false,
      brand: discovered,
      message: `I couldn't find reliable information about "${brandName}". It may be a very new brand, regional, or not a professional hair product. You can request a manual addition via Settings → Brands.`,
    });
  }

  // 5. Save to global catalog (upsert — handles race condition if two users discover simultaneously)
  const slug = discovered.slug || slugify(discovered.name);
  let savedId: string | null = null;
  let linesSaved = 0;

  if (discovered.confidence >= 0.3) {
    try {
      // ON CONFLICT DO NOTHING handles concurrent requests for the same brand
      const inserted = await db
        .insert(brands)
        .values({
          name: discovered.name,
          slug,
          website: discovered.website || null,
          logoUrl: null,
          isActive: true,
          source: 'ai_discovered',
          discoveredBySalonId: auth.salonId,
          aiConfidence: String(discovered.confidence),
          aiNotes: discovered.notes || null,
        })
        .onConflictDoNothing()
        .returning({ id: brands.id });

      if (inserted.length > 0 && inserted[0]) {
        // We won the race — insert product lines
        savedId = inserted[0].id;

        if (discovered.lines.length > 0) {
          await db.insert(productLines).values(
            discovered.lines.map((line) => ({
              brandId: savedId!,
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
          linesSaved = discovered.lines.length;
        }
      } else {
        // Another request beat us to it — fetch what was saved
        const [raceWinner] = await db
          .select({ id: brands.id })
          .from(brands)
          .where(eq(brands.slug, slug))
          .limit(1);
        if (raceWinner) savedId = raceWinner.id;
      }
    } catch (err) {
      console.error('Brand global save error:', err);
      // Non-fatal — return the discovered data even if DB write fails
    }
  }

  const saved = savedId !== null;
  const lineCount = discovered.lines.length;

  return jsonResponse({
    found: true,
    source: 'ai',
    saved,
    brandId: savedId,
    brand: discovered,
    // Make it clear this benefits the whole platform
    message: saved
      ? `I researched ${discovered.name} and added it to the Elara Pro global catalog with ${linesSaved} product line${linesSaved !== 1 ? 's' : ''}. Every stylist on the platform can now use it. ${discovered.notes || ''}`
      : `I found information about ${discovered.name} (${lineCount} lines) but couldn't save it automatically — confidence was ${Math.round(discovered.confidence * 100)}%. ${discovered.notes || ''}`,
  });
}
