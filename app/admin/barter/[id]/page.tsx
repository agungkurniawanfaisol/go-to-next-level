export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminBarterChat } from "@/components/admin/AdminBarterChat";
import { BarterTradePair } from "@/components/barter/BarterTradePair";
import { getBarterProposalById } from "@/lib/api/barter-proposals";
import { getBarterMessages } from "@/lib/api/barter-messages";
import { getSession } from "@/lib/auth";

const STATUS_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: { label: "Menunggu", className: "bg-amber-100 text-amber-800" },
  ACCEPTED: {
    label: "Disetujui",
    className: "bg-emerald/15 text-emerald",
  },
  REJECTED: {
    label: "Ditolak",
    className: "bg-ink/10 text-ink/60",
  },
  CANCELLED: {
    label: "Dibatalkan",
    className: "bg-ink/10 text-ink/60",
  },
  COMPLETED: {
    label: "Selesai",
    className: "bg-forest/15 text-forest",
  },
};

function formatDate(d: Date | string | null): string {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function AdminBarterDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const [proposal, session] = await Promise.all([
    getBarterProposalById(id),
    getSession(),
  ]);

  if (!proposal) notFound();

  const messages = await getBarterMessages(id);
  const badge = STATUS_BADGE[proposal.status] ?? STATUS_BADGE.PENDING;

  // Determine the two participants
  const proposerName = proposal.proposer.name;
  const recipientId = proposal.requested.userId ?? "";
  const recipientName = proposal.requested.ownerName ?? "Anonim";

  const backHref =
    from === "permintaan" ? "/admin/barter/permintaan" : "/admin/barter/selesai";

  return (
    <>
      <AdminTopBar
        title="Detail Barter"
        description={`ID: ${id.slice(0, 8)}…`}
      />
      <div className="flex items-center justify-between border-b border-ink/8 px-6 py-3 lg:px-8">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
        <Link
          href={backHref}
          className="text-xs text-ink/50 hover:text-ink/80 transition-colors"
        >
          ← Kembali
        </Link>
      </div>

      <div className="min-h-0 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Info cards row */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-ink/8 bg-surface/90 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
              Pengaju (Proposer)
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {proposerName}
            </p>
            <p className="text-xs text-ink/50">{proposal.proposer.email}</p>
          </div>

          <div className="rounded-xl border border-ink/8 bg-surface/90 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
              Pemilik Barang Tujuan
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">
              {recipientName}
            </p>
            <p className="text-xs text-ink/50">{proposal.requested.ownerCity ?? "—"}</p>
          </div>

          <div className="rounded-xl border border-ink/8 bg-surface/90 px-4 py-3 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
              Timeline
            </p>
            <p className="mt-1 text-xs text-ink/70">
              Dibuat: {formatDate(proposal.createdAt)}
            </p>
            {proposal.respondedAt && (
              <p className="text-xs text-ink/50">
                Direspons: {formatDate(proposal.respondedAt)}
              </p>
            )}
            {proposal.completedAt && (
              <p className="text-xs text-ink/50">
                Selesai: {formatDate(proposal.completedAt)}
              </p>
            )}
          </div>
        </div>

        {/* Barang yang dipertukarkan */}
        <div className="rounded-2xl border border-ink/8 bg-surface/90 p-4 shadow-sm sm:p-6">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-ink/45">
            Barang yang dipertukarkan
          </p>
          <BarterTradePair
            offered={proposal.offered}
            requested={proposal.requested}
          />
        </div>

        {/* Pesan awal */}
        {proposal.message && (
          <div className="rounded-2xl border border-ink/8 bg-surface/90 p-4 shadow-sm sm:p-6">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink/45">
              Pesan awal dari pengaju
            </p>
            <p className="text-sm text-ink/80 italic">
              &ldquo;{proposal.message}&rdquo;
            </p>
          </div>
        )}

        {/* Chat / Percakapan */}
        <div className="rounded-2xl border border-ink/8 bg-surface/90 shadow-sm">
          <div className="border-b border-ink/8 px-4 py-3 sm:px-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
              Percakapan ({messages.length} pesan)
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <AdminBarterChat
              messages={messages}
              proposerId={proposal.proposer.id}
              proposerName={proposerName}
              recipientId={recipientId}
              recipientName={recipientName}
            />
          </div>
        </div>
      </div>
    </>
  );
}
