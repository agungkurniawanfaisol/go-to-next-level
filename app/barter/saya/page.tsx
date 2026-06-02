export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { HeaderWithSession } from "@/components/HeaderWithSession";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserBarterProposals } from "@/lib/api/barter-proposals";
import { MyDashboardClient } from "@/components/barter/MyDashboardClient";

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

        <MyDashboardClient data={data} userId={session.userId} />
      </main>
    </>
  );
}
