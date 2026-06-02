"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getValidSessionUserId } from "@/lib/auth";

export type PublishBarterInput = {
  appraisalId: string;
  ownerName: string;
  ownerCity: string;
  swapDescription?: string;
  wantedItem?: string;
};

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

export async function publishBarter(
  input: PublishBarterInput,
): Promise<ActionResult> {
  const { appraisalId, ownerName, ownerCity, swapDescription, wantedItem } =
    input;

  if (!ownerName.trim() || !ownerCity.trim()) {
    return { success: false, error: "Nama dan kota wajib diisi." };
  }

  try {
    const existing = await prisma.appraisal.findUnique({
      where: { id: appraisalId },
    });

    if (!existing) {
      return { success: false, error: "Appraisal tidak ditemukan." };
    }

    const userId = await getValidSessionUserId();

    await prisma.appraisal.update({
      where: { id: appraisalId },
      data: {
        openForBarter: true,
        ...(userId ? { userId } : {}),
        ownerName: ownerName.trim(),
        ownerCity: ownerCity.trim(),
        swapDescription: swapDescription?.trim() || null,
        wantedItem: wantedItem?.trim() || null,
        publishedAt: new Date(),
      },
    });

    revalidatePath("/barter");
    revalidatePath(`/barter/${appraisalId}`);
    revalidatePath("/admin/barter");

    return { success: true };
  } catch (error) {
    console.error("[publishBarter]", error);
    return { success: false, error: "Gagal mempublikasikan ke barter." };
  }
}

export async function unpublishBarter(appraisalId: string): Promise<ActionResult> {
  try {
    await prisma.appraisal.update({
      where: { id: appraisalId },
      data: {
        openForBarter: false,
        publishedAt: null,
      },
    });

    revalidatePath("/barter");
    revalidatePath(`/barter/${appraisalId}`);
    revalidatePath("/admin/barter");

    return { success: true };
  } catch (error) {
    console.error("[unpublishBarter]", error);
    return { success: false, error: "Gagal menonaktifkan barter." };
  }
}
