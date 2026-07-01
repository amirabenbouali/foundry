import { calculateDeploymentReadiness } from "./readiness";
import type { ReadinessPlan } from "./readiness";

type OwnershipIssue = {
  status: string;
  plan?: ReadinessPlan;
};

type OwnershipIncident = {
  status: string;
};

export type OwnershipHealthStatus = "Healthy" | "Watch" | "At risk";

export type OwnershipHealthInput = {
  owner?: string | null;
  issues: OwnershipIssue[];
  incidents: OwnershipIncident[];
};

export type OwnershipHealth = {
  score: number;
  status: OwnershipHealthStatus;
  reasons: string[];
  openIssueCount: number;
  activeIncidentCount: number;
  blockedIssueCount: number;
  missingRolloutOrMonitoringCount: number;
};

export function getOwnershipHealthStatus(score: number): OwnershipHealthStatus {
  if (score >= 85) {
    return "Healthy";
  }

  if (score >= 60) {
    return "Watch";
  }

  return "At risk";
}

function hasText(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export function calculateOwnershipHealth(input: OwnershipHealthInput): OwnershipHealth {
  const openIssues = input.issues.filter((issue) => issue.status !== "RESOLVED");
  const activeIncidents = input.incidents.filter((incident) => incident.status !== "RESOLVED");
  const blockedIssues = openIssues.filter(
    (issue) => calculateDeploymentReadiness(issue.plan).status === "Blocked",
  );
  const issuesMissingRolloutOrMonitoring = openIssues.filter(
    (issue) => !hasText(issue.plan?.rolloutPlan) || !hasText(issue.plan?.monitoringPlan),
  );
  const hasOwner = hasText(input.owner);

  const deductions = [
    hasOwner ? 0 : 25,
    Math.min(openIssues.length * 4, 20),
    Math.min(activeIncidents.length * 15, 30),
    Math.min(blockedIssues.length * 12, 36),
    Math.min(issuesMissingRolloutOrMonitoring.length * 8, 32),
  ];
  const score = Math.max(0, 100 - deductions.reduce((total, deduction) => total + deduction, 0));
  const riskReasons = [
    !hasOwner ? "No accountable owner is assigned." : null,
    activeIncidents.length > 0
      ? `${activeIncidents.length} active incident${activeIncidents.length === 1 ? "" : "s"} need owner attention.`
      : null,
    blockedIssues.length > 0
      ? `${blockedIssues.length} blocked issue${blockedIssues.length === 1 ? "" : "s"} lack safe-shipment evidence.`
      : null,
    issuesMissingRolloutOrMonitoring.length > 0
      ? `${issuesMissingRolloutOrMonitoring.length} issue${
          issuesMissingRolloutOrMonitoring.length === 1 ? "" : "s"
        } missing rollout or monitoring plans.`
      : null,
    openIssues.length > 0
      ? `${openIssues.length} open ownership issue${openIssues.length === 1 ? "" : "s"} remain.`
      : null,
  ].filter((reason): reason is string => Boolean(reason));
  const positiveReasons = [
    hasOwner ? "Accountable owner is assigned." : null,
    activeIncidents.length === 0 ? "No active incidents are attached to this system." : null,
    blockedIssues.length === 0 ? "No open issues are blocked by missing readiness evidence." : null,
    issuesMissingRolloutOrMonitoring.length === 0
      ? "Open work has rollout and monitoring evidence."
      : null,
  ].filter((reason): reason is string => Boolean(reason));

  return {
    score,
    status: getOwnershipHealthStatus(score),
    reasons: (riskReasons.length > 0 ? riskReasons : positiveReasons).slice(0, 4),
    openIssueCount: openIssues.length,
    activeIncidentCount: activeIncidents.length,
    blockedIssueCount: blockedIssues.length,
    missingRolloutOrMonitoringCount: issuesMissingRolloutOrMonitoring.length,
  };
}
