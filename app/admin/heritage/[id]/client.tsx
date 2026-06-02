"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeritageForm,
  HeritageDeleteConfirm,
} from "@/components/admin/HeritageForm";

type HeritageDetail = {
  id: string;
  name: string;
  region: string;
  category: string;
  description: string | null;
  imageUrl: string | null;
  era: string | null;
  status: string;
};

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

export function HeritageDetailClient({ item }: { item: HeritageDetail }) {
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { label, active } = formatStatus(item.status);
  const hasImage = !!item.imageUrl;

  return (
    <>
      <div className="p-6 lg:p-8 dark:text-[#f0ebe3]">
        {/* Breadcrumb + actions */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-sm text-ink/50">
            <Link
              href="/admin/heritage"
              className="transition-colors hover:text-ink"
            >
              Katalog Warisan
            </Link>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-ink">{item.name}</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-ink/15 px-4 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-ink/30 hover:text-ink"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeleting(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Hapus
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Image / Visual */}
          <div className="lg:col-span-1">
            {hasImage ? (
              <div className="overflow-hidden rounded-2xl border border-ink/8 shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl!}
                  alt={item.name}
                  className="h-80 w-full object-cover lg:h-96"
                />
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center rounded-2xl border border-dashed border-ink/15 bg-ink/3 lg:h-96">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-ink/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <p className="mt-2 text-xs text-ink/35">Belum ada gambar</p>
                </div>
              </div>
            )}
          </div>

          {/* Detail info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-3xl font-bold text-ink">
                  {item.name}
                </h1>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-medium ${
                    active
                      ? "bg-emerald/15 text-emerald"
                      : "bg-gold/15 text-ink"
                  }`}
                >
                  {label}
                </span>
              </div>
              <p className="mt-2 text-lg text-ink/60">{item.region}</p>
            </div>

            {/* Info grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-panel rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-ink/40">
                  Kategori
                </p>
                <p className="mt-1 font-medium text-ink">{item.category}</p>
              </div>
              {item.era && (
                <div className="glass-panel rounded-xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-ink/40">
                    Era / Abad
                  </p>
                  <p className="mt-1 font-medium text-ink">{item.era}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="glass-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-forest">
                Deskripsi
              </p>
              {item.description ? (
                <p className="mt-3 leading-relaxed text-ink/75 whitespace-pre-line">
                  {item.description}
                </p>
              ) : (
                <p className="mt-3 text-sm italic text-ink/40">
                  Belum ada deskripsi.
                </p>
              )}
            </div>

            {/* Metadata */}
            <div className="glass-panel rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/40">
                Info Sistem
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/50">ID</dt>
                  <dd className="font-mono text-ink/60 text-xs">{item.id}</dd>
                </div>
                {item.imageUrl && (
                  <div className="flex justify-between">
                    <dt className="text-ink/50">URL Gambar</dt>
                    <dd className="max-w-[200px] truncate text-emerald">
                      <a
                        href={item.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {item.imageUrl}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-10">
          <Link
            href="/admin/heritage"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink/50 transition-colors hover:text-ink"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Katalog Warisan
          </Link>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <HeritageForm
          mode="edit"
          item={item}
          onClose={() => setEditing(false)}
        />
      )}

      {/* Delete modal */}
      {deleting && (
        <HeritageDeleteConfirm
          item={item}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
}
