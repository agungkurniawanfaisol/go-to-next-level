"use client";

import { motion } from "framer-motion";
import { CNNInferenceReport } from "@/components/ai-appraisal/CNNInferenceReport";
import { CNN_MODEL_NAME } from "@/lib/cnn-pipeline";
import type { AppraisalResultData } from "@/lib/appraisal-mock";

type AppraisalResultProps = {
  data: AppraisalResultData;
};

const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.08,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

function ResultField({
  label,
  children,
  index,
}: {
  label: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="show"
      className="rounded-xl border border-ink/8 bg-surface/80 p-4 shadow-card backdrop-blur-sm"
    >
      <dt className="text-xs font-medium uppercase tracking-widest text-ink/50">
        {label}
      </dt>
      <dd className="mt-2">{children}</dd>
    </motion.div>
  );
}

function ConfidenceBar({ percent }: { percent: number }) {
  return (
    <div className="space-y-2">
      <span className="text-2xl font-bold tabular-nums text-ink">{percent}%</span>
      <div className="h-2.5 overflow-hidden rounded-full bg-ink/8">
        <motion.div
          className="ai-accent-bar h-full rounded-full shadow-[0_0_12px_rgba(15,107,86,0.35)]"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export function AppraisalResult({ data }: AppraisalResultProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full overflow-hidden rounded-2xl border border-forest/15 bg-surface shadow-elevated"
      aria-label="Hasil prediksi CNN"
    >
      <div className="flex items-center gap-3 border-b border-gold/20 bg-gradient-to-r from-forest/5 via-surface to-gold/5 px-6 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald/15 ring-1 ring-emerald/30">
          <svg
            className="h-4 w-4 text-emerald"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-forest">
            CNN Prediction Complete
          </h3>
          <p className="mt-0.5 font-mono text-[10px] text-ink/45">{CNN_MODEL_NAME}</p>
        </div>
        <span className="ml-auto hidden rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold sm:inline">
          Verified
        </span>
      </div>

      <div className="border-b border-ink/6 px-4 py-4 sm:px-6">
        <CNNInferenceReport data={data} />
      </div>

      <dl className="grid gap-4 p-6 sm:grid-cols-2">
        <ResultField label="Detected Object" index={0}>
          <span className="text-lg font-semibold text-ink">{data.detectedObject}</span>
        </ResultField>

        <ResultField label="CNN Confidence Score" index={1}>
          <ConfidenceBar percent={data.confidenceScore} />
        </ResultField>

        <ResultField label="Role-Based Classification" index={2}>
          <span className="inline-flex rounded-full border border-gold/40 bg-gold/12 px-4 py-1.5 text-sm font-semibold text-ink">
            {data.roleClassification}
          </span>
        </ResultField>

        <ResultField label="Condition Analysis" index={3}>
          <span className="font-medium text-ink">{data.conditionAnalysis}</span>
        </ResultField>

        <motion.div
          custom={4}
          variants={rowVariants}
          initial="hidden"
          animate="show"
          className="rounded-xl border border-gold/35 bg-gradient-to-r from-gold/12 via-gold/5 to-surface p-6 sm:col-span-2"
        >
          <dt className="text-xs font-medium uppercase tracking-widest text-ink/50">
            EcoSwap Points Earned
          </dt>
          <dd className="mt-2 flex items-baseline gap-2">
            <span className="text-gradient-gold text-4xl font-bold tabular-nums md:text-5xl">
              {data.ecoSwapPoints.toLocaleString("id-ID")}
            </span>
            <span className="text-sm font-semibold text-gold">Points</span>
          </dd>
        </motion.div>
      </dl>

      <p className="border-t border-ink/6 px-6 py-3 text-center text-xs text-ink/45">
        Pipeline CNN · role-based classification · automated appraisal
      </p>
    </motion.article>
  );
}
