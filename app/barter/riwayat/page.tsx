export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { CompletedBarterCard } from "@/components/barter/CompletedBarterCard";
import {
  getCompletedBarterProposals,
  getCompletedBarterStats,
} from "@/lib/api/barter-proposals";

export const metadata: Metadata = {
  title: "Komunitas Barter — EcoSwap",
  description:
    "Anggota komunitas yang sudah berhasil menukar barang — lihat siapa, barang apa, dan cerita pertukarannya.",
};

export default async function KomunitasBarterPage() {
  const [completed, stats] = await Promise.all([
    getCompletedBarterProposals(),
    getCompletedBarterStats(),
  ]);

  return (
    <>
      <HeaderWithSession />
      <main className="min-h-screen bg-page">
        <div className="border-b border-ink/8 bg-gradient-to-b from-forest/8 via-ivory to-ivory">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
            <nav className="mb-4 text-sm text-ink/55">
              <Link href="/barter" className="hover:text-forest">
                List Barter
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink">Komunitas Barter</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-widest text-forest">
              Circular Swap
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold text-ink md:text-4xl">
              Komunitas Barter
            </h1>
            <p className="mt-3 max-w-2xl text-ink/65">
              Orang-orang yang sudah berhasil bertukar barang di EcoSwap — lihat
              pasangan barang, pemiliknya, dan cerita lengkap setiap pertukaran.
            </p>
            {stats.tradeCount > 0 && (
              <p className="mt-4 text-sm font-medium text-forest">
                {stats.tradeCount} pertukaran selesai · {stats.memberCount}{" "}
                anggota terlibat
              </p>
            )}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          {completed.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {completed.map((proposal) => (
                <CompletedBarterCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-ink/15 py-20 text-center">
              <p className="font-medium text-ink">Belum ada barter selesai</p>
              <p className="mt-2 text-sm text-ink/55">
                Setelah kedua pihak menandai pertukaran selesai, kisah mereka
                muncul di sini.
              </p>
              <Link
                href="/barter"
                className="mt-6 inline-block rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-ivory"
              >
                Lihat List Barter
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
