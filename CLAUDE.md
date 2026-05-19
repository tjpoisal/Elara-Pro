# Elara Pro

Next.js application with Drizzle ORM, PandaCSS, and Capacitor for mobile.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: PandaCSS
- **ORM**: Drizzle
- **Mobile**: Capacitor
- **Package manager**: pnpm
- **Runtime**: Node 20

## Development

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## CI
Workflow in `.github/workflows/ci.yml`:
- Lint → Typecheck → Build (pnpm, with `SKIP_ENV_VALIDATION=1`)

## Environment
Copy `.env.example` to `.env` and fill in required values before running locally.

## Branch Convention
Dev branches follow the pattern `claude/<name>-<id>` and are branched from `main`.
