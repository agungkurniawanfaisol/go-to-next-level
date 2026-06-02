import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { HeritageDetailClient } from "./client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function HeritageDetailPage({ params }: PageProps) {
  const { id } = await params;

  const item = await prisma.heritageItem.findUnique({
    where: { id },
  });

  if (!item) notFound();

  const data = {
    id: item.id,
    name: item.name,
    region: item.region,
    category: item.category,
    description: item.description,
    imageUrl: item.imageUrl,
    era: item.era,
    status: item.status,
  };

  return (
    <>
      <AdminTopBar
        title={item.name}
        description={`Detail warisan budaya — ${item.region}`}
      />
      <HeritageDetailClient item={data} />
    </>
  );
}
