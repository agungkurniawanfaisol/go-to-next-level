"use client";

import { useMemo, useState } from "react";
import { SectionShell } from "@/components/sections/SectionShell";

const beforeList = [
  "Barang layak pakai menumpuk di rumah.",
  "Tidak ada standar nilai tukar yang adil.",
  "Akhirnya dibuang atau dijual murah tanpa jejak dampak.",
];

const afterList = [
  "AI appraisal memberi skor dan EcoSwap Points.",
  "Barang masuk komunitas barter dengan transparansi.",
  "Dampak lingkungan dan sosial tercatat real-time.",
];

export function BeforeAfterSection() {
  const [slider, setSlider] = useState(58);
  const clip = useMemo(() => `${slider}%`, [slider]);

  return (
    <SectionShell
      id="before-after"
      eyebrow="Before vs After"
      title="Apa yang Berubah dengan EcoSwap"
      description="Visual cepat untuk menunjukkan perbedaan kondisi sebelum dan sesudah sistem dipakai."
      className="bg-gradient-to-b from-ivory via-cream-muted/40 to-ivory"
    >
      <div className="rounded-2xl border border-ink/8 bg-surface/80 p-5 shadow-card sm:p-6">
        <div className="relative overflow-hidden rounded-xl border border-ink/10">
          <div className="grid min-h-[320px] md:grid-cols-2">
            <div className="bg-gradient-to-br from-ink/10 to-ink/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">
                Sebelum EcoSwap
              </p>
              <ul className="mt-4 space-y-3 text-sm text-ink/70">
                {beforeList.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-forest/15 to-emerald/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-forest">
                Sesudah EcoSwap
              </p>
              <ul className="mt-4 space-y-3 text-sm text-ink/75">
                {afterList.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="pointer-events-none absolute inset-0 border-r-2 border-gold/70"
            style={{ clipPath: `inset(0 0 0 ${clip})` }}
            aria-hidden
          />
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-ink/50">
            <span>Before</span>
            <span>After</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="w-full accent-emerald"
            aria-label="Geser perbandingan before after"
          />
        </div>
      </div>
    </SectionShell>
  );
}

