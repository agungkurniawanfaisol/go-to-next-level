import { db } from "@/lib/db";

export type CategoryStat = {
  category: string;
  label: string;
  count: number;
  totalPoints: number;
  avgPoints: number;
  percentage: number;
  color: string;
};

export type BarterStatsData = {
  totalItems: number;
  totalPoints: number;
  avgPoints: number;
  maxPoints: number;
  minPoints: number;
  totalOwners: number;
  categories: CategoryStat[];
  topItems: { name: string; points: number; owner: string | null }[];
  pointsDistribution: { range: string; count: number }[];
};

// Reuse the same keyword detection as BarterGrid (but simpler server-side)
function detectCategory(
  name: string,
  role: string,
): { key: string; label: string } {
  const lowerName = name.toLowerCase();
  const lowerRole = role.toLowerCase();

  if (
    lowerRole.includes("high heritage") ||
    lowerRole.includes("medium heritage") ||
    /\b(batik|tenun|songket|ukir|keramik|anyaman|tulis|ikat|palembang|jepara|kasongan|sumba|tasikmalaya)\b/.test(
      lowerName,
    )
  ) {
    return { key: "heritage", label: "Warisan" };
  }

  if (
    /\b(elektronik|blender|tv|televisi|laptop|komputer|hp|smartphone|radio|kulkas|mesin cuci|charger|kabel)\b/.test(
      lowerName,
    )
  ) {
    return { key: "elektronik", label: "Elektronik" };
  }

  if (
    /\b(mobil|motor|sepeda|kendaraan|komuter|sedan|truk|bus|vespa|skuter|bike)\b/.test(
      lowerName,
    )
  ) {
    return { key: "kendaraan", label: "Kendaraan" };
  }

  return { key: "lainnya", label: "Lainnya" };
}

const CATEGORY_COLORS: Record<string, string> = {
  heritage: "from-amber-700 to-amber-500",
  elektronik: "from-sky-600 to-sky-400",
  kendaraan: "from-emerald-600 to-emerald-400",
  lainnya: "from-stone-500 to-stone-400",
};

export async function getBarterStats(): Promise<BarterStatsData> {
  const rows = db.appraisal.findMany({
    where: { openForBarter: true },
    orderBy: { ecoSwapPoints: "desc" },
  });

  const totalItems = rows.length;
  const totalPoints = rows.reduce((sum, r) => sum + r.ecoSwapPoints, 0);
  const avgPoints = totalItems > 0 ? Math.round(totalPoints / totalItems) : 0;
  const maxPoints = rows.length > 0 ? rows[0].ecoSwapPoints : 0;
  const minPoints = rows.length > 0 ? rows[rows.length - 1].ecoSwapPoints : 0;
  const uniqueOwners = new Set(rows.map((r) => r.ownerName).filter(Boolean));

  // Categorize
  const categoryMap = new Map<
    string,
    { count: number; totalPoints: number; label: string }
  >();

  for (const row of rows) {
    const { key, label } = detectCategory(
      row.detectedObject,
      row.roleClassification,
    );
    const entry = categoryMap.get(key) ?? { count: 0, totalPoints: 0, label };
    entry.count++;
    entry.totalPoints += row.ecoSwapPoints;
    categoryMap.set(key, entry);
  }

  const categories: CategoryStat[] = Array.from(categoryMap.entries())
    .map(([key, data]) => ({
      category: key,
      label: data.label,
      count: data.count,
      totalPoints: data.totalPoints,
      avgPoints: data.count > 0 ? Math.round(data.totalPoints / data.count) : 0,
      percentage: totalItems > 0 ? (data.count / totalItems) * 100 : 0,
      color: CATEGORY_COLORS[key] ?? "from-stone-500 to-stone-400",
    }))
    .sort((a, b) => b.count - a.count);

  // Top items by points
  const topItems = rows.slice(0, 10).map((r) => ({
    name: r.detectedObject,
    points: r.ecoSwapPoints,
    owner: r.ownerName,
  }));

  // Points distribution
  const ranges = [
    { label: "0–100", min: 0, max: 100 },
    { label: "101–200", min: 101, max: 200 },
    { label: "201–300", min: 201, max: 300 },
    { label: "301–400", min: 301, max: 400 },
    { label: "401–500", min: 401, max: 500 },
    { label: "500+", min: 501, max: Infinity },
  ];

  const pointsDistribution = ranges.map((range) => ({
    range: range.label,
    count: rows.filter(
      (r) => r.ecoSwapPoints >= range.min && r.ecoSwapPoints <= range.max,
    ).length,
  }));

  return {
    totalItems,
    totalPoints,
    avgPoints,
    maxPoints,
    minPoints,
    totalOwners: uniqueOwners.size,
    categories,
    topItems,
    pointsDistribution,
  };
}
