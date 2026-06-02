"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { generate360FramesFromImage } from "@/lib/generate-360-frames";

const PIXELS_PER_FRAME = 40;

export function useViewer360(sourceImage: string, rotateEnabled: boolean) {
  const isDraggingRef = useRef(false);
  const accumulatedRef = useRef(0);
  const generationIdRef = useRef(0);

  const [frames, setFrames] = useState<string[]>([]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPointerDragging, setIsPointerDragging] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!rotateEnabled) return;

    const generationId = ++generationIdRef.current;

    generate360FramesFromImage(sourceImage)
      .then((generated) => {
        if (generationIdRef.current !== generationId) return;
        setFrames(generated);
        setIsReady(true);
      })
      .catch(() => {
        if (generationIdRef.current !== generationId) return;
        setFrames([sourceImage]);
        setIsReady(true);
      });
  }, [sourceImage, rotateEnabled]);

  const isGenerating = rotateEnabled && !isReady;

  const stepFrame = useCallback(
    (direction: 1 | -1) => {
      if (frames.length === 0) return;
      setFrameIndex((prev) => (prev + direction + frames.length) % frames.length);
    },
    [frames.length],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!rotateEnabled || !isReady || isGenerating) return;
      e.preventDefault();
      isDraggingRef.current = true;
      accumulatedRef.current = 0;
      setIsPointerDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [rotateEnabled, isReady, isGenerating],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      accumulatedRef.current += e.movementX;
      while (accumulatedRef.current >= PIXELS_PER_FRAME) {
        accumulatedRef.current -= PIXELS_PER_FRAME;
        stepFrame(1);
      }
      while (accumulatedRef.current <= -PIXELS_PER_FRAME) {
        accumulatedRef.current += PIXELS_PER_FRAME;
        stepFrame(-1);
      }
    },
    [stepFrame],
  );

  const onPointerEnd = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    accumulatedRef.current = 0;
    setIsPointerDragging(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* released */
    }
  }, []);

  const displaySrc =
    rotateEnabled && isReady && frames.length > 0
      ? frames[frameIndex]
      : sourceImage;

  return {
    displaySrc,
    frameIndex,
    frameCount: frames.length || 8,
    isGenerating,
    isReady,
    isPointerDragging,
    canRotate: rotateEnabled && isReady && !isGenerating,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: onPointerEnd,
      onPointerCancel: onPointerEnd,
    },
  };
}
