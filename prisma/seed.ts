import { PrismaClient } from "@prisma/client";
import { domains, incidents, issues, workspace } from "../lib/sample-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.engineeringPlan.deleteMany();
  await prisma.incident.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.workspace.deleteMany();

  const createdWorkspace = await prisma.workspace.create({
    data: workspace,
  });

  const createdDomains = new Map<string, string>();

  for (const domain of domains) {
    const createdDomain = await prisma.domain.create({
      data: {
        ...domain,
        workspaceId: createdWorkspace.id,
      },
    });

    createdDomains.set(domain.slug, createdDomain.id);
  }

  for (const issue of issues) {
    const domainId = createdDomains.get(issue.domainSlug);

    if (!domainId) {
      throw new Error(`Missing domain for issue: ${issue.title}`);
    }

    await prisma.issue.create({
      data: {
        title: issue.title,
        summary: issue.summary,
        id: issue.id,
        status: issue.status,
        severity: issue.severity,
        risk: issue.risk,
        rollout: issue.rollout,
        workspaceId: createdWorkspace.id,
        domainId,
        plan: issue.plan
          ? {
              create: {
                title: issue.plan.title,
                status: issue.plan.status,
                approach: issue.plan.approach,
                edgeCases: issue.plan.edgeCases,
                testPlan: issue.plan.testPlan,
                rolloutPlan: issue.plan.rolloutPlan,
                monitoringPlan: issue.plan.monitoringPlan,
                rollbackPlan: issue.plan.rollbackPlan,
                owner: issue.plan.owner,
                targetDate: issue.plan.targetDate ? new Date(issue.plan.targetDate) : null,
              },
            }
          : undefined,
      },
    });
  }

  for (const incident of incidents) {
    const domainId = createdDomains.get(incident.domainSlug);

    if (!domainId) {
      throw new Error(`Missing domain for incident: ${incident.title}`);
    }

    await prisma.incident.create({
      data: {
        title: incident.title,
        summary: incident.summary,
        id: incident.id,
        impact: incident.impact,
        rootCause: incident.rootCause,
        resolution: incident.resolution,
        prevention: incident.prevention,
        postmortemRequired: incident.postmortemRequired,
        status: incident.status,
        severity: incident.severity,
        workspaceId: createdWorkspace.id,
        domainId,
        startedAt: new Date(incident.startedAt),
        resolvedAt: incident.resolvedAt ? new Date(incident.resolvedAt) : null,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
