import { cn } from "@/lib/utils";
import type { ReadinessStatus } from "@/lib/readiness";

const statusTone: Record<ReadinessStatus, string> = {
  Ready: "border-emerald-200 bg-emerald-50 text-emerald-800",
  "Needs attention": "border-amber-200 bg-amber-50 text-amber-800",
  Blocked: "border-neutral-900 bg-neutral-950 text-white",
};

export function ReadinessBadge({ status }: { status: ReadinessStatus }) {
  return (
    <span className={cn("inline-flex rounded-md border px-2 py-1 text-xs font-medium", statusTone[status])}>
      {status}
    </span>
  );
}

export function ReadinessMeter({ score }: { score: number }) {
  return (
    <div className="w-full">
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
        <div className="h-full rounded-full bg-neutral-950" style={{ width: `${score}%` }} />
      </div>
      <div className="mt-1 text-xs font-medium text-neutral-600">{score}% ready</div>
    </div>
  );
}

export function ReadinessScore({ score, status }: { score: number; status: ReadinessStatus }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-neutral-950">{score}%</span>
        <ReadinessBadge status={status} />
      </div>
      <ReadinessMeter score={score} />
    </div>
  );
}
