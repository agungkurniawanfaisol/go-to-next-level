"use client";

import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "@/lib/chart-config";

export type BarEntry = {
  label: string;
  value: number;
};

type PointsBarChartProps = {
  entries: BarEntry[];
};

export function PointsBarChart({ entries }: PointsBarChartProps) {
  const maxVal = Math.max(...entries.map((e) => e.value), 1);

  const data: ChartData<"bar"> = {
    labels: entries.map((e) => e.label),
    datasets: [
      {
        label: "Jumlah item",
        data: entries.map((e) => e.value),
        backgroundColor: [
          "rgba(15, 107, 86, 0.55)",
          "rgba(26, 138, 114, 0.55)",
          "rgba(47, 168, 140, 0.55)",
          "rgba(184, 134, 11, 0.55)",
          "rgba(218, 165, 32, 0.55)",
          "rgba(232, 213, 163, 0.55)",
        ],
        borderColor: [
          "rgba(15, 107, 86, 1)",
          "rgba(26, 138, 114, 1)",
          "rgba(47, 168, 140, 1)",
          "rgba(184, 134, 11, 1)",
          "rgba(218, 165, 32, 1)",
          "rgba(232, 213, 163, 1)",
        ],
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1a1410",
        titleFont: { family: "Plus Jakarta Sans", size: 12 },
        bodyFont: { family: "Plus Jakarta Sans", size: 13 },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} item`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "Plus Jakarta Sans", size: 11 },
          color: "#1a141080",
        },
      },
      y: {
        beginAtZero: true,
        max: Math.ceil(maxVal * 1.2),
        grid: {
          color: "rgba(26, 20, 16, 0.06)",
        },
        ticks: {
          stepSize: 1,
          font: { family: "Plus Jakarta Sans", size: 11 },
          color: "#1a141080",
        },
      },
    },
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
