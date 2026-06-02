export const dynamic = "force-dynamic";

import { AdminTopBar } from "@/components/admin/AdminTopBar";
import {
  getDashboardStats,
  getRecentAppraisals,
} from "@/lib/api/appraisals";

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString("id-ID");
}

export default async function AdminDashboardPage() {
  const [stats, recentAppraisals] = await Promise.all([
    getDashboardStats(),
    getRecentAppraisals(),
  ]);

  const statCards = [
    {
      label: "Total Appraisal",
      value: formatNumber(stats.totalAppraisals),
      change: stats.statsChange.appraisals,
    },
    {
      label: "Eco Points Diberikan",
      value: formatNumber(stats.totalPoints),
      change: stats.statsChange.points,
    },
    {
      label: "Item Heritage",
      value: formatNumber(stats.totalHeritageItems),
      change: stats.statsChange.heritage,
    },
    {
      label: "Pengguna Aktif",
      value: formatNumber(stats.activeUsers),
      change: stats.statsChange.users,
    },
  ];

  return (
    <>
      <AdminTopBar
        title="Dashboard"
        description="Ringkasan aktivitas AI appraisal & ekonomi sirkular"
      />
      <div className="flex-1 space-y-8 p-6 lg:p-8 dark:text-[#f0ebe3]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <article
              key={stat.label}
              className="glass-panel rounded-2xl border border-ink/8 bg-surface/80 p-5 transition-shadow hover:shadow-elevated"
            >
              <p className="text-xs font-medium uppercase tracking-wider text-ink/60">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-bold text-ink">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-emerald">{stat.change}</p>
            </article>
          ))}
        </div>

        <section className="glass-panel rounded-2xl border border-ink/8 bg-surface/80 p-6">
          <h2 className="font-semibold text-ink">Appraisal Terbaru</h2>
          <div className="mt-4 overflow-x-auto">
            {recentAppraisals.length > 0 ? (
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink/8 text-ink/60">
                    <th className="pb-3 font-medium">Objek Terdeteksi</th>
                    <th className="pb-3 font-medium">Poin</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAppraisals.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-ink/5 last:border-0"
                    >
                      <td className="py-3 font-medium text-ink">
                        {row.detectedObject}
                      </td>
                      <td className="py-3 text-gold">+{row.ecoSwapPoints}</td>
                      <td className="py-3">
                        <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-medium text-emerald">
                          Selesai
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="py-8 text-center text-sm text-ink/50">
                Belum ada data appraisal. Upload barang di halaman AI Appraisal untuk memulai.
              </p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
