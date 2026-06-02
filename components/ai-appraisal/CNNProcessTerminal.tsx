"use client";

import { useEffect, useMemo, useState } from "react";
import { CNN_MODEL_NAME } from "@/lib/cnn-pipeline";

const LOG_LINES = [
  "[INIT] Loading weights: ecoswap_heritage_cnn_v1.2.h5",
  "[INPUT] Tensor shape: (1, 224, 224, 3)",
  "[CONV1] Conv2D(64, 3×3) → ReLU → MaxPool2D",
  "[CONV2] Conv2D(128, 3×3) → ReLU → MaxPool2D",
  "[FEAT] GlobalAveragePooling → Dense(256)",
  "[CLS] Softmax — heritage_role_head",
  "[OUT] Top-1 class locked · computing appraisal",
  "[PTS] EcoSwap Points assigned — heritage multiplier applied",
] as const;

type CNNProcessTerminalProps = {
  active: boolean;
  progressPercent: number;
};

export function CNNProcessTerminal({
  active,
  progressPercent,
}: CNNProcessTerminalProps) {
  const visibleCount = useMemo(() => {
    if (!active) return 0;
    const ratio = progressPercent / 100;
    return Math.min(
      LOG_LINES.length,
      Math.max(1, Math.ceil(ratio * LOG_LINES.length)),
    );
  }, [active, progressPercent]);

  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="overflow-hidden rounded-xl border border-forest/30 bg-forest font-mono text-[10px] leading-relaxed shadow-inner"
      aria-live="polite"
      aria-label="Log proses CNN"
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/70" />
        <span className="h-2 w-2 rounded-full bg-gold/80" />
        <span className="h-2 w-2 rounded-full bg-emerald-light" />
        <span className="ml-1 truncate text-white/35">{CNN_MODEL_NAME}</span>
      </div>
      <div className="max-h-36 space-y-1 overflow-y-auto p-3 sm:max-h-44">
        {LOG_LINES.slice(0, visibleCount).map((line, i) => {
          const isLast = i === visibleCount - 1;
          const isPointsLine = line.startsWith("[PTS]");
          return (
            <p
              key={line}
              className={
                isLast
                  ? isPointsLine
                    ? "font-semibold text-gold-light"
                    : "text-emerald-light"
                  : isPointsLine
                    ? "text-gold-light/70"
                    : "text-emerald-light/55"
              }
            >
              {line}
              {isPointsLine && isLast && (
                <span className="ml-1 text-gold-light">→ +520 PTS</span>
              )}
            </p>
          );
        })}
        <p className="text-emerald-light/40">
          <span className={cursorOn ? "opacity-100" : "opacity-0"}>_</span>
        </p>
      </div>
    </div>
  );
}
