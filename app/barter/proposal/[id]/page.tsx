export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { BarterChatLive } from "@/components/barter/BarterChatLive";
import { BarterTradePair } from "@/components/barter/BarterTradePair";
import { getBarterProposalById } from "@/lib/api/barter-proposals";
import { getBarterMessages } from "@/lib/api/barter-messages";
import { getSession } from "@/lib/auth";
import { formatDateId } from "@/lib/format-date-id";

const STATUS_CONFIG: Record<string, { label: string; className: string; description: string }> = {
  PENDING: {
    label: "Menunggu",
    className: "bg-amber-100 text-amber-800",
    description: "Pemilik barang tujuan belum merespons.",
  },
  ACCEPTED: {
    label: "Disetujui",
    className: "bg-emerald/15 text-emerald",
    description: "Kedua pihak setuju. Segera tandai selesai setelah barang ditukar fisik.",
  },
  REJECTED: {
    label: "Ditolak",
    className: "bg-ink/10 text-ink/60",
    description: "Pemilik barang tujuan menolak pertukaran ini.",
  },
  CANCELLED: {
    label: "Dibatalkan",
    className: "bg-ink/10 text-ink/60",
    description: "Permintaan dibatalkan oleh pengaju.",
  },
  COMPLETED: {
    label: "Selesai",
    className: "bg-forest/15 text-forest",
    description: "Barter berhasil diselesaikan.",
  },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BarterProposalDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [session, proposal] = await Promise.all([
    getSession(),
    getBarterProposalById(id),
  ]);

  if (!session) {
    redirect(`/masuk?redirect=/barter/proposal/${id}`);
  }

  if (!proposal) notFound();

  const messages = await getBarterMessages(id);

  const isProposer = proposal.proposer.id === session.userId;
  const isRecipient = proposal.requested.userId === session.userId;
  const isParticipant = isProposer || isRecipient;
  const isAdmin = session.role === "SUPER_ADMIN" || session.role === "CURATOR";

  if (!isParticipant && !isAdmin) {
    notFound();
  }

  const statusConf = STATUS_CONFIG[proposal.status] ?? STATUS_CONFIG.PENDING;
  const proposerName = proposal.proposer.name;
  const recipientName =
    proposal.recipientUser?.name ??
    proposal.requested.ownerName ??
    "Anggota";

  return (
    <>
      <HeaderWithSession />
      <main className="min-h-screen bg-page">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-12">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm text-ink/55" aria-label="Breadcrumb">
            <Link href="/barter" className="hover:text-forest">
              List Barter
            </Link>
            <span className="mx-2">/</span>
            <Link href="/barter/permintaan" className="hover:text-forest">
              Permintaan
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Detail Proposal</span>
          </nav>

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink md:text-3xl">
                {proposerName}{" "}
                <span className="font-normal text-ink/30">↔</span>{" "}
                {recipientName}
              </h1>
              <p className="mt-1 flex items-center gap-2 text-sm text-ink/55">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConf.className}`}
                >
                  {statusConf.label}
                </span>
                <span>Diajukan {formatDateId(proposal.createdAt)}</span>
              </p>
              <p className="mt-1 text-xs text-ink/45">{statusConf.description}</p>
            </div>
            <Link
              href="/barter/permintaan"
              className="rounded-full border border-ink/15 px-4 py-2 text-xs font-medium text-ink/60 transition-colors hover:border-ink/30 hover:text-ink"
            >
              ← Kembali
            </Link>
          </div>

          {/* Timeline info */}
          <div className="mt-6 grid gap-3 rounded-2xl border border-ink/8 bg-surface/90 p-5 shadow-sm sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                Diajukan
              </p>
              <p className="mt-1 text-sm text-ink">{formatDateId(proposal.createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                Direspons
              </p>
              <p className="mt-1 text-sm text-ink">
                {proposal.respondedAt ? formatDateId(proposal.respondedAt) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                Selesai
              </p>
              <p className="mt-1 text-sm font-medium text-forest">
                {proposal.completedAt ? formatDateId(proposal.completedAt) : "—"}
              </p>
            </div>
          </div>

          {/* Trade pair */}
          <section className="mt-6 rounded-2xl border border-ink/8 bg-surface/90 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-forest">
              Barang yang Dipertukarkan
            </h2>
            <div className="mt-4">
              <BarterTradePair
                offered={proposal.offered}
                requested={proposal.requested}
              />
            </div>
          </section>

          {/* Pesan awal */}
          {proposal.message && (
            <section className="mt-6 rounded-2xl border border-ink/8 bg-surface/90 p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/45">
                Pesan Awal
              </h2>
              <p className="mt-3 text-sm italic leading-relaxed text-ink/75">
                &ldquo;{proposal.message}&rdquo;
              </p>
            </section>
          )}

          {/* Live Chat */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-ink/8 bg-surface/90 shadow-sm">
            <div className="border-b border-ink/8 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-forest">
                Percakapan ({messages.length} pesan)
              </h2>
            </div>
            <div className="p-5">
              <BarterChatLive
                messages={messages}
                proposalId={id}
                currentUserId={session.userId}
                proposerId={proposal.proposer.id}
                proposerName={proposerName}
                recipientName={recipientName}
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
