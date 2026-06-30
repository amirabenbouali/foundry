import { domains, incidents, issues, workspace } from "./sample-data";

type PrismaModule = typeof import("@prisma/client");

const prismaGlobal = globalThis as typeof globalThis & {
  prisma?: InstanceType<PrismaModule["PrismaClient"]>;
};

async function getPrisma() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  const { PrismaClient } = await import("@prisma/client");

  if (!prismaGlobal.prisma) {
    prismaGlobal.prisma = new PrismaClient();
  }

  return prismaGlobal.prisma;
}

function sampleDomainsWithCounts() {
  return domains.map((domain) => ({
    ...domain,
    _count: {
      issues: issues.filter(
        (issue) => issue.domainSlug === domain.slug && issue.status !== "RESOLVED",
      ).length,
      incidents: incidents.filter(
        (incident) => incident.domainSlug === domain.slug && incident.status !== "RESOLVED",
      ).length,
    },
  }));
}

export async function getOverviewMetrics() {
  const prisma = await getPrisma();

  if (prisma) {
    const [totalDomains, openIssues, activeIncidents, domainsAtRisk] = await Promise.all([
      prisma.domain.count(),
      prisma.issue.count({
        where: {
          status: {
            not: "RESOLVED",
          },
        },
      }),
      prisma.incident.count({
        where: {
          status: {
            in: ["ACTIVE", "MONITORING"],
          },
        },
      }),
      prisma.domain.count({
        where: {
          health: {
            in: ["AT_RISK", "CRITICAL"],
          },
        },
      }),
    ]);

    return { totalDomains, openIssues, activeIncidents, domainsAtRisk };
  }

  return {
    totalDomains: domains.length,
    openIssues: issues.filter((issue) => issue.status !== "RESOLVED").length,
    activeIncidents: incidents.filter((incident) => incident.status !== "RESOLVED").length,
    domainsAtRisk: domains.filter((domain) => ["AT_RISK", "CRITICAL"].includes(domain.health)).length,
  };
}

export async function getDomains() {
  const prisma = await getPrisma();

  if (prisma) {
    return prisma.domain.findMany({
      orderBy: [{ health: "desc" }, { name: "asc" }],
      include: {
        _count: {
          select: {
            issues: {
              where: {
                status: {
                  not: "RESOLVED",
                },
              },
            },
            incidents: {
              where: {
                status: {
                  not: "RESOLVED",
                },
              },
            },
          },
        },
      },
    });
  }

  return sampleDomainsWithCounts();
}

export async function getDomain(id: string) {
  const prisma = await getPrisma();

  if (prisma) {
    return prisma.domain.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        issues: {
          orderBy: [{ updatedAt: "desc" }],
          include: {
            plan: true,
          },
        },
        incidents: {
          orderBy: [{ startedAt: "desc" }],
        },
        _count: {
          select: {
            issues: {
              where: {
                status: {
                  not: "RESOLVED",
                },
              },
            },
            incidents: {
              where: {
                status: {
                  not: "RESOLVED",
                },
              },
            },
          },
        },
      },
    });
  }

  const domain = sampleDomainsWithCounts().find(
    (item) => item.id === id || item.slug === id,
  );

  if (!domain) {
    return null;
  }

  return {
    ...domain,
    issues: issues.filter((issue) => issue.domainSlug === domain.slug),
    incidents: incidents.filter((incident) => incident.domainSlug === domain.slug),
  };
}

export async function getIssues() {
  const prisma = await getPrisma();

  if (prisma) {
    return prisma.issue.findMany({
      orderBy: [{ severity: "asc" }, { updatedAt: "desc" }],
      include: {
        domain: true,
        plan: true,
      },
    });
  }

  return issues.map((issue) => ({
    ...issue,
    domain: domains.find((domain) => domain.slug === issue.domainSlug),
  }));
}

export async function getIssue(id: string) {
  const prisma = await getPrisma();

  if (prisma) {
    return prisma.issue.findFirst({
      where: {
        id,
      },
      include: {
        domain: true,
        plan: true,
      },
    });
  }

  const issue = issues.find((item) => item.id === id);

  if (!issue) {
    return null;
  }

  return {
    ...issue,
    domain: domains.find((domain) => domain.slug === issue.domainSlug),
  };
}

export async function getIncidents() {
  const prisma = await getPrisma();

  if (prisma) {
    return prisma.incident.findMany({
      orderBy: [{ startedAt: "desc" }],
      include: {
        domain: true,
      },
    });
  }

  return incidents.map((incident) => ({
    ...incident,
    domain: domains.find((domain) => domain.slug === incident.domainSlug),
  }));
}

export async function getSystemsNeedingAttention() {
  const allDomains = await getDomains();

  return allDomains
    .filter((domain) => domain.health !== "HEALTHY" || domain._count.issues > 0)
    .slice(0, 4);
}

export async function getWeeklyFocus() {
  const allIssues = await getIssues();

  return allIssues
    .filter((issue) => ["TRIAGE", "IN_PROGRESS", "PLANNED"].includes(issue.status))
    .slice(0, 4);
}

export async function getRecentRolloutActivity() {
  const allIssues = await getIssues();

  return allIssues
    .filter((issue) => Boolean(issue.rollout))
    .slice(0, 5)
    .map((issue) => ({
      id: issue.id,
      title: issue.title,
      domain: issue.domain?.name,
      rollout: issue.rollout,
      status: issue.status,
    }));
}

export async function getWorkspace() {
  const prisma = await getPrisma();

  if (prisma) {
    const found = await prisma.workspace.findFirst({
      orderBy: {
        createdAt: "asc",
      },
    });

    return found ?? workspace;
  }

  return workspace;
}
