# Foundry

**Foundry is an engineering operating system that helps teams understand whether the software they own is safe to operate, change, and ship.**

Foundry is not a Jira clone, task board, or project tracker. It is a product experiment around software ownership: domains, readiness, stewardship, incidents, rollouts, postmortems, and the operating signals that make engineering work trustworthy.

## Why Foundry Exists

Modern engineering teams ship inside systems they do not always fully understand. The work may have an owner, but the system might still be under-monitored. A plan may exist, but rollback may be vague. Incidents may close, but prevention may never connect back to the domain.

Foundry exists to answer sharper questions:

- Who owns this system?
- Is this work actually safe to ship?
- Is the system being looked after properly?
- What kind of system is this becoming?
- What risks does its behavior reveal?

## What Makes It Different

Foundry starts from software ownership, not task throughput.

Instead of boards, columns, and generic status labels, Foundry models engineering judgement:

- **Deployment Readiness** asks whether an issue has enough evidence to ship safely.
- **Ownership Health** asks whether a domain is actively stewarded.
- **Engineering DNA** diagnoses the behavioral character of a system over time.

The result is a calm operating surface for engineering leaders and domain owners: fewer vanity signals, more system truth.

## Screenshots

Screenshots are intentionally left as placeholders until the UI stabilizes further.

- Overview: System DNA, Deployment Readiness, Ownership Health
- Domains: owned systems with stewardship and DNA signals
- Domain detail: diagnosis, ownership health, incidents, blocked work
- Issue detail: safe-to-ship readiness judgement

## Key Product Concepts

### Deployment Readiness

Deployment Readiness scores engineering work based on whether the attached plan includes:

- technical approach
- edge cases
- test plan
- rollout plan
- monitoring plan
- rollback plan

It turns "we have a plan" into "we have enough evidence to ship safely."

### Ownership Health

Ownership Health scores each domain based on owner presence, open issues, active incidents, blocked issues, and rollout or monitoring gaps.

It answers: "Who owns this system, and is it being looked after properly?"

### Engineering DNA

Engineering DNA combines ownership health, readiness, incidents, postmortem pressure, rollout gaps, and monitoring gaps into a system profile.

It answers: "What kind of system is this, and what risks does its behavior reveal?"

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

Foundry uses `lib/data.ts` as the data abstraction. Without `DATABASE_URL`, it renders from curated sample data so the product can be reviewed immediately.

## Core Routes

- `/` - operating overview
- `/domains` - owned software systems
- `/domains/[id]` - domain diagnosis and stewardship profile
- `/issues` - engineering risks and deployment readiness
- `/issues/[id]` - safe-to-ship plan detail
- `/triage` - incident ownership triage
- `/postmortems` - incident learning loop
- `/settings` - workspace basics

## Engineering Practices Demonstrated

- Server-rendered product surfaces with App Router.
- A narrow data access layer that isolates UI from persistence.
- Prisma schema modeling domains, issues, engineering plans, incidents, and postmortems.
- Derived product judgement layers for readiness, ownership health, and Engineering DNA.
- Unit tests for scoring logic and data helpers.
- Playwright smoke tests for critical product routes.
- GitHub Actions for install, lint, test, and build.
- Product docs, RFCs, runbooks, observability notes, and review checklists.
- Tight scope: no auth, no CRUD, no external services until the operating model is clear.

## Verification

```bash
npm run lint
npm run test
npm run build
```
