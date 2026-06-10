"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EcoSwapPointsDisplay } from "@/components/ai-appraisal/EcoSwapPointsDisplay";
import { CNN_MODEL_NAME, CNN_PIPELINE_STEPS } from "@/lib/cnn-pipeline";

const APPRAISAL_STEP_INDEX = CNN_PIPELINE_STEPS.length - 1;

const STATUS_MESSAGES = [
  "Preprocessing 224×224...",
  "Conv layers — extracting features...",
  "Running CNN Model...",
  "Softmax — role classification...",
  "Automated appraisal...",
] as const;

type BoxRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type ScanningOverlayProps = {
  progressPercent?: number;
  activeStepIndex?: number;
};

function randomRect(): BoxRect {
  const width = 12 + Math.random() * 28;
  const height = 10 + Math.random() * 24;
  const left = 5 + Math.random() * (85 - width);
  const top = 5 + Math.random() * (85 - height);
  return { top, left, width, height };
}

function generateBoxPaths(count: number): BoxRect[][] {
  return Array.from({ length: count }, () => [
    randomRect(),
    randomRect(),
    randomRect(),
  ]);
}

function BoundingBox({
  paths,
  index,
}: {
  paths: BoxRect[];
  index: number;
}) {
  const toPercent = (rect: BoxRect) => ({
    top: `${rect.top}%`,
    left: `${rect.left}%`,
    width: `${rect.width}%`,
    height: `${rect.height}%`,
  });

  return (
    <motion.div
      className="absolute border border-emerald-light/70 bg-emerald/5"
      initial={toPercent(paths[0])}
      animate={{
        top: paths.map((p) => `${p.top}%`),
        left: paths.map((p) => `${p.left}%`),
        width: paths.map((p) => `${p.width}%`),
        height: paths.map((p) => `${p.height}%`),
      }}
      transition={{
        duration: 0.7 + index * 0.15,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      }}
    >
      <span className="absolute -left-px -top-px h-2 w-2 border-l-2 border-t-2 border-emerald-light" />
      <span className="absolute -right-px -top-px h-2 w-2 border-r-2 border-t-2 border-emerald-light" />
      <span className="absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 border-emerald-light" />
      <span className="absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 border-emerald-light" />
    </motion.div>
  );
}

export function ScanningOverlay({
  progressPercent = 0,
  activeStepIndex = 0,
}: ScanningOverlayProps) {
  const [statusIndex, setStatusIndex] = useState(0);
  const boxPaths = useMemo(() => generateBoxPaths(5), []);

  const activeStep = CNN_PIPELINE_STEPS[activeStepIndex];
  const isAppraisalStep = activeStepIndex >= APPRAISAL_STEP_INDEX;

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 z-10 overflow-hidden"
      aria-busy="true"
      aria-label="AI CNN scanning in progress"
    >
      <div className="absolute inset-0 bg-forest/35" />

      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-emerald-light shadow-[0_0_14px_rgba(26,138,114,0.7)]"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {boxPaths.map((paths, i) => (
        <BoundingBox key={i} paths={paths} index={i} />
      ))}

      <div className="absolute left-4 top-4 right-4 flex flex-wrap items-start justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-light/40 bg-forest/85 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-light backdrop-blur-sm">
          <motion.span
            className="h-2 w-2 rounded-full bg-emerald-light"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          CNN Inference
        </span>
        <span className="rounded-full bg-forest/85 px-2.5 py-1 font-mono text-[10px] text-gold-light backdrop-blur-sm">
          {progressPercent}%
        </span>
      </div>

      {activeStep && (
        <div className="absolute left-4 top-14 max-w-[min(100%,20rem)] rounded-lg border border-white/15 bg-forest/80 px-3 py-2 ring-1 ring-white/10 backdrop-blur-md">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-light/80">
            Layer aktif
          </p>
          <p className="text-sm font-medium text-white">{activeStep.label}</p>
          <p className="font-mono text-[10px] text-white/60">{activeStep.technical}</p>
        </div>
      )}

      {isAppraisalStep && (
        <div className="absolute bottom-24 left-4 right-4 z-20 sm:bottom-28 sm:left-auto sm:right-6 sm:max-w-xs">
          <EcoSwapPointsDisplay mode="loading" size="lg" />
        </div>
      )}

      <div className="absolute bottom-4 left-4 right-4 space-y-2" aria-live="polite">
        <div className="h-1 overflow-hidden rounded-full bg-forest/50">
          <div
            className="ai-accent-bar h-full rounded-full transition-[width] duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="font-mono text-xs text-emerald-light drop-shadow-md"
          >
            {STATUS_MESSAGES[statusIndex]}
          </motion.p>
        </AnimatePresence>
        <p className="font-mono text-[9px] text-white/40">{CNN_MODEL_NAME}</p>
      </div>
    </div>
  );
}
