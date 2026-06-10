import { EcoSwapPointsDisplay } from "@/components/ai-appraisal/EcoSwapPointsDisplay";
import {
  CameraIcon,
  CoinPointsIcon,
  FilterSegmentIcon,
  NeuralNetIcon,
} from "./ai-work-icons";

const STEPS = [
  {
    number: "01",
    title: "Image Input",
    description:
      "Pengguna mengunggah foto barang bekas atau heritage dari perangkat.",
    icon: CameraIcon,
    iconClass: "text-forest",
    ringClass: "border-forest/30 bg-forest/5",
  },
  {
    number: "02",
    title: "CNN Feature Extraction",
    description:
      "Convolutional layers mengekstrak pola visual, tekstur, dan fitur objek.",
    icon: NeuralNetIcon,
    iconClass: "text-forest",
    ringClass: "border-forest/30 bg-forest/5",
  },
  {
    number: "03",
    title: "Role-Based Classification",
    description:
      "Mengklasifikasikan apakah ini Sampah Umum atau Warisan Budaya.",
    icon: FilterSegmentIcon,
    iconClass: "text-forest",
    ringClass: "border-forest/30 bg-forest/5",
    badges: ["Sampah Umum", "Warisan Budaya"] as const,
  },
  {
    number: "04",
    title: "Automated Appraisal",
    description:
      "Menghasilkan skor confidence CNN dan EcoSwap Points secara otomatis.",
    icon: CoinPointsIcon,
    iconClass: "text-gold",
    ringClass: "border-gold/40 bg-gold/10",
  },
] as const;

export function HowOurAIWorks() {
  return (
    <section
      id="how-ai-works"
      aria-labelledby="how-ai-works-title"
      className="scroll-mt-20 border-t border-ink/8 bg-cream-muted/50 py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-forest">
            Technology Pipeline
          </p>
          <h2
            id="how-ai-works-title"
            className="font-display mt-3 text-3xl font-bold text-ink md:text-4xl"
          >
            How Our AI Works
          </h2>
          <p className="mt-4 text-ink/70">
            Alur computer vision EcoSwap — dari foto hingga appraisal dan poin,
            dijelaskan langkah demi langkah untuk juri.
          </p>
        </header>

        <ol className="relative mt-14 lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Horizontal connector — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-forest/30 via-emerald/40 to-gold/50 lg:block"
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEPS.length - 1;

            return (
              <li
                key={step.title}
                className="relative flex gap-5 pb-10 last:pb-0 lg:flex-col lg:items-center lg:gap-0 lg:pb-0 lg:text-center"
              >
                {/* Vertical connector — mobile only */}
                {!isLast && (
                  <div
                    aria-hidden
                    className="absolute left-7 top-14 bottom-0 w-px bg-gradient-to-b from-forest/30 to-emerald/15 lg:hidden"
                  />
                )}

                <div className="relative z-10 flex shrink-0 flex-col items-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full border-2 bg-surface shadow-card ${step.ringClass}`}
                  >
                    <Icon className={`h-6 w-6 ${step.iconClass}`} />
                  </div>
                  <span className="mt-2 font-mono text-[10px] font-semibold tracking-widest text-ink/35">
                    {step.number}
                  </span>
                </div>

                <div className="min-w-0 flex-1 pt-1 lg:mt-6 lg:pt-0">
                  <h3 className="font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">
                    {step.description}
                  </p>
                  {"badges" in step && step.badges && (
                    <div className="mt-3 flex flex-wrap gap-2 lg:justify-center">
                      <span className="rounded-full border border-ink/12 bg-ink/5 px-2.5 py-0.5 text-xs font-medium text-ink/70">
                        {step.badges[0]}
                      </span>
                      <span className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-ink">
                        {step.badges[1]}
                      </span>
                    </div>
                  )}
                  {step.number === "04" && (
                    <div className="mt-4 lg:mx-auto lg:max-w-[220px]">
                      <EcoSwapPointsDisplay points={520} size="sm" />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
