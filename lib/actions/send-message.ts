"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function sendBarterMessage(
  proposalId: string,
  message: string,
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Anda harus masuk terlebih dahulu." };
  }

  if (!message.trim()) {
    return { success: false, error: "Pesan tidak boleh kosong." };
  }

  if (message.length > 2000) {
    return { success: false, error: "Pesan maksimal 2000 karakter." };
  }

  try {
    // Verify user is participant of this proposal
    const proposal = await prisma.barterProposal.findUnique({
      where: { id: proposalId },
      include: {
        offeredAppraisal: { select: { userId: true } },
        requestedAppraisal: { select: { userId: true } },
      },
    });

    if (!proposal) {
      return { success: false, error: "Proposal tidak ditemukan." };
    }

    const isProposer = proposal.proposerUserId === session.userId;
    const isRecipient = proposal.requestedAppraisal.userId === session.userId;
    const isAdmin =
      session.role === "SUPER_ADMIN" || session.role === "CURATOR";

    if (!isProposer && !isRecipient && !isAdmin) {
      return {
        success: false,
        error: "Anda bukan peserta barter ini.",
      };
    }

    await prisma.barterMessage.create({
      data: {
        proposalId,
        senderId: session.userId,
        message: message.trim(),
      },
    });

    revalidatePath(`/barter/proposal/${proposalId}`);
    revalidatePath(`/admin/barter/${proposalId}`);
    revalidatePath(`/barter/permintaan`);

    return { success: true };
  } catch (error) {
    console.error("[sendBarterMessage]", error);
    return { success: false, error: "Gagal mengirim pesan." };
  }
}
