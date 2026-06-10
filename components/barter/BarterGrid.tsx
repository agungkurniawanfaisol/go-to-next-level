"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { BarterItemCard } from "@/components/barter/BarterItemCard";
import type { BarterListing } from "@/lib/api/barter";

const ITEMS_PER_PAGE = 9;
const LOAD_MORE_COUNT = 6;

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

type SortKey = "all" | "heritage" | "recent" | "points-high" | "points-low";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "heritage", label: "Heritage tinggi" },
  { key: "points-high", label: "Poin tertinggi" },
  { key: "points-low", label: "Poin terendah" },
  { key: "recent", label: "Terbaru" },
];

type CategoryKey = "all" | "heritage" | "elektronik" | "kendaraan" | "lainnya";

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "Semua kategori" },
  { key: "heritage", label: "Warisan" },
  { key: "elektronik", label: "Elektronik" },
  { key: "kendaraan", label: "Kendaraan" },
  { key: "lainnya", label: "Lainnya" },
];

type BarterGridProps = {
  listings: BarterListing[];
};

function isHighHeritage(role: string): boolean {
  return role.toLowerCase().includes("high heritage");
}

function detectCategory(listing: BarterListing): CategoryKey {
  const name = listing.detectedObject.toLowerCase();
  const role = listing.roleClassification.toLowerCase();

  // Heritage: role atau keywords
  if (
    role.includes("high heritage") ||
    role.includes("medium heritage") ||
    /\b(batik|tenun|songket|ukir|keramik|anyaman|tulis|ikat|palembang|jepara|kasongan|sumba|tasikmalaya)\b/.test(name)
  ) {
    return "heritage";
  }

  // Elektronik
  if (
    /\b(elektronik|blender|tv|televisi|laptop|komputer|hp|smartphone|radio|kulkas|mesin cuci|charger|kabel)\b/.test(name)
  ) {
    return "elektronik";
  }

  // Kendaraan
  if (
    /\b(mobil|motor|sepeda|kendaraan|komuter|sedan|truk|bus|vespa|skuter|bike)\b/.test(name)
  ) {
    return "kendaraan";
  }

  return "lainnya";
}

export function BarterGrid({ listings }: BarterGridProps) {
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortKey>("all");
  const [category, setCategory] = useState<CategoryKey>(
    (searchParams.get("kategori") as CategoryKey) ?? "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prevFilterKeyRef = useRef("");

  // Scroll progress + scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setShowScrollTop(scrollTop > 400);
      setScrollProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = useMemo(() => {
    let items = [...listings];

    // Text search: nama barang atau kota pemilik
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (l) =>
          l.detectedObject.toLowerCase().includes(q) ||
          (l.ownerCity ?? "").toLowerCase().includes(q) ||
          (l.ownerName ?? "").toLowerCase().includes(q),
      );
    }

    // Category filter
    if (category !== "all") {
      items = items.filter((l) => detectCategory(l) === category);
    }

    // Sort
    if (sort === "heritage") {
      items = items.filter((l) => isHighHeritage(l.roleClassification));
    }

    if (sort === "points-high") {
      items.sort((a, b) => b.ecoSwapPoints - a.ecoSwapPoints);
    }

    if (sort === "points-low") {
      items.sort((a, b) => a.ecoSwapPoints - b.ecoSwapPoints);
    }

    if (sort === "recent") {
      items.sort(
        (a, b) =>
          new Date(b.publishedAt ?? b.createdAt).getTime() -
          new Date(a.publishedAt ?? a.createdAt).getTime(),
      );
    }

    return items;
  }, [listings, sort, category, searchQuery]);

  // Compute a stable key to detect filter changes
  const filterKey = `${sort}-${category}-${searchQuery}`;

  // Reset pagination when filters change
  useEffect(() => {
    if (prevFilterKeyRef.current !== filterKey) {
      prevFilterKeyRef.current = filterKey;
      setVisibleCount(ITEMS_PER_PAGE);
    }
  }, [filterKey]);

  // IntersectionObserver: load more when sentinel is visible
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filtered.length) {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filtered.length));
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const hasMore = visibleCount < filtered.length;
  const displayedItems = filtered.slice(0, visibleCount);

  return (
    <div>
      {/* Scroll progress bar */}
      <div
        className="fixed left-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-forest via-emerald to-emerald-light transition-[width] duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress membaca halaman"
      />

      {/* Search bar */}
      <div className="relative mb-4">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari barang atau kota..."
          aria-label="Cari barang barter"
          className="w-full rounded-xl border border-ink/15 bg-surface py-2.5 pl-11 pr-10 text-sm text-ink transition-colors placeholder:text-ink/35 focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Hapus pencarian"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink/30 transition-colors hover:text-ink/60"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters row: category dropdown + sort buttons */}
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        {/* Category dropdown */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryKey)}
          aria-label="Filter kategori"
          className="rounded-lg border border-ink/15 bg-surface px-3 py-1.5 text-sm text-ink transition-colors focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
        >
          {CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Sort buttons */}
        <div className="flex flex-wrap gap-2">
          {SORTS.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setSort(s.key)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                sort === s.key
                  ? "border-forest bg-forest text-ivory"
                  : "border-ink/15 bg-surface text-ink/65 hover:border-emerald hover:text-forest"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="mt-5 text-sm text-ink/55">
        {searchQuery.trim() || category !== "all" || sort !== "all"
          ? `${filtered.length} dari ${listings.length} barang ditemukan`
          : `${listings.length} barang tersedia`}
        {hasMore && (
          <span className="ml-2 text-xs text-ink/40">
            (menampilkan {visibleCount})
          </span>
        )}
      </p>

      {filtered.length === 0 ? (
        <div className="glass-panel mt-6 rounded-2xl p-12 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            {searchQuery.trim()
              ? `Tidak ditemukan "${searchQuery}"`
              : "Belum ada barang di marketplace"}
          </p>
          <p className="mt-2 text-sm text-ink/60">
            {searchQuery.trim()
              ? "Coba ubah kata kunci pencarian."
              : "Upload barang di AI Appraisal lalu publikasikan ke list barter."}
          </p>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {displayedItems.map((listing) => (
              <motion.div key={listing.id} variants={cardVariants}>
                <BarterItemCard listing={listing} />
              </motion.div>
            ))}
          </motion.div>

          {/* Sentinel for IntersectionObserver */}
          <div ref={sentinelRef} className="h-4" />

          {/* Load More button (fallback for when observer doesn't fire) */}
          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((prev) =>
                    Math.min(prev + LOAD_MORE_COUNT, filtered.length),
                  )
                }
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-surface px-8 py-3 text-sm font-medium text-ink/70 transition-all hover:border-emerald hover:text-forest hover:shadow-sm"
              >
                Muat lebih banyak
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* Scroll-to-top button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke atas"
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-ivory/90 text-ink/60 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-emerald/40 hover:bg-emerald/10 hover:text-emerald hover:shadow-xl ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
