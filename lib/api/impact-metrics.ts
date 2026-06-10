import { db } from "@/lib/db";

export type ImpactMetrics = {
  itemsRescued: number;
  pointsInCirculation: number;
  successfulBarters: number;
  estimatedWastePreventedKg: number;
};

export async function getImpactMetrics(): Promise<ImpactMetrics> {
  const itemsRescued = db.appraisal.count({ where: { openForBarter: true } });
  const pointsAgg = db.appraisal.aggregate({
    where: { openForBarter: true },
    _sum: { ecoSwapPoints: true },
  });
  const successfulBarters = db.barterProposal.count({ where: { status: "COMPLETED" } });

  const estimatedWastePreventedKg = Math.round(successfulBarters * 3.2);

  return {
    itemsRescued,
    pointsInCirculation: pointsAgg._sum?.ecoSwapPoints ?? 0,
    successfulBarters,
    estimatedWastePreventedKg,
  };
}

