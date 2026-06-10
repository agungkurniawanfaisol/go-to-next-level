"use client";

import { Doughnut } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "@/lib/chart-config";

export type PieSlice = {
  label: string;
  count: number;
  color: string;
  categoryKey: string;
};

type CategoryPieChartProps = {
  slices: PieSlice[];
  onSliceClick?: (categoryKey: string) => void;
};

export function CategoryPieChart({ slices, onSliceClick }: CategoryPieChartProps) {
  const total = slices.reduce((sum, s) => sum + s.count, 0);

  const data: ChartData<"doughnut"> = {
    labels: slices.map((s) => s.label),
    datasets: [
      {
        data: slices.map((s) => s.count),
        backgroundColor: slices.map((s) => s.color),
        borderColor: "#faf8f4",
        borderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "55%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1a1410",
        titleFont: { family: "Plus Jakarta Sans", size: 12 },
        bodyFont: { family: "Plus Jakarta Sans", size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed as number;
            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
            return ` ${ctx.label}: ${val} item (${pct}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      duration: 800,
    },
    onClick: (_e, elements) => {
      if (elements.length > 0) {
        const idx = elements[0].index;
        const key = slices[idx]?.categoryKey;
        if (key && onSliceClick) {
          onSliceClick(key);
        }
      }
    },
  };

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <div className="h-56 w-56 shrink-0">
        <Doughnut data={data} options={options} />
      </div>
      <div className="flex flex-wrap gap-3 sm:flex-col">
        {slices.map((s) => {
          const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) : 0;
          return (
            <div key={s.label} className="flex items-center gap-2.5">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-sm text-ink/70">{s.label}</span>
              <span className="text-sm font-semibold text-ink">{s.count}</span>
              <span className="text-xs text-ink/45">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
