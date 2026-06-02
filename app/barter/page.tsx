export const dynamic = "force-dynamic";

import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { BarterListings } from "./BarterListings";
import { BarterGridSkeleton } from "@/components/barter/BarterGridSkeleton";

export const metadata: Metadata = {
  title: "List Barter — EcoSwap",
  description:
    "Daftar barang dari komunitas yang siap ditukar — heritage, circular swap, dan preview 360°.",
};

export default function BarterPage() {
  return (
    <>
      <HeaderWithSession />
      <main className="bg-page min-h-screen">
        <div className="border-b border-ink/8 bg-gradient-to-b from-forest/8 via-ivory to-ivory">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-forest">
              Circular Swap
            </p>
            <h1 className="font-display mt-3 max-w-2xl text-4xl font-bold text-ink md:text-5xl">
              List Barter
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink/70">
              Barang hasil upload komunitas yang <strong className="font-medium text-ink">mau ditukar</strong> — lihat detail, poin CNN, dan preview 360°.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/appraisal"
                className="inline-flex rounded-full border border-gold/35 bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
              >
                Upload barang Anda →
              </Link>
              <Link
                href="/barter/saya"
                className="inline-flex rounded-full border border-ink/15 bg-surface px-6 py-3 text-sm font-medium text-ink/65 transition-all hover:border-emerald/40 hover:text-forest"
              >
                Dashboard Saya
              </Link>
              <Link
                href="/barter/permintaan"
                className="inline-flex rounded-full border border-ink/15 bg-surface px-6 py-3 text-sm font-medium text-ink/65 transition-all hover:border-emerald/40 hover:text-forest"
              >
                Permintaan Saya
              </Link>
              <Link
                href="/barter/riwayat"
                className="inline-flex rounded-full border border-ink/15 bg-surface px-6 py-3 text-sm font-medium text-ink/65 transition-all hover:border-emerald/40 hover:text-forest"
              >
                Komunitas Barter
              </Link>
              <Link
                href="/barter/stats"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-6 py-3 text-sm font-medium text-ink/65 transition-all hover:border-emerald/40 hover:text-forest hover:shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                Statistik
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
          <Suspense fallback={<BarterGridSkeleton />}>
            <BarterListings />
          </Suspense>
        </div>
      </main>
    </>
  );
}
