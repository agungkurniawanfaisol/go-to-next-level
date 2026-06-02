import { db } from "@/lib/db";

export type GeoLocation = {
  lat: number;
  lng: number;
  cityLabel: string;
};

const geocodeCache = new Map<string, GeoLocation | null>();

async function geocodeCity(ownerCity: string): Promise<GeoLocation | null> {
  const city = ownerCity.trim();
  if (!city) return null;

  const cacheKey = city.toLowerCase();
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) ?? null;
  }

  const query = encodeURIComponent(`${city}, Indonesia`);
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`;

  try {
    const res = await fetch(url, {
      headers: {
        // Nominatim mensyaratkan identitas pemanggil agar request tidak diblok.
        "User-Agent": "EcoSwap/1.0 (BarterMap)",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(2500),
      cache: "force-cache",
    });

    if (!res.ok) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const json = (await res.json()) as Array<{
      lat?: string;
      lon?: string;
      display_name?: string;
    }>;

    const first = json[0];
    if (!first?.lat || !first?.lon) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const lat = Number(first.lat);
    const lng = Number(first.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const result: GeoLocation = {
      lat,
      lng,
      cityLabel: city,
    };
    geocodeCache.set(cacheKey, result);
    return result;
  } catch {
    geocodeCache.set(cacheKey, null);
    return null;
  }
}

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
  location: GeoLocation | null;
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
  confidenceScore: number;
  roleClassification: string;
  ecoSwapPoints: number;
  imagePath: string | null;
  ownerName: string | null;
  ownerCity: string | null;
  swapDescription: string | null;
  wantedItem: string | null;
  publishedAt: string | null;
  createdAt: string;
  location?: GeoLocation | null;
}): BarterListing {
  return {
    id: row.id,
    userId: row.userId,
    openForBarter: row.openForBarter,
    detectedObject: row.detectedObject,
    confidenceScore: Number(row.confidenceScore),
    roleClassification: row.roleClassification,
    ecoSwapPoints: row.ecoSwapPoints,
    imagePath: row.imagePath,
    ownerName: row.ownerName,
    ownerCity: row.ownerCity,
    swapDescription: row.swapDescription,
    wantedItem: row.wantedItem,
    publishedAt: row.publishedAt ? new Date(row.publishedAt) : null,
    createdAt: new Date(row.createdAt),
    location: row.location ?? null,
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
  const rows = db.appraisal.findMany({
    where: { openForBarter: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: listingSelect,
  });

  return rows.map(mapListing);
}

export async function attachLocationsToListings(
  listings: BarterListing[],
): Promise<BarterListing[]> {
  const citySet = new Set<string>();

  for (const listing of listings) {
    if (listing.ownerCity?.trim()) {
      citySet.add(listing.ownerCity.trim());
    }
  }

  const cityList = Array.from(citySet);
  const locationMap = new Map<string, GeoLocation | null>();

  await Promise.all(
    cityList.map(async (city) => {
      const location = await geocodeCity(city);
      locationMap.set(city.toLowerCase(), location);
    }),
  );

  return listings.map((listing) => {
    const city = listing.ownerCity?.trim().toLowerCase();
    return {
      ...listing,
      location: city ? (locationMap.get(city) ?? null) : null,
    };
  });
}

export async function getBarterListingsWithLocations(): Promise<BarterListing[]> {
  const listings = await getBarterListings();
  return attachLocationsToListings(listings);
}

async function isViewableBarterAppraisal(
  row: { openForBarter: boolean; ownerName: string | null; publishedAt: Date | null },
  id: string,
): Promise<boolean> {
  if (row.openForBarter) return true;
  if (row.ownerName || row.publishedAt) return true;

  const inTrade = db.barterProposal.findFirst({
    where: {
      OR: [{ offeredAppraisalId: id }, { requestedAppraisalId: id }],
    },
  });

  return !!inTrade;
}

export async function getBarterListingById(
  id: string,
): Promise<BarterListingDetail | null> {
  const row = db.appraisal.findUnique({
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
    predictions: (row.predictions ?? []).map((p: any) => ({
      label: p.label,
      probability: Number(p.probability),
      rank: p.rank,
    })),
    user: row.user ?? null,
  };
}

export async function getUsersWithUploadStats(): Promise<UserUploadStats[]> {
  const users = db.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  return users.map((u: any) => {
    const userAppraisals = db.appraisal.findMany({
      where: { userId: u.id },
    });
    const userBarterAppraisals = db.appraisal.findMany({
      where: { userId: u.id, openForBarter: true },
    });

    return {
      id: u.id,
      name: u.name as string,
      email: u.email as string,
      avatarUrl: u.avatarUrl as string | null,
      uploadCount: userAppraisals.length,
      barterCount: userBarterAppraisals.length,
    };
  });
}

export async function getGuestUploadStats(): Promise<{
  uploadCount: number;
  barterCount: number;
}> {
  const uploadCount = db.appraisal.count({ where: { userId: null } });
  const barterCount = db.appraisal.count({ where: { userId: null, openForBarter: true } });

  return { uploadCount, barterCount };
}

export async function getAllBarterListingsAdmin(): Promise<BarterListing[]> {
  return getBarterListingsWithLocations();
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
