import { SectionShell } from "@/components/sections/SectionShell";

const trustItems = [
  {
    title: "AI Explainable",
    desc: "Faktor pembentuk poin tampil transparan untuk validasi juri.",
  },
  {
    title: "Poin Transparan",
    desc: "Nilai tukar muncul real-time dengan alasan penilaian yang jelas.",
  },
  {
    title: "Jejak Barter Tercatat",
    desc: "Status, riwayat, chat, dan dampak tersimpan end-to-end.",
  },
] as const;

export function TrustStripSection() {
  return (
    <SectionShell
      id="trust-strip"
      eyebrow="Trust & Validity"
      title="Alasan Sistem Ini Layak Dipercaya"
      description="EcoSwap dibangun agar keputusan AI, alur barter, dan dampak bisa diverifikasi langsung oleh juri."
      className="bg-gradient-to-b from-cream-muted/40 via-ivory to-ivory dark:from-[#1a1714] dark:via-[#0f0e0c] dark:to-[#0f0e0c]"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {trustItems.map((item) => (
          <article
            key={item.title}
            className="glass-panel rounded-2xl border border-ink/8 p-5"
          >
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <p className="mt-2 text-sm text-ink/60">{item.desc}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

