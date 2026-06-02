"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createBarterProposal } from "@/lib/actions/barter-proposals";
import {
  BarterItemPreview360,
  BarterPointsCompare,
} from "@/components/barter/BarterItemPreview360";
import type { AppraisalSummary } from "@/lib/api/barter-proposals";

type BarterProposalFormProps = {
  requestedAppraisalId: string;
  requestedTitle: string;
  requestedOwner: string;
  requestedPoints: number;
  requestedImagePath?: string | null;
  myItems: AppraisalSummary[];
  cancelHref: string;
};

type Step = "review" | "select" | "message" | "confirm" | "submitting";

const stepLabels: Record<Step, string> = {
  review: "Barang yang diminta",
  select: "Pilih barang Anda",
  message: "Tulis pesan",
  confirm: "Konfirmasi",
  submitting: "Mengirim...",
};

const previewLg = "min-h-[260px] sm:min-h-[300px] lg:min-h-[380px]";

export function BarterProposalForm({
  requestedAppraisalId,
  requestedTitle,
  requestedOwner,
  requestedPoints,
  requestedImagePath,
  myItems,
  cancelHref,
}: BarterProposalFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("review");
  const [offeredId, setOfferedId] = useState(myItems[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedItem = myItems.find((i) => i.id === offeredId);
  const totalSteps = 4;
  const currentStepNum =
    step === "submitting" ? 4 : ["review", "select", "message", "confirm"].indexOf(step) + 1;

  const handleNext = () => {
    if (step === "review") setStep("select");
    else if (step === "select") {
      if (!offeredId) {
        setError("Pilih barang yang akan Anda tawarkan.");
        return;
      }
      setError(null);
      setStep("message");
    } else if (step === "message") {
      setStep("confirm");
    }
  };

  const handleBack = () => {
    setError(null);
    if (step === "select") setStep("review");
    else if (step === "message") setStep("select");
    else if (step === "confirm") setStep("message");
  };

  const handleSubmit = () => {
    setStep("submitting");
    setError(null);
    startTransition(async () => {
      const result = await createBarterProposal(
        offeredId,
        requestedAppraisalId,
        message,
      );
      if (result.success) {
        router.push("/barter/permintaan");
        router.refresh();
        return;
      }
      setError(result.error ?? "Gagal mengajukan barter.");
      setStep("confirm");
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col">
      {/* Header langkah */}
      <div className="border-b border-ink/8 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-forest">
              Ajukan Barter
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink sm:text-3xl">
              {stepLabels[step]}
            </h1>
            <p className="mt-2 text-sm text-ink/55">
              Tukar dengan <span className="font-medium text-ink">{requestedTitle}</span>
              {" · "}
              milik {requestedOwner}
            </p>
          </div>
          <Link
            href={cancelHref}
            className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-sm font-medium text-ink/60 transition-colors hover:border-ink/25 hover:text-ink"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Kembali ke detail
          </Link>
        </div>

        <div className="mt-6 flex gap-1.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i <= currentStepNum ? "bg-forest" : "bg-ink/10"
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-ink/45">
          Langkah {currentStepNum} dari {totalSteps}
        </p>
      </div>

      {/* Konten utama — lebar penuh */}
      <div className="flex flex-1 flex-col py-8 lg:py-10">
        <AnimatePresence mode="wait">
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-8 lg:grid-cols-2 lg:gap-10"
            >
              <div className="space-y-4">
                <p className="text-base text-ink/70">
                  Anda akan mengajukan barter untuk barang berikut. Putar 360° untuk
                  melihat detail sebelum memilih barang Anda.
                </p>
                <div className="rounded-2xl border border-ink/8 bg-surface p-5 sm:p-6">
                  <p className="font-display text-xl font-semibold text-ink sm:text-2xl">
                    {requestedTitle}
                  </p>
                  <p className="mt-2 text-sm text-ink/50">Milik: {requestedOwner}</p>
                  <p className="mt-3 text-lg font-semibold text-gold dark:text-gold-light">
                    +{requestedPoints.toLocaleString("id-ID")} EcoSwap Points
                  </p>
                </div>
              </div>
              <BarterItemPreview360
                imagePath={requestedImagePath ?? null}
                title={requestedTitle}
                className={previewLg}
              />
            </motion.div>
          )}

          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              <p className="text-base text-ink/70">
                Pilih barang Anda yang akan ditukarkan:
              </p>

              {myItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink/15 p-12 text-center">
                  <p className="text-base font-medium text-ink">Tidak ada barang</p>
                  <p className="mt-2 text-sm text-ink/50">
                    Upload di AI Appraisal lalu publikasikan ke List Barter.
                  </p>
                  <Link
                    href="/appraisal"
                    className="mt-6 inline-flex rounded-full bg-forest px-6 py-3 text-sm font-semibold text-ivory"
                  >
                    Upload & publish
                  </Link>
                </div>
              ) : (
                <div className="grid gap-8 xl:grid-cols-[1fr_1.1fr] xl:gap-10">
                  <div className="space-y-3">
                    {myItems.map((item) => {
                      const itemImg =
                        item.imagePath ??
                        "https://placehold.co/400x300/e8e2d8/1f3d32?text=EcoSwap";
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setOfferedId(item.id)}
                          className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all sm:p-5 ${
                            offeredId === item.id
                              ? "border-emerald/50 bg-emerald/8 ring-2 ring-emerald/25"
                              : "border-ink/8 bg-surface/80 hover:border-ink/15"
                          }`}
                        >
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={itemImg}
                              alt={item.detectedObject}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-semibold text-ink sm:text-lg">
                              {item.detectedObject}
                            </p>
                            <p className="mt-1 text-sm text-ink/50">
                              {item.ownerName ?? "Anda"}
                              {item.ownerCity ? ` · ${item.ownerCity}` : ""}
                            </p>
                            <p className="mt-1 text-sm font-medium text-gold dark:text-gold-light">
                              +{item.ecoSwapPoints.toLocaleString("id-ID")} poin
                            </p>
                          </div>
                          {offeredId === item.id && (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald text-sm text-ivory">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-6">
                    {offeredId && selectedItem && (
                      <>
                        <BarterItemPreview360
                          imagePath={selectedItem.imagePath}
                          title={selectedItem.detectedObject}
                          className={previewLg}
                        />
                        <BarterPointsCompare
                          offeredPoints={selectedItem.ecoSwapPoints}
                          requestedPoints={requestedPoints}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300" role="alert">
                  {error}
                </p>
              )}
            </motion.div>
          )}

          {step === "message" && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="grid gap-8 lg:grid-cols-2 lg:gap-10"
            >
              <div className="space-y-6">
                <p className="text-base text-ink/70">
                  Tambahkan pesan untuk pemilik barang (opsional):
                </p>
                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    maxLength={2000}
                    placeholder="Contoh: Halo, saya tertarik dengan barang Anda. Bisa COD di Yogyakarta?"
                    className="w-full resize-y rounded-2xl border border-ink/15 bg-surface px-5 py-4 text-base text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-emerald focus:ring-2 focus:ring-emerald/20"
                  />
                  <p className="mt-2 text-right text-xs text-ink/40">
                    {message.length}/2000
                  </p>
                </div>

                {selectedItem && (
                  <div className="rounded-2xl border border-gold/20 bg-gold/8 p-5 dark:border-gold/35 dark:bg-gold/12">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold">
                      Ringkasan
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink/50">Anda menawarkan:</p>
                        <p className="font-medium text-ink">{selectedItem.detectedObject}</p>
                      </div>
                      <svg className="h-6 w-6 shrink-0 text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ink/50">Anda meminta:</p>
                        <p className="font-medium text-ink">{requestedTitle}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedItem && (
                <div className="space-y-6">
                  <BarterPointsCompare
                    offeredPoints={selectedItem.ecoSwapPoints}
                    requestedPoints={requestedPoints}
                  />
                  <BarterItemPreview360
                    imagePath={selectedItem.imagePath}
                    title={selectedItem.detectedObject}
                    className={previewLg}
                  />
                </div>
              )}
            </motion.div>
          )}

          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                {selectedItem && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/45">
                      Barang Anda (360°)
                    </p>
                    <BarterItemPreview360
                      imagePath={selectedItem.imagePath}
                      title={selectedItem.detectedObject}
                      className={previewLg}
                    />
                  </div>
                )}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/45">
                    Barang lawan (360°)
                  </p>
                  <BarterItemPreview360
                    imagePath={requestedImagePath ?? null}
                    title={requestedTitle}
                    className={previewLg}
                  />
                </div>
              </div>

              {selectedItem && (
                <BarterPointsCompare
                  offeredPoints={selectedItem.ecoSwapPoints}
                  requestedPoints={requestedPoints}
                />
              )}

              <div className="rounded-2xl border border-emerald/25 bg-emerald/5 p-6 sm:p-8 dark:border-emerald/30 dark:bg-emerald/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-forest">
                  Konfirmasi Barter
                </p>
                <div className="mt-6 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="rounded-xl border border-ink/8 bg-surface p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                      Anda menawarkan
                    </p>
                    <p className="mt-2 text-lg font-semibold text-ink">
                      {selectedItem?.detectedObject ?? "—"}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gold dark:text-gold-light">
                      +{selectedItem?.ecoSwapPoints.toLocaleString("id-ID") ?? 0} poin
                    </p>
                  </div>
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald/15 text-emerald">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </span>
                  <div className="rounded-xl border border-ink/8 bg-surface p-5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-ink/45">
                      Anda meminta
                    </p>
                    <p className="mt-2 text-lg font-semibold text-ink">{requestedTitle}</p>
                    <p className="mt-1 text-sm font-medium text-gold dark:text-gold-light">
                      +{requestedPoints.toLocaleString("id-ID")} poin
                    </p>
                  </div>
                </div>
              </div>

              {message && (
                <div className="rounded-2xl border border-ink/8 bg-surface/80 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink/45">
                    Pesan Anda
                  </p>
                  <p className="mt-3 text-base italic text-ink/70">&ldquo;{message}&rdquo;</p>
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300" role="alert">
                  {error}
                </p>
              )}
            </motion.div>
          )}

          {step === "submitting" && (
            <motion.div
              key="submitting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24"
            >
              <span className="h-12 w-12 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
              <p className="mt-6 text-lg font-medium text-ink">Mengirim permintaan barter…</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer aksi — sticky */}
      {step !== "submitting" && (
        <div className="sticky bottom-0 -mx-6 border-t border-ink/8 bg-ivory/95 px-6 py-5 backdrop-blur-md dark:bg-[var(--bg-primary)]/95 lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            {step === "review" ? (
              <Link
                href={cancelHref}
                className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
              >
                Batal
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="rounded-full border border-ink/15 px-6 py-3 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
              >
                Kembali
              </button>
            )}

            {step !== "confirm" && (
              <button
                type="button"
                onClick={handleNext}
                disabled={
                  isPending ||
                  myItems.length === 0 ||
                  (step === "select" && !offeredId)
                }
                className="rounded-full bg-forest px-8 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-forest-light disabled:opacity-50"
              >
                Lanjut
              </button>
            )}

            {step === "confirm" && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-full bg-emerald px-8 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-emerald-light disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
                    Mengirim...
                  </>
                ) : (
                  "Kirim Permintaan"
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
