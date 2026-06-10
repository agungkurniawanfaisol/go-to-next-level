"use client";

import { CoinPointsIcon } from "@/components/appraisal/ai-work-icons";
import {
  CNN_MODEL_NAME,
  CNN_PIPELINE_STEPS,
  type CNNPipelineStep,
} from "@/lib/cnn-pipeline";

type CNNPipelinePanelProps = {
  mode: "scanning" | "complete";
  activeStepIndex?: number;
  progressPercent?: number;
  compact?: boolean;
};

function StepIcon({ status }: { status: "done" | "active" | "pending" }) {
  if (status === "done") {
    return (
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold ring-1 ring-gold/30">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  }
  if (status === "active") {
    return (
      <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald/25" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-emerald" />
      </span>
    );
  }
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-ink/5">
      <span className="h-1.5 w-1.5 rounded-full bg-ink/20" />
    </span>
  );
}

function stepStatus(
  index: number,
  mode: CNNPipelinePanelProps["mode"],
  activeStepIndex: number,
): "done" | "active" | "pending" {
  if (mode === "complete") return "done";
  if (index < activeStepIndex) return "done";
  if (index === activeStepIndex) return "active";
  return "pending";
}

function PipelineStepRow({
  step,
  index,
  mode,
  activeStepIndex,
}: {
  step: CNNPipelineStep;
  index: number;
  mode: CNNPipelinePanelProps["mode"];
  activeStepIndex: number;
}) {
  const status = stepStatus(index, mode, activeStepIndex);
  const isAppraisalStep = step.id === "appraisal";
  const showCoin =
    isAppraisalStep &&
    (status === "active" || (status === "done" && mode === "complete"));

  return (
    <li className="flex gap-3">
      {showCoin ? (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/15 text-gold">
          <CoinPointsIcon className="h-3.5 w-3.5" />
        </span>
      ) : (
        <StepIcon status={status} />
      )}
      <div className="min-w-0 flex-1 pb-4 last:pb-0">
        <p
          className={`text-sm font-medium ${
            status === "active"
              ? isAppraisalStep
                ? "text-gold"
                : "text-emerald"
              : status === "done"
                ? "text-ink"
                : "text-ink/40"
          }`}
        >
          {step.label}
        </p>
        <p className="mt-0.5 font-mono text-[10px] leading-snug text-ink/40">
          {step.technical}
        </p>
        {showCoin && status === "active" && mode === "scanning" && (
          <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            Menghitung poin…
          </p>
        )}
      </div>
    </li>
  );
}

export function CNNPipelinePanel({
  mode,
  activeStepIndex = 0,
  progressPercent = 0,
  compact = false,
}: CNNPipelinePanelProps) {
  const displayProgress = mode === "complete" ? 100 : progressPercent;

  if (compact && mode === "complete") {
    return (
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">
            Pipeline CNN
          </p>
          <span className="rounded-full bg-emerald/12 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald">
            6/6 · Verified
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] text-ink/45">{CNN_MODEL_NAME}</p>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-ink/8">
          <div className="ai-accent-bar h-full w-full rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">
            Pipeline CNN
          </p>
          <p className="mt-1 font-mono text-[10px] text-ink/45">{CNN_MODEL_NAME}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            mode === "complete"
              ? "bg-emerald/12 text-emerald"
              : "bg-gold/15 text-gold"
          }`}
        >
          {mode === "complete" ? "Selesai" : "Running"}
        </span>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-[10px] font-medium text-ink/45">
          <span>Inference progress</span>
          <span className="tabular-nums">{displayProgress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-ink/8">
          <div
            className="ai-accent-bar h-full rounded-full transition-[width] duration-150 ease-out"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
      </div>

      <ol className="mt-5 space-y-0" aria-label="Langkah pipeline CNN">
        {CNN_PIPELINE_STEPS.map((step, index) => (
          <PipelineStepRow
            key={step.id}
            step={step}
            index={index}
            mode={mode}
            activeStepIndex={activeStepIndex}
          />
        ))}
      </ol>
    </div>
  );
}
