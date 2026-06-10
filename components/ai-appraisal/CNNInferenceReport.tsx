"use client";

import { motion } from "framer-motion";
import { CNN_MODEL_NAME, CNN_PIPELINE_STEPS } from "@/lib/cnn-pipeline";
import type { AppraisalResultData } from "@/lib/appraisal-mock";

type CNNInferenceReportProps = {
  data: AppraisalResultData;
  compact?: boolean;
};

export function CNNInferenceReport({
  data,
  compact = false,
}: CNNInferenceReportProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      className="rounded-xl border border-ink/6 bg-cream-muted/40 p-4"
      aria-label="Laporan inferensi CNN"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest">
          CNN Inference Report
        </p>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
          Verified
        </span>
      </div>

      <dl
        className={`mt-3 grid gap-2 text-sm ${compact ? "grid-cols-1" : "sm:grid-cols-2"}`}
      >
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-ink/45">Model</dt>
          <dd className="font-mono text-xs text-ink">{CNN_MODEL_NAME}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wider text-ink/45">
            Inference time
          </dt>
          <dd className="font-mono text-xs tabular-nums text-ink">
            {data.inferenceMs} ms
          </dd>
        </div>
        {!compact && (
          <div className="sm:col-span-2">
            <dt className="text-[10px] uppercase tracking-wider text-ink/45">
              Layers executed
            </dt>
            <dd className="mt-1 font-mono text-[10px] leading-relaxed text-ink/55">
              {CNN_PIPELINE_STEPS.map((s) => s.id).join(" → ")}
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
          Top-3 class probabilities (Softmax)
        </p>
        <ul className="mt-2 space-y-2">
          {data.topPredictions.map((pred, i) => (
            <li key={pred.label}>
              <div className="flex justify-between gap-2 text-xs">
                <span
                  className={i === 0 ? "font-semibold text-ink" : "text-ink/60"}
                >
                  {pred.label}
                </span>
                <span className="shrink-0 font-mono tabular-nums text-ink">
                  {pred.probability}%
                </span>
              </div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-ink/8">
                <motion.div
                  className={`h-full rounded-full ${i === 0 ? "ai-accent-bar" : "bg-ink/15"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pred.probability}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
