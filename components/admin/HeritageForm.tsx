"use client";

import { useActionState, useCallback, useEffect, useRef } from "react";
import {
  createHeritageItem,
  updateHeritageItem,
  deleteHeritageItem,
  type HeritageFormData,
} from "@/lib/actions/heritage";

/* ─── Same shape as the server-side HeritageItemData ───────────────── */
type HeritageItemData = {
  id: string;
  name: string;
  region: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  era: string | null;
  status: string;
};

type ActionState = Awaited<ReturnType<typeof createHeritageItem>> | null;

const CATEGORIES = ["Tekstil", "Kerajinan", "Senjata", "Seni Rupa", "Arsitektur", "Lainnya"];

const STATUS_OPTIONS: { value: HeritageFormData["status"]; label: string }[] = [
  { value: "ACTIVE", label: "Aktif" },
  { value: "REVIEW", label: "Review" },
  { value: "INACTIVE", label: "Nonaktif" },
];

// ─── Form fields (reusable) ──────────────────────────────────────────────

function InputField({
  label,
  name,
  defaultValue,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-medium text-ink/80">
      {label}
      {required && <span className="ml-0.5 text-red-600">*</span>}
      <input
        name={name}
        defaultValue={defaultValue}
        required={required}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-lg border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/35 focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block text-sm font-medium text-ink/80">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 block w-full rounded-lg border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// ─── Textarea field ─────────────────────────────────────────────────

function TextareaField({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-medium text-ink/80">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
        className="mt-1.5 block w-full rounded-lg border border-ink/15 bg-ivory px-3.5 py-2.5 text-sm text-ink transition-colors placeholder:text-ink/35 focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
      />
    </label>
  );
}

// ─── Modal form (add / edit) ─────────────────────────────────────────────

export function HeritageForm({ mode, item, onClose }: HeritageFormProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Build a useActionState-compatible action based on mode
  const wrappedAction =
    mode === "add"
      ? (async (_prev: ActionState, fd: FormData) => {
          const data: HeritageFormData = {
            name: fd.get("name") as string,
            region: fd.get("region") as string,
            category: fd.get("category") as string,
            description: (fd.get("description") as string) || undefined,
            imageUrl: (fd.get("imageUrl") as string) || undefined,
            era: (fd.get("era") as string) || undefined,
            status: fd.get("status") as HeritageFormData["status"],
          };
          return createHeritageItem(data);
        })
      : (async (_prev: ActionState, fd: FormData) => {
          const data: HeritageFormData = {
            name: fd.get("name") as string,
            region: fd.get("region") as string,
            category: fd.get("category") as string,
            description: (fd.get("description") as string) || undefined,
            imageUrl: (fd.get("imageUrl") as string) || undefined,
            era: (fd.get("era") as string) || undefined,
            status: fd.get("status") as HeritageFormData["status"],
          };
          return updateHeritageItem(item!.id, data);
        });

  const [state, formAction, isPending] = useActionState(wrappedAction, null);

  // Close modal on success
  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === dialogRef.current?.parentElement) onClose();
    },
    [onClose],
  );

  const title = mode === "add" ? "Tambah Item Heritage" : "Edit Item Heritage";
  const submitLabel = mode === "add" ? "Tambah" : "Simpan";

  return (
    <FormShell
      title={title}
      dialogRef={dialogRef}
      onBackdrop={handleBackdrop}
      onClose={onClose}
    >
      <form action={formAction}>
        <input type="hidden" name="id" value={item?.id ?? ""} />
        <div className="space-y-4">
          <InputField
            label="Nama Warisan"
            name="name"
            defaultValue={item?.name}
            required
            placeholder="Contoh: Batik Tulis"
          />
          <InputField
            label="Daerah Asal"
            name="region"
            defaultValue={item?.region}
            required
            placeholder="Contoh: Pekalongan"
          />
          <InputField
            label="Era / Abad"
            name="era"
            defaultValue={item?.era ?? ""}
            placeholder="Contoh: Abad ke-19, Era Majapahit"
          />
          <TextareaField
            label="Deskripsi"
            name="description"
            defaultValue={item?.description ?? ""}
            placeholder="Cerita singkat tentang warisan ini…"
          />
          <InputField
            label="URL Gambar"
            name="imageUrl"
            defaultValue={item?.imageUrl ?? ""}
            placeholder="https://images.unsplash.com/photo-…"
          />
          <SelectField
            label="Kategori"
            name="category"
            defaultValue={item?.category ?? CATEGORIES[0]}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <SelectField
            label="Status"
            name="status"
            defaultValue={item?.status ?? "ACTIVE"}
            options={STATUS_OPTIONS}
          />
        </div>

        {state && !state.success && (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {state.error ?? "Terjadi kesalahan."}
          </p>
        )}

        <FormActions onClose={onClose} submitLabel={submitLabel} disabled={isPending} />
      </form>
    </FormShell>
  );
}

type HeritageFormProps = {
  mode: "add" | "edit";
  item?: HeritageItemData;
  onClose: () => void;
};

// ─── Delete confirmation ─────────────────────────────────────────────────

export function HeritageDeleteConfirm({
  item,
  onClose,
}: {
  item: HeritageItemData;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  const wrappedDelete = async (_prev: ActionState) => deleteHeritageItem(item.id);
  const [state, formAction, isPending] = useActionState(wrappedDelete, null);

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === dialogRef.current?.parentElement) onClose();
    },
    [onClose],
  );

  return (
    <FormShell
      title="Hapus Item Heritage"
      dialogRef={dialogRef}
      onBackdrop={handleBackdrop}
      onClose={onClose}
    >
      <form action={formAction}>
        <p className="text-sm text-ink/75">
          Apakah Anda yakin ingin menghapus{" "}
          <span className="font-semibold text-ink">{item.name}</span>?
        </p>
        <p className="mt-1 text-xs text-ink/50">Tindakan ini tidak dapat dibatalkan.</p>

        {state && !state.success && (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {state.error ?? "Terjadi kesalahan."}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-50"
          >
            {isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </form>
    </FormShell>
  );
}

// ─── Shared shell ─────────────────────────────────────────────────────────

function FormShell({
  title,
  children,
  dialogRef,
  onBackdrop,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  dialogRef: React.RefObject<HTMLDivElement | null>;
  onBackdrop: (e: React.MouseEvent) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm"
      onClick={onBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={dialogRef}
        className="mx-4 w-full max-w-lg rounded-2xl border border-ink/8 bg-surface p-6 shadow-elevated"
      >
        <div className="flex items-center justify-between border-b border-ink/6 pb-4">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}

function FormActions({
  onClose,
  submitLabel,
  disabled,
}: {
  onClose: () => void;
  submitLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-ink/6 pt-4">
      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
        className="rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-emerald-light disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
      >
        {disabled ? "Menyimpan..." : submitLabel}
      </button>
    </div>
  );
}
