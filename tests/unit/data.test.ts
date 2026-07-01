import { describe, expect, it } from "vitest";
import {
  getDomain,
  getIncidents,
  getIssue,
  getOverviewMetrics,
  getRecentRolloutActivity,
  getSystemsNeedingAttention,
  getWeeklyFocus,
} from "../../lib/data";
import { calculateDeploymentReadiness, getReadinessStatus } from "../../lib/readiness";

describe("data helpers", () => {
  it("summarizes ownership posture metrics from fallback data", async () => {
    const metrics = await getOverviewMetrics();

    expect(metrics).toEqual({
      totalDomains: 5,
      openIssues: 7,
      activeIncidents: 2,
      domainsAtRisk: 2,
    });
  });

  it("returns a domain ownership profile with related work", async () => {
    const domain = await getDomain("telemetry-pipeline");

    expect(domain?.name).toBe("Telemetry Pipeline");
    expect(domain?.owner).toBe("Lena Ortiz");
    expect(domain?.dependencies).toContain("Alert Routing");
    expect(domain?.issues.length).toBeGreaterThan(0);
    expect(domain?.incidents.length).toBeGreaterThan(0);
  });

  it("returns issue details with an engineering plan when attached", async () => {
    const issue = await getIssue("trace-backpressure-visibility");

    expect(issue?.domain?.name).toBe("Telemetry Pipeline");
    expect(issue?.plan?.approach).toContain("Expose ingestion lag");
    expect(issue?.plan?.rollbackPlan).toContain("Turn off owner paging");
  });

  it("surfaces operating-system views for focus and rollout activity", async () => {
    const [attentionSystems, weeklyFocus, rolloutActivity, incidents] = await Promise.all([
      getSystemsNeedingAttention(),
      getWeeklyFocus(),
      getRecentRolloutActivity(),
      getIncidents(),
    ]);

    expect(attentionSystems.map((domain) => domain.slug)).toContain("telemetry-pipeline");
    expect(weeklyFocus.some((issue) => issue.status === "IN_PROGRESS")).toBe(true);
    expect(rolloutActivity.length).toBeGreaterThan(0);
    expect(incidents.some((incident) => incident.postmortemRequired)).toBe(true);
  });
});

describe("deployment readiness", () => {
  it("scores completed engineering plan sections", () => {
    const readiness = calculateDeploymentReadiness({
      approach: "Use owner-aware policies.",
      edgeCases: "Emergency override.",
      testPlan: "Policy tests.",
      rolloutPlan: "Report-only first.",
      monitoringPlan: "Override rate.",
      rollbackPlan: "Disable enforcement flag.",
    });

    expect(readiness.score).toBe(100);
    expect(readiness.status).toBe("Ready");
    expect(readiness.missingSections).toHaveLength(0);
  });

  it("marks partial plans as needing attention", () => {
    const readiness = calculateDeploymentReadiness({
      approach: "Define budget policy.",
      testPlan: "Replay fixtures.",
      rolloutPlan: "Report-only.",
    });

    expect(readiness.score).toBe(50);
    expect(readiness.status).toBe("Needs attention");
    expect(readiness.missingSections.map((section) => section.key)).toEqual([
      "edgeCases",
      "monitoringPlan",
      "rollbackPlan",
    ]);
  });

  it("marks missing plans as blocked", () => {
    const readiness = calculateDeploymentReadiness(null);

    expect(readiness.score).toBe(0);
    expect(readiness.status).toBe("Blocked");
    expect(readiness.blockers).toContain("Rollback plan is missing, so recovery is not proven.");
  });

  it("uses readiness thresholds", () => {
    expect(getReadinessStatus(100)).toBe("Ready");
    expect(getReadinessStatus(85)).toBe("Ready");
    expect(getReadinessStatus(84)).toBe("Needs attention");
    expect(getReadinessStatus(50)).toBe("Needs attention");
    expect(getReadinessStatus(49)).toBe("Blocked");
  });
});
