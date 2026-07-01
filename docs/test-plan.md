# Foundry Test Plan

## Automated Checks

Run these before shipping changes:

```bash
npm run lint
npm run build
```

Run Prisma generation after schema changes:

```bash
npx prisma generate
```

When PostgreSQL is configured:

```bash
npm run prisma:migrate
npm run prisma:seed
```

## Manual Product Checks

1. Overview shows total domains, open issues, active incidents, and domains at risk.
2. Overview includes systems needing attention, weekly focus, active incidents, and rollout activity.
3. Domain cards link to `/domains/[id]`.
4. Domain cards show ownership score, ownership status, and 2-3 stewardship reasons.
5. Domain detail pages show owner, health, open issues, active incidents, rollout notes, and dependencies.
6. Domain detail pages show Ownership Health with related blocked issues and active incidents.
7. Issue rows link to `/issues/[id]`.
8. Issue rows show deployment readiness score and status.
9. Issue detail pages show the engineering plan sections when a plan exists.
10. Issue detail pages show completed and missing deployment readiness evidence.
11. Issue detail pages explain what blocks safe shipment.
12. Overview shows average readiness, ready issues, blocked issues, and top issues needing attention.
13. Overview shows average ownership health, healthy domains, domains on watch, and at-risk domains.
14. Issue detail pages handle missing plans without breaking.
15. Triage groups incidents by operational state and shows domain owner plus postmortem requirement.
16. Postmortems show impact, root cause, resolution, and prevention.
17. The interface stays calm and ownership-centered across desktop and mobile widths.

## Deferred Tests

- Database integration tests once CRUD is introduced.
- Auth and permission tests once authentication is added.
- End-to-end workflow tests once issue and incident mutation flows exist.
