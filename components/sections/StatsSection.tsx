"use client";

import { useEffect, useRef, useState } from "react";
import { SectionShell } from "./SectionShell";

type StatItem = {
  label: string;
  value: number;
  suffix: string;
  gradient: string;
};

const stats: StatItem[] = [
  { label: "Barang Terappraisal", value: 1284, suffix: "+", gradient: "from-forest to-emerald" },
  { label: "Swap Berhasil", value: 456, suffix: "+", gradient: "from-emerald to-gold" },
  { label: "EcoSwap Points Dibagikan", value: 245000, suffix: "+", gradient: "from-gold to-amber-600" },
  { label: "Kategori Heritage", value: 12, suffix: "", gradient: "from-forest-light to-emerald-light" },
];

function AnimatedCounter({ value, suffix, gradient, label }: StatItem) {
  const [displayed, setDisplayed] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setInView(true);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const current = Math.min(Math.round(increment * step), value);
      setDisplayed(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  const formatNumber = (n: number): string => {
    if (n >= 1000) {
      return n.toLocaleString("id-ID");
    }
    return String(n);
  };

  return (
    <div
      ref={ref}
      className={`glass-panel group relative overflow-hidden rounded-2xl p-7 transition-all duration-700 ease-out ${
        inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {/* Gradient accent bar */}
      <div
        className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${gradient} origin-left transition-all duration-1000 ease-out ${
          inView ? "scale-x-100" : "scale-x-0"
        }`}
      />

      {/* Background glow */}
      <div
        className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-[0.04] blur-2xl`}
      />

      <div className="relative">
        <p className="text-sm font-medium text-ink/60">{label}</p>
        <div className="mt-2 flex items-baseline gap-1">
          <span
            className={`bg-gradient-to-r ${gradient} bg-clip-text text-4xl font-bold tabular-nums leading-none text-transparent md:text-5xl`}
          >
            {formatNumber(displayed)}
          </span>
          {suffix && (
            <span className="text-lg font-semibold text-ink/40">{suffix}</span>
          )}
        </div>
      </div>

      {/* Shimmer on hover */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
    </div>
  );
}

export function StatsSection() {
  return (
    <SectionShell
      id="stats"
      eyebrow="Live Stats"
      title="Dampak Komunitas EcoSwap"
      description="Data real-time dari aktivitas appraisal, swap, dan pelestarian heritage oleh komunitas."
      className="relative overflow-hidden bg-gradient-to-b from-ivory via-cream-muted/50 to-ivory dark:from-[#0f0e0c] dark:via-[#1a1714] dark:to-[#0f0e0c]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 rounded-full bg-emerald/8 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 h-64 w-64 rounded-full bg-gold/8 blur-3xl"
      />

      <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <AnimatedCounter key={stat.label} {...stat} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-ink/40">
        * Data simulasi — real-time saat terhubung dengan database
      </p>
    </SectionShell>
  );
}
