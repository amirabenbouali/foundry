export const readinessSections = [
  {
    key: "approach",
    label: "Technical approach",
    blockingMessage: "Technical approach is not explicit enough to judge implementation risk.",
  },
  {
    key: "edgeCases",
    label: "Edge cases",
    blockingMessage: "Edge cases are not named, so hidden failure modes are still unknown.",
  },
  {
    key: "testPlan",
    label: "Test plan",
    blockingMessage: "Test plan is missing, so correctness evidence is not ready.",
  },
  {
    key: "rolloutPlan",
    label: "Rollout plan",
    blockingMessage: "Rollout path is missing, so blast-radius control is unclear.",
  },
  {
    key: "monitoringPlan",
    label: "Monitoring plan",
    blockingMessage: "Monitoring plan is missing, so safety signals are not defined.",
  },
  {
    key: "rollbackPlan",
    label: "Rollback plan",
    blockingMessage: "Rollback plan is missing, so recovery is not proven.",
  },
] as const;

export type ReadinessSectionKey = (typeof readinessSections)[number]["key"];
export type ReadinessSection = (typeof readinessSections)[number];

export type ReadinessPlan = Partial<Record<ReadinessSectionKey, string>> | null | undefined;

export type ReadinessStatus = "Ready" | "Needs attention" | "Blocked";

export type DeploymentReadiness = {
  score: number;
  status: ReadinessStatus;
  completedSections: ReadinessSection[];
  missingSections: ReadinessSection[];
  blockers: string[];
};

export function getReadinessStatus(score: number): ReadinessStatus {
  if (score >= 85) {
    return "Ready";
  }

  if (score >= 50) {
    return "Needs attention";
  }

  return "Blocked";
}

export function calculateDeploymentReadiness(plan: ReadinessPlan): DeploymentReadiness {
  const completedSections = readinessSections.filter((section) => {
    const value = plan?.[section.key];
    return typeof value === "string" && value.trim().length > 0;
  });
  const missingSections = readinessSections.filter(
    (section) => !completedSections.some((completed) => completed.key === section.key),
  );
  const score = Math.round((completedSections.length / readinessSections.length) * 100);

  return {
    score,
    status: getReadinessStatus(score),
    completedSections,
    missingSections,
    blockers: missingSections.map((section) => section.blockingMessage),
  };
}
