"use client";

type PointsTransparencyPanelProps = {
  confidenceScore: number;
  roleClassification: string;
  conditionAnalysis: string;
  ecoSwapPoints: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function extractConditionPercent(conditionText: string): number {
  const match = conditionText.match(/(\d{1,3})%/);
  if (!match) return 65;
  return clamp(Number(match[1]), 0, 100);
}

function heritageScoreFromRole(role: string): number {
  const lower = role.toLowerCase();
  if (lower.includes("high")) return 95;
  if (lower.includes("medium")) return 75;
  if (lower.includes("low")) return 50;
  return 60;
}

function normalizePoints(points: number): number {
  // Rentang demo EcoSwap kira-kira 0-700.
  return clamp(Math.round((points / 700) * 100), 0, 100);
}

function FactorBar({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-ink/65">{label}</span>
        <span className="font-semibold tabular-nums text-ink">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-ink/8">
        <div
          className={`h-full rounded-full ${colorClass} transition-all`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function PointsTransparencyPanel({
  confidenceScore,
  roleClassification,
  conditionAnalysis,
  ecoSwapPoints,
}: PointsTransparencyPanelProps) {
  const confidence = clamp(Math.round(confidenceScore), 0, 100);
  const condition = extractConditionPercent(conditionAnalysis);
  const heritage = heritageScoreFromRole(roleClassification);
  const points = normalizePoints(ecoSwapPoints);

  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">
            Kenapa poin ini keluar?
          </p>
          <p className="mt-1 text-sm text-ink/60">
            Transparansi faktor utama yang memengaruhi EcoSwap Points.
          </p>
        </div>
        <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
          AI Explainable
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <FactorBar
          label="Kondisi barang"
          value={condition}
          colorClass="bg-gradient-to-r from-emerald to-emerald-light"
        />
        <FactorBar
          label="Klasifikasi heritage"
          value={heritage}
          colorClass="bg-gradient-to-r from-gold to-gold-light"
        />
        <FactorBar
          label="Confidence CNN"
          value={confidence}
          colorClass="bg-gradient-to-r from-sky-500 to-cyan-400"
        />
        <FactorBar
          label="Skor poin akhir (normalisasi)"
          value={points}
          colorClass="bg-gradient-to-r from-forest to-emerald"
        />
      </div>
    </div>
  );
}

