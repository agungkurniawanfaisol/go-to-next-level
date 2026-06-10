"use client";

import { EcoSwapPointsDisplay } from "@/components/ai-appraisal/EcoSwapPointsDisplay";
import { ScanningOverlay } from "@/components/ai-appraisal/ScanningOverlay";
import { CNNPipelinePanel } from "@/components/ai-appraisal/CNNPipelinePanel";
import { CNNProcessTerminal } from "@/components/ai-appraisal/CNNProcessTerminal";
import { APPRAISAL_SCAN_DURATION_MS } from "@/lib/appraisal-scan-duration";
import { useCNNScanProgress } from "@/hooks/useCNNScanProgress";
import { CNN_PIPELINE_STEPS } from "@/lib/cnn-pipeline";

const APPRAISAL_STEP_INDEX = CNN_PIPELINE_STEPS.length - 1;

type AppraisalScanningLayoutProps = {
  previewUrl: string;
};

export function AppraisalScanningLayout({ previewUrl }: AppraisalScanningLayoutProps) {
  const scan = useCNNScanProgress(true, APPRAISAL_SCAN_DURATION_MS);
  const isAppraisalStep = scan.activeStepIndex >= APPRAISAL_STEP_INDEX;

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
      <div className="lg:col-span-3">
        <div
          role="img"
          aria-label="Preview barang — CNN sedang menganalisis"
          aria-busy
          className="relative min-h-[55vh] w-full overflow-hidden rounded-2xl border border-ink/8 bg-cream-muted shadow-elevated sm:min-h-[60vh] lg:min-h-[min(75vh,820px)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview barang"
            className="absolute inset-0 h-full w-full object-contain lg:object-cover"
          />
          <ScanningOverlay
            progressPercent={scan.progressPercent}
            activeStepIndex={scan.activeStepIndex}
          />
          <span className="pointer-events-none absolute bottom-4 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-forest/50 text-sm font-bold text-white shadow-card backdrop-blur-sm">
            AI
          </span>
        </div>
        <p className="mt-3 text-center text-sm text-ink/55 lg:hidden">
          Pipeline CNN berjalan — {scan.progressPercent}%
        </p>
        <div className="mt-4 lg:hidden">
          <CNNProcessTerminal active progressPercent={scan.progressPercent} />
        </div>
      </div>

      <aside className="flex flex-col gap-4 lg:col-span-1 lg:sticky lg:top-24">
        {isAppraisalStep && (
          <EcoSwapPointsDisplay mode="loading" size="lg" />
        )}
        <CNNPipelinePanel
          mode="scanning"
          activeStepIndex={scan.activeStepIndex}
          progressPercent={scan.progressPercent}
        />
        <CNNProcessTerminal active progressPercent={scan.progressPercent} />
        <p className="text-xs leading-relaxed text-ink/60">
          Juri memverifikasi alur:{" "}
          <strong className="text-ink">input</strong> →{" "}
          <strong className="text-ink">CNN features</strong> →{" "}
          <strong className="text-ink">klasifikasi</strong> →{" "}
          <strong className="text-ink">appraisal</strong>.
        </p>
      </aside>
    </div>
  );
}
