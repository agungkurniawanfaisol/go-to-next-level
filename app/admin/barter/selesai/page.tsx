export const dynamic = "force-dynamic";

import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminBarterProposalsList } from "@/components/admin/AdminBarterProposalsList";
import { getAdminBarterProposals } from "@/lib/api/barter-proposals";
import { getSession } from "@/lib/auth";

export default async function AdminBarterSelesaiPage() {
  const [proposals, session] = await Promise.all([
    getAdminBarterProposals("completed"),
    getSession(),
  ]);

  return (
    <>
      <AdminTopBar
        title="Barter Selesai"
        description="Riwayat pertukaran barang yang sudah diselesaikan"
      />
      <div className="min-h-0 flex-1 p-4 sm:p-6 lg:p-8">
        <AdminBarterProposalsList
          proposals={proposals}
          currentUserId={session!.userId}
          emptyMessage="Belum ada barter yang ditandai selesai."
          variant="history"
          from="selesai"
        />
      </div>
    </>
  );
}
