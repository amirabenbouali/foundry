# Interview Notes

## Problem

Foundry explores a gap between engineering planning and operational ownership.

Many teams know what work exists, but not whether the work is safe to ship, whether the owning system is healthy, or what recurring behavior makes a system risky. Foundry turns those questions into first-class product concepts.

## Why Foundry Is Not a Jira Clone

Jira and task boards center work items. Foundry centers owned software systems.

Foundry does not optimize for tickets moved, sprint throughput, or generic project status. It asks:

- Is the system owned?
- Is the work safe to ship?
- Are incidents creating learning?
- Are rollout, monitoring, and rollback plans present?
- Is the system stable, evolving, or fragile?

The product is deliberately read-oriented for now because the first challenge is modeling the right engineering judgement.

## Key Technical Decisions

- **Next.js App Router:** server-rendered surfaces match the read-heavy operating-dashboard shape.
- **Data abstraction in `lib/data.ts`:** UI code does not care whether data comes from Prisma or curated sample data.
- **Derived scoring modules:** Deployment Readiness, Ownership Health, and Engineering DNA live as testable domain logic.
- **Prisma schema:** persistence model captures domains, issues, plans, incidents, and postmortems without adding premature workflow tables.
- **Testing:** Vitest covers scoring logic; Playwright covers critical route rendering.
- **Docs-first production habits:** RFCs, runbooks, changelog, observability notes, and PR checklist make the repository interview-readable.

## Tradeoffs

- No auth yet, because user roles are less important than proving the operating model.
- No CRUD yet, because mutation flows should follow from validated read models.
- Scoring is deterministic and transparent, not ML-driven, so reviewers can inspect the judgement.
- Sample data is curated to demonstrate product behavior before a full database workflow exists.
- The UI favors calm density over feature volume.

## What Would Come Next

- Add authenticated workspaces and domain-owner permissions.
- Add CRUD for domains, issues, engineering plans, incidents, and postmortems.
- Persist score snapshots so Engineering DNA can show trends over time.
- Add audit history for readiness and ownership changes.
- Integrate deployment systems, incident tools, and observability providers.
- Add notification workflows for blocked readiness, fragile domains, and required postmortems.
- Add database-backed integration tests and richer E2E coverage.
