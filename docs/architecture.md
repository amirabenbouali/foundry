# Foundry Architecture

Foundry is a Next.js App Router application for software ownership, operational risk, rollouts, incidents, and postmortems.

## Stack

- Next.js App Router with React Server Components by default.
- TypeScript for application code and data contracts.
- Tailwind CSS for a restrained monochrome interface system.
- Prisma for the domain model and PostgreSQL access.
- PostgreSQL as the production datastore.

## Data Access

The UI reads through `lib/data.ts`. That layer hides whether the app is using Prisma or the local sample data in `lib/sample-data.ts`.

This keeps early product work fast while preserving a clean path to real database-backed pages.

## Core Model

- `Workspace` is the top-level operating boundary.
- `Domain` represents an owned software system.
- `Issue` represents an engineering risk or ownership gap.
- `EngineeringPlan` captures the technical path for selected issues.
- `Incident` captures active interruptions and postmortem learning.

## Routing

- `/` gives the operational overview.
- `/domains` lists owned systems.
- `/domains/[id]` shows one system ownership profile.
- `/issues` lists engineering risks.
- `/issues/[id]` shows the attached engineering plan.
- `/triage` groups incident ownership work.
- `/postmortems` keeps incident learning connected to prevention.
- `/settings` holds workspace-level configuration.

## Current Constraints

- No authentication yet.
- No complex CRUD yet.
- No background jobs yet.
- Seed data is intentionally small and opinionated.
