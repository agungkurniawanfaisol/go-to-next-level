"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CNNPipelinePanel } from "@/components/ai-appraisal/CNNPipelinePanel";
import { CNNProcessTerminal } from "@/components/ai-appraisal/CNNProcessTerminal";
import { CNNInferenceReport } from "@/components/ai-appraisal/CNNInferenceReport";
import { SectionShell } from "./SectionShell";
import { useCNNScanProgress } from "@/hooks/useCNNScanProgress";
import { generateAppraisalFromFeatures } from "@/lib/appraisal-mock";
import { CNN_PIPELINE_STEPS } from "@/lib/cnn-pipeline";
import type { AppraisalResultData } from "@/lib/appraisal-mock";

/* ─── Mock image features (deterministic: batik-like) ─────────── */
const DEMO_FEATURES = {
  avgBrightness: 168,
  avgSaturation: 0.52,
  colorVariance: 62,
  warmCoolRatio: 2.4,
  edgeDensity: 0.58,
  dominantColor: [140, 90, 65] as [number, number, number],
};

const SCAN_DURATION_MS = 3800;

type Phase = "idle" | "scanning" | "complete";

/* ─── Decorative heritage icon ────────────────────────────────── */
function HeritagePreview({ phase }: { phase: Phase }) {
  return (
    <div className="relative flex h-full min-h-[260px] w-full items-center justify-center overflow-hidden rounded-2xl border border-forest/20 bg-gradient-to-br from-forest/8 via-emerald/5 to-gold/8 shadow-card">
      {/* Decorative batik-inspired pattern */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 300 250"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="150" cy="125" r="60" stroke="currentColor" strokeWidth="0.5" className="text-forest" />
        <circle cx="150" cy="125" r="40" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
        <circle cx="150" cy="125" r="20" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 150 + Math.cos(rad) * 60;
          const y1 = 125 + Math.sin(rad) * 60;
          const x2 = 150 + Math.cos(rad) * 85;
          const y2 = 125 + Math.sin(rad) * 85;
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="currentColor"
              strokeWidth="0.3"
              className="text-emerald"
            />
          );
        })}
        <path d="M30 30l15-10 15 10-15 10zM270 30l-15-10-15 10 15 10zM30 220l15 10 15-10-15-10zM270 220l-15 10-15-10 15-10z" stroke="currentColor" strokeWidth="0.3" className="text-emerald" />
      </svg>

      {/* Batik icon */}
      <div className="relative z-10 text-center">
        <motion.div
          animate={phase === "scanning" ? { scale: [1, 1.03, 1], opacity: [0.8, 1, 0.8] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-gold/30 bg-surface/70 shadow-card backdrop-blur-sm"
        >
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-gold">
            <img
              src="assets/images(1).jpg"
              alt="Item"
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <motion.p
          className="mt-3 font-display text-xl font-semibold text-forest"
          animate={phase === "scanning" ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          Batik Tulis
        </motion.p>
        <p className="text-xs font-medium uppercase tracking-widest text-gold">Pekalongan</p>
      </div>

      {/* Scanning beam */}
      <AnimatePresence>
        {phase === "scanning" && (
          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 z-20 h-0.5 bg-gradient-to-r from-transparent via-emerald-light to-transparent shadow-[0_0_16px_rgba(26,138,114,0.6)]"
          />
        )}
      </AnimatePresence>

      {/* Corner accents */}
      <div className="absolute -left-px -top-px h-6 w-6 border-l-2 border-t-2 border-gold/30" />
      <div className="absolute -right-px -top-px h-6 w-6 border-r-2 border-t-2 border-gold/30" />
      <div className="absolute -bottom-px -left-px h-6 w-6 border-b-2 border-l-2 border-gold/30" />
      <div className="absolute -bottom-px -right-px h-6 w-6 border-b-2 border-r-2 border-gold/30" />

      {/* Top-left badge */}
      <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-emerald/25 bg-surface/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-forest shadow-card backdrop-blur-sm">
        <span className={`h-1.5 w-1.5 rounded-full ${
          phase === "complete" ? "bg-emerald" : phase === "scanning" ? "bg-gold animate-pulse" : "bg-ink/30"
        }`} />
        {phase === "complete" ? "Complete" : phase === "scanning" ? "Scanning..." : "Ready"}
      </span>

      {/* 360 badge */}
      <span className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-forest/50 text-[10px] font-bold text-white backdrop-blur-sm">
        360
      </span>
    </div>
  );
}

/* ─── Top control bar ─────────────────────────────────────────── */
function ControlBar({
  phase,
  onStart,
  onReset,
}: {
  phase: Phase;
  onStart: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-forest">
          Live CNN Pipeline
        </p>
        <p className="mt-0.5 text-sm text-ink/60">
          {phase === "idle" && "Tekan start untuk melihat CNN inference secara real-time"}
          {phase === "scanning" && "CNN sedang memproses gambar heritage..."}
          {phase === "complete" && "Inference selesai — lihat hasil prediksi di bawah"}
        </p>
      </div>

      {phase === "idle" && (
        <motion.button
          type="button"
          onClick={onStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory shadow-elevated transition-colors hover:bg-forest-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <span className="flex h-5 w-5 items-center justify-center">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Mulai Demo CNN
        </motion.button>
      )}

      {phase === "scanning" && (
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold">
            <span className="h-2 w-2 animate-ping rounded-full bg-gold" />
            Processing
          </span>
        </div>
      )}

      {phase === "complete" && (
        <motion.button
          type="button"
          onClick={onReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full border border-forest/25 bg-transparent px-6 py-3 text-sm font-semibold text-forest transition-colors hover:bg-forest/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Ulangi Demo
        </motion.button>
      )}
    </div>
  );
}

/* ─── Progress bar ────────────────────────────────────────────── */
function ProgressBar({ percent, phase }: { percent: number; phase: Phase }) {
  if (phase === "idle") return null;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px] font-medium text-ink/45">
        <span>Inference Progress</span>
        <span className="tabular-nums">{phase === "complete" ? "100" : percent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-forest via-emerald to-gold shadow-[0_0_10px_rgba(15,107,86,0.3)]"
          initial={{ width: "0%" }}
          animate={{ width: phase === "complete" ? "100%" : `${percent}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */
export function LiveDemoSection() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<AppraisalResultData | null>(null);

  const { activeStepIndex, progressPercent, isComplete } = useCNNScanProgress(
    phase === "scanning",
    SCAN_DURATION_MS,
  );

  // Transition scanning → complete
  useEffect(() => {
    if (phase === "scanning" && isComplete) {
      const demoData = generateAppraisalFromFeatures(DEMO_FEATURES);
      setResult(demoData);
      setPhase("complete");
    }
  }, [phase, isComplete]);

  const handleStart = useCallback(() => {
    setResult(null);
    setPhase("scanning");
  }, []);

  const handleReset = useCallback(() => {
    setPhase("idle");
    setResult(null);
  }, []);

  return (
    <SectionShell
      id="live-demo"
      eyebrow="Live Demo"
      title="Saksikan CNN Inference Secara Langsung"
      description="Pipeline computer vision berjalan di depan mata Anda — dari upload hingga hasil klasifikasi heritage."
      className="relative overflow-hidden bg-cream-muted/40"
    >
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 rounded-full bg-emerald/5 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />

      <div className="relative space-y-6">
        {/* Control bar */}
        <ControlBar phase={phase} onStart={handleStart} onReset={handleReset} />

        {/* Progress */}
        <ProgressBar percent={progressPercent} phase={phase} />

        {/* Main content: 2 columns */}
        <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
          {/* Left: Heritage Preview */}
          <div className="lg:col-span-2">
            <HeritagePreview phase={phase} />
          </div>

          {/* Right: Pipeline + Terminal / Result */}
          <div className="space-y-4 lg:col-span-3">
            <AnimatePresence mode="wait">
              {phase === "idle" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="glass-panel flex flex-col items-center justify-center gap-4 rounded-2xl px-6 py-14 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gold/30 text-gold/50">
                      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold text-ink">CNN Pipeline Siap</p>
                      <p className="mt-1 text-sm text-ink/55">
                        Pipeline 6-layer siap memproses gambar heritage. Tekan <strong>&quot;Mulai Demo CNN&quot;</strong> di atas.
                      </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {["Input 224×224", "Conv2D(64)", "Conv2D(128)", "Dense(256)", "Softmax", "Appraisal"].map(
                        (s) => (
                          <span
                            key={s}
                            className="rounded-full border border-ink/8 bg-surface px-2.5 py-1 text-[10px] font-medium text-ink/50"
                          >
                            {s}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {(phase === "scanning" || phase === "complete") && (
                <motion.div
                  key="active"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-4"
                >
                  {/* Pipeline Panel */}
                  <CNNPipelinePanel
                    mode={phase === "complete" ? "complete" : "scanning"}
                    activeStepIndex={activeStepIndex}
                    progressPercent={progressPercent}
                  />

                  {/* Terminal */}
                  <CNNProcessTerminal
                    active={phase === "scanning"}
                    progressPercent={progressPercent}
                  />

                  {/* Result */}
                  {phase === "complete" && result && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <CNNInferenceReport data={result} compact />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom callout when complete */}
        <AnimatePresence>
          {phase === "complete" && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel rounded-2xl p-6 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-forest">
                Hasil Demo
              </p>
              <p className="font-display mt-2 text-2xl font-bold text-ink md:text-3xl">
                Terdeteksi: {result.detectedObject}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                <span className="rounded-full border border-emerald/30 bg-emerald/10 px-4 py-1.5 text-sm font-semibold text-emerald">
                  Confidence: {result.confidenceScore}%
                </span>
                <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold">
                  {result.roleClassification}
                </span>
                <span className="rounded-full border border-forest/25 bg-forest/10 px-4 py-1.5 text-sm font-semibold text-forest">
                  {result.ecoSwapPoints} EcoSwap Points
                </span>
              </div>
              <p className="mt-3 text-xs text-ink/45">
                Pipeline: {CNN_PIPELINE_STEPS.map((s) => s.label).join(" → ")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
