export const dynamic = "force-dynamic";

import Link from "next/link";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getAppraisalLogs } from "@/lib/api/appraisals";

function formatDate(d: Date): string {
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminAppraisalsPage() {
  const logs = await getAppraisalLogs();

  return (
    <>
      <AdminTopBar
        title="Log Appraisal"
        description="Riwayat hasil prediksi CNN dari pengguna"
      />
      <div className="p-6 lg:p-8">
        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-surface/80 shadow-card">
          {logs.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead className="bg-forest/8 text-ink/70">
                <tr>
                  <th className="px-5 py-3 font-medium">Foto</th>
                  <th className="px-5 py-3 font-medium">Objek</th>
                  <th className="px-5 py-3 font-medium">Confidence</th>
                  <th className="px-5 py-3 font-medium">Poin</th>
                  <th className="px-5 py-3 font-medium">Barter</th>
                  <th className="px-5 py-3 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-t border-ink/8">
                    <td className="px-5 py-3">
                      {log.imagePath ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={log.imagePath}
                          alt=""
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-forest/10 text-xs text-ink/40">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-ink">
                      {log.detectedObject}
                    </td>
                    <td className="px-5 py-4 text-emerald">
                      {log.confidenceScore.toFixed(1)}%
                    </td>
                    <td className="px-5 py-4 font-semibold text-gold">
                      +{log.ecoSwapPoints}
                    </td>
                    <td className="px-5 py-4">
                      {log.openForBarter ? (
                        <Link
                          href={`/barter/${log.id}`}
                          className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-medium text-emerald hover:bg-emerald/20"
                        >
                          Aktif
                        </Link>
                      ) : (
                        <span className="text-xs text-ink/40">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-ink/60">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-12 text-center text-sm text-ink/50">
              Belum ada log appraisal. Mulai dengan upload barang di halaman AI Appraisal.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
