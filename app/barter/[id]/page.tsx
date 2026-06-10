import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { BarterDetailView } from "@/components/barter/BarterDetailView";
import { getBarterListingById } from "@/lib/api/barter";
import { getUserPublishedItems } from "@/lib/api/barter-proposals";
import { getSession, getValidSessionUserId } from "@/lib/auth";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getBarterListingById(id);
  if (!listing) return { title: "Barang tidak ditemukan — EcoSwap" };
  return {
    title: `${listing.detectedObject} — List Barter EcoSwap`,
    description: listing.swapDescription ?? `Barter ${listing.detectedObject}`,
  };
}

export default async function BarterDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [listing, session, validUserId] = await Promise.all([
    getBarterListingById(id),
    getSession(),
    getValidSessionUserId(),
  ]);

  if (!listing) notFound();

  const isLoggedIn = !!session && !!validUserId;
  const isOwnListing = isLoggedIn && listing.userId === validUserId;
  const myItems =
    isLoggedIn && !isOwnListing
      ? await getUserPublishedItems(validUserId!, listing.id)
      : [];

  return (
    <>
      <HeaderWithSession />
      <main className="bg-page min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
          <nav className="mb-6 text-sm text-ink/55" aria-label="Breadcrumb">
            <Link href="/barter" className="hover:text-forest">
              List Barter
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{listing.detectedObject}</span>
          </nav>

          {listing.openForBarter && !isOwnListing && isLoggedIn && myItems.length > 0 && (
            <div className="mb-6 rounded-2xl border border-gold/30 bg-gradient-to-r from-forest/10 via-gold/8 to-ivory px-4 py-3 lg:hidden dark:from-forest/20 dark:via-gold/12">
              <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                Tukar barang
              </p>
              <p className="mt-1 text-sm text-ink/70">
                Ketuk <strong className="text-ink">Ajukan Barter</strong> — membuka halaman
                baru (bukan popup) untuk pilih barang, bandingkan poin, lalu kirim ke{" "}
                {listing.ownerName ?? "pemilik"}.
              </p>
            </div>
          )}

          <BarterDetailView
            listing={listing}
            myItems={myItems}
            isLoggedIn={isLoggedIn}
            isOwnListing={isOwnListing}
            sessionStale={!!session && !validUserId}
          />
        </div>
      </main>
    </>
  );
}
