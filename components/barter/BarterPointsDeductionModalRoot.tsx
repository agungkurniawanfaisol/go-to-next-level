"use client";

import { useEffect, useMemo, useState } from "react";
import { CoinPointsIcon } from "@/components/appraisal/ai-work-icons";

const SESSION_KEY = "ecoswap_barter_points_modal";
const EVENT_NAME = "ecoswap:barter-points-modal";

type ModalPayload = {
  deducted: number;
  newPoints: number;
  completedAt?: string;
};

export function BarterPointsDeductionModalRoot() {
  const [payload, setPayload] = useState<ModalPayload | null>(null);
  const open = payload != null;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ModalPayload;
      setPayload(parsed);
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    const onShow = () => {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw) as ModalPayload;
        setPayload(parsed);
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        // no-op
      }
    };

    window.addEventListener(EVENT_NAME, onShow);
    return () => window.removeEventListener(EVENT_NAME, onShow);
  }, []);

  const deductedText = useMemo(() => {
    if (!payload) return "";
    const deducted = Math.max(0, payload.deducted ?? 0);
    return deducted.toLocaleString("id-ID");
  }, [payload]);

  const newPointsText = useMemo(() => {
    if (!payload) return "";
    const points = Math.max(0, payload.newPoints ?? 0);
    return points.toLocaleString("id-ID");
  }, [payload]);

  if (!open || !payload) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        onClick={() => setPayload(null)}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg rounded-2xl border border-ink/10 bg-ivory/95 p-6 shadow-elevated"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-forest">
              Barter selesai
            </p>
            <h2 className="mt-2 font-display text-xl font-semibold text-ink">
              EcoSwap Points Anda berkurang
            </h2>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-ink/10 bg-surface/80 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest/12">
                <CoinPointsIcon className="h-5 w-5 text-gold" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink/70">
                  Terpotong
                </p>
                <p className="text-lg font-display font-bold tabular-nums text-forest">
                  {deductedText} PTS
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs font-medium text-ink/45">Total sekarang</p>
                <p className="text-lg font-display font-bold tabular-nums text-gold">
                  {newPointsText} PTS
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-ink/60">
              Ini terjadi karena barang yang dipakai barter sudah dinonaktifkan dari
              List Barter setelah transaksi selesai.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPayload(null)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/12 text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="Tutup"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setPayload(null)}
            className="rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}

