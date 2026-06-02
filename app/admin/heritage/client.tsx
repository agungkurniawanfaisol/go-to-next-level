"use client";

import { useMemo, useState } from "react";
import {
  HeritageForm,
  HeritageDeleteConfirm,
} from "@/components/admin/HeritageForm";

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

type HeritagePageClientProps = {
  items: HeritageItemData[];
};

type ModalState =
  | { type: "add" }
  | { type: "edit"; item: HeritageItemData }
  | { type: "delete"; item: HeritageItemData }
  | { type: "none" };

type Filters = {
  query: string;
  category: string;
  status: string;
};

const ALL_CATEGORIES = ["Tekstil", "Kerajinan", "Senjata", "Seni Rupa", "Arsitektur", "Lainnya"];

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "ACTIVE", label: "Aktif" },
  { value: "REVIEW", label: "Review" },
  { value: "INACTIVE", label: "Nonaktif" },
];

function formatStatus(status: string): { label: string; active: boolean } {
  switch (status) {
    case "ACTIVE":
      return { label: "Aktif", active: true };
    case "REVIEW":
      return { label: "Review", active: false };
    case "INACTIVE":
      return { label: "Nonaktif", active: false };
    default:
      return { label: status, active: false };
  }
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-ivory transition-colors hover:bg-emerald-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      Tambah
    </button>
  );
}

function ActionButtons({
  item,
  onEdit,
  onDelete,
}: {
  item: HeritageItemData;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${item.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-emerald/10 hover:text-emerald"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Hapus ${item.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-ink/40 transition-colors hover:bg-red-50 hover:text-red-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

// ─── Filter bar ──────────────────────────────────────────────────────────

function HeritageFilters({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search input */}
      <div className="relative min-w-0 flex-1 sm:max-w-xs">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Cari nama atau daerah..."
          aria-label="Cari item heritage"
          className="w-full rounded-lg border border-ink/15 bg-ivory py-2 pl-10 pr-3 text-sm text-ink transition-colors placeholder:text-ink/35 focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
        />
      </div>

      {/* Category filter */}
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        aria-label="Filter kategori"
        className="rounded-lg border border-ink/15 bg-ivory px-3 py-2 text-sm text-ink transition-colors focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
      >
        <option value="">Semua Kategori</option>
        {ALL_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Status filter */}
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        aria-label="Filter status"
        className="rounded-lg border border-ink/15 bg-ivory px-3 py-2 text-sm text-ink transition-colors focus:border-emerald focus:outline-none focus:ring-2 focus:ring-emerald/20"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Clear filters */}
      {(filters.query || filters.category || filters.status) && (
        <button
          type="button"
          onClick={() => onChange({ query: "", category: "", status: "" })}
          className="whitespace-nowrap text-sm font-medium text-ink/50 underline decoration-dotted underline-offset-4 transition-colors hover:text-emerald"
        >
          Hapus filter
        </button>
      )}
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────

export function HeritagePageClient({ items }: HeritagePageClientProps) {
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [filters, setFilters] = useState<Filters>({
    query: "",
    category: "",
    status: "",
  });

  const filtered = useMemo(() => {
    return items.filter((item) => {
      // Text search: name or region (case-insensitive)
      if (filters.query) {
        const q = filters.query.toLowerCase();
        if (
          !item.name.toLowerCase().includes(q) &&
          !item.region.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      // Category filter
      if (filters.category && item.category !== filters.category) {
        return false;
      }
      // Status filter
      if (filters.status && item.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [items, filters]);

  const hasFilters = !!(filters.query || filters.category || filters.status);

  return (
    <>
      <div className="p-6 lg:p-8">
        {/* Toolbar: filters + add button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <HeritageFilters filters={filters} onChange={setFilters} />
          <AddButton onClick={() => setModal({ type: "add" })} />
        </div>

        {/* Result count */}
        <p className="mb-4 text-sm text-ink/60">
          {hasFilters
            ? `${filtered.length} dari ${items.length} item ditemukan`
            : `${items.length} item heritage terdaftar`}
        </p>

        {/* Cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const { label, active } = formatStatus(item.status);
              return (
                <article
                  key={item.id}
                  className="glass-panel group relative rounded-2xl border border-ink/8 bg-surface/80 p-5 transition-all hover:shadow-elevated"
                >
                  <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <ActionButtons
                      item={item}
                      onEdit={() => setModal({ type: "edit", item })}
                      onDelete={() => setModal({ type: "delete", item })}
                    />
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink">{item.name}</h3>
                    <span className="shrink-0 rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-mono text-ink/40">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">{item.region}</p>

                  {item.era && (
                    <p className="mt-1 text-xs text-ink/45 italic">{item.era}</p>
                  )}

                  {item.description && (
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <span
                    className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      active
                        ? "bg-emerald/15 text-emerald"
                        : "bg-gold/15 text-ink"
                    }`}
                  >
                    {label}
                  </span>

                  <a
                    href={`/admin/heritage/${item.id}`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald transition-colors hover:text-emerald-light"
                  >
                    Lihat Detail
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </article>
              );
            })
          ) : (
            <p className="col-span-full py-12 text-center text-sm text-ink/50">
              {hasFilters
                ? "Tidak ada item yang cocok dengan filter."
                : "Belum ada item heritage dalam katalog."}
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal.type === "add" && (
        <HeritageForm mode="add" onClose={() => setModal({ type: "none" })} />
      )}
      {modal.type === "edit" && (
        <HeritageForm
          mode="edit"
          item={modal.item}
          onClose={() => setModal({ type: "none" })}
        />
      )}
      {modal.type === "delete" && (
        <HeritageDeleteConfirm
          item={modal.item}
          onClose={() => setModal({ type: "none" })}
        />
      )}
    </>
  );
}
