export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { BarterConversation } from "@/components/barter/BarterConversation";
import { BarterItemDetail } from "@/components/barter/BarterItemDetail";
import { BarterParticipants } from "@/components/barter/BarterParticipants";
import { BarterTradePair } from "@/components/barter/BarterTradePair";
import { getBarterMessages } from "@/lib/api/barter-messages";
import { getCompletedBarterProposalById } from "@/lib/api/barter-proposals";
import { formatDateId } from "@/lib/format-date-id";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return formatDateId(d);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const proposal = await getCompletedBarterProposalById(id);
  if (!proposal) return { title: "Pertukaran tidak ditemukan — EcoSwap" };

  const recipient =
    proposal.recipientUser?.name ?? proposal.requested.ownerName ?? "Anggota";

  return {
    title: `${proposal.proposer.name} ↔ ${recipient} — Komunitas Barter`,
    description: `Pertukaran ${proposal.offered.detectedObject} dengan ${proposal.requested.detectedObject}`,
  };
}

export default async function KomunitasBarterDetailPage({ params }: PageProps) {
  const { id } = await params;
  const proposal = await getCompletedBarterProposalById(id);

  if (!proposal) notFound();

  const messages = await getBarterMessages(id);

  const recipientName =
    proposal.recipientUser?.name ??
    proposal.requested.ownerName ??
    "Anggota";

  return (
    <>
      <HeaderWithSession />
      <main className="min-h-screen bg-page">
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-12">
          <nav className="mb-6 text-sm text-ink/55" aria-label="Breadcrumb">
            <Link href="/barter" className="hover:text-forest">
              List Barter
            </Link>
            <span className="mx-2">/</span>
            <Link href="/barter/riwayat" className="hover:text-forest">
              Komunitas Barter
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Detail</span>
          </nav>

          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="rounded-full bg-forest/15 px-3 py-1 text-xs font-semibold text-forest">
                Barter selesai
              </span>
              <h1 className="font-display mt-3 text-2xl font-bold text-ink md:text-3xl">
                {proposal.proposer.name}{" "}
                <span className="font-normal text-ink/40">↔</span> {recipientName}
              </h1>
              <p className="mt-1 text-sm text-ink/55">
                Selesai {formatDate(proposal.completedAt)}
              </p>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-ink/8 bg-surface/90 p-5 shadow-sm">
            <BarterParticipants proposal={proposal} />
          </section>

          <section className="mt-6 grid gap-3 rounded-2xl border border-ink/8 bg-surface/90 p-5 shadow-sm sm:grid-cols-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                Diajukan
              </p>
              <p className="mt-1 text-sm text-ink">{formatDate(proposal.createdAt)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                Disetujui
              </p>
              <p className="mt-1 text-sm text-ink">
                {formatDate(proposal.respondedAt)}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                Selesai
              </p>
              <p className="mt-1 text-sm font-medium text-forest">
                {formatDate(proposal.completedAt)}
              </p>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-ink/8 bg-surface/90 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-forest">
              Barang yang ditukar
            </h2>
            <div className="mt-4">
              <BarterTradePair
                offered={proposal.offered}
                requested={proposal.requested}
              />
            </div>
            <div className="mt-6 space-y-4">
              <BarterItemDetail item={proposal.offered} label="Barang ditawarkan" />
              <BarterItemDetail item={proposal.requested} label="Barang diterima" />
            </div>
          </section>

          {proposal.message && (
            <section className="mt-6 rounded-2xl border border-ink/8 bg-surface/90 p-5 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink/45">
                Pesan awal
              </h2>
              <p className="mt-3 text-sm italic leading-relaxed text-ink/75">
                &ldquo;{proposal.message}&rdquo;
              </p>
            </section>
          )}

          <section className="mt-6 overflow-hidden rounded-2xl border border-ink/8 bg-surface/90 shadow-sm">
            <div className="border-b border-ink/8 px-5 py-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-forest">
                Percakapan ({messages.length} pesan)
              </h2>
            </div>
            <div className="p-5">
              <BarterConversation
                messages={messages}
                proposerId={proposal.proposer.id}
              />
            </div>
          </section>

          <div className="mt-8">
            <Link
              href="/barter/riwayat"
              className="text-sm font-medium text-forest hover:underline"
            >
              ← Kembali ke Komunitas Barter
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
