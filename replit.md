# What's Your Equip Story?

A mobile-first demo website for Equip Expo that lets attendees share their story (voice or written) in ~60 seconds, with a QR presentation screen for live demos and a hidden Equip Intelligence executive dashboard at `/intelligence`.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- Frontend: `artifacts/equip-story/src/pages/` (presentation, welcome, profile, verify, listen, thanks, intelligence); journey state in `src/lib/store.tsx`
- API contract: `lib/api-spec/openapi.yaml` (source of truth); routes in `artifacts/api-server/src/routes/{attendees,stories,intelligence}.ts`
- DB schema: `lib/db/src/schema/{attendees,stories}.ts`
- Brand assets: `attached_assets/brand/equip_540.png` (navy logo) and `equip_White.png`

## Architecture decisions

- SMS verification is simulated — any 6-digit code verifies (demo only, no SMS provider)
- Voice recordings are not uploaded; only duration is stored (`voiceDurationSeconds`)
- Sentiment/theme detection is keyword-based on the server at story creation
- The intelligence dashboard blends a synthetic baseline (1,284 stories) with live submissions
- OpenAPI spec uses `type: number` everywhere (never `integer`) — see `.agents/memory/orval-zod-int.md`

## Product

Attendee journey: QR screen (`/`) → welcome (`/story`) → quick profile → simulated mobile verification → personalized listening experience (speak/write, prompts by business type, quick interest path, one AI-like follow-up) → thank-you with demo recommendations. Hidden executive dashboard at `/intelligence`. Never called a "survey" anywhere in the UI.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
