import Link from "next/link";
import { OwnershipHealthBadge, OwnershipHealthMeter } from "@/components/ownership-health";
import type { OwnershipHealth } from "@/lib/ownership-health";
import { formatLabel } from "@/lib/utils";

type DomainCardProps = {
  domain: {
    id: string;
    name: string;
    owner: string;
    health: string;
    system: string;
    description: string;
    _count: {
      issues: number;
      incidents?: number;
    };
    ownershipHealth?: OwnershipHealth;
  };
};

const healthTone: Record<string, string> = {
  HEALTHY: "border-emerald-200 bg-emerald-50 text-emerald-800",
  WATCH: "border-amber-200 bg-amber-50 text-amber-800",
  AT_RISK: "border-rose-200 bg-rose-50 text-rose-800",
  CRITICAL: "border-neutral-900 bg-neutral-950 text-white",
};

export function DomainCard({ domain }: DomainCardProps) {
  return (
    <Link
      href={`/domains/${domain.id}`}
      className="block rounded-lg border border-neutral-200/90 bg-white/88 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-neutral-300 hover:bg-white"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-950">{domain.name}</h2>
          <p className="mt-1 text-sm text-neutral-500">{domain.system}</p>
        </div>
        <span
          className={`shrink-0 rounded-md border px-2 py-1 text-xs font-medium ${
            healthTone[domain.health] ?? "border-neutral-200 bg-neutral-100 text-neutral-700"
          }`}
        >
          {formatLabel(domain.health)}
        </span>
      </div>

      <p className="mt-4 min-h-12 text-sm leading-6 text-neutral-600">{domain.description}</p>

      {domain.ownershipHealth ? (
        <div className="mt-5 rounded-md border border-neutral-200 bg-neutral-50/70 p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="text-sm font-semibold text-neutral-950">
              {domain.ownershipHealth.score}%
            </div>
            <OwnershipHealthBadge status={domain.ownershipHealth.status} />
          </div>
          <div className="mt-3">
            <OwnershipHealthMeter score={domain.ownershipHealth.score} />
          </div>
          <div className="mt-3 space-y-1">
            {domain.ownershipHealth.reasons.slice(0, 3).map((reason) => (
              <p key={reason} className="text-xs leading-5 text-neutral-600">
                {reason}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-neutral-100 pt-4 text-sm">
        <div>
          <div className="text-neutral-500">Owner</div>
          <div className="mt-1 font-medium text-neutral-900">{domain.owner}</div>
        </div>
        <div>
          <div className="text-neutral-500">Open issues</div>
          <div className="mt-1 font-medium text-neutral-900">
            {domain._count.issues}
            {domain._count.incidents ? (
              <span className="ml-2 text-neutral-400">{domain._count.incidents} incidents</span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
