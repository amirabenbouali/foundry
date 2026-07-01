import { DomainCard } from "@/components/domain-card";
import { PageHeader } from "@/components/page-header";
import { getDomainsWithOwnershipHealth } from "@/lib/data";

export default async function DomainsPage() {
  const domains = await getDomainsWithOwnershipHealth();

  return (
    <>
      <PageHeader
        eyebrow="Domains"
        title="Systems under ownership"
        description="Each domain is a living software system with stewardship, shipment evidence, and behavioral signals."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {domains.map((domain) => (
          <DomainCard key={domain.slug} domain={domain} />
        ))}
      </section>
    </>
  );
}
