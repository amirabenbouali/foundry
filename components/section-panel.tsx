type SectionPanelProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function SectionPanel({ title, description, children }: SectionPanelProps) {
  return (
    <section className="rounded-lg border border-neutral-200/90 bg-white/88 shadow-soft">
      <div className="border-b border-neutral-100 px-5 py-4">
        <h2 className="text-sm font-semibold text-neutral-950">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-5 text-neutral-500">{description}</p> : null}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
