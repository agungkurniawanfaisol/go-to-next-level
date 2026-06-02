"use client";

import { PannellumViewer360 } from "@/components/appraisal/PannellumViewer360";

type BarterItemPreview360Props = {
  imagePath: string | null;
  title: string;
  className?: string;
};

export function BarterItemPreview360({
  imagePath,
  title,
  className = "",
}: BarterItemPreview360Props) {
  const imageSrc =
    imagePath ?? "https://placehold.co/800x600/e8e2d8/1f3d32?text=EcoSwap";

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-ink/8 bg-cream-muted ${className}`}
    >
      <PannellumViewer360
        imageSrc={imageSrc}
        className="min-h-[200px] w-full sm:min-h-[240px]"
      />
      <span className="pointer-events-none absolute right-2 top-2 z-10 rounded-full border border-white/40 bg-forest/55 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
        360°
      </span>
      <p className="sr-only">Preview 360°: {title}</p>
    </div>
  );
}

function pointsDiffLabel(offered: number, requested: number): string {
  const diff = Math.abs(offered - requested);
  const avg = (offered + requested) / 2;
  if (avg === 0) return "Nilai belum tersedia";
  const pct = Math.round((diff / avg) * 100);
  if (pct <= 15) return "Seimbang — selisih poin kecil";
  if (pct <= 35) return "Cukup seimbang — selisih poin moderat";
  return "Selisih poin cukup besar — negosiasi disarankan";
}

export function BarterPointsCompare({
  offeredPoints,
  requestedPoints,
}: {
  offeredPoints: number;
  requestedPoints: number;
}) {
  const label = pointsDiffLabel(offeredPoints, requestedPoints);
  const diff = requestedPoints - offeredPoints;

  return (
    <div className="rounded-xl border border-gold/25 bg-gold/8 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gold">
        Perbandingan EcoSwap Points
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg bg-surface/80 px-2 py-2">
          <p className="text-[10px] text-ink/45">Anda tawarkan</p>
          <p className="text-lg font-bold tabular-nums text-gold">
            +{offeredPoints.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="rounded-lg bg-surface/80 px-2 py-2">
          <p className="text-[10px] text-ink/45">Anda minta</p>
          <p className="text-lg font-bold tabular-nums text-gold">
            +{requestedPoints.toLocaleString("id-ID")}
          </p>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-ink/60">{label}</p>
      {diff !== 0 && (
        <p className="mt-1 text-center text-[11px] text-ink/45">
          Selisih: {diff > 0 ? "+" : ""}
          {diff.toLocaleString("id-ID")} poin
        </p>
      )}
    </div>
  );
}
