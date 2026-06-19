import { SectionShell } from "./SectionShell";

interface HeritageItem {
  name: string;
  region: string;
  tag: string;
  gradient: string;
  imageSrc: string;
  description: string;
}

const heritageItems: HeritageItem[] = [
  {
    name: "Batik Tulis",
    region: "Pekalongan",
    tag: "Tekstil",
    gradient: "from-amber-800/20 via-amber-600/10 to-amber-900/20",
    imageSrc: "/assets/images(1).jpg",
    description: "Motif klasik yang diakui UNESCO — dilestarikan lewat sirkulasi digital",
  },
  {
    name: "Keramik Tradisional",
    region: "Jawa Tengah",
    tag: "Kerajinan",
    gradient: "from-stone-700/20 via-rose-600/10 to-stone-800/20",
    imageSrc: "/assets/gambar_keramik(2).png",
    description: "Gerabah & porselen dengan teknik turun-temurun dari Kasongan",
  },
  {
    name: "Ukiran Kayu",
    region: "Jepara",
    tag: "Seni Pasif",
    gradient: "from-amber-900/20 via-orange-700/10 to-stone-800/20",
    imageSrc: "/assets/gambar_ukiran.jpg",
    description: "Relief & patung kayu jati — mahakarya dari Jepara sejak abad ke-16",
  },
  {
    name: "Tenun Ikat",
    region: "Nusa Tenggara",
    tag: "Tekstil",
    gradient: "from-rose-800/20 via-violet-600/10 to-rose-900/20",
    imageSrc: "/assets/gambar_tenunan.jpg",
    description: "Benang diwarnai & ditenun manual — setiap motif punya makna filosofis",
  },
];

// const REGION_EMOJIS: Record<string, string> = {
//   Pekalongan: "🦅",
//   "Jawa Tengah": "🏺",
//   Jepara: "🪵",
//   "Nusa Tenggara": "🧶",
// };

export function WarisanSection() {
  return (
    <SectionShell
      id="warisan"
      eyebrow="Warisan"
      title="Lestarikan Budaya Lewat Circular Economy"
      description="Setiap barang yang diswap membantu dokumentasi dan apresiasi warisan lokal secara digital."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {heritageItems.map((item) => (
            <article
              key={item.name}
              className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-elevated"
            >
              {/* Decorative header with image */}
              <div
                className={`relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br ${item.gradient}`}
              >
                <img
                  src={item.imageSrc}
                  alt={item.name}
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Base layer */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,rgba(255,255,255,0.08)_0%,transparent_70%)]" />
                {/* Heritage icon */}
                {/* <span aria-hidden="true" className="relative z-10 text-5xl opacity-60 transition-all duration-500 group-hover:scale-110 group-hover:opacity-90">
                  {REGION_EMOJIS[item.region] || "🏺"}
                </span> */}
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
        ))}
      </div>
    </SectionShell>
  );
}
