import Link from "next/link";
import { EcoSwapPointsDisplay } from "@/components/ai-appraisal/EcoSwapPointsDisplay";
import { SectionShell } from "./SectionShell";

const steps = [
  {
    step: "01",
    title: "Upload Barang",
    description:
      "Foto barang bekas atau heritage. Drag & drop langsung dari perangkatmu.",
  },
  {
    step: "02",
    title: "AI CNN Scan",
    description:
      "Model computer vision menganalisis objek, kondisi, dan nilai budaya.",
  },
  {
    step: "03",
    title: "Klasifikasi Role",
    description:
      "Sistem menentukan peran barang dalam ekonomi sirkular & warisan lokal.",
  },
  {
    step: "04",
    title: "Swap & Poin",
    description:
      "Tukar dengan komunitas, dapatkan EcoSwap Points untuk reward budaya.",
  },
];

export function CaraKerjaSection() {
  return (
    <SectionShell
      id="cara-kerja"
      eyebrow="Cara Kerja"
      title="Dari Upload ke Swap dalam 4 Langkah"
      description="Alur sederhana yang menghubungkan barang bekas, AI, dan pelestarian warisan budaya."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((item) => (
          <article
            key={item.step}
            className="glass-panel group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
          >
            <span className="text-gradient-gold text-3xl font-bold">{item.step}</span>
            <h3 className="mt-4 text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              {item.description}
            </p>
            {item.step === "04" && (
              <div className="mt-4">
                <EcoSwapPointsDisplay points={420} size="sm" />
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link
          href="/appraisal"
          className="inline-flex rounded-full border border-gold/35 bg-forest px-8 py-3 text-sm font-semibold text-ivory shadow-card transition-all hover:shadow-elevated"
        >
          Coba AI Appraisal Sekarang
        </Link>
      </div>
    </SectionShell>
  );
}
