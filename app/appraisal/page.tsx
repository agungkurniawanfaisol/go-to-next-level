import type { Metadata } from "next";
import { AppraisalPageClient } from "@/components/appraisal/AppraisalPageClient";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { PageTransition } from "@/components/PageTransition";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "AI Appraisal — EcoSwap",
  description:
    "Upload barang bekas atau heritage — AI CNN menganalisis peran budaya, klasifikasi, dan nilai swap.",
};

export default async function AppraisalPage() {
  const session = await getSession();
  const userName = session?.name ?? null;

  return (
    <>
      <HeaderWithSession />
      <PageTransition>
        <main className="bg-page mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">
            Fitur Unggulan
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
            AI · CNN v1.2
          </span>
        </div>
        <h1 className="font-display mt-2 text-3xl font-bold text-ink md:text-4xl">
          AI Heritage Appraisal
        </h1>
        <p className="mt-2 max-w-2xl text-ink/70">
          Upload barang — pipeline CNN mengekstrak fitur, mengklasifikasi peran
          budaya, dan menampilkan laporan inferensi untuk juri.
        </p>
        <AppraisalPageClient userName={userName} />
        </main>
      </PageTransition>
    </>
  );
}
