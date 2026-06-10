"use client";

import Link from "next/link";
import { CoinPointsIcon } from "@/components/appraisal/ai-work-icons";

/** Kelas bersama agar poin terbaca di light & dark */
const pointsShell =
  "border-gold/30 bg-gradient-to-r from-gold/12 to-surface/90 shadow-card " +
  "dark:border-gold/50 dark:from-gold/30 dark:to-gold/15 dark:shadow-[0_0_14px_rgba(212,168,30,0.22)]";

const pointsNumber = "text-forest dark:text-gold-light";

const iconWrap =
  "bg-forest/10 text-gold dark:bg-gold/25 dark:text-gold-light";

type HeaderPointsBadgeProps = {
  points: number;
  variant?: "inline" | "compact" | "menu";
  className?: string;
};

export function HeaderPointsBadge({
  points,
  variant = "inline",
  className = "",
}: HeaderPointsBadgeProps) {
  const formatted = points.toLocaleString("id-ID");
  const label = `EcoSwap Points: ${formatted}`;

  if (variant === "menu") {
    return (
      <Link
        href="/barter/saya"
        className={`flex items-center gap-4 rounded-xl border border-ink/10 bg-surface px-4 py-3.5 transition-colors hover:border-forest/20 hover:bg-forest/[0.03] dark:border-gold/35 dark:bg-gold/12 dark:hover:border-gold/50 dark:hover:bg-gold/18 ${className}`}
        aria-label={`${label}. Buka dashboard.`}
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}
        >
          <CoinPointsIcon className="h-5 w-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-medium text-ink/50 dark:text-gold-light/80">
            EcoSwap Points Anda
          </span>
          <span
            className={`mt-0.5 block font-display text-2xl font-semibold tabular-nums tracking-tight ${pointsNumber}`}
          >
            {formatted}
          </span>
        </span>
        <span className="shrink-0 text-xs font-medium text-ink/40 dark:text-gold/90">
          Dashboard →
        </span>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link
        href="/barter/saya"
        className={`flex h-9 items-center gap-1.5 rounded-full border px-2.5 transition-colors hover:border-gold/45 hover:from-gold/18 ${pointsShell} ${className}`}
        aria-label={label}
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${iconWrap}`}
        >
          <CoinPointsIcon className="h-3.5 w-3.5" />
        </span>
        <span className={`text-sm font-bold tabular-nums ${pointsNumber}`}>
          {formatted}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/barter/saya"
      className={`group flex h-9 shrink-0 items-center gap-2 rounded-full border py-0 pl-1 pr-3 transition-colors hover:border-gold/45 hover:from-gold/18 ${pointsShell} ${className}`}
      aria-label={`${label}. Buka dashboard.`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors group-hover:bg-forest/15 dark:group-hover:bg-gold/35 ${iconWrap}`}
      >
        <CoinPointsIcon className="h-3.5 w-3.5" />
      </span>
      <span className="flex items-baseline gap-1 leading-none">
        <span className={`text-sm font-bold tabular-nums ${pointsNumber}`}>
          {formatted}
        </span>
        <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-gold/90 dark:text-gold sm:inline">
          pts
        </span>
      </span>
    </Link>
  );
}
