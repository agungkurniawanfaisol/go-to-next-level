import { SectionShell } from "@/components/sections/SectionShell";
import type { ImpactMetrics } from "@/lib/api/impact-metrics";

type CounterfactualSectionProps = {
  metrics: ImpactMetrics;
};

export function CounterfactualSection({ metrics }: CounterfactualSectionProps) {
  const ifNoEcoSwapWasteKg = Math.round(
    metrics.estimatedWastePreventedKg + metrics.itemsRescued * 1.8,
  );
  const ifNoEcoSwapLossPoints = Math.round(metrics.pointsInCirculation * 0.75);

  return (
    <SectionShell
      id="counterfactual"
      eyebrow="Counterfactual"
      title="Jika Tanpa EcoSwap"
      description="Panel ini membantu juri melihat skenario pembanding ketika platform ini tidak ada."
      className="bg-gradient-to-b from-ivory via-gold/5 to-ivory"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-red-200/60 bg-red-50/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-700">
            Risiko tanpa EcoSwap
          </p>
          <p className="mt-3 text-3xl font-bold text-red-700">
            {ifNoEcoSwapWasteKg.toLocaleString("id-ID")} kg
          </p>
          <p className="mt-2 text-sm text-red-800/80">
            estimasi limbah berpotensi tidak terselamatkan dari siklus pakai ulang.
          </p>
        </article>

        <article className="rounded-2xl border border-ink/10 bg-surface p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink/50">
            Nilai tukar yang hilang
          </p>
          <p className="mt-3 text-3xl font-bold text-ink">
            {ifNoEcoSwapLossPoints.toLocaleString("id-ID")} PTS
          </p>
          <p className="mt-2 text-sm text-ink/65">
            potensi value ekonomi sirkular yang tidak terjadi di komunitas.
          </p>
        </article>
      </div>
    </SectionShell>
  );
}

