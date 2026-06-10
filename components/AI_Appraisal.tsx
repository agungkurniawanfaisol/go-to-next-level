"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppraisalResultLayout } from "@/components/appraisal/AppraisalResultLayout";
import { AppraisalScanningLayout } from "@/components/appraisal/AppraisalScanningLayout";
import {
  generateAppraisalFromFeatures,
  type AppraisalResultData,
} from "@/lib/appraisal-mock";
import { analyzeImage, type ImageFeatures } from "@/lib/image-analyzer";
import { saveAppraisalWithImage } from "@/lib/actions/save-appraisal";

import { APPRAISAL_SCAN_DURATION_MS } from "@/lib/appraisal-scan-duration";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

type AppraisalState = "idle" | "scanning" | "result";

export function AI_Appraisal({ userName }: { userName?: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scanTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const pendingFileRef = useRef<File | null>(null);
  const lastFileRef = useRef<File | null>(null);
  const imageFeaturesRef = useRef<ImageFeatures | null>(null);
  const featuresPromiseRef = useRef<Promise<void> | null>(null);

  const [state, setState] = useState<AppraisalState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<AppraisalResultData | null>(null);
  const [appraisalId, setAppraisalId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const revokePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  const clearScanTimer = useCallback(() => {
    if (scanTimerRef.current) {
      clearTimeout(scanTimerRef.current);
      scanTimerRef.current = null;
    }
  }, []);

  const saveResult = useCallback(async (file: File, appraisalResult: AppraisalResultData) => {
    setIsSaving(true);
    setSaveError(null);

    const formData = new FormData();
    formData.set("image", file);
    formData.set("result", JSON.stringify(appraisalResult));

    try {
      const saved = await saveAppraisalWithImage(formData);
      if (saved.success) {
        setAppraisalId(saved.id);
      } else {
        setSaveError(saved.error);
      }
    } catch {
      setSaveError("Gagal menyimpan hasil appraisal.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  const finishScan = useCallback(async () => {
    const file = pendingFileRef.current;
    if (!file) return;

    if (featuresPromiseRef.current) {
      await featuresPromiseRef.current;
    }

    const features = imageFeaturesRef.current;
    if (features) {
      const appraisalResult = generateAppraisalFromFeatures(features);
      setResult(appraisalResult);
      void saveResult(file, appraisalResult);
    }

    setState("result");
    pendingFileRef.current = null;
    imageFeaturesRef.current = null;
    featuresPromiseRef.current = null;
    scanTimerRef.current = null;
  }, [saveResult]);

  const reset = useCallback(() => {
    clearScanTimer();
    pendingFileRef.current = null;
    lastFileRef.current = null;
    imageFeaturesRef.current = null;
    featuresPromiseRef.current = null;
    revokePreview();
    setResult(null);
    setAppraisalId(null);
    setSaveError(null);
    setIsSaving(false);
    setError(null);
    setState("idle");
  }, [clearScanTimer, revokePreview]);

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!file.type.startsWith("image/")) {
        setError("Hanya file gambar yang didukung.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("Ukuran file maksimal 10 MB.");
        return;
      }

      clearScanTimer();
      revokePreview();

      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      pendingFileRef.current = file;
      lastFileRef.current = file;
      setPreviewUrl(url);
      setResult(null);
      setState("scanning");

      // Start image analysis in parallel with scanning timer
      imageFeaturesRef.current = null;
      featuresPromiseRef.current = analyzeImage(url).then((features) => {
        imageFeaturesRef.current = features;
      });

      scanTimerRef.current = setTimeout(finishScan, APPRAISAL_SCAN_DURATION_MS);
    },
    [clearScanTimer, revokePreview, finishScan],
  );

  useEffect(() => {
    return () => {
      clearScanTimer();
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, [clearScanTimer]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  if (state === "idle") {
    return (
      <div>
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload gambar barang bekas atau heritage"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={handleDrop}
          className={`flex min-h-[320px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors shadow-card ${
            isDraggingFile
              ? "border-emerald bg-emerald/8"
              : "border-forest/25 bg-surface hover:border-emerald/50 hover:shadow-elevated"
          }`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-forest/20 bg-ivory ring-1 ring-gold/20">
            <svg
              className="h-8 w-8 text-forest"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <p className="text-lg font-semibold text-ink">
            Seret gambar barang bekas / heritage
          </p>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            Upload, analisis AI CNN, lalu putar foto 360° di preview yang sama
          </p>
          <span className="mt-6 inline-flex rounded-full border border-gold/30 bg-forest px-6 py-2.5 text-sm font-semibold text-ivory shadow-card transition-shadow hover:shadow-elevated">
            Pilih dari perangkat
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />

        {error && (
          <p className="mt-4 text-center text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {previewUrl && state === "scanning" && (
        <AppraisalScanningLayout
          key={`${previewUrl}-scanning`}
          previewUrl={previewUrl}
        />
      )}

      {previewUrl && state === "result" && result && (
        <AppraisalResultLayout
          key={`${previewUrl}-result`}
          previewUrl={previewUrl}
          result={result}
          appraisalId={appraisalId}
          userName={userName}
          isSaving={isSaving}
          saveError={saveError}
          onRetrySave={() => {
            if (result && lastFileRef.current) {
              void saveResult(lastFileRef.current, result);
            }
          }}
        />
      )}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-ink/15 px-6 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:border-forest hover:text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Scan ulang
        </button>
      </div>
    </div>
  );
}
