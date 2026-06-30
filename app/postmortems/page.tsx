import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { getIncidents } from "@/lib/data";
import { formatLabel } from "@/lib/utils";

const fields = [
  ["Impact", "impact"],
  ["Root Cause", "rootCause"],
  ["Resolution", "resolution"],
  ["Prevention", "prevention"],
] as const;

export default async function PostmortemsPage() {
  const incidents = await getIncidents();

  return (
    <>
      <PageHeader
        eyebrow="Postmortems"
        title="Incident learning loop"
        description="Incidents stay connected to the domains and systems that own the prevention work."
      />

      <section className="grid gap-4">
        {incidents.map((incident) => (
          <article
            key={incident.id}
            className="rounded-lg border border-neutral-200/90 bg-white/88 p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-neutral-950">{incident.title}</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {incident.domain?.name} · {formatLabel(incident.severity)}
                </p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                {incident.postmortemRequired ? <StatusPill value="CRITICAL" /> : null}
                <StatusPill value={incident.status} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-600">{incident.summary}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {fields.map(([label, key]) => (
                <div key={key} className="rounded-md border border-neutral-200 bg-neutral-50/70 p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    {label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-700">{incident[key]}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
