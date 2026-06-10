export const dynamic = "force-dynamic";

import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminBarterProposalsList } from "@/components/admin/AdminBarterProposalsList";
import {
  getAdminBarterProposalStats,
  getAdminBarterProposals,
} from "@/lib/api/barter-proposals";
import { getSession } from "@/lib/auth";

export default async function AdminBarterPermintaanPage() {
  const [proposals, stats, session] = await Promise.all([
    getAdminBarterProposals("active"),
    getAdminBarterProposalStats(),
    getSession(),
  ]);

  const pending = proposals.filter((p) => p.status === "PENDING");
  const accepted = proposals.filter((p) => p.status === "ACCEPTED");

  return (
    <>
      <AdminTopBar
        title="Permintaan Barter"
        description="Semua pengajuan tukar barang — menunggu, disetujui, ditolak"
      />
      <div className="min-h-0 flex-1 space-y-8 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
            {stats.pending} menunggu
          </span>
          <span className="rounded-full bg-emerald/15 px-3 py-1 text-sm font-medium text-emerald">
            {stats.accepted} disetujui
          </span>
          <span className="rounded-full bg-forest/10 px-3 py-1 text-sm font-medium text-forest">
            {stats.completed} selesai total
          </span>
        </div>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Menunggu respons ({pending.length})
          </h2>
          <div className="mt-4">
            <AdminBarterProposalsList
              proposals={pending}
              currentUserId={session!.userId}
              emptyMessage="Tidak ada permintaan menunggu."
              variant="active"
              from="permintaan"
            />
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">
            Disetujui — siap ditukar ({accepted.length})
          </h2>
          <div className="mt-4">
            <AdminBarterProposalsList
              proposals={accepted}
              currentUserId={session!.userId}
              emptyMessage="Tidak ada barter yang sudah disetujui."
              variant="active"
              from="permintaan"
            />
          </div>
        </section>
      </div>
    </>
  );
}
