"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CoinPointsIcon } from "@/components/appraisal/ai-work-icons";

type EcoSwapPointsDisplayProps = {
  points?: number | null;
  mode?: "loading" | "revealed";
  size?: "sm" | "lg";
  className?: string;
};

function useCountUp(target: number, active: boolean, durationMs = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active || target <= 0) {
      setValue(0);
      return;
    }

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const ratio = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(target * ratio));
      if (ratio < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, durationMs]);

  return value;
}

export function EcoSwapPointsDisplay({
  points = null,
  mode = "revealed",
  size = "lg",
  className = "",
}: EcoSwapPointsDisplayProps) {
  const isLoading = mode === "loading";
  const displayValue = useCountUp(points ?? 0, !isLoading && points != null);

  const isLarge = size === "lg";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-gold/20 via-gold/8 to-ivory shadow-[0_0_32px_rgba(201,162,39,0.25)] ${className}`}
      role="status"
      aria-live="polite"
      aria-label={
        isLoading
          ? "Menghitung EcoSwap Points"
          : `EcoSwap Points: ${points?.toLocaleString("id-ID") ?? 0}`
      }
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/20 blur-2xl" />

      <div
        className={`flex items-center gap-3 ${isLarge ? "px-5 py-4" : "px-3 py-2.5"}`}
      >
        <span
          className={`flex shrink-0 items-center justify-center rounded-full border border-gold/50 bg-gold/15 text-gold ${
            isLarge ? "h-12 w-12" : "h-9 w-9"
          }`}
        >
          <CoinPointsIcon className={isLarge ? "h-6 w-6" : "h-4 w-4"} />
        </span>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink/50">
            EcoSwap Points
          </p>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.p
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`font-bold tabular-nums text-gold ${isLarge ? "text-2xl" : "text-lg"}`}
              >
                Menghitung…
              </motion.p>
            ) : (
              <motion.p
                key="points"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-baseline gap-1.5"
              >
                <span
                  className={`text-gradient-gold font-bold tabular-nums ${isLarge ? "text-3xl md:text-4xl" : "text-xl"}`}
                >
                  +{displayValue.toLocaleString("id-ID")}
                </span>
                <span
                  className={`font-semibold text-gold ${isLarge ? "text-sm" : "text-xs"}`}
                >
                  PTS
                </span>
              </motion.p>
            )}
          </AnimatePresence>
          {isLarge && !isLoading && (
            <p className="mt-0.5 text-[11px] text-ink/55">
              Nilai tukar · untuk juri & komunitas
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
