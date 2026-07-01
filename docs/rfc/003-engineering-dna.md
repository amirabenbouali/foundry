# RFC 003: Engineering DNA

## Problem

Point-in-time metrics do not explain how a system behaves. Foundry needs to summarize the character and risk profile of each software domain.

## Proposed Solution

Add Engineering DNA as a derived domain profile.

The profile answers: "What kind of system is this, and what risks does its behavior reveal?"

## Scoring Logic

Engineering DNA combines:

- ownership health
- deployment readiness of related issues
- active incidents
- postmortem-required incidents
- missing rollout plans
- missing monitoring plans

Statuses:

- `Stable`: 85-100
- `Evolving`: 60-84
- `Fragile`: 0-59

Traits include:

- Well-owned
- Rollout-aware
- Under-monitored
- Incident-prone
- Needs clearer plans
- Ready to ship

## Tradeoffs

- DNA is opinionated and synthetic; it is not a raw metric.
- The profile is more useful for diagnosis than for precise ranking.
- Early scoring uses deterministic weights rather than historical calibration.

## Risks

- Users may over-index on labels like Fragile without reading the diagnosis.
- Traits may need tuning once real production data exists.
- Missing plan fields may not always imply true operational risk.

## Future Improvements

- Persist DNA history and show system drift.
- Add domain criticality and dependency impact.
- Use incident recurrence and deployment failure rates.
- Add owner annotations explaining temporary risk.
