# Rollout Plan

Foundry v0.3 is a foundation release for validating the product model and engineering practices.

## Release Goals

- Demonstrate system ownership as the primary product surface.
- Validate domain, issue, engineering plan, incident, and postmortem models.
- Keep the app usable without PostgreSQL through the existing data abstraction.
- Add baseline automated checks before future CRUD work.

## Rollout Steps

1. Ship v0.3 behind local and preview environments only.
2. Run `npm run lint`, `npm run test`, and `npm run build` in CI.
3. Review core routes manually after deployment.
4. Seed a PostgreSQL database in a staging environment.
5. Compare database-backed pages against fallback sample data behavior.
6. Promote only after overview, domain detail, issue detail, triage, and postmortem pages render successfully.

## Rollback

If a release breaks critical route rendering, rollback to the previous GitHub commit and redeploy.

If a Prisma migration fails in staging, stop promotion, restore from the latest database backup, and keep the app on fallback data until the migration is corrected.

## Success Signals

- CI passes on `main`.
- Smoke tests cover overview and domain detail.
- Pages remain readable without authentication or CRUD.
- The product still feels centered on software ownership rather than task management.
