import Link from "next/link";
import { SectionShell } from "./SectionShell";

const POINTS = [
  "AI Computer Vision untuk klasifikasi heritage",
  "Role-based circular economy — bukan marketplace biasa",
  "360° turntable dari satu foto upload",
  "Pipeline CNN transparan untuk verifikasi juri",
] as const;

export function TentangSection() {
  return (
    <SectionShell
      id="tentang"
      eyebrow="Tentang"
      title="EcoSwap untuk Generasi Berikutnya"
      description="Platform AI-driven yang menjembatani barang bekas, pelestarian budaya, dan ekonomi sirkular di Indonesia."
      className="bg-cream-muted/40"
    >
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4 text-ink/80">
          <p>
            EcoSwap lahir dari keyakinan bahwa barang bekas bukan sekadar limbah
            — banyak di antaranya membawa nilai heritage yang perlu diidentifikasi
            dan dilestarikan secara digital.
          </p>
          <p>
            Dengan CNN-based appraisal dan demo interaktif, komunitas dan juri
            dapat melihat bagaimana teknologi mendukung{" "}
            <strong className="text-ink">digital cultural stewardship</strong>{" "}
            yang nyata.
          </p>
          <Link
            href="/appraisal"
            className="inline-flex text-sm font-semibold text-emerald hover:text-forest"
          >
            Lihat bukti demo AI →
          </Link>
        </div>
        <ul className="space-y-4">
          {POINTS.map((point) => (
            <li
              key={point}
              className="glass-panel flex items-start gap-3 rounded-xl p-4"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-xs text-emerald ring-1 ring-emerald/25">
                ✓
              </span>
              <span className="text-sm font-medium text-ink">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
