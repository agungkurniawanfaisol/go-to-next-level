import type { CNNClassPrediction } from "@/lib/cnn-pipeline";
import type { ImageFeatures } from "@/lib/image-analyzer";

export type AppraisalResultData = {
  detectedObject: string;
  confidenceScore: number;
  roleClassification: string;
  conditionAnalysis: string;
  ecoSwapPoints: number;
  inferenceMs: number;
  topPredictions: CNNClassPrediction[];
};

// ─── Heritage categories with feature profiles ──────────────────────────

type HeritageProfile = {
  name: string;
  region: string;
  /** Expected edge density range [min, max] */
  edgeRange: [number, number];
  /** Expected warm/cool ratio range */
  warmRange: [number, number];
  /** Expected color variance range */
  varianceRange: [number, number];
  /** Base heritage score */
  baseHeritage: number;
};

const HERITAGE_PROFILES: HeritageProfile[] = [
  {
    name: "Batik Tulis",
    region: "Pekalongan",
    edgeRange: [0.35, 0.85],
    warmRange: [1.2, 4.0],
    varianceRange: [45, 85],
    baseHeritage: 95,
  },
  {
    name: "Tenun Ikat",
    region: "Nusa Tenggara Timur",
    edgeRange: [0.25, 0.65],
    warmRange: [0.8, 2.5],
    varianceRange: [50, 90],
    baseHeritage: 90,
  },
  {
    name: "Ukiran Kayu",
    region: "Jepara",
    edgeRange: [0.4, 0.9],
    warmRange: [0.9, 2.0],
    varianceRange: [20, 55],
    baseHeritage: 88,
  },
  {
    name: "Keramik Tradisional",
    region: "Jawa Tengah",
    edgeRange: [0.1, 0.4],
    warmRange: [0.5, 1.8],
    varianceRange: [30, 65],
    baseHeritage: 85,
  },
  {
    name: "Anyaman Bambu",
    region: "Tasikmalaya",
    edgeRange: [0.3, 0.7],
    warmRange: [0.7, 1.8],
    varianceRange: [15, 40],
    baseHeritage: 80,
  },
  {
    name: "Songket Palembang",
    region: "Sumatera Selatan",
    edgeRange: [0.2, 0.55],
    warmRange: [1.0, 3.0],
    varianceRange: [55, 95],
    baseHeritage: 92,
  },
];

const MODERN_ITEMS = [
  { name: "Elektronik Rumah Tangga", baseHeritage: 15 },
  { name: "Pakaian Bekas Sintetis", baseHeritage: 10 },
  { name: "Kemasan Plastik", baseHeritage: 5 },
  { name: "Aksesoris Modern", baseHeritage: 20 },
  { name: "Mainan Anak", baseHeritage: 12 },
];

const CONDITIONS = [
  { label: "Layak Pakai", percentRange: [80, 98] as [number, number] },
  { label: "Layak Koleksi", percentRange: [65, 85] as [number, number] },
  { label: "Butuh Restorasi", percentRange: [40, 70] as [number, number] },
  { label: "Rusak — Spare Part", percentRange: [20, 50] as [number, number] },
];

/** Simple seeded PRNG (Mulberry32) for deterministic randomness. */
function createSeededRng(features: ImageFeatures): () => number {
  // Deterministic seed from feature values
  let seed =
    Math.round(features.avgBrightness * 100) * 1 +
    Math.round(features.colorVariance * 10) * 100 +
    Math.round(features.warmCoolRatio * 100) * 10000 +
    Math.round(features.edgeDensity * 1000) * 100000 +
    Math.round(features.avgSaturation * 1000) * 10000000;
  // Ensure it's a 32-bit int
  seed = seed >>> 0;

  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function deterministicJitter(
  value: number,
  jitterPercent: number,
  rng: () => number,
): number {
  const jitter = (rng() - 0.5) * 2 * (value * jitterPercent);
  return clamp(value + jitter, 0, 100);
}

// ─── Feature scoring ────────────────────────────────────────────────────

function computeHeritageScore(features: ImageFeatures): {
  heritageScore: number;
  bestProfile: HeritageProfile | null;
  profileScore: number;
} {
  // Normalize each feature to 0–1
  const edgeScore = clamp(features.edgeDensity, 0, 1);
  // WarmCoolRatio: >2 is very warm, normalize with log scale
  const warmScore = clamp(Math.log2(1 + features.warmCoolRatio) / 2.5, 0, 1);
  // Color variance: >60 is very colorful
  const varianceScore = clamp(features.colorVariance / 80, 0, 1);
  // Saturation: >0.4 is saturated
  const satScore = clamp(features.avgSaturation / 0.6, 0, 1);
  // Brightness: penalize very dark (<50) and very bright (>220)
  const brightScore =
    features.avgBrightness < 50
      ? features.avgBrightness / 50
      : features.avgBrightness > 220
        ? 1 - (features.avgBrightness - 220) / 35
        : 1;

  // Composite heritage indicator (0–1)
  const rawHeritage =
    0.30 * edgeScore +
    0.20 * warmScore +
    0.25 * varianceScore +
    0.15 * satScore +
    0.10 * brightScore;

  // Find best matching heritage profile
  let bestProfile: HeritageProfile | null = null;
  let bestMatchScore = 0;

  for (const profile of HERITAGE_PROFILES) {
    let matchScore = 0;

    // Edge density match
    const edgeMid = (profile.edgeRange[0] + profile.edgeRange[1]) / 2;
    const edgeWidth = (profile.edgeRange[1] - profile.edgeRange[0]) / 2;
    matchScore += Math.max(0, 1 - Math.abs(features.edgeDensity - edgeMid) / (edgeWidth + 0.1)) * 0.35;

    // Warm/cool ratio match
    const warmMid = (profile.warmRange[0] + profile.warmRange[1]) / 2;
    const warmWidth = (profile.warmRange[1] - profile.warmRange[0]) / 2;
    matchScore += Math.max(0, 1 - Math.abs(features.warmCoolRatio - warmMid) / (warmWidth + 0.1)) * 0.30;

    // Color variance match
    const varMid = (profile.varianceRange[0] + profile.varianceRange[1]) / 2;
    const varWidth = (profile.varianceRange[1] - profile.varianceRange[0]) / 2;
    matchScore += Math.max(0, 1 - Math.abs(features.colorVariance - varMid) / (varWidth + 0.1)) * 0.35;

    if (matchScore > bestMatchScore) {
      bestMatchScore = matchScore;
      bestProfile = profile;
    }
  }

  // Heritage score: blend raw heritage indicator with best profile match
  const heritageScore = clamp(
    rawHeritage * 50 + bestMatchScore * 50,
    0,
    100,
  );

  return { heritageScore, bestProfile, profileScore: bestMatchScore };
}

function pickCondition(features: ImageFeatures): string {
  // Well-lit, saturated images with high variance → better condition
  const conditionQuality =
    clamp(features.avgBrightness / 255, 0, 1) * 0.4 +
    features.avgSaturation * 0.3 +
    clamp(features.colorVariance / 80, 0, 1) * 0.3;

  let selected = CONDITIONS[0];
  if (conditionQuality > 0.75) selected = CONDITIONS[0];
  else if (conditionQuality > 0.55) selected = CONDITIONS[1];
  else if (conditionQuality > 0.35) selected = CONDITIONS[2];
  else selected = CONDITIONS[3];

  const [minP, maxP] = selected.percentRange;
  const percent = Math.round(minP + (maxP - minP) * conditionQuality);

  return `${selected.label} - ${percent}%`;
}

function generatePredictions(
  heritageScore: number,
  bestProfile: HeritageProfile | null,
  profileScore: number,
  rng: () => number,
): CNNClassPrediction[] {
  const predictions: CNNClassPrediction[] = [];

  if (bestProfile && profileScore > 0.25) {
    // Heritage category detected
    const topProb = clamp(heritageScore * 0.92 + deterministicJitter(2, 0.05, rng), 50, 99.5);
    const remaining = 100 - topProb;

    // Second prediction: similar profile
    const secondLabel = `Warisan Budaya — ${bestProfile.name.split(" ")[0]}`;
    const secondProb = clamp(remaining * 0.65 + deterministicJitter(1, 0.1, rng), 0.5, remaining - 0.5);

    // Third prediction: general waste
    const thirdProb = clamp(remaining - secondProb, 0.1, 20);

    predictions.push(
      { label: `Warisan Budaya — ${bestProfile.name}`, probability: Math.round(topProb * 10) / 10 },
      { label: secondLabel, probability: Math.round(secondProb * 10) / 10 },
      { label: "Sampah Umum", probability: Math.round(thirdProb * 10) / 10 },
    );
  } else {
    // Low heritage — modern/waste item
    const topProb = clamp(60 + heritageScore * 0.25 + deterministicJitter(3, 0.1, rng), 40, 95);
    const remaining = 100 - topProb;

    // Deterministic modern item selection based on seed
    const itemIndex = Math.floor(rng() * MODERN_ITEMS.length);
    const item = MODERN_ITEMS[itemIndex];

    const secondProb = clamp(remaining * 0.6, 1, remaining - 1);
    const thirdProb = clamp(remaining - secondProb, 0.1, 10);

    predictions.push(
      { label: item.name, probability: Math.round(topProb * 10) / 10 },
      { label: "Sampah Umum", probability: Math.round(secondProb * 10) / 10 },
      { label: "Warisan Budaya", probability: Math.round(thirdProb * 10) / 10 },
    );
  }

  return predictions;
}

function computePoints(heritageScore: number, features: ImageFeatures): number {
  // Formula: heritageScore * multiplier + bonus for rich colors/texture
  const baseMultiplier = 4.5;
  const colorBonus = clamp(features.colorVariance / 200, 0, 1) * 80;
  const edgeBonus = features.edgeDensity * 50;
  return Math.round(heritageScore * baseMultiplier + colorBonus + edgeBonus);
}

// ─── Public API ─────────────────────────────────────────────────────────

export function generateAppraisalFromFeatures(features: ImageFeatures): AppraisalResultData {
  const rng = createSeededRng(features);
  const { heritageScore, bestProfile, profileScore } = computeHeritageScore(features);

  const topPredictions = generatePredictions(heritageScore, bestProfile, profileScore, rng);

  const topLabel = topPredictions[0]?.label ?? "Warisan Budaya";
  const confidenceScore = topPredictions[0]?.probability ?? 85;
  const detectedObject = bestProfile
    ? `${bestProfile.name} — ${bestProfile.region}`
    : topLabel;

  // Role classification based on heritage score
  let roleClassification: string;
  if (heritageScore >= 80) {
    roleClassification = "High Heritage Value";
  } else if (heritageScore >= 50) {
    roleClassification = "Medium Heritage Value";
  } else if (heritageScore >= 25) {
    roleClassification = "Low Heritage — Circular Asset";
  } else {
    roleClassification = "Sampah Umum — Sustainable Disposal";
  }

  const conditionAnalysis = pickCondition(features);
  const ecoSwapPoints = computePoints(heritageScore, features);

  // Inference time: deterministic based on image complexity
  const inferenceMs = Math.round(
    600 + features.edgeDensity * 300 + features.colorVariance * 3 + (rng() * 80),
  );

  return {
    detectedObject,
    confidenceScore,
    roleClassification,
    conditionAnalysis,
    ecoSwapPoints,
    inferenceMs,
    topPredictions,
  };
}
