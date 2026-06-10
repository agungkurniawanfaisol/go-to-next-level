"use client";

import { BarterMap } from "@/components/barter/BarterMap";
import type { BarterListing } from "@/lib/api/barter";

type AdminBarterMapProps = {
  listings: BarterListing[];
  activeListingId?: string | null;
  onPickListing?: (listingId: string) => void;
};

export function AdminBarterMap({
  listings,
  activeListingId = null,
  onPickListing,
}: AdminBarterMapProps) {
  return (
    <BarterMap
      listings={listings}
      variant="full"
      enableNearby
      activeListingId={activeListingId}
      onPickListing={onPickListing}
    />
  );
}
