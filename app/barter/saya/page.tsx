export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserBarterProposals } from "@/lib/api/barter-proposals";
import { BarterProposalCard } from "@/components/barter/BarterProposalCard";
import { formatDateShortId } from "@/lib/format-date-id";

async function getMyDashboard(userId: string) {
  const totalPointsResult = db.appraisal.aggregate({
    where: { userId, openForBarter: true },
    _sum: { ecoSwapPoints: true },
  });

  const myItems = db.appraisal.findMany({
    where: { userId, openForBarter: true },
    orderBy: { publishedAt: "desc" },
  });

  const { sent, received } = await getUserBarterProposals(userId);

  return {
    totalPoints: totalPointsResult._sum?.ecoSwapPoints ?? 0,
    publishedCount: myItems.length,
    myItems,
    activeProposals: { sent, received },
  };
}

export default async function MyDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/masuk?redirect=/barter/saya");
  }

  const data = await getMyDashboard(session.userId);

  return (
    <>
      <HeaderWithSession />
      <main className="min-h-screen bg-page">
        <div className="border-b border-ink/8 bg-gradient-to-b from-forest/8 via-ivory to-ivory">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
            <nav className="mb-4 text-sm text-ink/55">
              <Link href="/barter" className="hover:text-forest">
                List Barter
              </Link>
              <span className="mx-2">/</span>
              <span className="text-ink">Dashboard Saya</span>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-widest text-forest">
              Akun Saya
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold text-ink md:text-4xl">
              Dashboard Saya
            </h1>
            <p className="mt-2 text-ink/65">
              Selamat datang, <strong className="text-ink">{session.name}</strong>
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-12">
          {/* Summary cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">
                Total EcoSwap Points
              </p>
              <p className="text-gradient-gold mt-2 font-display text-4xl font-bold tabular-nums md:text-5xl">
                {data.totalPoints.toLocaleString("id-ID")}
              </p>
              <p className="mt-1 text-xs text-ink/45">
                Dari barang yang masih dipublikasikan di List Barter
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">
                Barang Dipublikasi
              </p>
              <p className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">
                {data.publishedCount}
              </p>
              <p className="mt-1 text-xs text-ink/45">
                Siap ditukar di List Barter
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">
                Proposal Aktif
              </p>
              <p className="mt-2 font-display text-4xl font-bold text-ink md:text-5xl">
                {data.activeProposals.sent.length + data.activeProposals.received.length}
              </p>
              <p className="mt-1 text-xs text-ink/45">
                {data.activeProposals.received.length} masuk · {data.activeProposals.sent.length} dikirim
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/appraisal"
              className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Upload Barang Baru
            </Link>
            <Link
              href="/barter/permintaan"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-6 py-3 text-sm font-medium text-ink/70 transition-all hover:border-emerald/40 hover:text-forest"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Lihat Permintaan
            </Link>
          </div>

          {/* My published items */}
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              Barang Saya di List Barter
            </h2>
            {data.myItems.length > 0 ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.myItems.map((item) => {
                  const itemImg =
                    item.imagePath ??
                    "https://placehold.co/400x300/e8e2d8/1f3d32?text=EcoSwap";
                  return (
                    <Link
                      key={item.id}
                      href={`/barter/${item.id}`}
                      className="group overflow-hidden rounded-xl border border-ink/8 bg-surface/90 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-forest/10 to-emerald/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={itemImg}
                          alt={item.detectedObject}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <p className="font-display text-base font-semibold text-ink">
                          {item.detectedObject}
                        </p>
                        <p className="mt-1 text-xs text-ink/50">
                          {item.ownerCity ?? "—"}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-medium text-emerald">
                            +{item.ecoSwapPoints} poin
                          </span>
                          {item.publishedAt && (
                            <span className="text-[10px] text-ink/40">
                              {formatDateShortId(item.publishedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-ink/15 py-12 text-center">
                <p className="text-sm text-ink/55">
                  Belum ada barang yang dipublikasikan.
                </p>
                <Link
                  href="/appraisal"
                  className="mt-4 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory"
                >
                  Upload Sekarang
                </Link>
              </div>
            )}
          </section>

          {/* Active proposals */}
          <section className="mt-12">
            <h2 className="font-display text-xl font-semibold text-ink">
              Proposal Aktif
            </h2>
            <div className="mt-4 space-y-6">
              {data.activeProposals.received.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-forest">
                    Masuk ke Anda ({data.activeProposals.received.length})
                  </p>
                  <div className="space-y-4">
                    {data.activeProposals.received.map((p) => (
                      <BarterProposalCard
                        key={p.id}
                        proposal={p}
                        currentUserId={session.userId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {data.activeProposals.sent.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/50">
                    Anda mengajukan ({data.activeProposals.sent.length})
                  </p>
                  <div className="space-y-4">
                    {data.activeProposals.sent.map((p) => (
                      <BarterProposalCard
                        key={p.id}
                        proposal={p}
                        currentUserId={session.userId}
                      />
                    ))}
                  </div>
                </div>
              )}

              {data.activeProposals.sent.length === 0 &&
                data.activeProposals.received.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-ink/15 py-12 text-center">
                    <p className="text-sm text-ink/55">
                      Belum ada proposal barter aktif.
                    </p>
                    <Link
                      href="/barter"
                      className="mt-4 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-ivory"
                    >
                      Lihat List Barter
                    </Link>
                  </div>
                )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
