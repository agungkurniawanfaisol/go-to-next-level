import { db } from "@/lib/db";

export type LandingTimelineEvent = {
  id: string;
  type: "barter_completed" | "item_published";
  title: string;
  detail: string;
  timestamp: string;
};

export async function getLandingTimeline(
  limit = 8,
): Promise<LandingTimelineEvent[]> {
  const completedBarters = db.barterProposal.findMany({
    where: { status: "COMPLETED" },
    include: {
      offeredAppraisal: { select: { detectedObject: true } },
      requestedAppraisal: { select: { detectedObject: true } },
      proposer: { select: { name: true } },
    },
    orderBy: { completedAt: "desc" },
    take: limit,
  });

  const publishedItems = db.appraisal.findMany({
    where: { openForBarter: true, publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  const events: LandingTimelineEvent[] = [
    ...completedBarters
      .filter((row: any) => row.completedAt)
      .map((row: any) => ({
        id: `barter-${row.id}`,
        type: "barter_completed" as const,
        title: "Barter selesai",
        detail: `${row.proposer?.name ?? "Member"}: ${row.offeredAppraisal?.detectedObject ?? "?"} ↔ ${row.requestedAppraisal?.detectedObject ?? "?"}`,
        timestamp: row.completedAt,
      })),
    ...publishedItems
      .filter((row: any) => row.publishedAt)
      .map((row: any) => ({
        id: `publish-${row.id}`,
        type: "item_published" as const,
        title: "Item baru dipublikasikan",
        detail: `${row.detectedObject} · +${Number(row.ecoSwapPoints).toLocaleString("id-ID")} PTS · ${row.ownerName ?? "Member"}${row.ownerCity ? ` (${row.ownerCity})` : ""}`,
        timestamp: row.publishedAt,
      })),
  ];

  return events
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

