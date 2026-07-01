import { PageHeader } from "@/components/page-header";
import { SectionPanel } from "@/components/section-panel";
import { StatusPill } from "@/components/status-pill";
import { getIncidents } from "@/lib/data";
import { formatLabel } from "@/lib/utils";

const groups = [
  {
    title: "Critical and Active",
    matcher: (incident: { severity: string; status: string }) =>
      incident.severity === "SEV1" || incident.status === "ACTIVE",
  },
  {
    title: "Monitoring",
    matcher: (incident: { status: string }) => incident.status === "MONITORING",
  },
  {
    title: "Resolved",
    matcher: (incident: { status: string }) => incident.status === "RESOLVED",
  },
];

export default async function TriagePage() {
  const incidents = await getIncidents();

  return (
    <>
      <PageHeader
        eyebrow="Triage"
        title="Incident ownership triage"
        description="Severity, domain owner, postmortem pressure, and follow-up ownership in one place."
      />

      <div className="grid gap-5">
        {groups.map((group) => {
          const groupedIncidents = incidents.filter(group.matcher);

          return (
            <SectionPanel key={group.title} title={group.title}>
              <div className="space-y-3">
                {groupedIncidents.map((incident) => (
                  <article
                    key={incident.id}
                    className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-semibold text-neutral-950">{incident.title}</h2>
                        <p className="mt-1 text-sm text-neutral-500">
                          {incident.domain?.name} · {incident.domain?.owner}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <StatusPill value={incident.severity} />
                        <StatusPill value={incident.status} />
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-neutral-600">{incident.summary}</p>
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-200 pt-4 text-xs font-medium text-neutral-600">
                      <span className="rounded-md border border-neutral-200 bg-white px-2 py-1">
                        {formatLabel(incident.severity)}
                      </span>
                      <span className="rounded-md border border-neutral-200 bg-white px-2 py-1">
                        {incident.postmortemRequired ? "Postmortem required" : "Postmortem optional"}
                      </span>
                    </div>
                  </article>
                ))}
                {groupedIncidents.length === 0 ? (
                  <p className="text-sm text-neutral-500">No incidents in this lane.</p>
                ) : null}
              </div>
            </SectionPanel>
          );
        })}
      </div>
    </>
  );
}
