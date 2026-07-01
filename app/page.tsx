import Link from "next/link";
import { DomainCard } from "@/components/domain-card";
import { EngineeringDnaBadge } from "@/components/engineering-dna";
import { OwnershipHealthMeter } from "@/components/ownership-health";
import { PageHeader } from "@/components/page-header";
import { ReadinessBadge, ReadinessMeter } from "@/components/readiness";
import { SectionPanel } from "@/components/section-panel";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import {
  getDeploymentReadinessSummary,
  getEngineeringDnaSummary,
  getIncidents,
  getOverviewMetrics,
  getOwnershipHealthSummary,
  getRecentRolloutActivity,
  getSystemsNeedingAttention,
  getWeeklyFocus,
} from "@/lib/data";

export default async function OverviewPage() {
  const [
    metrics,
    dnaSummary,
    readinessSummary,
    ownershipHealthSummary,
    attentionSystems,
    weeklyFocus,
    incidents,
    rolloutActivity,
  ] = await Promise.all([
    getOverviewMetrics(),
    getEngineeringDnaSummary(),
    getDeploymentReadinessSummary(),
    getOwnershipHealthSummary(),
    getSystemsNeedingAttention(),
    getWeeklyFocus(),
    getIncidents(),
    getRecentRolloutActivity(),
  ]);
  const activeIncidents = incidents.filter((incident) => incident.status !== "RESOLVED");

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Software ownership posture"
        description="A quiet operational view of the systems, risks, incidents, and rollout work that need engineering ownership."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total domains" value={metrics.totalDomains} detail="Owned software boundaries" />
        <StatCard label="Open issues" value={metrics.openIssues} detail="Risks not yet resolved" />
        <StatCard label="Active incidents" value={metrics.activeIncidents} detail="Active or monitoring" />
        <StatCard label="Domains at risk" value={metrics.domainsAtRisk} detail="At risk or critical health" />
      </section>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionPanel
          title="System DNA"
          description="A behavioral profile of how owned systems age, change, and reveal risk."
          className="xl:col-span-2"
        >
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Stable systems
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {dnaSummary.stableSystems}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Strong ownership and low behavioral risk.</p>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Evolving systems
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {dnaSummary.evolvingSystems}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Active change with signals worth watching.</p>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Fragile systems
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {dnaSummary.fragileSystems}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Systems showing risky behavioral patterns.</p>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Top fragile domain
              </div>
              {dnaSummary.topFragileDomain ? (
                <Link href={`/domains/${dnaSummary.topFragileDomain.id}`} className="mt-3 block">
                  <div className="text-sm font-semibold text-neutral-950">
                    {dnaSummary.topFragileDomain.name}
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-neutral-600">
                      {dnaSummary.topFragileDomain.score}% DNA
                    </span>
                    <EngineeringDnaBadge status="Fragile" />
                  </div>
                </Link>
              ) : (
                <p className="mt-3 text-sm leading-6 text-neutral-600">No fragile systems detected.</p>
              )}
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Deployment Readiness"
          description="A judgement layer for whether engineering work has enough evidence to ship safely."
          className="xl:col-span-2"
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Average readiness
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {readinessSummary.averageReadiness}%
              </div>
              <div className="mt-3">
                <ReadinessMeter score={readinessSummary.averageReadiness} />
              </div>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Ready issues
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {readinessSummary.readyIssues}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Plans with complete ship-safety evidence.</p>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Blocked issues
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {readinessSummary.blockedIssues}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Work missing enough evidence to ship safely.</p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-neutral-100">
            {readinessSummary.needsAttention.map((issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`} className="block py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-950">{issue.title}</h3>
                    <p className="mt-1 text-xs text-neutral-500">{issue.domain}</p>
                  </div>
                  <div className="min-w-28">
                    <ReadinessBadge status={issue.readiness.status} />
                    <div className="mt-2 text-xs font-medium text-neutral-600">
                      {issue.readiness.score}% ready
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Ownership Health"
          description="A stewardship signal for whether each system has an owner, active attention, and safe rollout evidence."
          className="xl:col-span-2"
        >
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Average ownership
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {ownershipHealthSummary.averageOwnershipScore}%
              </div>
              <div className="mt-3">
                <OwnershipHealthMeter score={ownershipHealthSummary.averageOwnershipScore} />
              </div>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Healthy domains
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {ownershipHealthSummary.healthyDomains}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Systems with clear ownership and low operational drag.</p>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                On watch
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {ownershipHealthSummary.watchDomains}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Systems that need closer owner attention.</p>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
              <div className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                At-risk domains
              </div>
              <div className="mt-3 text-3xl font-semibold text-neutral-950">
                {ownershipHealthSummary.atRiskDomains}
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-600">Systems where stewardship evidence is weak.</p>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Systems Needing Attention"
          description="Domains with elevated health signals, unresolved risks, or active operational load."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            {attentionSystems.map((domain) => (
              <DomainCard key={domain.slug} domain={domain} />
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="This Week's Engineering Focus">
          <div className="space-y-4">
            {weeklyFocus.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="block rounded-md border border-neutral-200 bg-neutral-50/70 p-4 transition hover:border-neutral-300 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-950">{issue.title}</h3>
                    <p className="mt-1 text-xs text-neutral-500">{issue.domain?.name}</p>
                  </div>
                  <StatusPill value={issue.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{issue.rollout}</p>
              </Link>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Active Incidents" description="Operational interruptions that still need owner attention.">
          <div className="space-y-3">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-950">{incident.title}</h3>
                    <p className="mt-1 text-xs text-neutral-500">{incident.domain?.name}</p>
                  </div>
                  <StatusPill value={incident.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{incident.summary}</p>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Recent Rollout Activity" description="Planned changes tied back to ownership risks.">
          <div className="divide-y divide-neutral-100">
            {rolloutActivity.map((activity) => (
              <Link key={activity.id} href={`/issues/${activity.id}`} className="block py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-950">{activity.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-neutral-600">{activity.rollout}</p>
                    <p className="mt-1 text-xs text-neutral-500">{activity.domain}</p>
                  </div>
                  <StatusPill value={activity.status} />
                </div>
              </Link>
            ))}
          </div>
        </SectionPanel>
      </div>
    </>
  );
}
