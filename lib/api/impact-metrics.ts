import { prisma } from "@/lib/prisma";

export type ImpactMetrics = {
  itemsRescued: number;
  pointsInCirculation: number;
  successfulBarters: number;
  estimatedWastePreventedKg: number;
};

export async function getImpactMetrics(): Promise<ImpactMetrics> {
  const [itemsRescued, pointsAgg, successfulBarters] = await Promise.all([
    prisma.appraisal.count({ where: { openForBarter: true } }),
    prisma.appraisal.aggregate({
      where: { openForBarter: true },
      _sum: { ecoSwapPoints: true },
    }),
    prisma.barterProposal.count({ where: { status: "COMPLETED" } }),
  ]);

  // Estimasi sederhana untuk storytelling demo:
  // 1 barter selesai ~= 3.2 kg limbah yang dialihkan dari pembuangan.
  const estimatedWastePreventedKg = Math.round(successfulBarters * 3.2);

  return {
    itemsRescued,
    pointsInCirculation: pointsAgg._sum.ecoSwapPoints ?? 0,
    successfulBarters,
    estimatedWastePreventedKg,
  };
}

