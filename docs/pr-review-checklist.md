# PR Review Checklist

Use this checklist for Foundry changes.

## Product Fit

- Does the change reinforce software ownership?
- Does it avoid turning Foundry into a generic task manager?
- Are domains, risks, rollouts, incidents, or postmortems made clearer?

## Engineering Quality

- Is the change scoped and readable?
- Are server components used where appropriate?
- Does UI data flow through `lib/data.ts`?
- Are Prisma schema changes reflected in seed data and docs when needed?

## Reliability

- Does `npm run lint` pass?
- Does `npm run test` pass?
- Does `npm run build` pass?
- Are important routes covered by smoke tests if behavior changed?

## Operational Thinking

- Is rollout behavior explicit?
- Is rollback behavior clear for risky changes?
- Are monitoring or observability implications documented?
- Do incidents and postmortems remain connected to domain ownership?

## Deferrals

- No authentication until the ownership model is stable.
- No CRUD until read-model workflows are validated.
- No complex workflow automation before core operating loops are clear.
