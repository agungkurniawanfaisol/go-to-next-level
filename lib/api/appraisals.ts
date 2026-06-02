import { prisma } from "@/lib/prisma";

export type DashboardStats = {
  totalAppraisals: number;
  totalPoints: number;
  totalHeritageItems: number;
  activeUsers: number;
  statsChange: {
    appraisals: string;
    points: string;
    heritage: string;
    users: string;
  };
};

export type RecentAppraisal = {
  id: string;
  detectedObject: string;
  ecoSwapPoints: number;
  confidenceScore: number;
  createdAt: Date;
};

export type AppraisalLog = {
  id: string;
  detectedObject: string;
  confidenceScore: number;
  ecoSwapPoints: number;
  createdAt: Date;
  imageName: string;
  imagePath: string | null;
  openForBarter: boolean;
};

export type HeritageItemData = {
  id: string;
  name: string;
  region: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  era: string | null;
  status: string;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
};

// ─── Dashboard ────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalAppraisals,
    totalPointsResult,
    totalHeritageItems,
    activeUsers,
    lastWeekAppraisals,
    lastWeekPointsResult,
  ] = await Promise.all([
    prisma.appraisal.count(),
    prisma.appraisal.aggregate({ _sum: { ecoSwapPoints: true } }),
    prisma.heritageItem.count({ where: { status: "ACTIVE" } }),
    prisma.user.count(),
    // Last-week counts for change calculation
    prisma.appraisal.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.appraisal.aggregate({
      _sum: { ecoSwapPoints: true },
      where: {
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  const totalPoints = totalPointsResult._sum.ecoSwapPoints ?? 0;
  const prevWeekPoints = lastWeekPointsResult._sum.ecoSwapPoints ?? 0;

  // Calculate percentage changes (simplified relative to baseline)
  const calcChange = (current: number, previous: number): string => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${Math.round(change)}%`;
  };

  return {
    totalAppraisals,
    totalPoints: Number(totalPoints),
    totalHeritageItems,
    activeUsers,
    statsChange: {
      appraisals: calcChange(totalAppraisals, lastWeekAppraisals),
      points: calcChange(Number(totalPoints), Number(prevWeekPoints)),
      heritage: "+0%", // static until heritage CRUD
      users: "+0%",    // static until registration
    },
  };
}

export async function getRecentAppraisals(
  limit = 5,
): Promise<RecentAppraisal[]> {
  const rows = await prisma.appraisal.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((r) => ({
    id: r.id,
    detectedObject: r.detectedObject,
    ecoSwapPoints: r.ecoSwapPoints,
    confidenceScore: Number(r.confidenceScore),
    createdAt: r.createdAt,
  }));
}

// ─── Appraisal Logs ───────────────────────────────────────────────────────

export async function getAppraisalLogs(): Promise<AppraisalLog[]> {
  const rows = await prisma.appraisal.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return rows.map((r) => ({
    id: r.id,
    detectedObject: r.detectedObject,
    confidenceScore: Number(r.confidenceScore),
    ecoSwapPoints: r.ecoSwapPoints,
    createdAt: r.createdAt,
    imageName: r.imageName,
    imagePath: r.imagePath,
    openForBarter: r.openForBarter,
  }));
}

// ─── Heritage Catalog ─────────────────────────────────────────────────────

export async function getHeritageCatalog(): Promise<HeritageItemData[]> {
  const items = await prisma.heritageItem.findMany({
    orderBy: { name: "asc" },
  });

  return items.map((i) => ({
    id: i.id,
    name: i.name,
    region: i.region,
    category: i.category,
    description: i.description,
    imageUrl: i.imageUrl,
    era: i.era,
    status: i.status,
  }));
}

// ─── Users ────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<UserData[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
  }));
}
