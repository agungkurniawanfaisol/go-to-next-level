import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-forest/20 bg-forest py-12 text-ivory/85">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
        <div className="text-center md:text-left">
          <p className="font-display text-lg font-semibold text-ivory">EcoSwap</p>
          <p className="mt-1 text-sm text-ivory/55">
            AI-Driven Digital Cultural Stewardship
          </p>
          <p className="mt-2 text-xs text-emerald-light/80">
            CNN × Heritage × Circular Economy × 360° View
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-6 text-sm"
        >
          <Link href="/#beranda" className="transition-colors hover:text-gold-light">
            Beranda
          </Link>
          <Link href="/#inovasi" className="transition-colors hover:text-gold-light">
            Inovasi
          </Link>
          <Link href="/#cara-kerja" className="transition-colors hover:text-gold-light">
            Cara Kerja
          </Link>
          <Link href="/#alur-cnn" className="transition-colors hover:text-gold-light">
            Alur CNN
          </Link>
          <Link href="/appraisal" className="transition-colors hover:text-gold-light">
            AI Appraisal
          </Link>
        </nav>
        <p className="text-center text-xs text-ivory/45 md:text-right">
          © {new Date().getFullYear()} EcoSwap
          <br />
          Demo interaktif untuk penilaian juri
        </p>
      </div>
    </footer>
  );
}
