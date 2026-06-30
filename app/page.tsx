import Link from "next/link";
import { DomainCard } from "@/components/domain-card";
import { PageHeader } from "@/components/page-header";
import { SectionPanel } from "@/components/section-panel";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import {
  getIncidents,
  getOverviewMetrics,
  getRecentRolloutActivity,
  getSystemsNeedingAttention,
  getWeeklyFocus,
} from "@/lib/data";

export default async function OverviewPage() {
  const [metrics, attentionSystems, weeklyFocus, incidents, rolloutActivity] = await Promise.all([
    getOverviewMetrics(),
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
