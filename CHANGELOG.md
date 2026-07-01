# Changelog

## Foundation

- Created the Next.js App Router foundation with TypeScript and Tailwind CSS.
- Added Prisma and PostgreSQL schema for workspaces, domains, issues, engineering plans, and incidents.
- Seeded realistic engineering ownership data.
- Built the first calm dashboard shell with Overview, Domains, Issues, Triage, Postmortems, and Settings.

## MVP v0.2

- Added richer operating-system views across Overview, Domains, Issues, Triage, and Postmortems.
- Added domain detail routes and issue detail routes.
- Expanded engineering plans with rollout, monitoring, rollback, test, and edge-case sections.
- Added foundational product docs.

## MVP v0.3

- Added production engineering habits: README, CI, Vitest, Playwright, runbook, rollout plan, observability notes, PR checklist, and a sample postmortem.
- Added unit tests and smoke tests.
- Added GitHub Actions for install, lint, test, and build.

## Alpha v0.4

- Introduced Deployment Readiness.
- Added safe-to-ship scoring based on plan completeness.
- Surfaced readiness on Overview, Issues, and Issue detail pages.
- Added readiness unit tests and docs updates.

## Alpha v0.5

- Introduced Ownership Health.
- Added domain stewardship scoring based on owner presence, incidents, blocked issues, and rollout or monitoring gaps.
- Surfaced ownership health on Overview, Domains, and Domain detail pages.
- Added ownership health tests and docs updates.

## Alpha v0.6

- Introduced Engineering DNA.
- Added system behavior profiling based on ownership health, readiness, incidents, postmortem pressure, and plan gaps.
- Surfaced DNA on Overview, Domains, and Domain detail pages.
- Added DNA tests and docs updates.
