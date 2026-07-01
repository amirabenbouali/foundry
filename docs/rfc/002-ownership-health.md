# RFC 002: Ownership Health

## Problem

A domain can have an owner listed while still being neglected. Foundry needs to show whether a software system is actively stewarded.

## Proposed Solution

Add Ownership Health as a derived score for each domain.

The score answers: "Who owns this system, and is it being looked after properly?"

## Scoring Logic

Ownership Health considers:

- open issue count
- active incident count
- blocked issue count
- issues missing rollout or monitoring plans
- whether the domain has an owner

Statuses:

- `Healthy`: 85-100
- `Watch`: 60-84
- `At risk`: 0-59

The calculation returns short reasons explaining the score.

## Tradeoffs

- The model is deterministic and inspectable.
- It treats all open issues similarly for now.
- It does not yet account for domain criticality or historical trend.

## Risks

- A high score could hide important qualitative context.
- A low score could be noisy during known migration windows.
- Owner presence is necessary but not sufficient.

## Future Improvements

- Add domain criticality weighting.
- Persist ownership health snapshots over time.
- Add explicit ownership review dates.
- Connect health changes to incidents and deployment outcomes.
