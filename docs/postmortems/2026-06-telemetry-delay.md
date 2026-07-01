# Postmortem: Telemetry Delay - June 2026

## Summary

Trace ingestion lag increased across the EU region after a collector rollout. Domain owners lost fresh trace visibility during active diagnosis windows.

## Impact

- EU trace visibility was delayed for 42 minutes.
- Service owners had incomplete diagnostic context.
- Incident response depended on metrics and logs while traces caught up.

## Root Cause

The collector rollout increased retry volume without matching queue capacity for high-cardinality services. Existing dashboards showed global ingestion health but did not expose domain-scoped backpressure quickly enough.

## Resolution

- Paused the collector rollout.
- Drained affected queues.
- Reduced sampling pressure for the region.
- Verified ingestion lag returned to baseline.

## Prevention

- Add domain-scoped ingestion health.
- Alert owners on lag, dropped spans, and queue saturation.
- Block collector promotion when regional ingestion exceeds policy thresholds.
- Include trace backpressure in rollout readiness checks.

## Follow-Up Ownership

- Domain: Telemetry Pipeline
- Owner: Lena Ortiz
- Related issue: Trace ingestion backpressure is invisible to service owners
