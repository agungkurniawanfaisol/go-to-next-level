"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/actions/barter";

async function requireSession() {
  const session = await getSession();
  if (!session) {
    return { ok: false as const, error: "Anda harus masuk terlebih dahulu." };
  }
  return { ok: true as const, session };
}

function revalidateBarterPaths() {
  revalidatePath("/barter");
  revalidatePath("/barter/permintaan");
  revalidatePath("/barter/riwayat");
  revalidatePath("/admin/barter");
  revalidatePath("/admin/barter/permintaan");
  revalidatePath("/admin/barter/selesai");
}

export async function createBarterProposal(
  offeredAppraisalId: string,
  requestedAppraisalId: string,
  message?: string,
): Promise<ActionResult & { proposalId?: string }> {
  const auth = await requireSession();
  if (!auth.ok) return { success: false, error: auth.error };

  if (offeredAppraisalId === requestedAppraisalId) {
    return { success: false, error: "Tidak bisa menukar barang dengan dirinya sendiri." };
  }

  try {
    const [offered, requested] = await Promise.all([
      prisma.appraisal.findUnique({ where: { id: offeredAppraisalId } }),
      prisma.appraisal.findUnique({ where: { id: requestedAppraisalId } }),
    ]);

    if (!offered?.openForBarter || !requested?.openForBarter) {
      return {
        success: false,
        error: "Kedua barang harus masih aktif di List Barter.",
      };
    }

    if (offered.userId !== auth.session.userId) {
      return {
        success: false,
        error: "Barang yang Anda tawarkan harus milik akun Anda.",
      };
    }

    if (offered.ecoSwapPoints <= 0 || requested.ecoSwapPoints <= 0) {
      return {
        success: false,
        error: "Kedua barang harus memiliki EcoSwap Points yang valid.",
      };
    }

    if (requested.userId === auth.session.userId) {
      return { success: false, error: "Tidak bisa mengajukan barter ke barang sendiri." };
    }

    const existingPending = await prisma.barterProposal.findFirst({
      where: {
        offeredAppraisalId,
        requestedAppraisalId,
        status: "PENDING",
      },
    });

    if (existingPending) {
      return {
        success: false,
        error: "Permintaan barter untuk pasangan ini sudah menunggu respons.",
      };
    }

    const proposal = await prisma.barterProposal.create({
      data: {
        proposerUserId: auth.session.userId,
        offeredAppraisalId,
        requestedAppraisalId,
        message: message?.trim() || null,
      },
    });

    revalidateBarterPaths();
    revalidatePath(`/barter/${requestedAppraisalId}`);

    return { success: true, proposalId: proposal.id };
  } catch (error) {
    console.error("[createBarterProposal]", error);
    return { success: false, error: "Gagal mengajukan barter." };
  }
}

export async function acceptBarterProposal(
  proposalId: string,
): Promise<ActionResult> {
  const auth = await requireSession();
  if (!auth.ok) return { success: false, error: auth.error };

  try {
    const proposal = await prisma.barterProposal.findUnique({
      where: { id: proposalId },
      include: { requestedAppraisal: { select: { userId: true } } },
    });

    if (!proposal || proposal.status !== "PENDING") {
      return { success: false, error: "Permintaan tidak valid." };
    }

    const recipientId = proposal.requestedAppraisal.userId;
    const isAdmin =
      auth.session.role === "SUPER_ADMIN" || auth.session.role === "CURATOR";

    if (recipientId) {
      if (recipientId !== auth.session.userId) {
        return {
          success: false,
          error: "Hanya pemilik barang yang dituju yang bisa menerima.",
        };
      }
    } else if (!isAdmin) {
      return {
        success: false,
        error: "Barang lawan belum terhubung akun — hubungi admin untuk mediasi.",
      };
    }

    await prisma.barterProposal.update({
      where: { id: proposalId },
      data: { status: "ACCEPTED", respondedAt: new Date() },
    });

    revalidateBarterPaths();
    return { success: true };
  } catch (error) {
    console.error("[acceptBarterProposal]", error);
    return { success: false, error: "Gagal menerima permintaan." };
  }
}

export async function rejectBarterProposal(
  proposalId: string,
): Promise<ActionResult> {
  const auth = await requireSession();
  if (!auth.ok) return { success: false, error: auth.error };

  try {
    const proposal = await prisma.barterProposal.findUnique({
      where: { id: proposalId },
      include: { requestedAppraisal: { select: { userId: true } } },
    });

    if (!proposal || proposal.status !== "PENDING") {
      return { success: false, error: "Permintaan tidak valid." };
    }

    const recipientId = proposal.requestedAppraisal.userId;
    const isAdmin =
      auth.session.role === "SUPER_ADMIN" || auth.session.role === "CURATOR";

    if (recipientId) {
      if (recipientId !== auth.session.userId) {
        return { success: false, error: "Hanya pemilik barang yang dituju yang bisa menolak." };
      }
    } else if (!isAdmin) {
      return {
        success: false,
        error: "Barang lawan belum terhubung akun — hubungi admin untuk mediasi.",
      };
    }

    await prisma.barterProposal.update({
      where: { id: proposalId },
      data: { status: "REJECTED", respondedAt: new Date() },
    });

    revalidateBarterPaths();
    return { success: true };
  } catch (error) {
    console.error("[rejectBarterProposal]", error);
    return { success: false, error: "Gagal menolak permintaan." };
  }
}

export async function cancelBarterProposal(
  proposalId: string,
): Promise<ActionResult> {
  const auth = await requireSession();
  if (!auth.ok) return { success: false, error: auth.error };

  try {
    const proposal = await prisma.barterProposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal || proposal.status !== "PENDING") {
      return { success: false, error: "Hanya permintaan menunggu yang bisa dibatalkan." };
    }

    if (proposal.proposerUserId !== auth.session.userId) {
      return { success: false, error: "Hanya pengaju yang bisa membatalkan." };
    }

    await prisma.barterProposal.update({
      where: { id: proposalId },
      data: { status: "CANCELLED", respondedAt: new Date() },
    });

    revalidateBarterPaths();
    return { success: true };
  } catch (error) {
    console.error("[cancelBarterProposal]", error);
    return { success: false, error: "Gagal membatalkan permintaan." };
  }
}

export async function completeBarterProposal(
  proposalId: string,
): Promise<ActionResult & { pointsDeducted?: number; newPoints?: number }> {
  const auth = await requireSession();
  if (!auth.ok) return { success: false, error: auth.error };

  try {
    const proposal = await prisma.barterProposal.findUnique({
      where: { id: proposalId },
      include: {
        requestedAppraisal: {
          select: { userId: true, ecoSwapPoints: true, openForBarter: true },
        },
        offeredAppraisal: {
          select: { userId: true, ecoSwapPoints: true, openForBarter: true },
        },
      },
    });

    if (!proposal || proposal.status !== "ACCEPTED") {
      return {
        success: false,
        error: "Hanya barter yang sudah disetujui yang bisa diselesaikan.",
      };
    }

    const isProposer = proposal.proposerUserId === auth.session.userId;
    const isRecipient =
      proposal.requestedAppraisal.userId === auth.session.userId;
    const isAdmin =
      auth.session.role === "SUPER_ADMIN" || auth.session.role === "CURATOR";

    if (!isProposer && !isRecipient && !isAdmin) {
      return { success: false, error: "Anda tidak berhak menyelesaikan barter ini." };
    }

    const currentUserId = auth.session.userId;
    const pointsDeducted =
      (proposal.offeredAppraisal.userId === currentUserId &&
      proposal.offeredAppraisal.openForBarter
        ? proposal.offeredAppraisal.ecoSwapPoints
        : 0) +
      (proposal.requestedAppraisal.userId === currentUserId &&
      proposal.requestedAppraisal.openForBarter
        ? proposal.requestedAppraisal.ecoSwapPoints
        : 0);

    await prisma.$transaction([
      prisma.barterProposal.update({
        where: { id: proposalId },
        data: { status: "COMPLETED", completedAt: new Date() },
      }),
      prisma.appraisal.updateMany({
        where: {
          id: { in: [proposal.offeredAppraisalId, proposal.requestedAppraisalId] },
        },
        data: { openForBarter: false, publishedAt: null },
      }),
    ]);

    const newPoints = await prisma.appraisal.aggregate({
      where: { userId: currentUserId, openForBarter: true },
      _sum: { ecoSwapPoints: true },
    });

    revalidateBarterPaths();
    revalidatePath(`/barter/${proposal.offeredAppraisalId}`);
    revalidatePath(`/barter/${proposal.requestedAppraisalId}`);

    return {
      success: true,
      pointsDeducted,
      newPoints: newPoints._sum.ecoSwapPoints ?? 0,
    };
  } catch (error) {
    console.error("[completeBarterProposal]", error);
    return { success: false, error: "Gagal menyelesaikan barter." };
  }
}

export async function adminCompleteBarterProposal(
  proposalId: string,
): Promise<ActionResult> {
  const auth = await requireSession();
  if (!auth.ok) return { success: false, error: auth.error };

  if (auth.session.role !== "SUPER_ADMIN" && auth.session.role !== "CURATOR") {
    return { success: false, error: "Akses ditolak." };
  }

  return completeBarterProposal(proposalId);
}
