"use client";

import dynamic from "next/dynamic";
import { useEffect, useId, useRef, useState } from "react";
import { FrameViewer360Fallback } from "@/components/appraisal/FrameViewer360Fallback";
import { dataUrlToBlobUrl, revokeBlobUrl } from "@/lib/panorama-blob-url";
import { singleImageToEquirectangular } from "@/lib/single-image-to-equirectangular";

const ReactPannellum = dynamic(
  () => import("react-pannellum").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[inherit] items-center justify-center bg-ivory/90">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
      </div>
    ),
  },
);

type PannellumViewer360Props = {
  imageSrc: string;
  className?: string;
  onReadyChange?: (ready: boolean) => void;
};

export function PannellumViewer360({
  imageSrc,
  className = "",
  onReadyChange,
}: PannellumViewer360Props) {
  const reactId = useId().replace(/:/g, "");
  const blobUrlRef = useRef<string | null>(null);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [panoramaUrl, setPanoramaUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    onReadyChange?.(false);
    let cancelled = false;

    const build = async () => {
      setPhase("loading");
      setPanoramaUrl(null);
      revokeBlobUrl(blobUrlRef.current);
      blobUrlRef.current = null;

      try {
        const dataUrl = await singleImageToEquirectangular(imageSrc);
        const blobUrl = await dataUrlToBlobUrl(dataUrl);
        if (cancelled) {
          revokeBlobUrl(blobUrl);
          return;
        }
        blobUrlRef.current = blobUrl;
        setPanoramaUrl(blobUrl);
      } catch (err) {
        console.error("[PannellumViewer360] build panorama", err);
        if (!cancelled) setPhase("fallback");
      }
    };

    void build();

    return () => {
      cancelled = true;
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      revokeBlobUrl(blobUrlRef.current);
      blobUrlRef.current = null;
    };
  }, [imageSrc, onReadyChange]);

  const handlePanoramaLoaded = () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setPhase("ready");
    onReadyChange?.(true);
  };

  useEffect(() => {
    if (!panoramaUrl || phase === "fallback") return;

    loadTimeoutRef.current = setTimeout(() => {
      console.warn("[PannellumViewer360] load timeout — frame fallback");
      setPhase("fallback");
      onReadyChange?.(false);
    }, 30000);

    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [panoramaUrl, phase, onReadyChange]);

  if (phase === "fallback") {
    return (
      <FrameViewer360Fallback
        imageSrc={imageSrc}
        className={className}
        onReadyChange={onReadyChange}
      />
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      {panoramaUrl && (
        <ReactPannellum
          key={panoramaUrl}
          id={`ecoswap-pannellum-${reactId}`}
          sceneId="appraisalScene"
          imageSource={panoramaUrl}
          equirectangularOptions={{
            haov: 360,
            vaov: 100,
          }}
          config={{
            autoLoad: true,
            showControls: false,
            showFullscreenCtrl: false,
            showZoomCtrl: false,
            mouseZoom: true,
            draggable: true,
            friction: 0.12,
            backgroundColor: [0.94, 0.97, 0.96],
          }}
          style={{ width: "100%", height: "100%", minHeight: "inherit" }}
          className="h-full w-full min-h-[inherit]"
          onPanoramaLoaded={handlePanoramaLoaded}
        />
      )}

      {phase === "loading" && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-ivory/90">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
          <p className="text-sm text-ink/60">Menyiapkan panorama Pannellum…</p>
        </div>
      )}

      {phase === "ready" && (
        <p className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full border border-white/40 bg-forest/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Drag untuk putar 360° · Pannellum
        </p>
      )}
    </div>
  );
}
