export const dynamic = "force-dynamic";

import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { AdminBarterExplorer } from "@/components/admin/AdminBarterExplorer";
import { getAdminBarterPageData } from "@/lib/api/barter";

export default async function AdminBarterPage() {
  const data = await getAdminBarterPageData();

  return (
    <>
      <AdminTopBar
        title="List Barter"
        description="Klik pengguna untuk melihat barang yang siap ditukar"
      />
      <div className="min-h-0 flex-1 p-4 sm:p-6 lg:p-8">
        <AdminBarterExplorer data={data} />
      </div>
    </>
  );
}
