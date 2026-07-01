# Foundry Runbook

This runbook covers local operation and first-response checks for Foundry.

## Start Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verify Health

```bash
npm run lint
npm run test
npm run build
```

For Prisma schema changes:

```bash
npx prisma generate
```

## PostgreSQL Setup

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`.
3. Run migrations.
4. Seed the database.

```bash
npm run prisma:migrate
npm run prisma:seed
```

## Common Issues

### App renders sample data

This is expected when `DATABASE_URL` is not set. `lib/data.ts` falls back to curated sample data.

### Prisma client type errors

Run:

```bash
npx prisma generate
```

### Playwright browser missing

Run:

```bash
npx playwright install chromium
```

### Route returns 404

Check that the ID matches the sample data or a database row. Example valid routes:

- `/domains/telemetry-pipeline`
- `/issues/trace-backpressure-visibility`

## Incident Response

1. Confirm whether the issue affects route rendering, data access, or styling.
2. Check the latest CI run.
3. Reproduce locally with `npm run build`.
4. If database-backed, verify `DATABASE_URL` and Prisma migration state.
5. Roll back the latest deploy if overview or domain detail pages are unavailable.
