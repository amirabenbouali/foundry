import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SectionPanel } from "@/components/section-panel";
import { StatusPill } from "@/components/status-pill";
import { getIssue } from "@/lib/data";
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
        <SectionPanel title="Ownership Risk">
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
