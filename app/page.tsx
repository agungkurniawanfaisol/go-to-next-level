import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Hero } from "@/components/Hero";
import { PageTransition } from "@/components/PageTransition";
import { AlurCNNSection } from "@/components/sections/AlurCNNSection";
import { BeforeAfterSection } from "@/components/sections/BeforeAfterSection";
import { CaraKerjaSection } from "@/components/sections/CaraKerjaSection";
import { CounterfactualSection } from "@/components/sections/CounterfactualSection";
import { LiveDemoSection } from "@/components/sections/LiveDemoSection";
import { Footer } from "@/components/sections/Footer";
import { ImpactCounterSection } from "@/components/sections/ImpactCounterSection";
import { ImpactTimelineSection } from "@/components/sections/ImpactTimelineSection";
import { InovasiSection } from "@/components/sections/InovasiSection";
import { PersonaSwitcherSection } from "@/components/sections/PersonaSwitcherSection";
import { ShowcaseCasesSection } from "@/components/sections/ShowcaseCasesSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TentangSection } from "@/components/sections/TentangSection";
import { BarterNearbyMapSection } from "@/components/sections/BarterNearbyMapSection";
import { TrustStripSection } from "@/components/sections/TrustStripSection";
import { WarisanSection } from "@/components/sections/WarisanSection";
import { getBarterListingsWithLocations } from "@/lib/api/barter";
import { getImpactMetrics } from "@/lib/api/impact-metrics";
import { getLandingTimeline } from "@/lib/api/landing-highlights";
import { getCompletedBarterProposals } from "@/lib/api/barter-proposals";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [impactMetrics, timeline, completedCases, barterListings] =
    await Promise.all([
      getImpactMetrics(),
      getLandingTimeline(8),
      getCompletedBarterProposals(3),
      getBarterListingsWithLocations(),
    ]);

  return (
    <>
      <HeaderWithSession />
      <PageTransition>
        <main className="bg-page">
          <Hero />
          <PersonaSwitcherSection />
          <ImpactCounterSection metrics={impactMetrics} />
          <TrustStripSection />
          <BarterNearbyMapSection listings={barterListings} />
          <BeforeAfterSection />
          <ImpactTimelineSection events={timeline} />
          <CounterfactualSection metrics={impactMetrics} />
          <ShowcaseCasesSection cases={completedCases} />
          <InovasiSection />
          <CaraKerjaSection />
          <AlurCNNSection />
          <LiveDemoSection />
          <WarisanSection />
          <StatsSection />
          <TentangSection />
        </main>
      </PageTransition>
      <Footer />
    </>
  );
}
