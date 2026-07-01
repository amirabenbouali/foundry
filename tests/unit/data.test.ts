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
