export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { BarterProposalCard } from "@/components/barter/BarterProposalCard";
import { getUserBarterProposals } from "@/lib/api/barter-proposals";
import { getSession } from "@/lib/auth";
import { BarterPointsDeductionModalRoot } from "@/components/barter/BarterPointsDeductionModalRoot";

export default async function BarterPermintaanPage() {
  const session = await getSession();
  if (!session) {
    redirect(`/masuk?redirect=/barter/permintaan`);
  }

  const { sent, received } = await getUserBarterProposals(session.userId);

  return (
    <>
      <HeaderWithSession />
      <main className="min-h-screen bg-page">
        <BarterPointsDeductionModalRoot />
        <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8 lg:py-12">
          <nav className="mb-6 text-sm text-ink/55">
            <Link href="/barter" className="hover:text-forest">
              List Barter
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Permintaan Saya</span>
          </nav>

          <h1 className="font-display text-2xl font-semibold text-ink md:text-3xl">
            Permintaan Barter
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Ajukan tukar barang Anda dengan barang orang lain — terima, tolak, atau
            tandai selesai setelah deal.
          </p>

          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-forest">
              Masuk ke Anda ({received.length})
            </h2>
            <p className="mt-1 text-xs text-ink/50">
              Orang lain ingin menukar barang mereka dengan milik Anda
            </p>
            {received.length > 0 ? (
              <div className="mt-4 space-y-4">
                {received.map((p) => (
                  <BarterProposalCard
                    key={p.id}
                    proposal={p}
                    currentUserId={session.userId}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-ink/15 py-10 text-center text-sm text-ink/50">
                Belum ada permintaan masuk.
              </p>
            )}
          </section>

          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-forest">
              Anda mengajukan ({sent.length})
            </h2>
            {sent.length > 0 ? (
              <div className="mt-4 space-y-4">
                {sent.map((p) => (
                  <BarterProposalCard
                    key={p.id}
                    proposal={p}
                    currentUserId={session.userId}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-ink/15 py-10 text-center text-sm text-ink/50">
                Anda belum mengajukan barter. Buka item di{" "}
                <Link href="/barter" className="text-forest underline">
                  List Barter
                </Link>{" "}
                lalu klik Ajukan Barter.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
