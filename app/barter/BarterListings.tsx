import { BarterGrid } from "@/components/barter/BarterGrid";
import { BarterMap } from "@/components/barter/BarterMap";
import { getBarterListingsWithLocations } from "@/lib/api/barter";

export async function BarterListings() {
  const listings = await getBarterListingsWithLocations();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink">
          Peta barter terdekat
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          Aktifkan lokasi untuk melihat barang terdekat dari posisi Anda.
        </p>
        <div className="mt-4">
          <BarterMap listings={listings} variant="full" enableNearby />
        </div>
      </div>
      <BarterGrid listings={listings} />
    </div>
  );
}
