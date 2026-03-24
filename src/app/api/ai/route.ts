import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, parseBody, getAuthContext } from '@/lib/api-helpers';
import { parseNotesSchema } from '@/lib/validators';
import { parseConsultationNotes, generateNarrative, scoreConsultationConfidence } from '@/lib/ai';
import { discoverBrand, slugify } from '@/lib/ai/brandDiscovery';
import { db } from '@/lib/db';
import { brands, productLines } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { US_PROFESSIONAL_BRANDS } from '@/lib/brands/data';

export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'parse') {
    const parseResult = await parseBody(request, parseNotesSchema);
    if (parseResult.error) return errorResponse(parseResult.error);

    try {
      const aiResult = await parseConsultationNotes(parseResult.data!.rawNotes);
      return jsonResponse(aiResult);
    } catch (err) {
      return errorResponse('AI parsing failed. Please try again.', 500);
    }
  }

  if (action === 'narrative') {
    try {
      const body = await request.json();
      const narrative = await generateNarrative(body);
      return jsonResponse({ narrative });
    } catch (err) {
      return errorResponse('Narrative generation failed.', 500);
    }
  }

  if (action === 'confidence') {
    try {
      const body = await request.json();
      const confidence = await scoreConsultationConfidence(body);
      return jsonResponse(confidence);
    } catch (err) {
      return errorResponse('Confidence scoring failed.', 500);
    }
  }

  // Discover an unknown brand — research via Claude and save to DB
  if (action === 'discover-brand') {
    try {
      const body = await request.json();
      const brandName = (body.brandName ?? '').trim();
      if (!brandName) return errorResponse('brandName is required', 400);

      const candidateSlug = slugify(brandName);

      // Check static catalog
      const inStatic = US_PROFESSIONAL_BRANDS.find(
        (b) => b.slug === candidateSlug || b.name.toLowerCase() === brandName.toLowerCase()
      );
      if (inStatic) {
        return jsonResponse({
          found: true, source: 'catalog', saved: false, brand: inStatic,
          message: `${inStatic.name} is already in the Elara Pro catalog with ${inStatic.lines.length} product lines.`,
        });
      }

      // Check DB — may have been discovered by any other salon already
      const [existingInDb] = await db.select().from(brands).where(eq(brands.slug, candidateSlug)).limit(1);
      if (existingInDb) {
        const lines = await db.select().from(productLines).where(eq(productLines.brandId, existingInDb.id));
        return jsonResponse({
          found: true, source: 'database', saved: false,
          brand: { ...existingInDb, lines },
          message: `${existingInDb.name} is already in the global Elara Pro catalog${existingInDb.source === 'ai_discovered' ? ' — added by another stylist' : ''} with ${lines.length} product lines. Every salon on the platform can use it.`,
        });
      }

      // Research with Claude
      const discovered = await discoverBrand(brandName);

      if (discovered.confidence === 0 || discovered.lines.length === 0) {
        return jsonResponse({
          found: false, source: 'ai', saved: false, brand: discovered,
          message: `I couldn't find reliable information about "${brandName}". It may be a very new brand, regional, or not a professional hair product. You can add it manually in Settings → Brands.`,
        });
      }

      // Save to global catalog — onConflictDoNothing handles race conditions
      // if two stylists discover the same brand simultaneously
      const slug = discovered.slug || slugify(discovered.name);
      let savedId: string | null = null;
      let linesSaved = 0;

      if (discovered.confidence >= 0.3) {
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
          // Race condition — another request saved it first, fetch the id
          const [raceWinner] = await db.select({ id: brands.id }).from(brands).where(eq(brands.slug, slug)).limit(1);
          if (raceWinner) savedId = raceWinner.id;
        }
      }

      const lineCount = discovered.lines.length;
      const saved = savedId !== null;
      return jsonResponse({
        found: true, source: 'ai', saved, brandId: savedId, brand: discovered,
        message: saved
          ? `I researched ${discovered.name} and added it to the global Elara Pro catalog with ${linesSaved} product line${linesSaved !== 1 ? 's' : ''}. Every stylist on the platform can now use it. ${discovered.notes || ''}`
          : `I found information about ${discovered.name} but couldn't save it automatically. ${discovered.notes || ''}`,
      });
    } catch (err) {
      return errorResponse(`Brand discovery failed: ${err instanceof Error ? err.message : 'Unknown error'}`, 500);
    }
  }

  return errorResponse('Invalid action. Use ?action=parse|narrative|confidence|discover-brand');
}
