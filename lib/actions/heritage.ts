"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type HeritageFormData = {
  name: string;
  region: string;
  category: string;
  description?: string;
  imageUrl?: string;
  era?: string;
  status: "ACTIVE" | "REVIEW" | "INACTIVE";
};

export async function createHeritageItem(data: HeritageFormData) {
  try {
    await prisma.heritageItem.create({
      data: {
        name: data.name,
        region: data.region,
        category: data.category,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        era: data.era || null,
        status: data.status,
      },
    });
    revalidatePath("/admin/heritage");
    return { success: true as const };
  } catch (error) {
    console.error("[createHeritageItem]", error);
    return { success: false as const, error: "Gagal menambah item heritage." };
  }
}

export async function updateHeritageItem(id: string, data: HeritageFormData) {
  try {
    await prisma.heritageItem.update({
      where: { id },
      data: {
        name: data.name,
        region: data.region,
        category: data.category,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        era: data.era || null,
        status: data.status,
      },
    });
    revalidatePath("/admin/heritage");
    return { success: true as const };
  } catch (error) {
    console.error("[updateHeritageItem]", error);
    return {
      success: false as const,
      error: "Gagal memperbarui item heritage.",
    };
  }
}

export async function deleteHeritageItem(id: string) {
  try {
    await prisma.heritageItem.delete({ where: { id } });
    revalidatePath("/admin/heritage");
    return { success: true as const };
  } catch (error) {
    console.error("[deleteHeritageItem]", error);
    return {
      success: false as const,
      error: "Gagal menghapus item heritage.",
    };
  }
}
