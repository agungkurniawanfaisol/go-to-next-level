export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { BarterStats } from "@/components/barter/BarterStats";
import { getBarterStats } from "@/lib/api/barter-stats";

export const metadata: Metadata = {
  title: "Statistik Barter — EcoSwap",
  description:
    "Statistik lengkap ekosistem barter — distribusi kategori, total EcoSwap Poin, dan barang teratas.",
};

export default async function BarterStatsPage() {
  const stats = await getBarterStats();

  return (
    <>
      <HeaderWithSession />
      <main className="bg-page min-h-screen">
        <div className="border-b border-ink/8 bg-gradient-to-b from-forest/8 via-ivory to-ivory">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-forest">
              <Link
                href="/barter"
                className="transition-colors hover:text-emerald"
              >
                Circular Swap
              </Link>
              <span className="text-ink/30">/</span>
              <span className="text-emerald">Statistik</span>
            </div>
            <h1 className="font-display mt-3 max-w-2xl text-4xl font-bold text-ink md:text-5xl">
              Statistik Barter
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink/70">
              Gambaran lengkap ekosistem barter — dari distribusi kategori
              hingga barang dengan poin tertinggi.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <BarterStats stats={stats} />
        </div>
      </main>
    </>
  );
}
