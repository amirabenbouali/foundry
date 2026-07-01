import { cn } from "@/lib/utils";
import type { OwnershipHealthStatus } from "@/lib/ownership-health";

const statusTone: Record<OwnershipHealthStatus, string> = {
  Healthy: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Watch: "border-amber-200 bg-amber-50 text-amber-800",
  "At risk": "border-neutral-900 bg-neutral-950 text-white",
};

export function OwnershipHealthBadge({ status }: { status: OwnershipHealthStatus }) {
  return (
    <span className={cn("inline-flex rounded-md border px-2 py-1 text-xs font-medium", statusTone[status])}>
      {status}
    </span>
  );
}

export function OwnershipHealthMeter({ score }: { score: number }) {
  return (
    <div className="w-full">
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
        <div className="h-full rounded-full bg-neutral-950" style={{ width: `${score}%` }} />
      </div>
      <div className="mt-1 text-xs font-medium text-neutral-600">{score}% ownership health</div>
    </div>
  );
}
