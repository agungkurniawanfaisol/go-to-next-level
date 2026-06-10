import { db } from "@/lib/db";

export type AppraisalSummary = {
  id: string;
  detectedObject: string;
  imagePath: string | null;
  ownerName: string | null;
  ownerCity: string | null;
  ecoSwapPoints: number;
  userId: string | null;
  swapDescription: string | null;
  wantedItem: string | null;
};

export type BarterUserSummary = {
  id: string;
  name: string;
  email: string;
};

export type BarterProposalStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";

export type BarterProposalView = {
  id: string;
  status: BarterProposalStatus;
  message: string | null;
  createdAt: Date;
  respondedAt: Date | null;
  completedAt: Date | null;
  proposer: BarterUserSummary;
  recipientUser: BarterUserSummary | null;
  offered: AppraisalSummary;
  requested: AppraisalSummary;
};

const appraisalSelect = {
  id: true,
  detectedObject: true,
  imagePath: true,
  ownerName: true,
  ownerCity: true,
  ecoSwapPoints: true,
  userId: true,
  swapDescription: true,
  wantedItem: true,
} as const;

type ProposalRow = {
  id: string;
  status: BarterProposalStatus;
  message: string | null;
  createdAt: Date;
  respondedAt: Date | null;
  completedAt: Date | null;
  proposer: BarterUserSummary;
  offeredAppraisal: {
    id: string;
    detectedObject: string;
    imagePath: string | null;
    ownerName: string | null;
    ownerCity: string | null;
    ecoSwapPoints: number;
    userId: string | null;
    swapDescription: string | null;
    wantedItem: string | null;
  };
  requestedAppraisal: {
    id: string;
    detectedObject: string;
    imagePath: string | null;
    ownerName: string | null;
    ownerCity: string | null;
    ecoSwapPoints: number;
    userId: string | null;
    swapDescription: string | null;
    wantedItem: string | null;
    user: BarterUserSummary | null;
  };
};

function mapProposal(row: ProposalRow): BarterProposalView {
  return {
    id: row.id,
    status: row.status,
    message: row.message,
    createdAt: row.createdAt,
    respondedAt: row.respondedAt,
    completedAt: row.completedAt,
    proposer: row.proposer,
    recipientUser: (row.requestedAppraisal as any).user ?? null,
    offered: row.offeredAppraisal,
    requested: {
      id: row.requestedAppraisal.id,
      detectedObject: row.requestedAppraisal.detectedObject,
      imagePath: row.requestedAppraisal.imagePath,
      ownerName: row.requestedAppraisal.ownerName,
      ownerCity: row.requestedAppraisal.ownerCity,
      ecoSwapPoints: row.requestedAppraisal.ecoSwapPoints,
      userId: row.requestedAppraisal.userId,
      swapDescription: row.requestedAppraisal.swapDescription,
      wantedItem: row.requestedAppraisal.wantedItem,
    },
  };
}

const proposalInclude = {
  proposer: { select: { id: true, name: true, email: true } },
  offeredAppraisal: { select: { ...appraisalSelect } },
  requestedAppraisal: {
    select: {
      ...appraisalSelect,
      user: { select: { id: true, name: true, email: true } },
    },
  },
} as const;

export async function getUserPublishedItems(
  userId: string,
  excludeAppraisalId?: string,
): Promise<AppraisalSummary[]> {
  return db.appraisal.findMany({
    where: {
      userId,
      openForBarter: true,
      ...(excludeAppraisalId ? { id: { not: excludeAppraisalId } } : {}),
    },
    select: appraisalSelect,
    orderBy: { publishedAt: "desc" },
  });
}

export async function getBarterProposalById(
  id: string,
): Promise<BarterProposalView | null> {
  const row = db.barterProposal.findUnique({
    where: { id },
    include: proposalInclude,
  });
  return row ? mapProposal(row) : null;
}

export async function getCompletedBarterProposalById(
  id: string,
): Promise<BarterProposalView | null> {
  const row = db.barterProposal.findUnique({
    where: { id, status: "COMPLETED" },
    include: proposalInclude,
  });
  return row ? mapProposal(row) : null;
}

export async function getCompletedBarterStats(): Promise<{
  tradeCount: number;
  memberCount: number;
}> {
  const completed = db.barterProposal.findMany({
    where: { status: "COMPLETED" },
  });

  const memberIds = new Set<string>();
  for (const row of completed) {
    memberIds.add(row.proposerUserId as string);
    const requestedAppraisal = db.appraisal.findUnique({ where: { id: row.requestedAppraisalId as string } });
    if (requestedAppraisal?.userId) {
      memberIds.add(requestedAppraisal.userId as string);
    }
  }

  return {
    tradeCount: completed.length,
    memberCount: memberIds.size,
  };
}

export async function getUserBarterProposals(
  userId: string,
): Promise<{ sent: BarterProposalView[]; received: BarterProposalView[] }> {
  // Get proposals where user is proposer
  const sentRows = db.barterProposal.findMany({
    where: {
      proposerUserId: userId,
      status: { in: ["PENDING", "ACCEPTED"] },
    },
    include: proposalInclude,
    orderBy: { createdAt: "desc" },
  });

  // Get proposals where user is the owner of the requested appraisal
  const userAppraisalIds = db.appraisal
    .findMany({ where: { userId }, select: { id: true } })
    .map((a: any) => a.id);

  const receivedRows = db.barterProposal.findMany({
    where: {
      requestedAppraisalId: { in: userAppraisalIds },
      status: { in: ["PENDING", "ACCEPTED"] },
    },
    include: proposalInclude,
    orderBy: { createdAt: "desc" },
  });

  const mapped = [...sentRows, ...receivedRows].map(mapProposal);
  const sent = mapped.filter((p) => p.proposer.id === userId);
  const received = mapped.filter(
    (p) =>
      p.proposer.id !== userId && p.requested.userId === userId,
  );

  return { sent, received };
}

export async function getCompletedBarterProposals(
  limit = 50,
): Promise<BarterProposalView[]> {
  const rows = db.barterProposal.findMany({
    where: { status: "COMPLETED" },
    include: proposalInclude,
    orderBy: { completedAt: "desc" },
    take: limit,
  });
  return rows.map(mapProposal);
}

export async function getAdminBarterProposals(
  statusFilter: "active" | "completed",
): Promise<BarterProposalView[]> {
  const status =
    statusFilter === "completed"
      ? ["COMPLETED"]
      : ["PENDING", "ACCEPTED"];

  const rows = db.barterProposal.findMany({
    where: { status: { in: status } },
    include: proposalInclude,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return rows.map(mapProposal);
}

export async function getAdminBarterProposalStats(): Promise<{
  pending: number;
  accepted: number;
  completed: number;
}> {
  const pending = db.barterProposal.count({ where: { status: "PENDING" } });
  const accepted = db.barterProposal.count({ where: { status: "ACCEPTED" } });
  const completed = db.barterProposal.count({ where: { status: "COMPLETED" } });
  return { pending, accepted, completed };
}
