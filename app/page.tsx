import { HeaderWithSession } from "@/components/HeaderWithSession";
import { Hero } from "@/components/Hero";
import { PageTransition } from "@/components/PageTransition";
import { AlurCNNSection } from "@/components/sections/AlurCNNSection";
import { CaraKerjaSection } from "@/components/sections/CaraKerjaSection";
import { LiveDemoSection } from "@/components/sections/LiveDemoSection";
import { Footer } from "@/components/sections/Footer";
import { InovasiSection } from "@/components/sections/InovasiSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { TentangSection } from "@/components/sections/TentangSection";
import { WarisanSection } from "@/components/sections/WarisanSection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <HeaderWithSession />
      <PageTransition>
        <main className="bg-page">
          <Hero />
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
