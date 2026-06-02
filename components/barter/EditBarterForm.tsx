"use client";

import { useState, useTransition } from "react";
import { updateBarter } from "@/lib/actions/barter";

type EditBarterFormProps = {
  listing: {
    id: string;
    ownerName: string | null;
    ownerCity: string | null;
    swapDescription: string | null;
    wantedItem: string | null;
    imagePath: string | null;
    detectedObject: string;
  };
  onClose: () => void;
};

export function EditBarterForm({ listing, onClose }: EditBarterFormProps) {
  const [ownerName, setOwnerName] = useState(listing.ownerName ?? "");
  const [ownerCity, setOwnerCity] = useState(listing.ownerCity ?? "");
  const [swapDescription, setSwapDescription] = useState(
    listing.swapDescription ?? "",
  );
  const [wantedItem, setWantedItem] = useState(listing.wantedItem ?? "");
  const [imageUrl, setImageUrl] = useState(listing.imagePath ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await updateBarter({
        appraisalId: listing.id,
        ownerName,
        ownerCity,
        swapDescription,
        wantedItem,
        imagePath: imageUrl || undefined,
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => onClose(), 1200);
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-ivory p-6 shadow-elevated dark:bg-[#0f0e0c] dark:text-[#f0ebe3]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-ink dark:text-[#f0ebe3]">
            Edit Listing
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 text-ink/50 hover:text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-ink/50 mb-5">
          {listing.detectedObject}
        </p>

        {success ? (
          <div className="rounded-xl bg-emerald/10 p-4 text-center">
            <p className="font-medium text-emerald">✅ Tersimpan!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
                  Nama pemilik
                </span>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald dark:bg-[#1a1714] dark:text-[#f0ebe3]"
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
                  className="mt-1.5 w-full rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald dark:bg-[#1a1714] dark:text-[#f0ebe3]"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
                Cerita barang
              </span>
              <textarea
                value={swapDescription}
                onChange={(e) => setSwapDescription(e.target.value)}
                rows={2}
                className="mt-1.5 w-full resize-none rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald dark:bg-[#1a1714] dark:text-[#f0ebe3]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
                Dicari untuk barter
              </span>
              <input
                type="text"
                value={wantedItem}
                onChange={(e) => setWantedItem(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald dark:bg-[#1a1714] dark:text-[#f0ebe3]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wider text-ink/50">
                URL / Path gambar
              </span>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://… atau upload baru lewat appraisal"
                className="mt-1.5 w-full rounded-xl border border-ink/12 bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-emerald dark:bg-[#1a1714] dark:text-[#f0ebe3]"
              />
              <p className="mt-1 text-[10px] text-ink/40">
                Untuk ganti foto, upload ulang lewat fitur Appraisal lalu paste URL gambar di sini.
              </p>
            </label>

            {error && (
              <p className="text-sm text-red-700" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-full border border-ink/15 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light disabled:opacity-60"
              >
                {isPending ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
