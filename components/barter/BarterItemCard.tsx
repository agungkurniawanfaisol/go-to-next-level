import Link from "next/link";
import type { BarterListing } from "@/lib/api/barter";

type BarterItemCardProps = {
  listing: BarterListing;
};

function OwnerInitial({ name }: { name: string }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest/15 text-xs font-bold text-forest">
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

function isHighHeritage(role: string): boolean {
  return role.toLowerCase().includes("high heritage");
}

export function BarterItemCard({ listing }: BarterItemCardProps) {
  const imageSources = [
    "/assets/gambar_keris.png",
    "/assets/gambar_gamelan.png",
    "/assets/gambar_wayang.png",
    "/assets/gambar_wayang_2.png",
    "/assets/gambar_angklung.png",
  ] as const;
  const imageLabels: Record<typeof imageSources[number], string> = {
    "/assets/gambar_keris.png": "Keris",
    "/assets/gambar_gamelan.png": "Gamelan",
    "/assets/gambar_wayang.png": "Wayang",
    "/assets/gambar_wayang_2.png": "Wayang Semar",
    "/assets/gambar_angklung.png": "Angklung",
  };
  const imageIndex = Math.abs(
    Array.from(String(listing.id)).reduce((sum, char) => sum + char.charCodeAt(0), 0),
  ) % imageSources.length;
  const imageSrc = imageSources[imageIndex];
  const displayName = imageLabels[imageSrc] ?? listing.detectedObject;

  return (
    <Link href={`/barter/${listing.id}`} className="group block">
      <article className="glass-panel overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-forest/10 to-emerald/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={
              displayName
            }
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />

          <span className="absolute left-3 top-3 rounded-full border border-emerald/40 bg-emerald/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            Siap Barter
          </span>

          {isHighHeritage(listing.roleClassification) && (
            <span className="absolute right-3 top-3 rounded-full border border-gold/40 bg-gold/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink backdrop-blur-sm">
              Heritage
            </span>
          )}

          <span className="absolute bottom-3 right-3 rounded-full border border-white/40 bg-forest/70 px-2.5 py-1 text-xs font-bold text-gold-light backdrop-blur-sm">
            +{listing.ecoSwapPoints.toLocaleString("id-ID")} poin
          </span>
        </div>

        <div className="p-5">
          <h3 className="font-display line-clamp-2 text-lg font-semibold text-ink transition-colors group-hover:text-forest">
            {displayName}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            {listing.ownerName && <OwnerInitial name={listing.ownerName} />}
            <p className="text-sm text-ink/60">
              {listing.ownerName ?? "Anonim"}
              {listing.ownerCity ? ` · ${listing.ownerCity}` : ""}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-emerald/10 px-2 py-0.5 font-medium text-emerald">
              CNN {listing.confidenceScore.toFixed(1)}%
            </span>
            <span className="rounded-full border border-ink/10 px-2 py-0.5 text-ink/55">
              {listing.roleClassification}
            </span>
          </div>

          {listing.wantedItem && (
            <p className="mt-3 line-clamp-2 text-sm italic text-ink/55">
              Cari: {listing.wantedItem}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
