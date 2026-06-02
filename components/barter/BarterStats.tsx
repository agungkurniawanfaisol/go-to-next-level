"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { BarterStatsData } from "@/lib/api/barter-stats";

// Dynamic import — ChartJS needs browser (window) so SSR must be disabled
const CategoryPieChart = dynamic(
  () =>
    import("@/components/charts/CategoryPieChart").then(
      (m) => m.CategoryPieChart,
    ),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const PointsBarChart = dynamic(
  () =>
    import("@/components/charts/PointsBarChart").then((m) => m.PointsBarChart),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

const TopItemsLineChart = dynamic(
  () =>
    import("@/components/charts/TopItemsLineChart").then(
      (m) => m.TopItemsLineChart,
    ),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

type BarterStatsProps = {
  stats: BarterStatsData;
};

function ChartSkeleton() {
  return (
    <div className="flex h-56 w-full animate-pulse items-center justify-center rounded-xl bg-ink/5">
      <svg className="h-8 w-8 text-ink/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    </div>
  );
}

const PIE_COLORS = [
  "#1f3d32", // forest
  "#0f6b56", // emerald
  "#b8860b", // gold
  "#2d5a4a", // forest-light
  "#1a8a72", // emerald-light
  "#e8d5a3", // gold-light
];

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel flex items-start gap-4 rounded-2xl p-6"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink/60">{label}</p>
        <p className="font-display mt-0.5 text-2xl font-bold text-ink">
          {typeof value === "number" ? value.toLocaleString("id-ID") : value}
        </p>
        {sub && <p className="mt-0.5 text-xs text-ink/45">{sub}</p>}
      </div>
    </motion.div>
  );
}

function TopItemsList({ items }: { items: BarterStatsData["topItems"] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={`${i}-${item.name}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between rounded-xl border border-ink/8 bg-surface px-4 py-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest/10 text-xs font-bold text-forest">
              {i + 1}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">
                {item.name}
              </p>
              {item.owner && (
                <p className="truncate text-xs text-ink/45">{item.owner}</p>
              )}
            </div>
          </div>
          <span className="shrink-0 text-sm font-bold text-emerald">
            +{item.points.toLocaleString("id-ID")}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function BarterStats({ stats }: BarterStatsProps) {
  const router = useRouter();

  const pieSlices = stats.categories.map((c, i) => ({
    label: c.label,
    count: c.count,
    color: PIE_COLORS[i % PIE_COLORS.length],
    categoryKey: c.category,
  }));

  const barEntries = stats.pointsDistribution.map((d) => ({
    label: d.range,
    value: d.count,
  }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* ── Summary cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={fadeUpVariants}>
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            }
            label="Total Barang"
            value={stats.totalItems}
            sub={`dari ${stats.totalOwners} pemilik`}
          />
        </motion.div>
        <motion.div variants={fadeUpVariants}>
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Total EcoSwap Poin"
            value={stats.totalPoints}
            sub={`Rata-rata ${stats.avgPoints} poin/item`}
          />
        </motion.div>
        <motion.div variants={fadeUpVariants}>
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
              </svg>
            }
            label="Poin Tertinggi"
            value={stats.maxPoints}
            sub={`Poin terendah ${stats.minPoints}`}
          />
        </motion.div>
        <motion.div variants={fadeUpVariants}>
          <StatCard
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            }
            label="Total Pemilik"
            value={stats.totalOwners}
          />
        </motion.div>
      </div>

      {/* ── Category Distribution (Pie Chart + Table) ── */}
      <motion.div
        variants={fadeUpVariants}
        className="glass-panel rounded-2xl p-6 lg:p-8"
      >
        <h2 className="font-display text-xl font-semibold text-ink">
          Distribusi Kategori
        </h2>
        <p className="mt-1 text-sm text-ink/55">
          Jumlah item dan total EcoSwap Poin per kategori
        </p>

        <div className="mt-6">
          <CategoryPieChart
            slices={pieSlices}
            onSliceClick={(categoryKey) =>
              router.push(`/barter?kategori=${categoryKey}`)
            }
          />
        </div>

        {/* Detail table */}
        <div className="mt-8 overflow-hidden rounded-xl border border-ink/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink/5 text-left text-xs font-semibold uppercase text-ink/50">
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-right">Jumlah</th>
                <th className="px-4 py-3 text-right">Total Poin</th>
                <th className="hidden px-4 py-3 text-right sm:table-cell">
                  Rata-rata
                </th>
                <th className="hidden px-4 py-3 text-right sm:table-cell">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {stats.categories.map((cat) => (
                <tr
                  key={cat.category}
                  className="transition-colors hover:bg-ink/3"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-ink">
                      {cat.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">
                    {cat.count}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald">
                    +{cat.totalPoints.toLocaleString("id-ID")}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-ink/60 sm:table-cell">
                    {cat.avgPoints}
                  </td>
                  <td className="hidden px-4 py-3 text-right text-ink/60 sm:table-cell">
                    {cat.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Points Distribution + Top Items ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bar chart */}
        <motion.div
          variants={fadeUpVariants}
          className="glass-panel rounded-2xl p-6 lg:p-8"
        >
          <h2 className="font-display text-xl font-semibold text-ink">
            Distribusi Poin
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            Sebaran EcoSwap Poin di semua barang
          </p>

          <div className="mt-6">
            <PointsBarChart entries={barEntries} />
          </div>
        </motion.div>

        {/* Top items */}
        <motion.div
          variants={fadeUpVariants}
          className="glass-panel rounded-2xl p-6 lg:p-8"
        >
          <h2 className="font-display text-xl font-semibold text-ink">
            Barang Teratas
          </h2>
          <p className="mt-1 text-sm text-ink/55">
            10 barang dengan EcoSwap Poin tertinggi
          </p>

          <div className="mt-6">
            <TopItemsLineChart
              entries={stats.topItems.map((item, i) => ({
                rank: i + 1,
                name: item.name,
                points: item.points,
              }))}
            />
          </div>

          <div className="mt-4">
            <TopItemsList items={stats.topItems} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
