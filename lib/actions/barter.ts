"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession, getValidSessionUserId } from "@/lib/auth";

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
    const existing = db.appraisal.findUnique({
      where: { id: appraisalId },
    });

    if (!existing) {
      return { success: false, error: "Appraisal tidak ditemukan." };
    }

    const userId = await getValidSessionUserId();

    db.appraisal.update({
      where: { id: appraisalId },
      data: {
        openForBarter: true,
        ...(userId ? { userId } : {}),
        ownerName: ownerName.trim(),
        ownerCity: ownerCity.trim(),
        swapDescription: swapDescription?.trim() || null,
        wantedItem: wantedItem?.trim() || null,
        publishedAt: new Date().toISOString(),
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

export type UpdateBarterInput = {
  appraisalId: string;
  ownerName: string;
  ownerCity: string;
  swapDescription?: string;
  wantedItem?: string;
  imagePath?: string;
};

export async function updateBarter(
  input: UpdateBarterInput,
): Promise<ActionResult> {
  // Hanya admin (SUPER_ADMIN / CURATOR) yang boleh edit
  const session = await getSession();
  const isAdmin =
    session?.role === "SUPER_ADMIN" || session?.role === "CURATOR";
  if (!isAdmin) {
    return { success: false, error: "Hanya admin yang dapat mengedit listing." };
  }

  const { appraisalId, ownerName, ownerCity, swapDescription, wantedItem, imagePath } =
    input;

  if (!ownerName.trim() || !ownerCity.trim()) {
    return { success: false, error: "Nama dan kota wajib diisi." };
  }

  try {
    const existing = db.appraisal.findUnique({
      where: { id: appraisalId },
    });

    if (!existing) {
      return { success: false, error: "Appraisal tidak ditemukan." };
    }

    const data: Record<string, any> = {
      ownerName: ownerName.trim(),
      ownerCity: ownerCity.trim(),
      swapDescription: swapDescription?.trim() || null,
      wantedItem: wantedItem?.trim() || null,
    };

    if (imagePath) {
      data.imagePath = imagePath;
    }

    db.appraisal.update({
      where: { id: appraisalId },
      data,
    });

    revalidatePath("/barter");
    revalidatePath(`/barter/${appraisalId}`);
    revalidatePath("/admin/barter");
    revalidatePath("/barter/saya");

    return { success: true };
  } catch (error) {
    console.error("[updateBarter]", error);
    return { success: false, error: "Gagal memperbarui listing." };
  }
}

export async function unpublishBarter(appraisalId: string): Promise<ActionResult> {
  try {
    db.appraisal.update({
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
