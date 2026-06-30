import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { SectionPanel } from "@/components/section-panel";
import { StatusPill } from "@/components/status-pill";
import { getDomain } from "@/lib/data";
import { formatLabel } from "@/lib/utils";

type DomainDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DomainDetailPage({ params }: DomainDetailPageProps) {
  const { id } = await params;
  const domain = await getDomain(id);

  if (!domain) {
    notFound();
  }

  const openIssues = domain.issues.filter((issue) => issue.status !== "RESOLVED");
  const activeIncidents = domain.incidents.filter((incident) => incident.status !== "RESOLVED");

  return (
    <>
      <PageHeader
        eyebrow="Domain"
        title={domain.name}
        description={domain.description}
        action={<StatusPill value={domain.health} />}
      />

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-neutral-200 bg-white/88 p-4 shadow-soft">
          <div className="text-xs font-medium text-neutral-500">Owner</div>
          <div className="mt-2 text-sm font-semibold text-neutral-950">{domain.owner}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white/88 p-4 shadow-soft">
          <div className="text-xs font-medium text-neutral-500">Health</div>
          <div className="mt-2 text-sm font-semibold text-neutral-950">{formatLabel(domain.health)}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white/88 p-4 shadow-soft">
          <div className="text-xs font-medium text-neutral-500">Open issues</div>
          <div className="mt-2 text-sm font-semibold text-neutral-950">{openIssues.length}</div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white/88 p-4 shadow-soft">
          <div className="text-xs font-medium text-neutral-500">Active incidents</div>
          <div className="mt-2 text-sm font-semibold text-neutral-950">{activeIncidents.length}</div>
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionPanel title="System Ownership" description={domain.system}>
          <div className="space-y-5">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Rollout Notes
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{domain.rolloutNotes}</p>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                Dependencies
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {domain.dependencies.map((dependency) => (
                  <span
                    key={dependency}
                    className="rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-700"
                  >
                    {dependency}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Open Ownership Work">
          <div className="divide-y divide-neutral-100">
            {openIssues.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`} className="block py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-medium text-neutral-950">{issue.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{issue.risk}</p>
                  </div>
                  <StatusPill value={issue.status} />
                </div>
              </Link>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Active Incidents">
          <div className="space-y-3">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-medium text-neutral-950">{incident.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{incident.impact}</p>
                  </div>
                  <StatusPill value={incident.status} />
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>
    </>
  );
}
