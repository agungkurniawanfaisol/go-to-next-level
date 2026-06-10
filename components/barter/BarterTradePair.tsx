import Link from "next/link";
import type { AppraisalSummary } from "@/lib/api/barter-proposals";

type BarterTradePairProps = {
  offered: AppraisalSummary;
  requested: AppraisalSummary;
  compact?: boolean;
};

function ItemThumb({
  item,
  label,
  compact,
}: {
  item: AppraisalSummary;
  label: string;
  compact?: boolean;
}) {
  const imageSrc =
    item.imagePath ??
    "https://placehold.co/400x300/e8e2d8/1f3d32?text=EcoSwap";

  return (
    <div className={`min-w-0 flex-1 ${compact ? "" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-forest">
        {label}
      </p>
      <Link
        href={`/barter/${item.id}`}
        className="mt-2 block overflow-hidden rounded-xl border border-ink/8 bg-ivory/80 transition-shadow hover:shadow-card"
      >
        <div className={compact ? "aspect-[4/3]" : "aspect-video"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={item.detectedObject}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-3">
          <p className="truncate text-sm font-semibold text-ink">
            {item.detectedObject}
          </p>
          <p className="mt-0.5 truncate text-xs text-ink/50">
            {item.ownerName ?? "Anonim"}
            {item.ownerCity ? ` · ${item.ownerCity}` : ""}
          </p>
          <p className="mt-1 text-xs font-medium text-gold">
            +{item.ecoSwapPoints.toLocaleString("id-ID")} poin
          </p>
        </div>
      </Link>
    </div>
  );
}

export function BarterTradePair({
  offered,
  requested,
  compact = false,
}: BarterTradePairProps) {
  return (
    <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
      <ItemThumb item={offered} label="Ditawarkan" compact={compact} />
      <div
        className="flex shrink-0 items-center justify-center sm:w-10"
        aria-hidden
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald/15 text-emerald">
          <svg
            className="h-4 w-4 sm:rotate-0 rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </span>
      </div>
      <ItemThumb item={requested} label="Dituju" compact={compact} />
    </div>
  );
}
