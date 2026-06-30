type StatCardProps = {
  label: string;
  value: number;
  detail: string;
};

export function StatCard({ label, value, detail }: StatCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200/90 bg-white/88 p-5 shadow-soft">
      <div className="text-[13px] font-medium text-neutral-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-normal text-neutral-950">{value}</div>
      <div className="mt-2 text-sm leading-5 text-neutral-500">{detail}</div>
    </div>
  );
}
