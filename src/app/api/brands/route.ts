import { NextRequest } from 'next/server';
import { jsonResponse, errorResponse, getAuthContext } from '@/lib/api-helpers';
import { db } from '@/lib/db';
import { brands, productLines } from '@/lib/db/schema';
import { eq, ilike, or } from 'drizzle-orm';
import { discoverBrand, slugify, type DiscoveredBrand } from '@/lib/ai/brandDiscovery';

// GET /api/brands?search=xxx   — search brands in DB
// GET /api/brands?brandId=xxx  — get a single brand's product lines
// GET /api/brands               — list all active brands
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search');
  const brandId = url.searchParams.get('brandId');

  try {
    // Return product lines for a specific brand
    if (brandId) {
      const lines = await db
        .select()
        .from(productLines)
        .where(eq(productLines.brandId, brandId))
        .orderBy(productLines.name);
      return jsonResponse({ lines });
    }

    const rows = search
      ? await db
          .select()
          .from(brands)
          .where(or(ilike(brands.name, `%${search}%`), ilike(brands.slug, `%${search}%`)))
          .orderBy(brands.name)
      : await db.select().from(brands).where(eq(brands.isActive, true)).orderBy(brands.name);

    return jsonResponse({ brands: rows });
  } catch (err) {
    return errorResponse('Failed to fetch brands', 500);
  }
}

// POST /api/brands  — save a discovered brand (and its lines) to the DB
export async function POST(request: NextRequest) {
  const auth = getAuthContext(request);
  if (!auth) return errorResponse('Unauthorized', 401);

  let body: DiscoveredBrand;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON body', 400);
  }

  if (!body.name || !body.slug) {
    return errorResponse('Brand name and slug are required', 400);
  }

  // Ensure slug is safe
  const slug = body.slug || slugify(body.name);

  try {
    // Check if brand already exists
    const [existing] = await db
      .select({ id: brands.id })
      .from(brands)
      .where(eq(brands.slug, slug))
      .limit(1);

    if (existing) {
      return jsonResponse({ id: existing.id, alreadyExists: true });
    }

    // Insert brand
    const [newBrand] = await db
      .insert(brands)
      .values({
        name: body.name,
        slug,
        website: body.website || null,
        logoUrl: null,
        isActive: true,
        source: 'manual',
        discoveredBySalonId: auth.salonId,
      })
      .returning({ id: brands.id });

    // Insert product lines
    if (body.lines && body.lines.length > 0) {
      await db.insert(productLines).values(
        body.lines.map((line) => ({
          brandId: newBrand.id,
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

    return jsonResponse({ id: newBrand.id, slug, linesAdded: body.lines?.length ?? 0 }, 201);
  } catch (err) {
    console.error('Brand save error:', err);
    return errorResponse('Failed to save brand', 500);
  }
}
