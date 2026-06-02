"use server";

import { prisma } from "@/lib/prisma";
import { saveAppraisalImage } from "@/lib/uploads";
import { getValidSessionUserId } from "@/lib/auth";
import type { AppraisalResultData } from "@/lib/appraisal-mock";

export type SaveAppraisalResult =
  | { success: true; id: string; imagePath: string }
  | { success: false; error: string };

export async function saveAppraisalWithImage(
  formData: FormData,
): Promise<SaveAppraisalResult> {
  try {
    const file = formData.get("image");
    const resultRaw = formData.get("result");

    if (!(file instanceof File) || typeof resultRaw !== "string") {
      return { success: false, error: "Data upload tidak valid." };
    }

    const result = JSON.parse(resultRaw) as AppraisalResultData;

    const userId = await getValidSessionUserId();

    const appraisal = await prisma.appraisal.create({
      data: {
        userId,
        imageName: file.name,
        imageSize: file.size,
        detectedObject: result.detectedObject,
        confidenceScore: result.confidenceScore,
        roleClassification: result.roleClassification,
        conditionAnalysis: result.conditionAnalysis,
        ecoSwapPoints: result.ecoSwapPoints,
        inferenceMs: result.inferenceMs,
        predictions: {
          create: result.topPredictions.map((pred, i) => ({
            label: pred.label,
            probability: pred.probability,
            rank: i + 1,
          })),
        },
      },
    });

    const imagePath = await saveAppraisalImage(appraisal.id, file);

    await prisma.appraisal.update({
      where: { id: appraisal.id },
      data: { imagePath },
    });

    return { success: true, id: appraisal.id, imagePath };
  } catch (error) {
    console.error("[saveAppraisalWithImage] Gagal menyimpan:", error);
    return { success: false, error: "Gagal menyimpan hasil appraisal." };
  }
}

/** @deprecated Use saveAppraisalWithImage */
export async function saveAppraisal(input: {
  imageName: string;
  imageSize: number;
  result: AppraisalResultData;
}) {
  const formData = new FormData();
  formData.set("result", JSON.stringify(input.result));
  const blob = new Blob([], { type: "image/jpeg" });
  formData.set("image", new File([blob], input.imageName, { type: "image/jpeg" }));
  return saveAppraisalWithImage(formData);
}
