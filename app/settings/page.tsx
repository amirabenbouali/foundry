import { PageHeader } from "@/components/page-header";
import { getWorkspace } from "@/lib/data";

export default async function SettingsPage() {
  const workspace = await getWorkspace();

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Workspace basics"
        description="Configuration stays intentionally small until ownership, readiness, and system diagnosis are proven."
      />

      <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-soft">
        <div className="text-sm text-neutral-500">Workspace</div>
        <div className="mt-2 text-lg font-semibold text-neutral-950">{workspace.name}</div>
        <div className="mt-1 text-sm text-neutral-500">{workspace.slug}</div>
      </section>
    </>
  );
}
