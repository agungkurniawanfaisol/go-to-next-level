import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { BarterProposalForm } from "@/components/barter/BarterProposalForm";
import { barterAjukanPath } from "@/lib/barter/ajukan-path";
import { getBarterListingById } from "@/lib/api/barter";
import { getUserPublishedItems } from "@/lib/api/barter-proposals";
import { getSession, getValidSessionUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = await getBarterListingById(id);
  if (!listing) return { title: "Ajukan Barter — EcoSwap" };
  return {
    title: `Ajukan Barter — ${listing.detectedObject}`,
    description: `Ajukan pertukaran untuk ${listing.detectedObject}`,
  };
}

export default async function AjukanBarterPage({ params }: PageProps) {
  const { id } = await params;
  const ajukanPath = barterAjukanPath(id);
  const detailPath = `/barter/${id}`;

  const [listing, session, validUserId] = await Promise.all([
    getBarterListingById(id),
    getSession(),
    getValidSessionUserId(),
  ]);

  if (!listing) {
    return (
      <>
        <HeaderWithSession />
        <main className="bg-page min-h-screen">
          <div className="mx-auto max-w-lg px-6 py-16 text-center">
            <h1 className="font-display text-2xl font-semibold text-ink">
              Barang tidak ditemukan
            </h1>
            <p className="mt-3 text-sm text-ink/60">
              ID barang mungkin sudah tidak ada (misalnya setelah reset database).
              Buka lagi dari List Barter.
            </p>
            <Link
              href="/barter"
              className="mt-8 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory"
            >
              Ke List Barter
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (!session) {
    redirect(`/masuk?redirect=${encodeURIComponent(ajukanPath)}`);
  }

  if (!validUserId) {
    return (
      <>
        <HeaderWithSession />
        <main className="bg-page min-h-screen">
          <div className="mx-auto max-w-lg px-6 py-16">
            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-8 text-center dark:border-gold/40 dark:bg-gold/15">
              <h1 className="font-display text-xl font-semibold text-ink">
                Sesi login perlu diperbarui
              </h1>
              <p className="mt-3 text-sm text-ink/65">
                Cookie login masih ada tetapi akun tidak valid (sering terjadi setelah
                seed ulang database). Masuk lagi untuk melanjutkan ajuan barter.
              </p>
              <Link
                href={`/masuk?redirect=${encodeURIComponent(ajukanPath)}`}
                className="mt-6 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory"
              >
                Masuk ulang
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!listing.openForBarter) {
    redirect(detailPath);
  }

  if (listing.userId === validUserId) {
    redirect("/barter/saya");
  }

  const myItems = await getUserPublishedItems(validUserId, listing.id);

  if (myItems.length === 0) {
    return (
      <>
        <HeaderWithSession />
        <main className="bg-page min-h-screen">
          <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
            <nav className="mb-8 text-sm text-ink/55" aria-label="Breadcrumb">
              <Link href="/barter" className="hover:text-forest">
                List Barter
              </Link>
              <span className="mx-2">/</span>
              <Link href={detailPath} className="hover:text-forest">
                {listing.detectedObject}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink">Ajukan Barter</span>
            </nav>
            <div className="rounded-2xl border border-ink/10 bg-surface p-8 text-center sm:p-12">
              <h1 className="font-display text-2xl font-semibold text-ink">
                Belum ada barang untuk ditawarkan
              </h1>
              <p className="mt-3 text-ink/60">
                Upload di AI Appraisal lalu publikasikan ke List Barter sebelum mengajukan
                tukar dengan {listing.detectedObject}.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/appraisal"
                  className="rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory"
                >
                  Upload & publish
                </Link>
                <Link
                  href={detailPath}
                  className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink/70"
                >
                  Kembali ke detail
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <HeaderWithSession />
      <main className="bg-page min-h-screen">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <nav className="mb-6 text-sm text-ink/55 sm:mb-8" aria-label="Breadcrumb">
            <Link href="/barter" className="hover:text-forest">
              List Barter
            </Link>
            <span className="mx-2">/</span>
            <Link href={detailPath} className="hover:text-forest">
              {listing.detectedObject}
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium text-ink">Ajukan Barter</span>
          </nav>

          <BarterProposalForm
            requestedAppraisalId={listing.id}
            requestedTitle={listing.detectedObject}
            requestedOwner={listing.ownerName ?? "Pemilik"}
            requestedPoints={listing.ecoSwapPoints}
            requestedImagePath={listing.imagePath}
            myItems={myItems}
            cancelHref={detailPath}
          />
        </div>
      </main>
    </>
  );
}
