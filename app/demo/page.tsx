import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panduan Demo | EcoSwap",
  description: "Alur presentasi untuk juri — AI Appraisal, EcoSwap Points, dan Barter",
};

const demoSteps = [
  {
    title: "AI Appraisal + EcoSwap Points",
    duration: "~2 menit",
    highlight: true,
    items: [
      "Upload foto barang di halaman AI Appraisal",
      "Tunggu pipeline CNN sampai langkah terakhir (Automated Appraisal)",
      "Kartu emas EcoSwap Points muncul saat menghitung — lalu angka poin final",
      "Hasil: klasifikasi, confidence, panorama 360°",
    ],
    href: "/appraisal",
    cta: "Buka AI Appraisal",
  },
  {
    title: "Publikasi & List Barter",
    duration: "~1 menit",
    items: [
      "Dari hasil appraisal, publikasikan ke barter",
      "Cek barang di list barter komunitas",
    ],
    href: "/barter",
    cta: "List Barter",
  },
  {
    title: "Komunitas Barter",
    duration: "~2 menit",
    items: [
      "Galeri orang yang sudah barter",
      "Detail: dua pihak, barang, dan percakapan",
    ],
    href: "/barter/riwayat",
    cta: "Komunitas Barter",
  },
  {
    title: "Panel Admin",
    duration: "~2 menit",
    items: [
      "Login admin, dashboard, heritage, log appraisal",
      "Kelola permintaan & barter selesai",
    ],
    href: "/masuk",
    cta: "Masuk",
  },
] as const;

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
        Panduan presentasi
      </p>
      <h1 className="mt-2 font-serif text-3xl font-bold text-ink sm:text-4xl">
        Demo untuk Juri
      </h1>
      <p className="mt-3 text-ink/65">
        Ikuti urutan ini saat presentasi (~7 menit). Fokus utama: pipeline CNN
        dan <strong className="text-ink">EcoSwap Points</strong> di langkah
        terakhir.
      </p>

      <div className="mt-8 rounded-2xl border border-gold/30 bg-gold/8 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">
          Akun demo
        </p>
        <dl className="mt-3 space-y-2 font-mono text-sm">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <dt className="text-ink/50">Admin</dt>
            <dd className="text-ink">admin@ecoswap.id / password123</dd>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <dt className="text-ink/50">Member</dt>
            <dd className="text-ink">siti@email.com / password123</dd>
          </div>
        </dl>
      </div>

      <ol className="mt-10 space-y-6">
        {demoSteps.map((step, index) => (
          <li
            key={step.title}
            className={`rounded-2xl border p-6 ${
              "highlight" in step && step.highlight
                ? "border-gold/40 bg-gradient-to-br from-gold/12 to-ivory shadow-[0_0_24px_rgba(201,162,39,0.12)]"
                : "border-ink/10 bg-ivory"
            }`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-gradient-gold text-2xl font-bold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xs text-ink/45">{step.duration}</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold text-ink">{step.title}</h2>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-ink/70">
              {step.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link
              href={step.href}
              className="mt-4 inline-flex rounded-full bg-forest px-4 py-2 text-sm font-medium text-ivory transition hover:bg-forest/90"
            >
              {step.cta} →
            </Link>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-center text-xs text-ink/45">
        Dokumen lengkap: <code className="rounded bg-ink/5 px-1">DEMO.md</code> di
        repositori proyek
      </p>
    </main>
  );
}
