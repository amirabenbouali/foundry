import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ReadinessBadge, ReadinessMeter } from "@/components/readiness";
import { SectionPanel } from "@/components/section-panel";
import { StatusPill } from "@/components/status-pill";
import { getIssue } from "@/lib/data";
import { calculateDeploymentReadiness } from "@/lib/readiness";
import { formatLabel } from "@/lib/utils";

type IssueDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const planSections = [
  ["Technical Approach", "approach"],
  ["Edge Cases", "edgeCases"],
  ["Test Plan", "testPlan"],
  ["Rollout Plan", "rolloutPlan"],
  ["Monitoring Plan", "monitoringPlan"],
  ["Rollback Plan", "rollbackPlan"],
] as const;

export default async function IssueDetailPage({ params }: IssueDetailPageProps) {
  const { id } = await params;
  const issue = await getIssue(id);

  if (!issue) {
    notFound();
  }

  const plan = issue.plan;
  const readiness = calculateDeploymentReadiness(plan);

  return (
    <>
      <PageHeader
        eyebrow="Engineering Issue"
        title={issue.title}
        description={issue.summary}
        action={<StatusPill value={issue.status} />}
      />

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white/88 p-4 shadow-soft">
          <div className="text-xs font-medium text-neutral-500">Domain</div>
          <div className="mt-2 text-sm font-semibold text-neutral-950">{issue.domain?.name}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white/88 p-4 shadow-soft">
          <div className="text-xs font-medium text-neutral-500">Severity</div>
          <div className="mt-2 text-sm font-semibold text-neutral-950">{formatLabel(issue.severity)}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white/88 p-4 shadow-soft">
          <div className="text-xs font-medium text-neutral-500">Status</div>
          <div className="mt-2">
            <StatusPill value={issue.status} />
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white/88 p-4 shadow-soft">
          <div className="text-xs font-medium text-neutral-500">Plan owner</div>
          <div className="mt-2 text-sm font-semibold text-neutral-950">{issue.plan?.owner ?? "Unassigned"}</div>
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <SectionPanel
          title="Deployment Readiness"
          description="Foundry's judgement of whether this work has enough evidence to ship safely."
        >
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-3xl font-semibold text-neutral-950">{readiness.score}%</div>
                <p className="mt-1 text-sm text-neutral-500">Safe-to-ship confidence</p>
              </div>
              <ReadinessBadge status={readiness.status} />
            </div>
            <ReadinessMeter score={readiness.score} />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Evidence Present
                </h2>
                <div className="mt-3 space-y-2">
                  {readiness.completedSections.length > 0 ? (
                    readiness.completedSections.map((section) => (
                      <div key={section.key} className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
                        {section.label}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-neutral-600">No readiness evidence has been attached yet.</p>
                  )}
                </div>
              </div>
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Judgement Gaps
                </h2>
                <div className="mt-3 space-y-2">
                  {readiness.missingSections.length > 0 ? (
                    readiness.missingSections.map((section) => (
                      <div key={section.key} className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700">
                        {section.label}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-neutral-600">No blocking gaps detected in the deployment plan.</p>
                  )}
                </div>
              </div>
            </div>

            {readiness.blockers.length > 0 ? (
              <div className="border-t border-neutral-100 pt-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Blocking Safe Shipment
                </h2>
                <div className="mt-3 space-y-2">
                  {readiness.blockers.map((blocker) => (
                    <p key={blocker} className="text-sm leading-6 text-neutral-700">
                      {blocker}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </SectionPanel>

        <SectionPanel title="Risk Narrative">
          <div className="space-y-5">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Risk</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{issue.risk}</p>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Rollout</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{issue.rollout}</p>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title={plan?.title ?? "Engineering Plan Needed"}
          description={plan ? `${formatLabel(plan.status)} plan` : "No plan has been attached yet."}
        >
          {plan ? (
            <div className="grid gap-4 md:grid-cols-2">
              {planSections.map(([label, key]) => (
                <div key={key} className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    {label}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{plan[key]}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm leading-6 text-neutral-600">
              This issue is still in intake. The next step is to name the owner, clarify edge cases,
              and define rollout and rollback paths before implementation begins.
            </p>
          )}
        </SectionPanel>
      </div>
    </>
  );
}
