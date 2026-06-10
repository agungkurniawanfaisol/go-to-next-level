"use client";

import Link from "next/link";
import { useTransition } from "react";
import { unpublishBarter } from "@/lib/actions/barter";
import type { BarterListing } from "@/lib/api/barter";

type AdminBarterCardProps = {
  listing: BarterListing;
};

function formatDate(d: Date | null): string {
  if (!d) return "—";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isHighHeritage(role: string): boolean {
  return role.toLowerCase().includes("high heritage");
}

export function AdminBarterCard({ listing }: AdminBarterCardProps) {
  const [isPending, startTransition] = useTransition();

  const imageSrc =
    listing.imagePath ??
    "https://placehold.co/400x300/e8e2d8/1f3d32?text=EcoSwap";

  const handleUnpublish = () => {
    startTransition(async () => {
      await unpublishBarter(listing.id);
    });
  };

  return (
    <article className="overflow-hidden rounded-xl border border-ink/8 bg-ivory/90 shadow-sm transition-shadow hover:shadow-card">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full shrink-0 md:w-48">
          <div className="aspect-[4/3] md:aspect-square md:h-48">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={listing.detectedObject}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="absolute left-2 top-2 rounded-full bg-emerald px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-sm">
            Siap Barter
          </span>
          {isHighHeritage(listing.roleClassification) && (
            <span className="absolute right-2 top-2 rounded-full border border-gold/40 bg-gold px-2 py-0.5 text-[10px] font-bold uppercase text-ink">
              Heritage
            </span>
          )}
        </div>

        {/* Detail barang */}
        <div className="flex min-w-0 flex-1 flex-col p-4 md:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-forest">
                Barang ditawarkan
              </p>
              <h3 className="font-display mt-1 text-lg font-semibold leading-snug text-ink md:text-xl">
                {listing.detectedObject}
              </h3>
            </div>
            <span className="shrink-0 rounded-full bg-gold/15 px-3 py-1 text-sm font-bold text-gold">
              +{listing.ecoSwapPoints.toLocaleString("id-ID")} poin
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink/65">
            <span className="inline-flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest/15 text-xs font-bold text-forest">
                {(listing.ownerName ?? "?").charAt(0).toUpperCase()}
              </span>
              <span>
                <span className="font-medium text-ink">
                  {listing.ownerName ?? "Anonim"}
                </span>
                {listing.ownerCity ? ` · ${listing.ownerCity}` : ""}
              </span>
            </span>
            <span className="text-ink/30">|</span>
            <span className="text-xs text-ink/50">
              Dipublikasi {formatDate(listing.publishedAt)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-medium text-emerald">
              CNN {listing.confidenceScore.toFixed(1)}%
            </span>
            <span className="rounded-full border border-ink/10 px-2.5 py-0.5 text-xs text-ink/60">
              {listing.roleClassification}
            </span>
          </div>

          {listing.swapDescription && (
            <div className="mt-3 rounded-xl border border-ink/8 bg-ivory/80 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                Cerita / kondisi barang
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink/75">
                {listing.swapDescription}
              </p>
            </div>
          )}

          {listing.wantedItem && (
            <div className="mt-3 rounded-xl border border-gold/25 bg-gold/8 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                Dicari untuk ditukar
              </p>
              <p className="mt-1 text-sm font-medium text-ink">
                {listing.wantedItem}
              </p>
            </div>
          )}

          {!listing.swapDescription && !listing.wantedItem && (
            <p className="mt-3 text-sm italic text-ink/45">
              Belum ada deskripsi atau permintaan barter dari pemilik.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2 border-t border-ink/8 pt-4">
            <Link
              href={`/barter/${listing.id}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest/30 bg-forest px-4 py-2 text-xs font-semibold text-ivory transition-colors hover:bg-forest-light"
            >
              Lihat detail & 360°
            </Link>
            <button
              type="button"
              onClick={handleUnpublish}
              disabled={isPending}
              className="rounded-full border border-red-200 px-4 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              {isPending ? "Menonaktifkan…" : "Nonaktifkan dari list"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
