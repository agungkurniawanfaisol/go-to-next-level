import { prisma } from "@/lib/prisma";

export type BarterMessageView = {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: Date;
};

export async function getBarterMessages(
  proposalId: string,
): Promise<BarterMessageView[]> {
  const rows = await prisma.barterMessage.findMany({
    where: { proposalId },
    include: {
      sender: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    senderId: row.senderId,
    senderName: row.sender.name,
    message: row.message,
    createdAt: row.createdAt,
  }));
}
