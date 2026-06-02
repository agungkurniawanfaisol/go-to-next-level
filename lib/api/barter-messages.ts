import { db } from "@/lib/db";

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
  const rows = db.barterMessage.findMany({
    where: { proposalId },
    include: {
      sender: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((row: any) => ({
    id: row.id,
    senderId: row.senderId,
    senderName: row.sender?.name ?? "Unknown",
    message: row.message,
    createdAt: new Date(row.createdAt),
  }));
}
