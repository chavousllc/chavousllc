import { prisma } from "@/lib/prisma";

export type DailyCount = { date: string; count: number };

export async function getPageViewsByDay(days = 30): Promise<DailyCount[]> {
  try {
    const rows = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::bigint AS count
      FROM "PageView"
      WHERE "createdAt" >= NOW() - (${days}::text || ' days')::interval
      GROUP BY day
      ORDER BY day ASC
    `;
    return rows.map((r) => ({
      date: r.day.toISOString().slice(0, 10),
      count: Number(r.count),
    }));
  } catch {
    return [];
  }
}

export async function getTopPages(days = 30, limit = 6) {
  try {
    const rows = await prisma.$queryRaw<{ path: string; count: bigint }[]>`
      SELECT "path", COUNT(*)::bigint AS count
      FROM "PageView"
      WHERE "createdAt" >= NOW() - (${days}::text || ' days')::interval
      GROUP BY "path"
      ORDER BY count DESC
      LIMIT ${limit}
    `;
    return rows.map((r) => ({ path: r.path, count: Number(r.count) }));
  } catch {
    return [];
  }
}

export async function getDashboardCounts() {
  try {
    const [
      totalViews,
      totalApplications,
      newApplications,
      totalQuotes,
      newQuotes,
      totalMessages,
      newMessages,
    ] = await Promise.all([
      prisma.pageView.count(),
      prisma.driverApplication.count(),
      prisma.driverApplication.count({ where: { status: "NEW" } }),
      prisma.quoteRequest.count(),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "NEW" } }),
    ]);
    return {
      totalViews,
      totalApplications,
      newApplications,
      totalQuotes,
      newQuotes,
      totalMessages,
      newMessages,
    };
  } catch {
    return {
      totalViews: 0,
      totalApplications: 0,
      newApplications: 0,
      totalQuotes: 0,
      newQuotes: 0,
      totalMessages: 0,
      newMessages: 0,
    };
  }
}

export async function getRecentSubmissions() {
  try {
    const [applications, quotes, messages] = await Promise.all([
      prisma.driverApplication.findMany({
        orderBy: { submittedAt: "desc" },
        take: 5,
        select: { id: true, fullName: true, positionAppliedFor: true, submittedAt: true, status: true },
      }),
      prisma.quoteRequest.findMany({
        orderBy: { submittedAt: "desc" },
        take: 5,
        select: { id: true, shipperCompany: true, originCity: true, originState: true, destCity: true, destState: true, submittedAt: true, status: true },
      }),
      prisma.contactMessage.findMany({
        orderBy: { submittedAt: "desc" },
        take: 5,
        select: { id: true, name: true, message: true, submittedAt: true, status: true },
      }),
    ]);
    return { applications, quotes, messages };
  } catch {
    return { applications: [], quotes: [], messages: [] };
  }
}
