import { prisma } from "@/lib/prisma";

export type BarterListing = {
  id: string;
  userId: string | null;
  openForBarter: boolean;
  detectedObject: string;
  confidenceScore: number;
  roleClassification: string;
  ecoSwapPoints: number;
  imagePath: string | null;
  ownerName: string | null;
  ownerCity: string | null;
  swapDescription: string | null;
  wantedItem: string | null;
  publishedAt: Date | null;
  createdAt: Date;
};

export type BarterListingDetail = BarterListing & {
  conditionAnalysis: string;
  inferenceMs: number;
  predictions: { label: string; probability: number; rank: number }[];
  user: { name: string; email: string } | null;
};

export type UserUploadStats = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  uploadCount: number;
  barterCount: number;
};

function mapListing(row: {
  id: string;
  userId: string | null;
  openForBarter: boolean;
  detectedObject: string;
  confidenceScore: { toNumber(): number } | number;
  roleClassification: string;
  ecoSwapPoints: number;
  imagePath: string | null;
  ownerName: string | null;
  ownerCity: string | null;
  swapDescription: string | null;
  wantedItem: string | null;
  publishedAt: Date | null;
  createdAt: Date;
}): BarterListing {
  return {
    id: row.id,
    userId: row.userId,
    openForBarter: row.openForBarter,
    detectedObject: row.detectedObject,
    confidenceScore:
      typeof row.confidenceScore === "number"
        ? row.confidenceScore
        : row.confidenceScore.toNumber(),
    roleClassification: row.roleClassification,
    ecoSwapPoints: row.ecoSwapPoints,
    imagePath: row.imagePath,
    ownerName: row.ownerName,
    ownerCity: row.ownerCity,
    swapDescription: row.swapDescription,
    wantedItem: row.wantedItem,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
  };
}

const listingSelect = {
  id: true,
  userId: true,
  openForBarter: true,
  detectedObject: true,
  confidenceScore: true,
  roleClassification: true,
  ecoSwapPoints: true,
  imagePath: true,
  ownerName: true,
  ownerCity: true,
  swapDescription: true,
  wantedItem: true,
  publishedAt: true,
  createdAt: true,
} as const;

// Langsung query tanpa cache — data barter berubah setiap publish/unpublish
export async function getBarterListings(): Promise<BarterListing[]> {
  const rows = await prisma.appraisal.findMany({
    where: { openForBarter: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: listingSelect,
  });

  return rows.map(mapListing);
}

async function isViewableBarterAppraisal(
  row: { openForBarter: boolean; ownerName: string | null; publishedAt: Date | null },
  id: string,
): Promise<boolean> {
  if (row.openForBarter) return true;
  if (row.ownerName || row.publishedAt) return true;

  const inTrade = await prisma.barterProposal.findFirst({
    where: {
      OR: [{ offeredAppraisalId: id }, { requestedAppraisalId: id }],
    },
    select: { id: true },
  });

  return !!inTrade;
}

export async function getBarterListingById(
  id: string,
): Promise<BarterListingDetail | null> {
  const row = await prisma.appraisal.findUnique({
    where: { id },
    include: {
      predictions: { orderBy: { rank: "asc" } },
      user: { select: { name: true, email: true } },
    },
  });

  if (!row) return null;

  if (!(await isViewableBarterAppraisal(row, id))) return null;

  return {
    ...mapListing(row),
    conditionAnalysis: row.conditionAnalysis,
    inferenceMs: row.inferenceMs,
    predictions: row.predictions.map((p) => ({
      label: p.label,
      probability:
        typeof p.probability === "number"
          ? p.probability
          : p.probability.toNumber(),
      rank: p.rank,
    })),
    user: row.user,
  };
}

export async function getUsersWithUploadStats(): Promise<UserUploadStats[]> {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { appraisals: true } },
      appraisals: {
        where: { openForBarter: true },
        select: { id: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatarUrl: u.avatarUrl,
    uploadCount: u._count.appraisals,
    barterCount: u.appraisals.length,
  }));
}

export async function getGuestUploadStats(): Promise<{
  uploadCount: number;
  barterCount: number;
}> {
  const [uploadCount, barterCount] = await Promise.all([
    prisma.appraisal.count({ where: { userId: null } }),
    prisma.appraisal.count({ where: { userId: null, openForBarter: true } }),
  ]);

  return { uploadCount, barterCount };
}

export async function getAllBarterListingsAdmin(): Promise<BarterListing[]> {
  return getBarterListings();
}

export type AdminBarterPageData = {
  users: UserUploadStats[];
  guestStats: { uploadCount: number; barterCount: number };
  listings: BarterListing[];
};

export async function getAdminBarterPageData(): Promise<AdminBarterPageData> {
  const [users, guestStats, listings] = await Promise.all([
    getUsersWithUploadStats(),
    getGuestUploadStats(),
    getAllBarterListingsAdmin(),
  ]);

  return { users, guestStats, listings };
}
