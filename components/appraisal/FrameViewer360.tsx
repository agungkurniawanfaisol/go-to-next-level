"use client";

import { useEffect } from "react";
import { useViewer360 } from "@/hooks/useViewer360";

type FrameViewer360Props = {
  imageSrc: string;
  className?: string;
  onReadyChange?: (ready: boolean) => void;
};

/**
 * Viewer 360° dari satu foto: 8 sudut simulasi, drag kiri/kanan.
 * Satu frame tampil — tidak ada panorama terbelah 8 seperti di Pannellum stitch.
 */
export function FrameViewer360({
  imageSrc,
  className = "",
  onReadyChange,
}: FrameViewer360Props) {
  const viewer = useViewer360(imageSrc, true);

  useEffect(() => {
    onReadyChange?.(viewer.isReady);
  }, [viewer.isReady, onReadyChange]);

  return (
    <div
      className={`relative h-full w-full touch-none select-none ${className} ${
        viewer.canRotate
          ? viewer.isPointerDragging
            ? "cursor-grabbing"
            : "cursor-grab"
          : ""
      }`}
      onPointerDown={viewer.canRotate ? viewer.pointerHandlers.onPointerDown : undefined}
      onPointerMove={viewer.canRotate ? viewer.pointerHandlers.onPointerMove : undefined}
      onPointerUp={viewer.canRotate ? viewer.pointerHandlers.onPointerUp : undefined}
      onPointerCancel={viewer.canRotate ? viewer.pointerHandlers.onPointerCancel : undefined}
      aria-label="360 view — drag kiri/kanan"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={viewer.displaySrc}
        alt="Preview 360"
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full object-contain lg:object-cover"
      />
      {viewer.isGenerating && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-ivory/90">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald border-t-transparent" />
          <p className="mt-3 text-sm text-ink/60">Membuat view 360°…</p>
        </div>
      )}
      {viewer.canRotate && (
        <p className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-full border border-white/40 bg-forest/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          Drag kiri/kanan • sudut {viewer.frameIndex + 1}/{viewer.frameCount}
        </p>
      )}
    </div>
  );
}
