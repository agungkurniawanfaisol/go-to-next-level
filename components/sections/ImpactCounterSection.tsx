"use client";

import { useEffect, useRef, useState } from "react";
import { SectionShell } from "@/components/sections/SectionShell";
import type { ImpactMetrics } from "@/lib/api/impact-metrics";

type ImpactCounterSectionProps = {
  metrics: ImpactMetrics;
};

type CounterCard = {
  label: string;
  value: number;
  suffix?: string;
  note: string;
  gradient: string;
};

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const ratio = Math.min((now - start) / durationMs, 1);
      setValue(Math.round(target * ratio));
      if (ratio < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, durationMs]);

  return value;
}

function CounterCard({
  label,
  value,
  suffix = "",
  note,
  gradient,
}: CounterCard) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          setInView(true);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const counted = useCountUp(value, inView);

  return (
    <div
      ref={ref}
      className="glass-panel relative overflow-hidden rounded-2xl border border-ink/8 p-6"
    >
      <div
        aria-hidden
        className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${gradient}`}
      />
      <p className="text-xs font-semibold uppercase tracking-widest text-ink/45">
        {label}
      </p>
      <p className={`mt-3 bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-bold text-transparent md:text-5xl`}>
        {counted.toLocaleString("id-ID")}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-ink/60">{note}</p>
    </div>
  );
}

export function ImpactCounterSection({ metrics }: ImpactCounterSectionProps) {
  const cards: CounterCard[] = [
    {
      label: "Barang Terselamatkan",
      value: metrics.itemsRescued,
      suffix: "+",
      note: "Item aktif yang masih berputar di ekonomi sirkular.",
      gradient: "from-forest to-emerald",
    },
    {
      label: "Poin Beredar",
      value: metrics.pointsInCirculation,
      suffix: " PTS",
      note: "Nilai tukar komunitas yang sedang berjalan.",
      gradient: "from-gold to-amber-500",
    },
    {
      label: "Barter Sukses",
      value: metrics.successfulBarters,
      suffix: "+",
      note: "Transaksi selesai antara pengguna EcoSwap.",
      gradient: "from-emerald to-cyan-400",
    },
    {
      label: "Estimasi Limbah Dicegah",
      value: metrics.estimatedWastePreventedKg,
      suffix: " kg",
      note: "Perkiraan dampak lingkungan dari barter yang selesai.",
      gradient: "from-sky-600 to-emerald-400",
    },
  ];

  return (
    <SectionShell
      id="impact-counter"
      eyebrow="WOW Impact"
      title="Dampak Nyata EcoSwap"
      description="Angka ini naik seiring aktivitas komunitas: upload, appraisal, barter, dan penyelesaian transaksi."
      className="bg-gradient-to-b from-ivory via-cream-muted/50 to-ivory dark:from-[#0f0e0c] dark:via-[#1a1714] dark:to-[#0f0e0c]"
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <CounterCard key={card.label} {...card} />
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-ink/45">
        * Data real-time dari database lokal EcoSwap.
      </p>
    </SectionShell>
  );
}

