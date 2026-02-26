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
# Elara-Pro
# ELARA PRO — MASTER BUILD PROMPT v3.0
## The Complete, Definitive Warp/Cursor Deployment Prompt

---

> **Role:** God-Tier Full-Stack Engineer / Global Salon Strategist / Lead Architect  
> **Project:** Elara Pro — The Ultimate Hair Color Operating System  
> **Target:** Production-ready, deployed to Vercel + Neon, mobile-first, zero placeholders

---

## TECH STACK (MANDATORY — NO SUBSTITUTIONS)

- **Framework:** Next.js 14 (App Router, TypeScript strict mode)
- **Database:** Neon Postgres
- **ORM:** Drizzle ORM + Drizzle-Kit
- **Styling:** Panda CSS (primary layout/tokens) + Emotion (dynamic/runtime states)
- **Validation:** Zod (all inputs, API routes, batch uploads)
- **Voice:** Web Speech API (in-app, when open)
- **AI:** Claude API (claude-sonnet-4-6) for NLP parsing, confidence scoring, formula suggestions
- **Payments:** Stripe (subscriptions + usage metering)
- **Email/SMS:** Resend (email) + Twilio (SMS)
- **Barcode:** ZXing-js (UPC camera scanning)
- **Package Manager:** pnpm
- **Deployment Target:** Vercel (Edge + Serverless functions)
- **NO Tailwind. NO styled-components. NO Python backend. NO OpenAI.**

---

## BRAND & VISUAL IDENTITY

**Name:** Elara Pro  
**Tagline:** "Your Formula. Your Art. Protected."  
**Aesthetic:** Luxury salon — dark mode first, high contrast, mineral tones (obsidian, rose gold, warm cream, slate blue)  
**Typography:** Inter Variable (body), Playfair Display (headings/hero)  
**Motion:** Subtle — micro-interactions only, never distracting  
**Accessibility-First:** All features must pass WCAG 2.1 AA minimum

---

## COMPLETE FEATURE SET (ALL MUST BE IMPLEMENTED — ZERO PLACEHOLDERS)

### I. ONBOARDING FLOW

Fast, hairdresser-friendly onboarding that collects:

- Stylist name, salon name
- Units preference (grams / oz)
- Typical bowl size
- Default formulation style (conservative vs aggressive lift)
- Professional color lines used
- Lighteners, developers, bond builders, smoothing systems
- Conditioning treatments, backbar products, styling lines
- Distributor (SalonCentric, Cosmoprof, direct, other)
- Inventory tracking preference (on/off)
- Voice control preference
- Accessibility presets (see Accessibility section)
- Pricing tier selection during onboarding

### II. PRODUCT DATABASE STRUCTURE

Structured models: Brands → Product Lines → Products

Each product supports:
- Category: permanent, demi, toner, gloss, lightener, developer, bond builder, smoothing, conditioning
- Level, Tone, Mixing ratio, Compatible developers
- Lift range, Processing time, Contraindications
- Notes, Default tube grams, UPC, SKU
- Pigment density/viscosity (brand-specific weight vs volume)
- SDS (Safety Data Sheet) link
- Distributor source + price
- Brand-specific rules (no hardcoded logic — data-driven)

### III. CONSULTATION ENGINE (50-Point Safety Logic)

**Capture fields:**
- Natural level, Current level, Underlying pigment
- Porosity, Elasticity (3-stage snap test digital log), Density, Texture
- % gray, Regrowth banding
- Chemical history: relaxer, keratin, box dye, henna, metallic salts
- Medications, Allergies (PPD/Resorcinol hard-lock)
- Scalp sensitivity, Microbiome health (dermatitis, psoriasis flags)
- Hormonal cycle log (pregnancy, menopause, thyroid — optional)
- Target level, Target tone
- Maintenance tolerance, Budget/time constraints
- Social preference (silent service vs social service toggle)
- Photo capture with root/mids/ends tagging

**AI Assistance (Claude API):**
- Messy note parser: "She's like a 5 but has some old box red on the ends and wants a cool beige" → fills 10+ structured fields
- Suggests missing consult questions
- Proposes 2–4 formula strategies with tradeoffs
- Confidence scoring: "90% confident, 10% risk on 40vol at ends"
- Identifies risk flags
- NEVER presents guarantees — all safety logic deterministic rules-based
- Generates 3-sentence stylist confidence narrative for client explanation

**Chemistry Safety Logic (All Deterministic):**
- Box dye / metallic salt exothermic reaction warning
- Underlying pigment exposure chart (visual warmth map)
- Rule of 11/12 neutralization calculator (exact counter-tone grams)
- pH prediction (estimates final mixture pH, predicts cuticle behavior)
- Porosity-adjusted timing (Zone 3 auto-reduction for high porosity)
- Developer cocktailing math (mix 10vol + 40vol → custom 25vol or 30vol)
- Gray coverage mode toggle (Opaque/Standard vs Translucent/Blended)
- Pre-pig engine (filler formula if going 3+ levels darker)
- Chemical history heatmap (visual strand timeline)
- Non-ammonia MEA alternate formula for scalp sensitivity
- Hard water/mineral analysis via ZIP code municipal data
- Seasonal pigment shift (Summer: UV protection/cool tones; Winter: moisture/warm)
- Elevation/altitude oxidation compensation
- Humidity-based oxidation timer adjustment (±5%)
- UV index formulation (pulls local weather, adds pigment/UV shield if high UV)
- Pregnancy safe-line switch (ammonia-free only toggle)
- PPD/Resorcinol hard-lock (blocks formula if allergen detected)

### IV. FORMULATION ENGINE

- Zone-based formulas (Zone 1, 2, 3) with porosity-gradient splits
  - Example: 7N roots / 7N+Clear mids / 7N+5vol+Treatment ends
- Auto gram calculation with manual override on all values
- Formula scaling
- Developer volume tracking
- Bond builder inclusion tracking
- Step-by-step application plan
- Timing guidance
- Risk conditions display
- Strand test warning requirements
- Developer decay monitor (flags opened bottles past 6 months)
- Tube squeezer algorithm (accounts for 5-10g stuck in tube neck)
- Developer substitution logic (out of 20vol → exact 40vol + distilled water ratio)
- Oxidation timer (alert if bowl sitting >20 min)
- Pigment weight vs volume by brand density
- Custom pigment mixing / apothecary mode (raw pigment + clear base)
- Saturation heatmap (calculates bowls needed before first mix by density)
- Correction buffer (auto +15% product for formulas marked as corrections)
- "Bleach-Out" rescue timer with high-pitch rinse alarm at danger zone
- Oxidative pigment matcher (reverse-engineer formula from faded hair photo)
- Spill-proof voice correction ("not 7N, I meant 7G" recalculates mid-pour)
- Cold vs warm water rinse logic per color type

### V. TIMING SYSTEM

Track per service:
- Consult start/end
- Application start/end
- Processing start/end
- Toner window
- Rinse time
- Finish time

- Multiple timers per service
- Double-booking timer stack (vibrates watch for earliest rinse client)
- Haptic metronome for fast application services
- Service timeline history storage
- Automatic finish time prediction from historical data
- Station QR code: printable, scan → opens current client's active timer
- Watch companion app (Apple Watch / Android Wear): countdown + next ingredient

### VI. INVENTORY MANAGEMENT

- Gram-level tube inventory tracking
- Auto-deduction when formula saved
- Manual waste adjustment
- Quick-add waste button (one-tap 10g bowl scraping log)
- Tubes opened tracking
- Open New Tube workflow: camera UPC scan → identify → mark open → set starting grams
- Batch scanning (20 tubes at once after shipment)
- Optional QR tagging per tube
- Distributor source tracking
- Low-stock alerts
- Automated reorder triggers (email salon manager at 2-tube threshold for hero shades)
- Usage trend reports
- Developer decay tracking (opened bottle date → potency flag at 6 months)
- Dead stock purge (items untouched 6+ months → suggests use-up formulas)
- Backbar depletion tracking (10 pumps shampoo/conditioner per service log)
- Distributor stock-out alternate (suggests 2-color mix from shelf if shade unavailable)
- Distributor price comparison (SalonCentric vs Cosmoprof vs Direct)
- Dynamic shopping list to distributor cart based on inventory levels + upcoming appointments

### VII. VOICE INTEGRATION

- In-app "Elara" wake detection via Web Speech API (when app is open)
- Siri Shortcut export: "Hey Siri, open Elara"
- Android App Action export
- High-gain frequency filter (ignores blow-dryer hiss, HVAC hum)
- Noisy environment mode
- Voice commands:
  - "Start consult"
  - "Formulate level 7 copper"
  - "Scale to 120 grams"
  - "Start processing timer"
  - "Go to inventory"
  - "Open previous formula"
  - "Tell Sarah to start mixing 7N and 7G for Zone 1" (multi-person)
  - "I just finished the last 6N" (auto-deducts inventory)
  - "Did I ask about her allergy to PPD?"
  - "I spilled bleach on my shoes!" (reads SDS neutralization steps)
  - "Not 7N, I meant 7G" (mid-pour correction)
  - "What was her last toner?" (Siri read-back)
- Audio step-by-step guidance: "Apply Zone 1 now. Start 15-minute timer in 3...2...1"

### VIII. BUSINESS & PROFITABILITY LAYER

- Cost-per-service calculator (exact dollar amount in bowl, real-time)
- Upsell assistant (suggests bond builders, glosses, treatments based on hair condition)
- Profit margin safeguard (flags if formula exceeds product cost cap)
- Usage analytics (product use vs waste per stylist)
- Commission vs booth-rent earnings tracker (subtracts product cost → true take-home)
- Revenue per ounce dashboard
- Client Lifetime Value (CLV) tracker
- Retail-to-service mapping alert (client hasn't bought retail in 3 months)
- Dynamic pricing: auto-add long/thick hair surcharge if formula used >2x standard product
- Formula IP vault (stylist locks proprietary formulas — encrypted, portable if they leave)
- Productivity dashboard (revenue per hour, per service)
- Booth-rent business planner (calculates # of services needed to cover rent + overhead)
- Tax-ready COGS ledger (every gram = COGS export for CPA year-end filing)
- Tax-loss harvesting: waste flagged as specific write-off category
- Passive income linker: identifies retail products → generates personalized affiliate shop link for client
- Color-line migration tool (salon switches brands → auto-remaps all client formulas)

### IX. CLIENT EXPERIENCE & RETENTION

- Formula evolution storyboard ("Today: Red → 8 weeks: Copper → 16 weeks: Ice Blonde")
- Predictive regrowth visualizer (shows roots at 4 weeks vs 8 weeks)
- Fade-clock re-booking automation (calculates when color goes brassy → sends "Time for a Gloss" text)
- Sensory archive (notes client preferred lavender shampoo, cool water temp)
- Home-care prescription texting (shoppable link to exact maintenance products)
- Formula secret vault (sends client home-care list, hides professional formula)
- Automated expectation contract (texts client: "Aiming for Level 7, may take 2 sessions. Reply AGREE")
- No-show protection (confirms formula 24hrs prior — no click = not paper-ready)
- Client booking referral network (clients book Elara-certified stylists, 2-5% referral fee)
- Social media recipe export (stylist-friendly formula "vibe" for Instagram, protects IP)
- "Dispute" video log (10-second end-result capture for chargeback protection)
- Automated model release (digital signature for before/after photo approval)
- Formula evolution social storyboard export

### X. LEGAL, COMPLIANCE & SAFETY

- Digital patch test tracker (legally binding: date, brand used, result photo)
- SDS emergency hub (red button on every formula screen → immediate SDS for chemicals in bowl)
- Chain of custody log (who mixed + who applied — multi-assistant salons)
- Drizzle-powered audit logs (every manual formula override logged for liability)
- Encrypted medical notes (HIPAA-ready: allergy/medication data)
- Digital consent forms with client signature
- Emergency contact-a-chemist (pre-configured bridge to Wella/Redken/Matrix tech support)
- Disaster recovery paper-back (auto-generates daily PDF of all client formulas each morning)
- CSV/PDF full disaster export (migrate away from Elara → all formulas portable)
- Formula IP protection (stylist can lock formulas, take with them)
- SOC2-aligned audit trails

### XI. EDUCATOR & TRAINING LAYER

- AI shadow training (explains "why" during formulation: "You chose 20vol because 50% gray — good move")
- Blind spot audit (analyzes stylist history: "You haven't done a cool blonde in 3 months")
- Education proof of mastery (generates certificates for complex formulations completed)
- CEU module (continuing education credits — accreditation-ready)
- Assistant grading dashboard (lead stylist grades mixing accuracy over time)
- Color-line migration tool (remaps all past formulas to new brand's pigment weights)

### XII. ACCESSIBILITY (MAX SPEC)

- Color-blind formula shield: pattern overlay (dots = warm, stripes = cool) on all color swatches
- Dynamic type: Apple Dynamic Type + Android Font Scaling support
- OpenDyslexic font toggle (global setting)
- Monochrome high-contrast mode (text/icons only, no color reliance)
- Bionic reading mode (bolds initial word characters for ADHD)
- Cognitive ease / clutter-reduced mode (hides non-essential UI, focuses on bowl/brush screen)
- Oversized touch layer (toggle → all targets minimum 80x80px)
- Shake-to-undo (accelerometer: shake to clear field or reset timer)
- Haptic confirmation (double pulse = saved formula; distinct patterns per action type)
- Wet-hand / glove mode (oversized gestures, locked accidental taps)
- Haptic dial for gram selection (rotary UI, long-press + vibration, feel numbers change)
- Voice-first navigation (every page reachable via voice)
- Gaze/gesture support (native OS eye/head tracking integration hooks)
- Visual alarms (LED flash + screen pulse when processing timer hits zero)
- High-gain voice filter (blow-dryer and HVAC frequency suppression)
- Audio descriptive aria-labels (descriptive, not just "Search" — "Search past client formulas by name")
- Subtitle-first AI display (bold text immediately, even in voice mode)
- Session lock (screen always-on during application phase)
- Proximity wake (front camera detects approaching hand → wakes screen)

### XIII. HARDWARE & IOT

- NFC tap-to-formula (tap phone to sticker on client folder → loads formula)
- Bluetooth scale integration (Acaia/Pearl API hooks → pulls gram weight directly)
- Proximity wake (front sensor)
- Apple Watch / Android Wear companion (timer countdown + next ingredient only)
- Smart mirror casting (goal photo + proposed formula to smart mirror for client)
- Environmental sensor link (salon temp/humidity → auto-adjust processing times)
- Light-adjusted formulation (phone light sensor detects warm vs cool salon lighting → warns of outdoor appearance difference)
- Chemical resistance guide (equipment health log — phone exposure to developer fumes)

### XIV. ERGONOMIC & WELLNESS SUITE

- Carpal tunnel prevention (gyroscope detects repetitive high-angle wrist movements → haptic stretch reminder every 45 min)
- Postural correction (3-second "Look Up" prompt between formulations)
- Chemical exposure tracker (cumulative daily ammonia/lightener exposure log → ventilation break suggestions)
- Smart ring integration (Oura/Samsung ring → tracks ergonomic strain, suggests breaks)

### XV. BRAND PARTNERSHIP LAYER (REVENUE)

- Preferred brand partnership API: brands pay to be default when formulas are equivalent (disclosed in ToS, standard formulary model)
- Brand certification program: "Wella Certified via Elara Pro" — brands pay per cert, stylists pay for training
- Beauty school white-label licensing system (custom branding, pre-loaded product DB, instructor dashboard)
- Distributor integration (SalonCentric API, Cosmoprof, direct ordering)
- Insurance partner integration (ABMP/Hiscox discount for patch test + consent form users)

---

## PRICING TIERS (STRIPE INTEGRATION — ALL TIERS BUILT ON LAUNCH)

### FREE — "The Apprentice"
- 5 consultations/month
- 1 color line
- Basic formulation (no zones)
- No inventory, no voice, no client history >30 days
- "Powered by Elara Pro" branding visible
- Upgrade prompt triggers when hitting consultation limit

### PRO — $29/month | $249/year
- Unlimited consultations
- Up to 5 color lines
- Zone-based formulation
- Inventory (up to 200 SKUs)
- Voice commands + in-app wake
- Full client history
- Patch test tracker + digital consent
- Cost-per-service calculator
- AI messy note parser
- Siri/Android shortcuts
- PDF daily formula sheet export

### ELITE — $79/month | $699/year
- Everything in Pro, plus:
- Unlimited color lines + SKUs
- Full AI confidence scoring + risk flags
- Ghost-tone detector (photo analysis)
- Predictive fading engine
- Formula evolution storyboard
- Bluetooth scale + NFC
- Distributor price comparison
- Upsell assistant
- Fade-clock re-booking automation
- Home-care prescription texting
- CEU module
- Formula IP vault (encrypted)
- Watch app companion
- Priority support

### SALON — $199/month (up to 5 stylists) | $149/seat/month (6+)
- Everything in Elite, plus:
- Multi-chair timer sync
- Chain of custody log
- Per-stylist analytics + waste alerts
- Profit margin safeguard
- Automated reorder triggers
- Salon owner dashboard
- Commission vs booth-rent tracker
- Dynamic shopping list to distributor
- Assistant hand-off QR
- White-label salon branding on client screens
- Batch UPC scanning
- Formula lock on stylist departure
- Full disaster export

### ENTERPRISE / SCHOOL — Custom ($500–$2,000/month)
- Full white-label (school/brand logo + colors)
- Pre-loaded product DB for school's color lines
- Instructor grading dashboard
- Student progress tracking
- CEU accreditation integration
- API access for POS integration (Boulevard, Vagaro, Phorest, Clover)
- SLA guarantee (1-second formula generation)
- Dedicated onboarding + support
- Neon branching sandbox for testing new lines

**Annual billing = 14-15% discount. Auto-displayed on pricing page.**  
**Free → Pro conversion trigger: upgrade prompt fires when free user hits limit during busy session.**

---

## DATABASE SCHEMA (NEON + DRIZZLE — ALL TABLES)

```
users
salons
brands
product_lines
products
consultations
consult_photos
formulas
formula_zones
formula_products
services
timelines
inventory_items
inventory_usage_logs
inventory_orders
optimization_history
patch_tests
consent_forms
voice_logs
audit_logs
client_profiles
client_lifetime_value
timer_sessions
distributors
distributor_prices
sds_library
certifications
ceu_records
stylist_metrics
waste_logs
chemical_exposure_logs
wellness_logs
formula_ip_vault
brand_partnerships
subscription_tiers
usage_metering
tax_ledger
affiliate_links
assistant_grades
school_enrollments
```

All tables: proper foreign keys, indexes, RLS policies (row-level security via Neon).

---

## PAGE ROUTES (APP ROUTER — ALL PAGES)

```
/                          → Marketing landing page (pricing tiers, features, signup)
/onboarding               → Multi-step stylist onboarding
/dashboard                → Main stylist dashboard
/consult                  → New consultation
/consult/[id]             → Active/past consultation
/formulate                → Formulation engine
/formulate/[id]           → Formula detail + scaling
/service/[id]             → Active service (timers + all zones)
/inventory                → Inventory management
/inventory/scan           → UPC camera scanner
/products                 → Product database browser
/clients                  → Client list
/clients/[id]             → Client profile + formula history
/analytics                → Stylist productivity + profit dashboard
/business                 → Booth-rent planner, COGS ledger, CLV
/voice                    → Voice settings + Siri shortcut export
/settings                 → All preferences + accessibility
/settings/billing         → Stripe portal
/admin                    → Salon owner multi-stylist view
/school                   → Enterprise/school dashboard
/api/...                  → All API routes (Zod-validated)
```

---

## UI REQUIREMENTS

- Mobile-first (375px base), tablet-friendly (768px), desktop-responsive
- Minimal, high contrast, salon-friendly
- Large tap targets (44px minimum, 80px in glove mode)
- Quick input controls (no 10-field forms on one screen)
- Panda CSS tokens for all layout, spacing, color system
- Emotion for dynamic highlights, timer states, risk color-coding
- Wet-hand mode lockable from notification center swipe
- Session lock (always-on during application phase)
- Mirror view (flips UI for client to see in station mirror)
- Dark mode default, light mode available, monochrome accessibility mode

---

## DEPLOYMENT

### Environment Variables (.env.example)
```
DATABASE_URL=                    # Neon connection string
NEON_DATABASE_URL=               # Neon direct connection
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRO_PRICE_ID=
STRIPE_ELITE_PRICE_ID=
STRIPE_SALON_PRICE_ID=
ANTHROPIC_API_KEY=               # Claude API (formula AI)
RESEND_API_KEY=                  # Transactional email
TWILIO_ACCOUNT_SID=              # SMS (fade-clock, expectations)
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
NEXT_PUBLIC_APP_URL=
```

### Commands
```bash
# Setup
pnpm install
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Dev
pnpm dev

# Deploy
vercel --prod
```

### Vercel Config
- Edge runtime for formula API routes (sub-100ms)
- Serverless for auth, Stripe webhooks
- ISR for product database pages

---

## ARCHITECTURE NOTES

- All color math logic lives client-side in a pure TS module (`/lib/chemistry/`) — works offline in basements with no signal
- Zod schemas are the single source of truth for all data shapes — shared between client, server, and DB
- Brand rules are 100% data-driven (stored in DB) — never hardcoded
- AI (Claude) handles NLP/parsing/narrative only — safety logic is always deterministic rules
- Formula IP vault uses AES-256 encryption at rest
- Audit log writes are append-only (Drizzle insert only, never update/delete)
- Multi-tenant: users.salon_id scopes all queries; RLS enforces at DB level
- Neon branching used for school/enterprise sandbox environments

---

## DELIVERY CHECKLIST (ZERO PLACEHOLDERS — ALL REQUIRED)

- [ ] Complete file tree
- [ ] schema.ts (Drizzle — all tables)
- [ ] All API routes (Zod-validated)
- [ ] Chemistry module (pure TS, offline-capable)
- [ ] Voice capture components (Web Speech API)
- [ ] Stripe subscription integration (all 4 tiers)
- [ ] Inventory logic modules (UPC scan, gram tracking, auto-deduct)
- [ ] AI parsing module (Claude API integration)
- [ ] All page routes (App Router)
- [ ] Accessibility components (all modes)
- [ ] .env.example
- [ ] Drizzle migration commands
- [ ] pnpm dev instructions
- [ ] Vercel deploy steps
- [ ] Neon setup steps (including RLS policies)

---

*Elara Pro v3.0 — Built for the stylist behind the chair. Every feature earns its place.*
