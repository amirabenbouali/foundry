# RFC 001: Deployment Readiness

## Problem

Engineering work often appears ready because it has a title, owner, and status. That does not mean it is safe to ship.

Foundry needs a way to judge whether an issue has enough technical evidence for rollout.

## Proposed Solution

Add Deployment Readiness as a derived score for each issue with an EngineeringPlan.

The score answers: "Is this work actually safe to ship?"

## Scoring Logic

Each completed plan section contributes equally:

- technical approach
- edge cases
- test plan
- rollout plan
- monitoring plan
- rollback plan

Statuses:

- `Ready`: 85-100
- `Needs attention`: 50-84
- `Blocked`: 0-49

Missing sections become safe-shipment blockers.

## Tradeoffs

- Equal weighting is simple and explainable.
- The score does not yet account for issue severity or domain criticality.
- It rewards completeness, not plan quality.

## Risks

- Users may treat the score as mechanical approval.
- Teams may fill sections shallowly to improve score.
- Some low-risk work may not need all six sections.

## Future Improvements

- Weight sections by issue severity.
- Add reviewer confidence or owner approval.
- Track readiness score history.
- Integrate deployment outcomes to calibrate scoring.
