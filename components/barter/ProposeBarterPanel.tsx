"use client";

import Link from "next/link";
import { barterAjukanPath } from "@/lib/barter/ajukan-path";
import type { AppraisalSummary } from "@/lib/api/barter-proposals";

type ProposeBarterPanelProps = {
  requestedAppraisalId: string;
  requestedTitle: string;
  requestedOwner: string;
  requestedPoints: number;
  requestedImagePath?: string | null;
  myItems: AppraisalSummary[];
  isLoggedIn: boolean;
  isOwnListing?: boolean;
  sessionStale?: boolean;
};

export function ProposeBarterPanel({
  requestedAppraisalId,
  myItems,
  isLoggedIn,
  isOwnListing = false,
  sessionStale = false,
}: ProposeBarterPanelProps) {
  const ajukanHref = barterAjukanPath(requestedAppraisalId);
  const loginHref = `/masuk?redirect=${encodeURIComponent(ajukanHref)}`;

  if (isOwnListing) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-ivory/80 p-5 text-sm text-ink/60 dark:bg-surface/50">
        Ini barang Anda. Kelola di{" "}
        <Link href="/barter/saya" className="font-medium text-forest underline">
          Dashboard Saya
        </Link>
        .
      </div>
    );
  }

  if (!isLoggedIn) {
    if (sessionStale) {
      return (
        <div className="rounded-2xl border border-gold/25 bg-gold/8 p-5 dark:border-gold/35 dark:bg-gold/12">
          <p className="text-sm font-medium text-ink">Sesi login perlu diperbarui</p>
          <p className="mt-1 text-xs text-ink/60">
            Login ulang agar barang Anda bisa dipilih untuk barter.
          </p>
          <Link
            href={loginHref}
            className="mt-4 inline-flex w-full justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory hover:bg-forest-light"
          >
            Masuk ulang
          </Link>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-gold/25 bg-gold/8 p-5 dark:border-gold/35 dark:bg-gold/12">
        <p className="text-sm font-medium text-ink">Ingin menukar barang ini?</p>
        <p className="mt-1 text-xs text-ink/60">
          Masuk dulu, lalu pilih barang Anda yang akan ditukar.
        </p>
        <Link
          href={loginHref}
          className="mt-4 inline-flex w-full justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory hover:bg-forest-light"
        >
          Masuk untuk ajukan barter
        </Link>
      </div>
    );
  }

  if (myItems.length === 0) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-ivory/80 p-5 dark:bg-surface/50">
        <p className="text-sm font-medium text-ink">Belum ada barang untuk ditawarkan</p>
        <p className="mt-1 text-xs text-ink/55">
          Upload di AI Appraisal lalu publikasikan ke List Barter.
        </p>
        <Link
          href="/appraisal"
          className="mt-4 inline-flex w-full justify-center rounded-full border border-forest/30 bg-forest px-6 py-3 text-sm font-semibold text-ivory"
        >
          Upload & publish
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={ajukanHref}
      className="flex w-full flex-col items-center rounded-2xl border border-gold/30 bg-forest px-6 py-4 text-center no-underline transition-colors hover:bg-forest-light"
    >
      <span className="text-sm font-semibold text-ivory">Ajukan Barter</span>
      <span className="mt-1 text-xs text-ivory/75">
        Buka halaman pengajuan lengkap
      </span>
    </Link>
  );
}
