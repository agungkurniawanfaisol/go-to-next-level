import { BarterGrid } from "@/components/barter/BarterGrid";
import { getBarterListings } from "@/lib/api/barter";

export async function BarterListings() {
  const listings = await getBarterListings();
  return <BarterGrid listings={listings} />;
}
