"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { publishBarter } from "@/lib/actions/barter";

type PublishBarterFormProps = {
  appraisalId: string;
  userName?: string | null;
};

export function PublishBarterForm({ appraisalId, userName }: PublishBarterFormProps) {
  const [ownerName, setOwnerName] = useState(userName ?? "");
  const [ownerCity, setOwnerCity] = useState("");
  const [swapDescription, setSwapDescription] = useState("");
  const [wantedItem, setWantedItem] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await publishBarter({
        appraisalId,
        ownerName,
        ownerCity,
        swapDescription,
        wantedItem,
      });

      if (result.success) {
        setPublished(true);
      } else {
        setError(result.error);
      }
    });
  };

  if (published) {
    return (
      <div className="glass-panel rounded-2xl border border-emerald/25 bg-emerald/5 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald/15 text-emerald">
            ✓
          </span>
          <div>
            <p className="font-semibold text-ink">Live di List Barter</p>
            <p className="mt-1 text-sm text-ink/65">
              Barang Anda sudah tampil di marketplace komunitas.
            </p>
            <Link
              href={`/barter/${appraisalId}`}
              className="mt-4 inline-flex rounded-full border border-gold/35 bg-forest px-5 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light"
            >
              Lihat di Marketplace →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-2xl border border-gold/20 p-6 shadow-card"
    >
      <div className="ai-accent-bar mb-4" />
      <p className="text-xs font-semibold uppercase tracking-widest text-forest">
        Publikasikan Barter
      </p>
      <p className="mt-2 text-sm text-ink/65">
        Tampilkan barang ini di marketplace agar komunitas bisa menawarkan tukar.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
            Nama pemilik
          </span>
          <input
            type="text"
            required
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            placeholder="Contoh: Siti Rahayu"
            className="mt-1.5 w-full rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
            Kota
          </span>
          <input
            type="text"
            required
            value={ownerCity}
            onChange={(e) => setOwnerCity(e.target.value)}
            placeholder="Contoh: Yogyakarta"
            className="mt-1.5 w-full rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
          Cerita barang (opsional)
        </span>
        <textarea
          value={swapDescription}
          onChange={(e) => setSwapDescription(e.target.value)}
          rows={2}
          placeholder="Warisan keluarga, kondisi, sejarah singkat…"
          className="mt-1.5 w-full resize-none rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald"
        />
      </label>

      <label className="mt-4 block">
        <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
          Yang dicari untuk barter
        </span>
        <input
          type="text"
          value={wantedItem}
          onChange={(e) => setWantedItem(e.target.value)}
          placeholder="Contoh: ukiran kayu Jepara atau tenun ikat"
          className="mt-1.5 w-full rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald"
        />
      </label>

      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-5 w-full rounded-full border border-gold/35 bg-forest px-6 py-3 text-sm font-semibold text-ivory transition-all hover:bg-forest-light disabled:opacity-60 sm:w-auto"
      >
        {isPending ? "Mempublikasikan…" : "Tampilkan di List Barter"}
      </button>
    </form>
  );
}
