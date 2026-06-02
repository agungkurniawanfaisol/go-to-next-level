"use client";

import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "@/lib/chart-config";

export type TopItemEntry = {
  rank: number;
  name: string;
  points: number;
};

type TopItemsLineChartProps = {
  entries: TopItemEntry[];
};

export function TopItemsLineChart({ entries }: TopItemsLineChartProps) {
  const reversed = [...entries].reverse();

  const data: ChartData<"line"> = {
    labels: reversed.map((e) => `#${e.rank}`),
    datasets: [
      {
        label: "EcoSwap Poin",
        data: reversed.map((e) => e.points),
        borderColor: "#0f6b56",
        backgroundColor: "rgba(15, 107, 86, 0.08)",
        borderWidth: 3,
        pointBackgroundColor: reversed.map((e) =>
          e.rank <= 3 ? "#b8860b" : "#0f6b56",
        ),
        pointBorderColor: reversed.map((e) =>
          e.rank <= 3 ? "#e8d5a3" : "#faf8f4",
        ),
        pointBorderWidth: 2,
        pointRadius: reversed.map((e) => (e.rank <= 3 ? 6 : 4)),
        pointHoverRadius: 8,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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
          title: (items) => {
            const idx = items[0].dataIndex;
            const entry = entries[entries.length - 1 - idx];
            return `Peringkat #${entry?.rank ?? idx}`;
          },
          label: (ctx) => {
            const idx = ctx.dataIndex;
            const entry = entries[entries.length - 1 - idx];
            return ` ${entry?.name}: ${ctx.parsed.y} poin`;
          },
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
        grid: { color: "rgba(26, 20, 16, 0.06)" },
        ticks: {
          font: { family: "Plus Jakarta Sans", size: 11 },
          color: "#1a141080",
          callback: (val) => `${val} pts`,
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
}
