import Link from "next/link";
import { BarterMap } from "@/components/barter/BarterMap";
import { SectionShell } from "@/components/sections/SectionShell";
import type { BarterListing } from "@/lib/api/barter";

type BarterNearbyMapSectionProps = {
  listings: BarterListing[];
};

export function BarterNearbyMapSection({ listings }: BarterNearbyMapSectionProps) {
  return (
    <SectionShell
      id="barter-terdekat"
      eyebrow="Circular Swap"
      title="Barter di dekat Anda"
      description="Lihat barang siap ditukar di peta — aktifkan lokasi untuk urutan terdekat, ketuk pin, lalu ajak barter."
    >
      <BarterMap listings={listings} variant="full" enableNearby />
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/barter"
          className="inline-flex rounded-full border border-gold/35 bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
        >
          Lihat semua barter →
        </Link>
        <Link
          href="/appraisal"
          className="inline-flex rounded-full border border-ink/15 bg-surface px-6 py-3 text-sm font-medium text-ink/65 transition-all hover:border-emerald/40 hover:text-forest"
        >
          Upload barang Anda
        </Link>
      </div>
    </SectionShell>
  );
}
