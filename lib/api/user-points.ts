import { prisma } from "@/lib/prisma";

export async function getUserTotalEcoSwapPoints(userId: string): Promise<number> {
  const result = await prisma.appraisal.aggregate({
    // EcoSwap Points yang tampil di UI = poin dari barang yang masih aktif di List Barter.
    // Saat barter sukses ditandai, `openForBarter` akan jadi false sehingga poin ikut berkurang.
    where: { userId, openForBarter: true },
    _sum: { ecoSwapPoints: true },
  });
  return result._sum.ecoSwapPoints ?? 0;
}
