import React from "react";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="beranda"
      className="relative min-h-[90vh] overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(31,61,50,0.12)_0%,transparent_55%),radial-gradient(ellipse_60%_50%_at_10%_80%,rgba(15,107,86,0.06)_0%,transparent_50%)]"
      />
      <div aria-hidden className="hero-grain pointer-events-none absolute inset-0 opacity-60" />

      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/4 hidden h-[480px] w-[480px] rounded-full bg-emerald/15 blur-3xl lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/3 hidden h-72 w-72 rounded-full border border-gold/20 lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-24 top-1/2 hidden h-40 w-40 -translate-y-1/2 rotate-45 rounded-3xl border border-ink/8 bg-surface/60 shadow-card lg:block"
      />

      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl flex-col justify-center px-6 py-20 lg:flex-row lg:items-center lg:gap-12 lg:px-8">
        <div className="flex-1 lg:max-w-[60%]">
          <p className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-gold/35 bg-surface/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-forest shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald" />
            Circular Economy × Budaya Lokal
          </p>

          <h1 className="font-display animate-fade-up delay-100 text-6xl font-bold leading-[0.95] tracking-tight text-ink md:text-8xl">
            <span className="relative inline-block">
              EcoSwap
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gold/70"
              />
            </span>
          </h1>

          <h2 className="animate-fade-up delay-200 mt-6 max-w-2xl text-sm font-semibold uppercase tracking-[0.2em] text-ink/65 md:text-base">
            AI-Driven Digital Cultural Stewardship
          </h2>

          <ul className="animate-fade-up delay-300 mt-6 flex flex-wrap gap-2">
            {["CNN Heritage", "360° View", "Circular Swap", "Live Demo"].map(
              (tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-emerald/25 bg-emerald/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald"
                >
                  {tag}
                </li>
              ),
            )}
          </ul>

          <p className="animate-fade-up delay-400 mt-8 max-w-xl text-lg leading-relaxed text-ink/80 md:text-xl">
            Reviving Local Heritage through CNN-Based Circular Economy. Tukar
            barang bekasmu, selamatkan warisan budaya, dan dapatkan poin.
          </p>

          <div className="animate-fade-up delay-500 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/appraisal"
              className="inline-flex items-center justify-center rounded-full border border-gold/35 bg-forest px-8 py-4 text-sm font-semibold text-ivory shadow-elevated transition-all hover:bg-forest-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Mulai Swap dengan AI
            </Link>
            <Link
              href="/barter"
              className="inline-flex items-center justify-center rounded-full border border-ink/20 bg-transparent px-8 py-4 text-sm font-semibold text-ink transition-all hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Jelajahi List Barter
            </Link>
            <Link
              href="/#inovasi"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 bg-transparent px-8 py-4 text-sm font-semibold text-ink/70 transition-all hover:border-gold hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Lihat Inovasi Platform
            </Link>
          </div>
        </div>

        <div
          aria-hidden
          className="animate-fade-in delay-600 relative mt-16 hidden flex-1 items-center justify-center lg:flex"
        >
          {/* ── Appraisal Result Mockup ── */}
          <div className="relative w-[340px] lg:w-[400px]">
            {/* Shadow glow */}
            <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-forest/10 via-emerald/5 to-gold/10 blur-2xl" />

            {/* Main card */}
            <div className="glass-panel relative overflow-hidden rounded-2xl shadow-elevated">
              {/* Header */}
              <div className="flex items-center gap-2 border-b border-gold/15 bg-gradient-to-r from-forest/5 via-surface to-gold/5 px-4 py-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald/15 ring-1 ring-emerald/30">
                  <svg className="h-3 w-3 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-forest">
                  CNN Prediction Complete
                </span>
                <span className="ml-auto rounded-full border border-gold/25 bg-gold/8 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-gold">
                  Live Demo
                </span>
              </div>

              {/* Image preview area */}
              <div className="relative mx-4 mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-forest/8 via-emerald/5 to-gold/8">
                <div className="aspect-[4/3] flex items-center justify-center">
                  {/* Decorative batik-like pattern */}
                  <div className="relative h-full w-full">
                    <svg
                      className="absolute inset-0 h-full w-full opacity-[0.07]"
                      viewBox="0 0 200 150"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h200v150H0z" fill="currentColor" className="text-forest" />
                      <circle cx="100" cy="75" r="40" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
                      <circle cx="100" cy="75" r="25" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
                      <circle cx="100" cy="75" r="10" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
                      <path d="M60 15l-10 20 10 20M140 15l10 20-10 20M60 115l-10 20 10 20M140 115l10 20-10 20" stroke="currentColor" strokeWidth="0.3" className="text-emerald" />
                      <path d="M20 45l30 10-30 10M180 45l-30 10 30 10M20 85l30 10-30 10M180 85l-30 10 30 10" stroke="currentColor" strokeWidth="0.3" className="text-emerald" />
                    </svg>

                    {/* Centered item display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div className="text-center">
                        <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-gold shadow-card">
                          <img
                            src="assets/images(1).jpg"
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="mt-2 font-display text-lg font-semibold text-forest">
                          Batik Tulis
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-gold">
                          Pekalongan
                        </p>
                      </div>
                    </div>

                    {/* 360 badge */}
                    <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-forest/50 text-[10px] font-bold text-white backdrop-blur-sm">
                      360
                    </span>
                  </div>
                </div>
              </div>

              {/* Result details */}
              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="rounded-lg border border-ink/6 bg-surface/60 p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-ink/45">
                    Confidence
                  </p>
                  <p className="mt-1 text-lg font-bold tabular-nums text-ink">98.5%</p>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink/8">
                    <div className="ai-accent-bar h-full w-[98%] rounded-full" />
                  </div>
                </div>
                <div className="rounded-lg border border-gold/20 bg-gold/8 p-3">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-ink/45">
                    Points
                  </p>
                  <p className="mt-1 text-gradient-gold text-lg font-bold tabular-nums">
                    480
                  </p>
                  <p className="text-[9px] uppercase tracking-wider text-gold/70">EcoSwap Points</p>
                </div>
                <div className="col-span-2 rounded-lg border border-emerald/20 bg-emerald/5 p-3 text-center">
                  <span className="inline-flex rounded-full border border-emerald/25 bg-emerald/12 px-3 py-1 text-[10px] font-semibold text-forest">
                    High Heritage Value · Role: Cultural Artifact
                  </span>
                </div>
              </div>

              {/* Footer */}
              <p className="border-t border-ink/6 px-4 py-2.5 text-center text-[9px] text-ink/40">
                Pipeline CNN · role-based classification · 360° Pannellum panorama
              </p>
            </div>

            {/* Floating decorative dots */}
            <div className="absolute -right-3 -top-3 h-6 w-6 rounded-full border border-gold/30 bg-gold/10" />
            <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-emerald/15" />
          </div>
        </div>
      </div>
    </section>
  );
}
