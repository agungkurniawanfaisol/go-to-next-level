import { db } from "@/lib/db";

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
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const totalAppraisals = db.appraisal.count();
  const totalPointsResult = db.appraisal.aggregate({ _sum: { ecoSwapPoints: true } });
  const totalHeritageItems = db.heritageItem.count({ where: { status: "ACTIVE" } });
  const activeUsers = db.user.count();
  const lastWeekAppraisals = db.appraisal.count({
    where: {
      createdAt: {
        gte: fourteenDaysAgo,
        lt: sevenDaysAgo,
      },
    },
  });
  const lastWeekPointsResult = db.appraisal.aggregate({
    _sum: { ecoSwapPoints: true },
    where: {
      createdAt: {
        gte: fourteenDaysAgo,
        lt: sevenDaysAgo,
      },
    },
  });

  const totalPoints = totalPointsResult._sum?.ecoSwapPoints ?? 0;
  const prevWeekPoints = lastWeekPointsResult._sum?.ecoSwapPoints ?? 0;

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
      points: calcChange(totalPoints, prevWeekPoints),
      heritage: "+0%", // static until heritage CRUD
      users: "+0%",    // static until registration
    },
  };
}

export async function getRecentAppraisals(
  limit = 5,
): Promise<RecentAppraisal[]> {
  const rows = db.appraisal.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((r: any) => ({
    id: r.id,
    detectedObject: r.detectedObject,
    ecoSwapPoints: r.ecoSwapPoints,
    confidenceScore: Number(r.confidenceScore),
    createdAt: new Date(r.createdAt),
  }));
}

// ─── Appraisal Logs ───────────────────────────────────────────────────────

export async function getAppraisalLogs(): Promise<AppraisalLog[]> {
  const rows = db.appraisal.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return rows.map((r: any) => ({
    id: r.id,
    detectedObject: r.detectedObject,
    confidenceScore: Number(r.confidenceScore),
    ecoSwapPoints: r.ecoSwapPoints,
    createdAt: new Date(r.createdAt),
    imageName: r.imageName,
    imagePath: r.imagePath,
    openForBarter: r.openForBarter,
  }));
}

// ─── Heritage Catalog ─────────────────────────────────────────────────────

export async function getHeritageCatalog(): Promise<HeritageItemData[]> {
  const items = db.heritageItem.findMany({
    orderBy: { name: "asc" },
  });

  return items.map((i: any) => ({
    id: i.id,
    name: i.name as string,
    region: i.region as string,
    category: i.category as string,
    description: i.description as string | null,
    imageUrl: i.imageUrl as string | null,
    era: i.era as string | null,
    status: i.status as string,
  }));
}

// ─── Users ────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<UserData[]> {
  const users = db.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  return users.map((u: any) => ({
    id: u.id,
    name: u.name as string,
    email: u.email as string,
    role: u.role as string,
  }));
}
