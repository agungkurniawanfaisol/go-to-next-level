import { db } from "@/lib/db";

export async function getUserTotalEcoSwapPoints(userId: string): Promise<number> {
  const result = db.appraisal.aggregate({
    where: { userId, openForBarter: true },
    _sum: { ecoSwapPoints: true },
  });
  return result._sum?.ecoSwapPoints ?? 0;
}
