import { SectionShell } from "./SectionShell";

interface HeritageItem {
  name: string;
  region: string;
  tag: string;
  gradient: string;
  pattern: "dots" | "diamonds" | "lines" | "waves";
  description: string;
}

const heritageItems: HeritageItem[] = [
  {
    name: "Batik Tulis",
    region: "Pekalongan",
    tag: "Tekstil",
    gradient: "from-amber-800/20 via-amber-600/10 to-amber-900/20",
    pattern: "dots",
    description: "Motif klasik yang diakui UNESCO — dilestarikan lewat sirkulasi digital",
  },
  {
    name: "Keramik Tradisional",
    region: "Jawa Tengah",
    tag: "Kerajinan",
    gradient: "from-stone-700/20 via-rose-600/10 to-stone-800/20",
    pattern: "diamonds",
    description: "Gerabah & porselen dengan teknik turun-temurun dari Kasongan",
  },
  {
    name: "Ukiran Kayu",
    region: "Jepara",
    tag: "Seni Pasif",
    gradient: "from-amber-900/20 via-orange-700/10 to-stone-800/20",
    pattern: "lines",
    description: "Relief & patung kayu jati — mahakarya dari Jepara sejak abad ke-16",
  },
  {
    name: "Tenun Ikat",
    region: "Nusa Tenggara",
    tag: "Tekstil",
    gradient: "from-rose-800/20 via-violet-600/10 to-rose-900/20",
    pattern: "waves",
    description: "Benang diwarnai & ditenun manual — setiap motif punya makna filosofis",
  },
];

function PatternDots() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 200 150" fill="none">
      <circle cx="20" cy="20" r="2" fill="currentColor" />
      <circle cx="60" cy="20" r="2" fill="currentColor" />
      <circle cx="100" cy="20" r="2" fill="currentColor" />
      <circle cx="140" cy="20" r="2" fill="currentColor" />
      <circle cx="180" cy="20" r="2" fill="currentColor" />
      <circle cx="40" cy="50" r="2" fill="currentColor" />
      <circle cx="80" cy="50" r="2" fill="currentColor" />
      <circle cx="120" cy="50" r="2" fill="currentColor" />
      <circle cx="160" cy="50" r="2" fill="currentColor" />
      <circle cx="20" cy="80" r="2" fill="currentColor" />
      <circle cx="60" cy="80" r="2" fill="currentColor" />
      <circle cx="100" cy="80" r="2" fill="currentColor" />
      <circle cx="140" cy="80" r="2" fill="currentColor" />
      <circle cx="180" cy="80" r="2" fill="currentColor" />
      <circle cx="40" cy="110" r="2" fill="currentColor" />
      <circle cx="80" cy="110" r="2" fill="currentColor" />
      <circle cx="120" cy="110" r="2" fill="currentColor" />
      <circle cx="160" cy="110" r="2" fill="currentColor" />
      <circle cx="20" cy="140" r="2" fill="currentColor" />
      <circle cx="60" cy="140" r="2" fill="currentColor" />
      <circle cx="100" cy="140" r="2" fill="currentColor" />
      <circle cx="140" cy="140" r="2" fill="currentColor" />
      <circle cx="180" cy="140" r="2" fill="currentColor" />
    </svg>
  );
}

function PatternDiamonds() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 200 150" fill="none">
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={col * 40 + 10}
            y={row * 30 + 10}
            width={20}
            height={20}
            rx={4}
            transform={`rotate(45 ${col * 40 + 20} ${row * 30 + 20})`}
            fill="currentColor"
            className="text-ink"
          />
        )),
      )}
    </svg>
  );
}

function PatternLines() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 200 150" fill="none">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line
          key={i}
          x1={0}
          y1={i * 20}
          x2={200}
          y2={i * 20 + 10}
          stroke="currentColor"
          strokeWidth={0.5}
          className="text-ink"
        />
      ))}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line
          key={`v-${i}`}
          x1={i * 25}
          y1={0}
          x2={i * 25 + 5}
          y2={150}
          stroke="currentColor"
          strokeWidth={0.5}
          className="text-ink"
        />
      ))}
    </svg>
  );
}

function PatternWaves() {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 200 150" fill="none">
      {[0, 1, 2, 3, 4].map((row) => (
        <path
          key={row}
          d={`M0 ${row * 30 + 15} Q25 ${row * 30} 50 ${row * 30 + 15} T100 ${row * 30 + 15} T150 ${row * 30 + 15} T200 ${row * 30 + 15}`}
          stroke="currentColor"
          strokeWidth={0.8}
          fill="none"
          className="text-ink"
        />
      ))}
    </svg>
  );
}

const patternComponents: Record<string, React.ComponentType> = {
  dots: PatternDots,
  diamonds: PatternDiamonds,
  lines: PatternLines,
  waves: PatternWaves,
};

const REGION_EMOJIS: Record<string, string> = {
  Pekalongan: "🦅",
  "Jawa Tengah": "🏺",
  Jepara: "🪵",
  "Nusa Tenggara": "🧶",
};

export function WarisanSection() {
  return (
    <SectionShell
      id="warisan"
      eyebrow="Warisan"
      title="Lestarikan Budaya Lewat Circular Economy"
      description="Setiap barang yang diswap membantu dokumentasi dan apresiasi warisan lokal secara digital."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {heritageItems.map((item) => {
          const PatternComp = patternComponents[item.pattern];
          return (
            <article
              key={item.name}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-elevated"
            >
              {/* Decorative header with pattern */}
              <div
                className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${item.gradient}`}
              >
                {/* Base layer */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,rgba(255,255,255,0.15)_0%,transparent_70%)]" />
                {/* SVG pattern */}
                <div className="text-forest/30">
                  <PatternComp />
                </div>
                {/* Heritage icon */}
                <span aria-hidden="true" className="relative z-10 text-5xl opacity-60 transition-all duration-500 group-hover:scale-110 group-hover:opacity-90">
                  {REGION_EMOJIS[item.region] || "🏺"}
                </span>
                {/* Corner accent */}
                <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-forest/10 transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2" />
              </div>

              {/* Content */}
              <div className="relative border-x border-b border-ink/8 bg-surface/90 px-5 pb-5 pt-4 backdrop-blur-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold/50" />
                  {item.tag}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                  {item.name}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-ink/60">{item.region}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink/50">
                  {item.description}
                </p>
              </div>

              {/* Hover gradient overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-gold/20 transition-opacity duration-500 group-hover:opacity-100" />
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
