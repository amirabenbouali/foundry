import { cn } from "@/lib/utils";
import type { EngineeringDnaStatus } from "@/lib/engineering-dna";

const statusTone: Record<EngineeringDnaStatus, string> = {
  Stable: "border-emerald-200 bg-emerald-50 text-emerald-800",
  Evolving: "border-amber-200 bg-amber-50 text-amber-800",
  Fragile: "border-neutral-900 bg-neutral-950 text-white",
};

export function EngineeringDnaBadge({ status }: { status: EngineeringDnaStatus }) {
  return (
    <span className={cn("inline-flex rounded-md border px-2 py-1 text-xs font-medium", statusTone[status])}>
      {status}
    </span>
  );
}

export function EngineeringDnaMeter({ score }: { score: number }) {
  return (
    <div className="w-full">
      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
        <div className="h-full rounded-full bg-neutral-950" style={{ width: `${score}%` }} />
      </div>
      <div className="mt-1 text-xs font-medium text-neutral-600">{score}% system DNA</div>
    </div>
  );
}
