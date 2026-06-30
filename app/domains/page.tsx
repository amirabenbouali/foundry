import { DomainCard } from "@/components/domain-card";
import { PageHeader } from "@/components/page-header";
import { getDomains } from "@/lib/data";

export default async function DomainsPage() {
  const domains = await getDomains();

  return (
    <>
      <PageHeader
        eyebrow="Domains"
        title="Owned software systems"
        description="Each domain represents a real ownership boundary with an accountable owner, health signal, and operational risk surface."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {domains.map((domain) => (
          <DomainCard key={domain.slug} domain={domain} />
        ))}
      </section>
    </>
  );
}
