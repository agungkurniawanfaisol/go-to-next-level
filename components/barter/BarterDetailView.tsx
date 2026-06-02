"use client";

import { useState } from "react";
import { PannellumViewer360 } from "@/components/appraisal/PannellumViewer360";
import { ProposeBarterPanel } from "@/components/barter/ProposeBarterPanel";
import type { BarterListingDetail } from "@/lib/api/barter";
import type { AppraisalSummary } from "@/lib/api/barter-proposals";

type BarterDetailViewProps = {
  listing: BarterListingDetail;
  myItems?: AppraisalSummary[];
  isLoggedIn?: boolean;
  isOwnListing?: boolean;
  sessionStale?: boolean;
};

export function BarterDetailView({
  listing,
  myItems = [],
  isLoggedIn = false,
  isOwnListing = false,
  sessionStale = false,
}: BarterDetailViewProps) {
  const [viewerReady, setViewerReady] = useState(false);

  const imageSrc =
    listing.imagePath ??
    "https://placehold.co/1200x800/e8e2d8/1f3d32?text=EcoSwap";

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
      {/* Mobile: panel barter di atas; desktop: sidebar kanan */}
      <aside className="order-1 flex flex-col gap-4 lg:order-2 lg:col-span-1 lg:sticky lg:top-24">
        {!listing.openForBarter && (
          <div className="rounded-2xl border border-ink/15 bg-ink/5 px-4 py-3 text-sm text-ink/70">
            <p className="font-medium text-ink">Barang tidak lagi di List Barter</p>
            <p className="mt-1 text-xs">
              Sudah ditukar atau dinonaktifkan. Halaman ini tetap bisa dilihat sebagai
              arsip.
            </p>
          </div>
        )}

        {listing.openForBarter ? (
          <ProposeBarterPanel
            requestedAppraisalId={listing.id}
            requestedTitle={listing.detectedObject}
            requestedOwner={listing.ownerName ?? "Pemilik"}
            requestedPoints={listing.ecoSwapPoints}
            requestedImagePath={listing.imagePath}
            myItems={myItems}
            isLoggedIn={isLoggedIn}
            isOwnListing={isOwnListing}
            sessionStale={sessionStale}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-ink/15 p-5 text-center text-sm text-ink/55">
            Ajukan barter tidak tersedia untuk barang ini.
          </div>
        )}

        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">
            Pemilik
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest/15 font-display text-lg font-bold text-forest">
              {(listing.ownerName ?? "?").charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-semibold text-ink">
                {listing.ownerName ?? "Anonim"}
              </p>
              <p className="text-sm text-ink/55">
                {listing.ownerCity ?? "Indonesia"}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold text-ink">
            {listing.detectedObject}
          </h2>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-ink/50">Klasifikasi: </span>
              <span className="font-medium text-ink">
                {listing.roleClassification}
              </span>
            </p>
            <p>
              <span className="text-ink/50">Kondisi: </span>
              <span className="font-medium text-ink">
                {listing.conditionAnalysis}
              </span>
            </p>
            <p>
              <span className="text-ink/50">CNN confidence: </span>
              <span className="font-medium text-emerald">
                {listing.confidenceScore.toFixed(1)}%
              </span>
            </p>
            <div className="-mx-6 -mb-6 mt-4 border-t border-gold/20 bg-gradient-to-br from-gold/12 via-gold/5 to-ivory px-6 pb-6 pt-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink/45">
                EcoSwap Points
              </p>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-gradient-gold text-4xl font-bold tabular-nums tracking-tight drop-shadow-sm md:text-5xl">
                  {listing.ecoSwapPoints.toLocaleString("id-ID")}
                </span>
                <span className="text-sm font-semibold text-gold">Points</span>
              </div>
            </div>
          </div>
        </div>

        {listing.wantedItem && (
          <div className="rounded-2xl border border-gold/25 bg-gold/8 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">
              Dicari untuk barter
            </p>
            <p className="mt-2 font-medium text-ink">{listing.wantedItem}</p>
          </div>
        )}

        {listing.predictions.length > 0 && (
          <div className="glass-panel rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">
              Top CNN Predictions
            </p>
            <ul className="mt-3 space-y-2">
              {listing.predictions.slice(0, 3).map((p) => (
                <li key={p.rank} className="flex items-center justify-between text-sm">
                  <span className="text-ink/70">{p.label}</span>
                  <span className="font-medium text-emerald">
                    {p.probability.toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <div className="order-2 lg:order-1 lg:col-span-3">
        <div className="relative min-h-[50vh] overflow-hidden rounded-2xl border border-ink/8 bg-cream-muted shadow-elevated sm:min-h-[60vh]">
          <PannellumViewer360
            imageSrc={imageSrc}
            className="absolute inset-0 min-h-[50vh] sm:min-h-[60vh]"
            onReadyChange={setViewerReady}
          />
          <span className="pointer-events-none absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-forest/40 text-sm font-bold text-white backdrop-blur-sm">
            360
          </span>
        </div>
        <p className="mt-3 text-center text-sm text-ink/55">
          {viewerReady
            ? "Drag untuk putar 360°"
            : "Menyiapkan panorama 360°…"}
        </p>

        {listing.swapDescription && (
          <div className="glass-panel mt-6 rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-forest">
              Cerita Barang
            </p>
            <p className="mt-3 leading-relaxed text-ink/75">
              {listing.swapDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
