# Elara Pro

AI-powered hair color consultation and formulation platform for licensed stylists.

## Tech Stack

- **Framework:** Next.js 14 App Router + TypeScript (strict mode)
- **Database:** Neon Postgres + Drizzle ORM + Drizzle-Kit
- **Styling:** Panda CSS (layout/tokens) + Emotion (dynamic states)
- **Validation:** Zod on all inputs and API routes
- **AI:** Claude API (claude-sonnet-4-6) — note parsing, confidence scoring, narrative generation
- **Payments:** Stripe (Free / Pro $29/mo / Elite $79/mo / Salon $199/mo)
- **Email:** Resend
- **SMS:** Twilio
- **Barcode:** ZXing-js (UPC camera scanning)
- **Package Manager:** pnpm

## Architecture

### Chemistry Engine (`/lib/chemistry/`)
Pure TypeScript, 100% offline-capable, deterministic-only:
- `colorMath.ts` — Rule of 11/12, lift calculations, gray coverage
- `underlyingPigment.ts` — Underlying pigment map by natural level
- `developer.ts` — Developer substitution logic (5/10/15/20/30/40 vol)
- `pH.ts` — pH prediction for mixed formulas
- `porosity.ts` — Porosity-adjusted timing calculations
- `safety.ts` — Chemical compatibility checks, exposure limits
- `mixing.ts` — Ratio calculations, gram measurements, cost estimates

### Database (35 Tables)
- **Core:** users, salons, client_profiles, client_lifetime_value
- **Products:** brands, product_lines, products
- **Consultations:** consultations, consult_photos, formulas, formula_zones, formula_products
- **Services:** services, timelines, timer_sessions
- **Inventory:** inventory_items, inventory_usage_logs, inventory_orders, distributors, distributor_prices
- **Safety:** patch_tests, consent_forms, sds_library, chemical_exposure_logs, wellness_logs
- **Business:** optimization_history, waste_logs, stylist_metrics, certifications, ceu_records
- **Platform:** voice_logs, audit_logs, formula_ip_vault, brand_partnerships, subscription_tiers

### Key Invariants
- Chemistry safety = deterministic rules ONLY, never AI-generated
- Claude API = ONLY note parsing, narrative generation, confidence scoring
- Audit logs = append-only (no UPDATE/DELETE)
- Formula vault = AES-256-GCM encryption
- All queries scoped by salon_id (multi-tenant)

## Getting Started

```bash
pnpm install
cp .env.example .env
# Fill in your environment variables
pnpm dev
```

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm lint         # ESLint
```
