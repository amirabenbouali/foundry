# Foundry

Foundry is an engineering operating system for software ownership.

It is not a generic project manager or task board. Foundry centers the software systems a team owns, the risks attached to those systems, the rollouts that change them, and the incidents that teach the organization how to improve.

Alpha v0.4 introduces the first opinionated workflow: Deployment Readiness. Foundry now evaluates whether engineering work has enough evidence to ship safely.

## Product Philosophy

Foundry starts from ownership, not tickets.

The core product question is: "Which systems need engineering attention, who owns them, and what evidence tells us they are safe to change?"

The product intentionally uses a calm, restrained interface so the important signals stand out:

- domains and systems
- owners and operational health
- engineering risks
- rollout plans
- deployment readiness
- active incidents
- postmortem learnings
- monitoring and rollback readiness

## Tech Stack

- Next.js App Router
- React Server Components
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Vitest
- Playwright
- GitHub Actions

## Local Setup

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

Optional PostgreSQL setup:

```bash
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
```

The app uses `lib/data.ts` as the data abstraction. Without `DATABASE_URL`, it renders from curated sample data so the product can be reviewed immediately.

## Core Routes

- `/` - ownership overview
- `/domains` - owned software systems
- `/domains/[id]` - domain ownership profile
- `/issues` - engineering risks
- `/issues/[id]` - engineering plan detail
- `/triage` - incident ownership triage
- `/postmortems` - incident learning loop
- `/settings` - workspace foundation

## Engineering Practices Demonstrated

- Server-rendered product surfaces with App Router.
- A narrow data access layer that isolates database access from UI code.
- Prisma schema modeling ownership, risk, plans, incidents, and postmortems.
- Seed data that exercises real product concepts rather than placeholder tasks.
- Derived deployment readiness scoring for safe-to-ship judgement.
- Unit tests for data helpers.
- Playwright smoke tests for critical product routes.
- GitHub Actions for install, lint, test, and build.
- Product and operational docs covering rollout, runbook, observability, and review discipline.
- No premature authentication or CRUD before the core product model is clear.

## Verification

```bash
npm run lint
npm run test
npm run build
```
