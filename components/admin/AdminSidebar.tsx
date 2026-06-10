"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavLink = {
  kind: "link";
  href: string;
  label: string;
  icon: string;
  external?: boolean;
};

type NavGroup = {
  kind: "group";
  label: string;
  icon: string;
  children: { href: string; label: string; external?: boolean }[];
};

type NavEntry = NavLink | NavGroup;

const navTree: NavEntry[] = [
  {
    kind: "link",
    href: "/admin",
    label: "Dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    kind: "group",
    label: "Barter",
    icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    children: [
      { href: "/admin/barter", label: "List Barter" },
      { href: "/admin/barter/permintaan", label: "Permintaan" },
      { href: "/admin/barter/selesai", label: "Selesai" },
      { href: "/barter/riwayat", label: "Komunitas", external: true },
    ],
  },
  {
    kind: "link",
    href: "/admin/appraisals",
    label: "Log Appraisal",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    kind: "link",
    href: "/admin/heritage",
    label: "Katalog Warisan",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  },
  {
    kind: "link",
    href: "/admin/users",
    label: "Pengguna",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    kind: "link",
    href: "/admin/settings",
    label: "Pengaturan",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

function isBarterPath(pathname: string): boolean {
  return (
    pathname === "/admin/barter" ||
    pathname.startsWith("/admin/barter/") ||
    pathname === "/barter/riwayat" ||
    pathname.startsWith("/barter/riwayat/")
  );
}

function isChildActive(pathname: string, href: string): boolean {
  if (href === "/admin/barter") return pathname === "/admin/barter";
  if (href === "/barter/riwayat") {
    return (
      pathname === "/barter/riwayat" ||
      pathname.startsWith("/barter/riwayat/")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ d }: { d: string }) {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
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

function NavGroupItem({
  group,
  pathname,
  onNavigate,
}: {
  group: NavGroup;
  pathname: string;
  onNavigate?: () => void;
}) {
  const groupActive = isBarterPath(pathname);
  const [open, setOpen] = useState(groupActive);

  useEffect(() => {
    if (groupActive) setOpen(true);
  }, [groupActive]);

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
          groupActive
            ? "bg-ivory/10 text-ivory"
            : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
        }`}
      >
        <NavIcon d={group.icon} />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul className="mt-0.5 space-y-0.5 border-l border-ivory/15 ml-5 pl-3">
          {group.children.map((child) => {
            const active = isChildActive(pathname, child.href);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-emerald font-medium text-ivory"
                      : "text-ivory/60 hover:bg-ivory/10 hover:text-ivory"
                  }`}
                >
                  {child.label}
                  {child.external && (
                    <svg
                      className="h-3 w-3 shrink-0 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="border-b border-ivory/10 px-5 py-6">
        <Link href="/admin" className="block" onClick={onNavigate}>
          <span className="text-lg font-bold tracking-tight text-ivory">
            EcoSwap
          </span>
          <span className="mt-0.5 block text-xs text-ivory/50">
            Admin Panel
          </span>
        </Link>
      </div>

      <nav
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
        aria-label="Admin navigation"
      >
        {navTree.map((entry) => {
          if (entry.kind === "group") {
            return (
              <NavGroupItem
                key={entry.label}
                group={entry}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            );
          }

          const isActive =
            entry.href === "/admin"
              ? pathname === "/admin"
              : pathname === entry.href ||
                pathname.startsWith(`${entry.href}/`);

          return (
            <Link
              key={entry.href}
              href={entry.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald text-ivory"
                  : "text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
              }`}
            >
              <NavIcon d={entry.icon} />
              {entry.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-ivory/10 p-4">
        <Link
          href="/appraisal"
          prefetch={false}
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ivory/60 hover:bg-ivory/10 hover:text-ivory"
        >
          AI Appraisal (Publik)
        </Link>
        <Link
          href="/"
          prefetch={false}
          onClick={onNavigate}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gold-light/90 hover:bg-ivory/10 hover:text-gold-light"
        >
          ← Kembali ke Situs
        </Link>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <button
        type="button"
        aria-label={mobileOpen ? "Tutup sidebar" : "Buka sidebar"}
        aria-expanded={mobileOpen}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 bg-ivory text-ink shadow-card backdrop-blur-md lg:hidden"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          {mobileOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-64 flex flex-col border-r border-ink/8 bg-ink text-ivory lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[80vw] flex-col bg-ink text-ivory shadow-elevated">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
