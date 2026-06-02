"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { BarterListing } from "@/lib/api/barter";
import { formatDistanceKm } from "@/lib/geo/distance";

const LeafletMapContainer = dynamic(
  async () => (await import("react-leaflet")).MapContainer,
  { ssr: false },
);
const LeafletTileLayer = dynamic(
  async () => (await import("react-leaflet")).TileLayer,
  { ssr: false },
);
const LeafletMarker = dynamic(
  async () => (await import("react-leaflet")).Marker,
  { ssr: false },
);
const LeafletPopup = dynamic(
  async () => (await import("react-leaflet")).Popup,
  { ssr: false },
);
const MapFlyTo = dynamic(
  () => import("@/components/barter/BarterMapFlyTo").then((m) => m.BarterMapFlyTo),
  { ssr: false },
);
const UserLocationMarker = dynamic(
  () =>
    import("@/components/barter/BarterMapFlyTo").then(
      (m) => m.UserLocationMarker,
    ),
  { ssr: false },
);

export type BarterMapProps = {
  listings: BarterListing[];
  variant?: "full" | "compact";
  enableNearby?: boolean;
  maxListings?: number;
  activeListingId?: string | null;
  onPickListing?: (listingId: string) => void;
  className?: string;
};

type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  city: string;
  points: number;
  owner: string;
  distanceKm: number | null;
};

function hashJitter(id: string, indexInCity: number): { lat: number; lng: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const angle = ((hash % 360) * Math.PI) / 180;
  const radius = 0.012 + indexInCity * 0.006;
  return {
    lat: Math.sin(angle) * radius,
    lng: Math.cos(angle) * radius,
  };
}

function buildPoints(
  listings: BarterListing[],
  distanceById: Map<string, number | null>,
): MapPoint[] {
  const cityCounts = new Map<string, number>();

  return listings
    .filter((row) => row.location)
    .map((row) => {
      const cityKey = row.location!.cityLabel.toLowerCase();
      const indexInCity = cityCounts.get(cityKey) ?? 0;
      cityCounts.set(cityKey, indexInCity + 1);
      const jitter = hashJitter(row.id, indexInCity);

      return {
        id: row.id,
        lat: row.location!.lat + jitter.lat,
        lng: row.location!.lng + jitter.lng,
        label: row.detectedObject,
        city: row.location!.cityLabel,
        points: row.ecoSwapPoints,
        owner: row.ownerName ?? "Member",
        distanceKm: distanceById.get(row.id) ?? null,
      };
    });
}

function computeCenter(points: MapPoint[]): [number, number] {
  if (points.length === 0) return [-2.5489, 118.0149];
  const latSum = points.reduce((sum, p) => sum + p.lat, 0);
  const lngSum = points.reduce((sum, p) => sum + p.lng, 0);
  return [latSum / points.length, lngSum / points.length];
}

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function BarterMap({
  listings,
  variant = "full",
  enableNearby = true,
  maxListings,
  activeListingId = null,
  onPickListing,
  className = "",
}: BarterMapProps) {
  const [iconsReady, setIconsReady] = useState(false);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [geoStatus, setGeoStatus] = useState<
    "idle" | "loading" | "ok" | "denied" | "error"
  >("idle");

  const slicedListings = useMemo(() => {
    if (!maxListings || listings.length <= maxListings) return listings;
    return listings.slice(0, maxListings);
  }, [listings, maxListings]);

  const distanceById = useMemo(() => {
    const map = new Map<string, number | null>();
    if (!userPos) {
      for (const row of slicedListings) map.set(row.id, null);
      return map;
    }
    for (const row of slicedListings) {
      if (!row.location) {
        map.set(row.id, null);
        continue;
      }
      map.set(
        row.id,
        haversineKm(userPos, {
          lat: row.location.lat,
          lng: row.location.lng,
        }),
      );
    }
    return map;
  }, [slicedListings, userPos]);

  const sortedListings = useMemo(() => {
    if (!userPos) return slicedListings;
    return [...slicedListings].sort((a, b) => {
      const da = distanceById.get(a.id) ?? Infinity;
      const db = distanceById.get(b.id) ?? Infinity;
      return da - db;
    });
  }, [slicedListings, userPos, distanceById]);

  const points = useMemo(
    () => buildPoints(sortedListings, distanceById),
    [sortedListings, distanceById],
  );

  const center = useMemo(() => computeCenter(points), [points]);
  const mapHeight = variant === "compact" ? "h-[220px]" : "h-[320px] md:h-[400px]";
  const zoom = variant === "compact" ? 5 : userPos ? 8 : 5;

  useEffect(() => {
    let cancelled = false;
    void import("leaflet").then((L) => {
      if (cancelled) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setIconsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus("error");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus("ok");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 60_000 },
    );
  }, []);

  if (points.length === 0) {
    return (
      <div
        className={`rounded-xl border border-dashed border-ink/15 bg-surface/80 p-6 text-sm text-ink/55 ${className}`}
      >
        Belum ada barang barter dengan lokasi kota. Publish barter dengan kota
        pemilik agar pin muncul di peta.
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-ink/10 bg-surface shadow-card ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/8 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-forest">
          {userPos ? "Barter terdekat dari Anda" : "Sebaran barter komunitas"}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[11px] font-medium text-forest">
            {points.length} pin
          </span>
          {enableNearby && (
            <button
              type="button"
              onClick={requestLocation}
              disabled={geoStatus === "loading"}
              className="rounded-full border border-emerald/35 bg-emerald/10 px-3 py-1 text-[11px] font-semibold text-emerald transition-colors hover:bg-emerald/20 disabled:opacity-60"
            >
              {geoStatus === "loading" ? "Mencari lokasi…" : "Lokasi saya"}
            </button>
          )}
        </div>
      </div>

      {geoStatus === "denied" && (
        <p className="border-b border-ink/8 bg-amber-50/80 px-4 py-2 text-xs text-ink/65">
          Izin lokasi ditolak — menampilkan semua pin. Aktifkan lokasi di browser
          untuk urutan terdekat.
        </p>
      )}

      <div className={`${mapHeight} w-full`}>
        {iconsReady ? (
          <LeafletMapContainer
            center={center}
            zoom={zoom}
            className="h-full w-full"
            scrollWheelZoom
          >
            <LeafletTileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userPos && (
              <>
                <MapFlyTo lat={userPos.lat} lng={userPos.lng} zoom={zoom} />
                <UserLocationMarker lat={userPos.lat} lng={userPos.lng} />
              </>
            )}
            {points.map((point) => (
              <LeafletMarker
                key={point.id}
                position={[point.lat, point.lng]}
                eventHandlers={
                  onPickListing
                    ? { click: () => onPickListing(point.id) }
                    : undefined
                }
              >
                <LeafletPopup>
                  <div className="min-w-[180px] space-y-2 text-sm">
                    <p className="font-semibold text-ink">{point.label}</p>
                    <p className="text-ink/70">{point.owner}</p>
                    <p className="text-ink/60">{point.city}</p>
                    {point.distanceKm !== null && (
                      <p className="text-xs font-medium text-emerald">
                        {formatDistanceKm(point.distanceKm)}
                      </p>
                    )}
                    <p className="font-medium text-gold">
                      +{point.points.toLocaleString("id-ID")} PTS
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Link
                        href={`/barter/${point.id}/ajukan`}
                        className="inline-flex rounded-md bg-forest px-2.5 py-1 text-xs font-semibold text-ivory"
                      >
                        Ajak barter
                      </Link>
                      <Link
                        href={`/barter/${point.id}`}
                        className="inline-flex rounded-md border border-ink/15 px-2.5 py-1 text-xs font-medium text-forest underline"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                </LeafletPopup>
              </LeafletMarker>
            ))}
          </LeafletMapContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink/50">
            Memuat peta…
          </div>
        )}
      </div>

      {activeListingId && (
        <div className="border-t border-ink/8 px-4 py-2 text-xs text-ink/55">
          Item terpilih:{" "}
          <span className="font-medium text-ink">{activeListingId}</span>
        </div>
      )}
    </div>
  );
}
