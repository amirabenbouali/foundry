import Link from "next/link";
import { notFound } from "next/navigation";
import { OwnershipHealthBadge, OwnershipHealthMeter } from "@/components/ownership-health";
import { PageHeader } from "@/components/page-header";
import { SectionPanel } from "@/components/section-panel";
import { StatusPill } from "@/components/status-pill";
import { getDomain } from "@/lib/data";
import { calculateOwnershipHealth } from "@/lib/ownership-health";
import { calculateDeploymentReadiness } from "@/lib/readiness";
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
  const ownershipHealth = calculateOwnershipHealth(domain);
  const blockedIssues = openIssues.filter(
    (issue) => calculateDeploymentReadiness(issue.plan).status === "Blocked",
  );

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
        <SectionPanel
          title="Ownership Health"
          description="Foundry asks who owns this system and whether it is being looked after properly."
          className="xl:col-span-2"
        >
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-3xl font-semibold text-neutral-950">
                    {ownershipHealth.score}%
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">System stewardship signal</p>
                </div>
                <OwnershipHealthBadge status={ownershipHealth.status} />
              </div>
              <div className="mt-4">
                <OwnershipHealthMeter score={ownershipHealth.score} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-neutral-500">Blocked issues</div>
                  <div className="mt-1 font-semibold text-neutral-950">
                    {ownershipHealth.blockedIssueCount}
                  </div>
                </div>
                <div>
                  <div className="text-neutral-500">Plan gaps</div>
                  <div className="mt-1 font-semibold text-neutral-950">
                    {ownershipHealth.missingRolloutOrMonitoringCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                  Health Reasons
                </h2>
                <div className="mt-3 space-y-2">
                  {ownershipHealth.reasons.map((reason) => (
                    <p key={reason} className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm leading-6 text-neutral-700">
                      {reason}
                    </p>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Related Blocked Issues
                  </h2>
                  <div className="mt-3 space-y-2">
                    {blockedIssues.length > 0 ? (
                      blockedIssues.map((issue) => (
                        <Link
                          key={issue.id}
                          href={`/issues/${issue.id}`}
                          className="block rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-800"
                        >
                          {issue.title}
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-neutral-600">
                        No open issues are blocked by missing readiness evidence.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Active Incidents
                  </h2>
                  <div className="mt-3 space-y-2">
                    {activeIncidents.length > 0 ? (
                      activeIncidents.map((incident) => (
                        <div key={incident.id} className="rounded-md border border-neutral-200 bg-white px-3 py-2">
                          <div className="text-sm font-medium text-neutral-900">{incident.title}</div>
                          <p className="mt-1 text-xs leading-5 text-neutral-500">{incident.impact}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-neutral-600">
                        No active incidents are attached to this system.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionPanel>

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
