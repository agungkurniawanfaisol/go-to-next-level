"use client";

import { CircleMarker, useMap } from "react-leaflet";
import { useEffect } from "react";

type BarterMapFlyToProps = {
  lat: number;
  lng: number;
  zoom: number;
};

export function BarterMapFlyTo({ lat, lng, zoom }: BarterMapFlyToProps) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], zoom, { duration: 1.2 });
  }, [map, lat, lng, zoom]);

  return null;
}

type UserLocationMarkerProps = {
  lat: number;
  lng: number;
};

export function UserLocationMarker({ lat, lng }: UserLocationMarkerProps) {
  return (
    <CircleMarker
      center={[lat, lng]}
      radius={8}
      pathOptions={{
        color: "#0f6b56",
        fillColor: "#0f6b56",
        fillOpacity: 0.35,
        weight: 2,
      }}
    />
  );
}
