export type LatLng = { lat: number; lng: number };

const EARTH_RADIUS_KM = 6371;

export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `±${Math.round(km * 1000)} m`;
  if (km < 10) return `±${km.toFixed(1)} km`;
  return `±${Math.round(km)} km`;
}

export function sortByDistanceFrom<T extends { location: LatLng | null }>(
  userLat: number,
  userLng: number,
  items: T[],
): (T & { distanceKm: number | null })[] {
  const origin = { lat: userLat, lng: userLng };

  return items
    .map((item) => {
      const distanceKm = item.location
        ? haversineKm(origin, item.location)
        : null;
      return { ...item, distanceKm };
    })
    .sort((a, b) => {
      if (a.distanceKm === null && b.distanceKm === null) return 0;
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
}
