"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderPointsBadge } from "@/components/HeaderPointsBadge";

type ThemeToggleProps = {
  darkMode: boolean;
  onToggle: () => void;
  sunIcon: ReactNode;
  moonIcon: ReactNode;
  className?: string;
};

export function HeaderThemeToggle({
  darkMode,
  onToggle,
  sunIcon,
  moonIcon,
  className = "",
}: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={darkMode ? "Mode terang" : "Mode gelap"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/12 bg-surface text-ink/55 shadow-card transition-colors hover:border-gold/35 hover:text-gold ${className}`}
    >
      {darkMode ? sunIcon : moonIcon}
    </button>
  );
}

/** Desktop (lg+): poin · tema · profil · keluar — item terpisah, tidak digabung satu kotak */
export function HeaderLoggedInDesktop({
  userName,
  totalPoints,
  darkMode,
  onToggleDark,
  sunIcon,
  moonIcon,
}: {
  userName: string;
  totalPoints: number;
  darkMode: boolean;
  onToggleDark: () => void;
  sunIcon: ReactNode;
  moonIcon: ReactNode;
}) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="hidden items-center gap-2.5 lg:flex">
      <HeaderPointsBadge points={totalPoints} variant="inline" />

      <HeaderThemeToggle
        darkMode={darkMode}
        onToggle={onToggleDark}
        sunIcon={sunIcon}
        moonIcon={moonIcon}
      />

      <div className="flex items-center rounded-full border border-ink/10 bg-surface/80 p-0.5 pl-0.5 pr-1 shadow-card">
        <Link
          href="/barter/saya"
          className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-2 transition-colors hover:bg-forest/[0.05]"
          title="Dashboard Saya"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/12 font-display text-sm font-bold text-forest">
            {initial}
          </span>
          <span className="max-w-[5.5rem] truncate text-sm font-medium text-ink xl:max-w-[8rem]">
            {userName}
          </span>
        </Link>
        <span className="mx-0.5 h-4 w-px shrink-0 bg-ink/12" aria-hidden />
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="rounded-full px-2.5 py-1.5 text-xs font-medium text-ink/50 transition-colors hover:text-red-600"
          >
            Keluar
          </button>
        </form>
      </div>
    </div>
  );
}

/** Tablet/mobile header: poin ringkas + hamburger dalam satu grup kanan */
export function HeaderLoggedInMobileBar({
  totalPoints,
  menuOpen,
  onMenuToggle,
  menuLabel,
}: {
  totalPoints: number;
  menuOpen: boolean;
  onMenuToggle: () => void;
  menuLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 lg:hidden">
      <HeaderPointsBadge points={totalPoints} variant="compact" />
      <button
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuLabel}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink/5"
        onClick={onMenuToggle}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden
        >
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>
    </div>
  );
}

/** Isi bawah menu mobile setelah link navigasi */
export function HeaderAccountMobileFooter({
  userName,
  totalPoints,
  darkMode,
  onToggleDark,
  sunIcon,
  moonIcon,
}: {
  userName: string;
  totalPoints: number;
  darkMode: boolean;
  onToggleDark: () => void;
  sunIcon: ReactNode;
  moonIcon: ReactNode;
}) {
  const initial = userName.charAt(0).toUpperCase();

  return (
    <div className="mt-4 space-y-3 border-t border-ink/8 pt-4">
      <HeaderPointsBadge points={totalPoints} variant="menu" className="w-full" />

      <div className="flex items-center gap-3">
        <Link
          href="/barter/saya"
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-ink/10 bg-surface/80 p-3 transition-colors hover:border-forest/20"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest/12 font-display text-base font-bold text-forest">
            {initial}
          </span>
          <span className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{userName}</p>
            <p className="text-xs text-ink/45">Dashboard Saya</p>
          </span>
        </Link>

        <HeaderThemeToggle
          darkMode={darkMode}
          onToggle={onToggleDark}
          sunIcon={sunIcon}
          moonIcon={moonIcon}
        />

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="h-10 shrink-0 rounded-xl border border-ink/10 px-3 text-xs font-medium text-ink/55 transition-colors hover:border-red-200 hover:text-red-600"
          >
            Keluar
          </button>
        </form>
      </div>
    </div>
  );
}

/** Tamu: desktop */
export function HeaderGuestDesktop({
  darkMode,
  onToggleDark,
  sunIcon,
  moonIcon,
}: {
  darkMode: boolean;
  onToggleDark: () => void;
  sunIcon: ReactNode;
  moonIcon: ReactNode;
}) {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <HeaderThemeToggle
        darkMode={darkMode}
        onToggle={onToggleDark}
        sunIcon={sunIcon}
        moonIcon={moonIcon}
      />
      <Link
        href="/masuk"
        className="rounded-full border border-ink/15 px-5 py-2 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold"
      >
        Masuk
      </Link>
    </div>
  );
}

/** Tamu: mobile hamburger saja (tema + masuk di drawer) */
export function HeaderGuestMobileMenuButton({
  menuOpen,
  onMenuToggle,
  menuLabel,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  menuLabel: string;
}) {
  return (
    <button
      type="button"
      aria-expanded={menuOpen}
      aria-controls="mobile-menu"
      aria-label={menuLabel}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink transition-colors hover:bg-ink/5 lg:hidden"
      onClick={onMenuToggle}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        {menuOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}
