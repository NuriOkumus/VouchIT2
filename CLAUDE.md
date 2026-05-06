# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

VouchIT is a developer profile platform that parses CVs with GPT-4o, cross-checks skills against real GitHub activity, and produces a shareable verified profile. Monorepo with two packages:

- `web/` — Next.js 16 frontend (React 19, NextAuth v5, Tailwind CSS v4)
- `api/` — Hono.js backend (Node.js, Drizzle ORM, PostgreSQL, OpenAI)

## Commands

### Web (`cd web`)
```bash
npm run dev      # dev server on :3000
npm run build
npm run lint
```

### API (`cd api`)
```bash
npm run dev      # tsx watch on :3001
npm run build    # tsc → dist/
npm run db:push      # push schema to DB (no migration file)
npm run db:generate  # generate Drizzle migration files
npm run db:studio    # Drizzle Studio GUI
```

## Environment variables

**web/.env.local**
```
NEXT_PUBLIC_API_BASE=http://localhost:3001
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
AUTH_SECRET=
```

**api/.env**
```
DATABASE_URL=
OPENAI_API_KEY=
PORT=3001
```

## Architecture

### Upload flow
`/upload` → `lib/upload-store.ts` → `/loading` → `/p/[id]`

`upload-store.ts` is a module-level in-memory singleton (not localStorage, not sessionStorage). The file and auth token are stored there between route transitions. The loading page reads it, calls `POST /analyze-cv`, then navigates to the resulting profile.

### Authentication
NextAuth v5 with GitHub (scope `read:user user:email repo`) and Google providers. GitHub's OAuth token flows through JWT → session as `session.accessToken` and is forwarded to the API for GitHub data fetching. Middleware at `web/middleware.ts` guards `/upload`, `/p/:path*`, and `/spaces`.

### API routes
- `POST /analyze-cv` — accepts multipart form (`cv` file, `userId`, optional `githubToken`). Uploads PDF to OpenAI Files API, calls GPT-4o, optionally fetches GitHub repos + contribution calendar via REST + GraphQL, stores result in `profiles` table.
- `GET /profile/:id` — fetch single profile by UUID
- `GET /profiles` — list all profiles (max 50)

### Database (Drizzle + PostgreSQL)
Two tables defined in `api/src/db/schema.ts`:
- `users` — OAuth identity (id, email, name, image)
- `profiles` — AI-generated profile (userId, name, developerSummary, hrSummary, skills JSONB, metadata JSONB)

### Design system
All UI styling uses CSS custom properties defined in `web/app/globals.css`. Key tokens: `--bg`, `--bg-1..3`, `--mint` (#7CFFB2), `--violet` (#A78BFA), `--amber`, `--rose`, `--fg`, `--fg-2..4`, `--mono`, `--sans`. Global utility classes: `.btn`, `.btn-primary`, `.chip`, `.glow`, `.scroll`. Components use inline styles referencing these vars — no Tailwind utility classes in page components.

### Spaces page
`/spaces` is currently fully static (mock `SPACES` and `FEED` arrays hardcoded in the file). No backend data yet.

### Profile page `/p/[id]`
Has a hardcoded `DEMO` profile constant used as fallback when the API returns nothing or when `id === "demo"`.

## Deployment
Both services deploy to Railway. `railway.json` at root configures the build/start commands via Nixpacks. The web app is also deployable to Vercel.

## Next.js version note
`web/AGENTS.md` warns that Next.js 16 has breaking API changes vs. earlier versions. Before writing any Next.js-specific code, check `web/node_modules/next/dist/docs/` for current conventions.
