"use client";

import { useState } from "react";
import { AppraisalResult } from "@/components/ai-appraisal/AppraisalResult";
import { CNNPipelinePanel } from "@/components/ai-appraisal/CNNPipelinePanel";
import { PannellumViewer360 } from "@/components/appraisal/PannellumViewer360";
import { PreviewGuidePanel } from "@/components/appraisal/PreviewGuidePanel";
import { EcoSwapPointsDisplay } from "@/components/ai-appraisal/EcoSwapPointsDisplay";
import { PointsTransparencyPanel } from "@/components/ai-appraisal/PointsTransparencyPanel";
import { PublishBarterForm } from "@/components/barter/PublishBarterForm";

import type { AppraisalResultData } from "@/lib/appraisal-mock";

type AppraisalResultLayoutProps = {
  previewUrl: string;
  result: AppraisalResultData;
  appraisalId?: string | null;
  userName?: string | null;
  isSaving?: boolean;
  saveError?: string | null;
  onRetrySave?: () => void;
};

export function AppraisalResultLayout({
  previewUrl,
  result,
  appraisalId,
  userName,
  isSaving = false,
  saveError = null,
  onRetrySave,
}: AppraisalResultLayoutProps) {
  const [viewerReady, setViewerReady] = useState(false);

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
      <div className="flex min-h-0 flex-col gap-6 lg:col-span-3">
        <div className="relative min-h-[55vh] w-full overflow-hidden rounded-2xl border border-ink/8 bg-cream-muted shadow-elevated sm:min-h-[60vh] lg:min-h-[min(75vh,820px)]">
          <PannellumViewer360
            imageSrc={previewUrl}
            className="absolute inset-0 min-h-[55vh] sm:min-h-[60vh] lg:min-h-[min(75vh,820px)]"
            onReadyChange={setViewerReady}
          />
          <span className="pointer-events-none absolute bottom-4 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-forest/40 text-sm font-bold text-white shadow-card backdrop-blur-sm">
            360
          </span>
        </div>

        <p className="text-center text-sm text-ink/55 lg:hidden">
          {viewerReady
            ? "Tarik/geser untuk putar 360° (satu foto)"
            : "Menyiapkan panorama 360°…"}
        </p>

        <AppraisalResult data={result} />

        {isSaving && !appraisalId && (
          <div className="rounded-2xl border border-ink/10 bg-surface/80 p-5 text-sm text-ink/65">
            Menyimpan hasil appraisal…
          </div>
        )}

        {saveError && !appraisalId && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-medium text-red-800">{saveError}</p>
            {onRetrySave && (
              <button
                type="button"
                onClick={onRetrySave}
                className="mt-3 rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
              >
                Coba simpan lagi
              </button>
            )}
          </div>
        )}

        {appraisalId && (
          <PublishBarterForm appraisalId={appraisalId} userName={userName} />
        )}
      </div>

      <aside className="flex flex-col gap-4 lg:col-span-1 lg:sticky lg:top-24">
        <EcoSwapPointsDisplay points={result.ecoSwapPoints} size="lg" />
        <PointsTransparencyPanel
          confidenceScore={result.confidenceScore}
          roleClassification={result.roleClassification}
          conditionAnalysis={result.conditionAnalysis}
          ecoSwapPoints={result.ecoSwapPoints}
        />
        <CNNPipelinePanel mode="complete" compact />
        <PreviewGuidePanel mode="result" viewerReady={viewerReady} />
      </aside>
    </div>
  );
}
