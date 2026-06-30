import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { getIssues } from "@/lib/data";
import { formatLabel } from "@/lib/utils";

export default async function IssuesPage() {
  const issues = await getIssues();

  return (
    <>
      <PageHeader
        eyebrow="Issues"
        title="Engineering risks"
        description="Risks, reliability gaps, and ownership work that affect software systems and rollout safety."
      />

      <section className="overflow-hidden rounded-lg border border-neutral-200/90 bg-white/88 shadow-soft">
        <div className="hidden grid-cols-[1.2fr_0.8fr_0.4fr_0.4fr] gap-4 border-b border-neutral-200 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 md:grid">
          <div>Risk</div>
          <div>Domain</div>
          <div>Status</div>
          <div>Severity</div>
        </div>
        <div className="divide-y divide-neutral-100">
          {issues.map((issue) => (
            <Link
              key={issue.id}
              href={`/issues/${issue.id}`}
              className="grid grid-cols-1 gap-3 px-4 py-4 transition hover:bg-neutral-50 md:grid-cols-[1.2fr_0.8fr_0.4fr_0.4fr] md:items-center md:gap-4"
            >
              <div>
                <h2 className="text-sm font-medium text-neutral-950">{issue.title}</h2>
                <p className="mt-1 text-sm leading-6 text-neutral-500">{issue.risk}</p>
              </div>
              <div className="text-sm text-neutral-700">{issue.domain?.name}</div>
              <div>
                <StatusPill value={issue.status} />
              </div>
              <div className="text-sm font-medium text-neutral-800">{formatLabel(issue.severity)}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
