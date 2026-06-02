import Link from "next/link";
import type { AppraisalSummary } from "@/lib/api/barter-proposals";

type BarterItemDetailProps = {
  item: AppraisalSummary;
  label: string;
};

export function BarterItemDetail({ item, label }: BarterItemDetailProps) {
  const imageSrc =
    item.imagePath ??
    "https://placehold.co/400x300/e8e2d8/1f3d32?text=EcoSwap";

  return (
    <div className="rounded-xl border border-ink/8 bg-ivory/80 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-forest">
        {label}
      </p>
      <div className="mt-3 flex gap-4">
        <Link
          href={`/barter/${item.id}`}
          className="block w-28 shrink-0 overflow-hidden rounded-lg border border-ink/8"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={item.detectedObject}
            className="aspect-square w-full object-cover"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <Link
            href={`/barter/${item.id}`}
            className="font-display text-lg font-semibold text-ink hover:text-forest"
          >
            {item.detectedObject}
          </Link>
          <p className="mt-1 text-sm text-ink/55">
            {item.ownerName ?? "Anonim"}
            {item.ownerCity ? ` · ${item.ownerCity}` : ""}
          </p>
          <p className="mt-1 text-sm font-medium text-gold">
            +{item.ecoSwapPoints.toLocaleString("id-ID")} poin
          </p>
          {item.swapDescription && (
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {item.swapDescription}
            </p>
          )}
          {item.wantedItem && (
            <p className="mt-2 text-sm text-ink/60">
              <span className="font-medium text-gold">Dicari: </span>
              {item.wantedItem}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
