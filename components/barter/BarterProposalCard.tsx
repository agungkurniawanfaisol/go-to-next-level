"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { BarterTradePair } from "@/components/barter/BarterTradePair";
import {
  acceptBarterProposal,
  cancelBarterProposal,
  completeBarterProposal,
  rejectBarterProposal,
} from "@/lib/actions/barter-proposals";
import type { BarterProposalView } from "@/lib/api/barter-proposals";
import { formatDateShortId } from "@/lib/format-date-id";

const SESSION_KEY = "ecoswap_barter_points_modal";
const EVENT_NAME = "ecoswap:barter-points-modal";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Menunggu", className: "bg-amber-100 text-amber-800" },
  ACCEPTED: { label: "Disetujui", className: "bg-emerald/15 text-emerald" },
  REJECTED: { label: "Ditolak", className: "bg-ink/10 text-ink/60" },
  CANCELLED: { label: "Dibatalkan", className: "bg-ink/10 text-ink/60" },
  COMPLETED: { label: "Selesai", className: "bg-forest/15 text-forest" },
};

type BarterProposalCardProps = {
  proposal: BarterProposalView;
  currentUserId: string;
  variant?: "active" | "history" | "admin";
  adminDetailHref?: string;
};

export function BarterProposalCard({
  proposal,
  currentUserId,
  variant = "active",
  adminDetailHref,
}: BarterProposalCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isProposer = proposal.proposer.id === currentUserId;
  const isRecipient = proposal.requested.userId === currentUserId;
  const statusStyle = STATUS_LABEL[proposal.status] ?? STATUS_LABEL.PENDING;

  const run = (
    action: () => Promise<{
      success: boolean;
      pointsDeducted?: number;
      newPoints?: number;
    }>,
  ) => {
    startTransition(async () => {
      const result = await action();
      if (result.success) router.refresh();

      if (
        result.success &&
        typeof result.pointsDeducted === "number" &&
        typeof result.newPoints === "number"
      ) {
        try {
          sessionStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
              deducted: result.pointsDeducted,
              newPoints: result.newPoints,
              completedAt: new Date().toISOString(),
            }),
          );

          window.dispatchEvent(new Event(EVENT_NAME));
        } catch {
          // no-op
        }
      }
    });
  };

  const formatDate = (d: Date | null) => (d ? formatDateShortId(d) : "—");

  return (
    <article className="overflow-hidden rounded-2xl border border-ink/8 bg-surface/90 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-xs text-ink/50">
            {isProposer ? "Anda mengajukan" : `Dari ${proposal.proposer.name}`}
            {" · "}
            {formatDate(proposal.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {adminDetailHref && (
            <Link
              href={adminDetailHref}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium text-ink/45 hover:text-emerald transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Detail
            </Link>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle.className}`}
          >
            {statusStyle.label}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <BarterTradePair offered={proposal.offered} requested={proposal.requested} />

        {proposal.message && (
          <p className="mt-4 rounded-lg bg-ivory/80 px-3 py-2 text-sm text-ink/70">
            <span className="font-medium text-ink">Pesan: </span>
            {proposal.message}
          </p>
        )}

        {variant === "history" && proposal.completedAt && (
          <p className="mt-3 text-xs text-ink/50">
            Barter selesai pada {formatDate(proposal.completedAt)}
          </p>
        )}

        {variant !== "history" && proposal.status === "PENDING" && isRecipient && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => run(() => acceptBarterProposal(proposal.id))}
              className="rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-ivory hover:bg-emerald/90 disabled:opacity-60"
            >
              Terima tukar
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => run(() => rejectBarterProposal(proposal.id))}
              className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium text-ink/70 hover:bg-ink/5 disabled:opacity-60"
            >
              Tolak
            </button>
          </div>
        )}

        {variant !== "history" &&
          proposal.status === "PENDING" &&
          isProposer && (
            <div className="mt-4">
              <button
                type="button"
                disabled={isPending}
                onClick={() => run(() => cancelBarterProposal(proposal.id))}
                className="rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                Batalkan permintaan
              </button>
            </div>
          )}

        {variant !== "history" &&
          proposal.status === "ACCEPTED" &&
          (isProposer || isRecipient || variant === "admin") && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-ink/55">
                Kedua pihak setuju. Tandai selesai setelah barang ditukar fisik.
              </p>
              <button
                type="button"
                disabled={isPending}
                onClick={() => run(() => completeBarterProposal(proposal.id))}
                className="rounded-full bg-forest px-4 py-2 text-xs font-semibold text-ivory hover:bg-forest-light disabled:opacity-60"
              >
                Tandai barter selesai
              </button>
            </div>
          )}
      </div>
    </article>
  );
}
