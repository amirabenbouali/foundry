# Observability

Foundry does not send telemetry yet. This document captures the intended Sentry and operational monitoring shape for future production deployments.

## Sentry Placeholder Setup

Future setup should include:

- Sentry project for the Next.js app.
- Server-side error capture for App Router routes.
- Client-side error capture for navigation and rendering failures.
- Release tracking tied to GitHub commit SHA.
- Source maps uploaded during CI.

No Sentry DSN is committed in this repository.

## Signals to Monitor

### Active Incidents

Track incident count by status and severity. Alert when active incidents increase or remain active beyond an agreed threshold.

### Domain Health Changes

Capture transitions between `HEALTHY`, `WATCH`, `AT_RISK`, and `CRITICAL`. Health changes should be attributable to owners and recent issue or incident activity.

### Failed Rollouts

Monitor rollout-related issues, rollback frequency, and incidents that occur during staged changes.

### Issue Latency

Track time from issue creation to triage, plan attachment, and resolution. Long latency indicates ownership gaps.

### Postmortem-Required Incidents

Monitor incidents marked `postmortemRequired`. Alert when required postmortems remain incomplete after the follow-up window.

## Dashboard Direction

Operational dashboards should answer:

- Which domains are getting riskier?
- Which rollouts failed or required rollback?
- Which incidents still need learning artifacts?
- Which owners are blocked by missing signals?
- Which systems lack current engineering plans?
