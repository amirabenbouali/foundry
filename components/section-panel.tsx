import { cn } from "@/lib/utils";

type SectionPanelProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function SectionPanel({ title, description, children, className }: SectionPanelProps) {
  return (
    <section className={cn("rounded-lg border border-neutral-200/90 bg-white/88 shadow-soft", className)}>
      <div className="border-b border-neutral-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-neutral-950">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-5 text-neutral-500">{description}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
