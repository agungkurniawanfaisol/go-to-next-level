import Link from "next/link";
import { SectionShell } from "./SectionShell";

const NOVELTY_ITEMS = [
  {
    badge: "Novelty #1",
    title: "CNN × Warisan Budaya",
    description:
      "Model computer vision khusus mengklasifikasi barang sebagai warisan vs sampah umum — bukan e-commerce generik.",
    metric: "98.5%",
    metricLabel: "confidence demo",
  },
  {
    badge: "Novelty #2",
    title: "360° Pannellum dari Satu Foto",
    description:
      "Upload sekali → panorama equirectangular + react-pannellum (drag 360° mulus, tanpa 8 potongan).",
    metric: "1",
    metricLabel: "foto → 360°",
  },
  {
    badge: "Novelty #3",
    title: "Pipeline Transparan",
    description:
      "Juri melihat langkah CNN real-time: Conv layers, Softmax, inference report & top-3 probabilities.",
    metric: "6",
    metricLabel: "layer terpantau",
  },
  {
    badge: "Novelty #4",
    title: "Circular × Heritage",
    description:
      "EcoSwap Points menghubungkan ekonomi sirkular dengan digital cultural stewardship Indonesia.",
    metric: "500+",
    metricLabel: "poin per swap",
  },
] as const;

export function InovasiSection() {
  return (
    <SectionShell
      id="inovasi"
      eyebrow="Keunikan Platform"
      title="Inovasi yang Membedakan EcoSwap"
      description="Bukan sekadar landing page — aplikasi ini membuktikan alur AI end-to-end yang bisa diverifikasi juri secara langsung."
      className="relative overflow-hidden bg-gradient-to-b from-forest/6 via-ivory to-ivory"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-emerald/10 blur-3xl"
      />

      <div className="relative grid gap-6 sm:grid-cols-2">
        {NOVELTY_ITEMS.map((item) => (            <article
            key={item.title}
            className="glass-panel group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
          >
            <span className="inline-flex rounded-full border border-gold/35 bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
              {item.badge}
            </span>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {item.description}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-gradient-gold text-2xl font-bold tabular-nums">
                  {item.metric}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-ink/45">
                  {item.metricLabel}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="relative mx-auto mt-12 max-w-3xl rounded-2xl border border-forest/20 bg-forest p-6 text-center shadow-elevated sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-light">
          Bukti untuk Juri
        </p>
        <p className="font-display mt-3 text-xl font-semibold text-ivory sm:text-2xl">
          Satu foto → CNN inference → 360° → poin swap
        </p>
        <p className="mt-3 text-sm text-ivory/70">
          Semua langkah dapat diuji langsung di demo live — tanpa mock tersembunyi di
          balik UI statis.
        </p>
        <Link
          href="/appraisal"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-8 py-3 text-sm font-semibold text-gold-light transition-colors hover:bg-gold/25"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-light" />
          Uji Demo AI Appraisal
        </Link>
      </div>
    </SectionShell>
  );
}
