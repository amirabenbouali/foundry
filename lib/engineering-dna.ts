import { calculateOwnershipHealth } from "./ownership-health";
import { calculateDeploymentReadiness } from "./readiness";
import type { ReadinessPlan } from "./readiness";

type DnaIssue = {
  status: string;
  plan?: ReadinessPlan;
};

type DnaIncident = {
  status: string;
  postmortemRequired?: boolean | null;
};

export type EngineeringDnaStatus = "Stable" | "Evolving" | "Fragile";

export type EngineeringDnaInput = {
  owner?: string | null;
  issues: DnaIssue[];
  incidents: DnaIncident[];
};

export type EngineeringDna = {
  score: number;
  status: EngineeringDnaStatus;
  traits: string[];
  explanation: string;
  averageReadiness: number;
  activeIncidentCount: number;
  postmortemRequiredCount: number;
  missingRolloutPlanCount: number;
  missingMonitoringPlanCount: number;
};

export function getEngineeringDnaStatus(score: number): EngineeringDnaStatus {
  if (score >= 85) {
    return "Stable";
  }

  if (score >= 60) {
    return "Evolving";
  }

  return "Fragile";
}

function hasText(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

export function calculateEngineeringDna(input: EngineeringDnaInput): EngineeringDna {
  const openIssues = input.issues.filter((issue) => issue.status !== "RESOLVED");
  const activeIncidents = input.incidents.filter((incident) => incident.status !== "RESOLVED");
  const postmortemRequiredIncidents = input.incidents.filter(
    (incident) => Boolean(incident.postmortemRequired),
  );
  const missingRolloutPlanCount = openIssues.filter(
    (issue) => !hasText(issue.plan?.rolloutPlan),
  ).length;
  const missingMonitoringPlanCount = openIssues.filter(
    (issue) => !hasText(issue.plan?.monitoringPlan),
  ).length;
  const readinessScores = openIssues.map((issue) => calculateDeploymentReadiness(issue.plan).score);
  const averageReadiness =
    readinessScores.length > 0
      ? Math.round(readinessScores.reduce((total, score) => total + score, 0) / readinessScores.length)
      : 100;
  const ownershipHealth = calculateOwnershipHealth(input);

  const deductions = [
    Math.round((100 - ownershipHealth.score) * 0.35),
    Math.round((100 - averageReadiness) * 0.25),
    Math.min(activeIncidents.length * 12, 30),
    Math.min(postmortemRequiredIncidents.length * 10, 20),
    Math.min(missingRolloutPlanCount * 6, 24),
    Math.min(missingMonitoringPlanCount * 6, 24),
  ];
  const score = Math.max(0, 100 - deductions.reduce((total, deduction) => total + deduction, 0));
  const status = getEngineeringDnaStatus(score);
  const traits = [
    ownershipHealth.score >= 85 ? "Well-owned" : null,
    missingRolloutPlanCount === 0 ? "Rollout-aware" : null,
    missingMonitoringPlanCount > 0 ? "Under-monitored" : null,
    activeIncidents.length > 0 || postmortemRequiredIncidents.length > 0 ? "Incident-prone" : null,
    averageReadiness < 60 || missingRolloutPlanCount > 0 ? "Needs clearer plans" : null,
    averageReadiness >= 85 && activeIncidents.length === 0 ? "Ready to ship" : null,
  ].filter((trait): trait is string => Boolean(trait));
  const explanation =
    status === "Stable"
      ? "This system shows steady ownership, strong shipment evidence, and low operational turbulence."
      : status === "Evolving"
        ? "This system has active ownership signals, but its behavior shows plan gaps or operational pressure that should stay visible."
        : "This system is carrying fragile signals: weak shipment evidence, incident pressure, or stewardship gaps are changing its risk profile.";

  return {
    score,
    status,
    traits,
    explanation,
    averageReadiness,
    activeIncidentCount: activeIncidents.length,
    postmortemRequiredCount: postmortemRequiredIncidents.length,
    missingRolloutPlanCount,
    missingMonitoringPlanCount,
  };
}
