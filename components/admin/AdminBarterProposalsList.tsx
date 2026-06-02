"use client";

import { BarterProposalCard } from "@/components/barter/BarterProposalCard";
import type { BarterProposalView } from "@/lib/api/barter-proposals";

type AdminBarterProposalsListProps = {
  proposals: BarterProposalView[];
  currentUserId: string;
  emptyMessage: string;
  variant: "active" | "history";
  /** Identifies the list origin so the detail page shows the correct back link */
  from?: "permintaan" | "selesai";
};

export function AdminBarterProposalsList({
  proposals,
  currentUserId,
  emptyMessage,
  variant,
  from,
}: AdminBarterProposalsListProps) {
  if (proposals.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-ink/15 py-16 text-center text-sm text-ink/50">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((p) => (
        <BarterProposalCard
          key={p.id}
          proposal={p}
          currentUserId={currentUserId}
          variant={variant === "history" ? "history" : "admin"}
          adminDetailHref={`/admin/barter/${p.id}${from ? `?from=${from}` : ""}`}
        />
      ))}
    </div>
  );
}
