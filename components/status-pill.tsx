import { formatLabel } from "@/lib/utils";

type StatusPillProps = {
  value: string;
};

const tones: Record<string, string> = {
  OPEN: "border-neutral-200 bg-neutral-50 text-neutral-700",
  TRIAGE: "border-amber-200 bg-amber-50 text-amber-800",
  PLANNED: "border-sky-200 bg-sky-50 text-sky-800",
  IN_PROGRESS: "border-violet-200 bg-violet-50 text-violet-800",
  RESOLVED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  ACTIVE: "border-rose-200 bg-rose-50 text-rose-800",
  MONITORING: "border-amber-200 bg-amber-50 text-amber-800",
  HIGH: "border-orange-200 bg-orange-50 text-orange-800",
  CRITICAL: "border-neutral-900 bg-neutral-950 text-white",
  MEDIUM: "border-neutral-200 bg-neutral-50 text-neutral-700",
  LOW: "border-neutral-200 bg-white text-neutral-600",
};

export function StatusPill({ value }: StatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${
        tones[value] ?? "border-neutral-200 bg-neutral-50 text-neutral-700"
      }`}
    >
      {formatLabel(value)}
    </span>
  );
}
