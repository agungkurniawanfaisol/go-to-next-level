"use client";

import { useEffect, useState } from "react";
import { CNN_PIPELINE_STEPS } from "@/lib/cnn-pipeline";

export type CNNScanProgress = {
  activeStepIndex: number;
  progressPercent: number;
  isComplete: boolean;
};

/**
 * Menggerakkan indikator pipeline CNN selama fase scanning.
 * Sinkron dengan durasi timer di AI_Appraisal.
 */
export function useCNNScanProgress(
  active: boolean,
  durationMs: number,
): CNNScanProgress {
  const stepCount = CNN_PIPELINE_STEPS.length;
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (!active) return;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const ratio = Math.min(elapsed / durationMs, 1);
      setProgressPercent(Math.round(ratio * 100));
      const step = Math.min(
        Math.floor(ratio * stepCount),
        stepCount - 1,
      );
      setActiveStepIndex(step);
      if (ratio < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, durationMs, stepCount]);

  if (!active) {
    return {
      activeStepIndex: 0,
      progressPercent: 0,
      isComplete: false,
    };
  }

  return {
    activeStepIndex,
    progressPercent,
    isComplete: progressPercent >= 100,
  };
}
