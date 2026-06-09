"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  HeaderAccountMobileFooter,
  HeaderGuestDesktop,
  HeaderGuestMobileMenuButton,
  HeaderLoggedInDesktop,
  HeaderLoggedInMobileBar,
  HeaderThemeToggle,
} from "@/components/HeaderAccountBar";
import { useSessionProfile } from "@/hooks/useSessionUser";

type NavChild = {
  href: string;
  label: string;
  description?: string;
};

type NavEntry =
  | { kind: "link"; href: string; label: string }
  | { kind: "group"; label: string; children: NavChild[] };

const navTree: NavEntry[] = [
  { kind: "link", href: "/", label: "Beranda" },
  {
    kind: "group",
    label: "Barter",
    children: [
      { href: "/barter", label: "List Barter", description: "Barang siap ditukar" },
      { href: "/barter/saya", label: "Dashboard Saya", description: "Poin, barang, & proposal" },
      { href: "/barter/permintaan", label: "Permintaan Saya", description: "Ajuan & respons" },
      {
        href: "/barter/riwayat",
        label: "Komunitas Barter",
        description: "Orang & barang yang sudah ditukar",
      },
      { href: "/barter/stats", label: "Statistik", description: "Ringkasan komunitas" },
    ],
  },
  { kind: "link", href: "/appraisal", label: "AI Appraisal" },
  {
    kind: "group",
    label: "Info",
    children: [
      { href: "/demo", label: "Panduan Demo", description: "Alur presentasi untuk juri" },
      { href: "/#inovasi", label: "Inovasi" },
      { href: "/#alur-cnn", label: "Alur CNN" },
      { href: "/#tentang", label: "Tentang" },
    ],
  },
];

function EcoSwapIcon() {
  return (
    <div
      aria-hidden
      className="h-5 w-5 text-gold"
      // viewBox="0 0 24 24"
      // fill="none"
      // stroke="currentColor"
      // strokeWidth="1.5"
    >
      <img src="assets/logo.png"/>
    </div>
  );
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function isGroupActive(pathname: string, children: NavChild[]): boolean {
  return children.some(
    (c) =>
      c.href.startsWith("/") &&
      !c.href.includes("#") &&
      (pathname === c.href || pathname.startsWith(`${c.href}/`)),
  );
}

function NavDropdown({
  label,
  items,
  pathname,
}: {
  label: string;
  items: NavChild[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = isGroupActive(pathname, items);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
          active || open ? "text-forest" : "text-ink/65 hover:text-forest"
        }`}
      >
        {label}
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 min-w-[220px] overflow-hidden rounded-xl border border-ink/10 bg-ivory py-1.5 shadow-elevated"
        >
          {items.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 transition-colors hover:bg-forest/5"
            >
              <span className="block text-sm font-medium text-ink">{child.label}</span>
              {child.description && (
                <span className="mt-0.5 block text-xs text-ink/50">
                  {child.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: NavChild[];
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(isGroupActive(pathname, items));

  return (
    <li>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between py-2 text-sm font-semibold text-ink"
      >
        {label}
        <ChevronIcon open={expanded} />
      </button>
      {expanded && (
        <ul className="mb-2 ml-3 space-y-0.5 border-l border-ink/10 pl-3">
          {items.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className="block py-2 text-sm text-ink/70 hover:text-forest"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export function Header({
  userName: initialUserName,
  totalPoints: initialTotalPoints,
}: {
  userName?: string | null;
  totalPoints?: number | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { name: userName, totalPoints } = useSessionProfile({
    name: initialUserName,
    totalPoints: initialTotalPoints,
  });

  useEffect(() => {
    const stored = localStorage.getItem("ecoswap-dark");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored !== null ? stored === "true" : prefersDark;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ecoswap-dark", String(next));
  };

  const isLoggedIn = !!userName && totalPoints != null;
  const menuLabel = mobileOpen ? "Tutup menu" : "Buka menu";

  const navLinks = (
    <>
      {navTree.map((entry) => {
        if (entry.kind === "link") {
          const isActive =
            entry.href === "/"
              ? pathname === "/"
              : pathname === entry.href || pathname.startsWith(`${entry.href}/`);
          return (
            <Link
              key={entry.href}
              href={entry.href}
              className={`text-sm font-medium transition-colors ${
                isActive ? "text-forest" : "text-ink/65 hover:text-forest"
              }`}
            >
              {entry.label}
            </Link>
          );
        }
        return (
          <NavDropdown
            key={entry.label}
            label={entry.label}
            items={entry.children}
            pathname={pathname}
          />
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto h-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {/* Kiri: logo */}
          <div className="flex justify-start">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-forest transition-colors hover:text-emerald"
            >
              <EcoSwapIcon />
              <span className="text-lg font-semibold tracking-tight">EcoSwap</span>
            </Link>
          </div>

          {/* Tengah: navigasi desktop */}
          <nav
            aria-label="Navigasi utama"
            className="hidden items-center justify-center gap-5 lg:flex lg:gap-6 xl:gap-7"
          >
            {navLinks}
          </nav>

          {/* Kanan: aksi akun / tamu */}
          <div className="flex items-center justify-end">
            {isLoggedIn ? (
              <>
                <HeaderLoggedInDesktop
                  userName={userName}
                  totalPoints={totalPoints}
                  darkMode={darkMode}
                  onToggleDark={toggleDark}
                  sunIcon={<SunIcon />}
                  moonIcon={<MoonIcon />}
                />
                <HeaderLoggedInMobileBar
                  totalPoints={totalPoints}
                  menuOpen={mobileOpen}
                  onMenuToggle={() => setMobileOpen((o) => !o)}
                  menuLabel={menuLabel}
                />
              </>
            ) : (
              <>
                <HeaderGuestDesktop
                  darkMode={darkMode}
                  onToggleDark={toggleDark}
                  sunIcon={<SunIcon />}
                  moonIcon={<MoonIcon />}
                />
                <HeaderGuestMobileMenuButton
                  menuOpen={mobileOpen}
                  onMenuToggle={() => setMobileOpen((o) => !o)}
                  menuLabel={menuLabel}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-menu"
          aria-label="Navigasi mobile"
          className="border-t border-ink/8 bg-ivory px-6 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navTree.map((entry) => {
              if (entry.kind === "link") {
                return (
                  <li key={entry.href}>
                    <Link
                      href={entry.href}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-sm font-medium text-ink/75 hover:text-forest"
                    >
                      {entry.label}
                    </Link>
                  </li>
                );
              }
              return (
                <MobileNavGroup
                  key={entry.label}
                  label={entry.label}
                  items={entry.children}
                  pathname={pathname}
                  onNavigate={() => setMobileOpen(false)}
                />
              );
            })}
            {isLoggedIn ? (
              <li>
                <HeaderAccountMobileFooter
                  userName={userName}
                  totalPoints={totalPoints}
                  darkMode={darkMode}
                  onToggleDark={toggleDark}
                  sunIcon={<SunIcon />}
                  moonIcon={<MoonIcon />}
                />
              </li>
            ) : (
              <li className="mt-4 flex items-center justify-between gap-3 border-t border-ink/8 pt-4">
                <HeaderThemeToggle
                  darkMode={darkMode}
                  onToggle={toggleDark}
                  sunIcon={<SunIcon />}
                  moonIcon={<MoonIcon />}
                />
                <Link
                  href="/masuk"
                  className="rounded-full border border-ink/15 px-5 py-2 text-sm font-medium text-ink hover:border-gold hover:text-gold"
                  onClick={() => setMobileOpen(false)}
                >
                  Masuk
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
