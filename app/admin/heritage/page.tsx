export const dynamic = "force-dynamic";

import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getHeritageCatalog } from "@/lib/api/appraisals";
import { HeritagePageClient } from "./client";

export default async function AdminHeritagePage() {
  const catalog = await getHeritageCatalog();

  return (
    <>
      <AdminTopBar
        title="Katalog Warisan"
        description="Kelola kategori heritage untuk model CNN"
      />
      <HeritagePageClient items={catalog} />
    </>
  );
}
