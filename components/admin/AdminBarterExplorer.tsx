"use client";

import { useMemo, useState } from "react";
import { AdminBarterCard } from "@/components/admin/AdminBarterCard";
import { AdminBarterMap } from "@/components/admin/AdminBarterMap";
import type {
  AdminBarterPageData,
  BarterListing,
  UserUploadStats,
} from "@/lib/api/barter";

type SelectedKey = string;

type AdminBarterExplorerProps = {
  data: AdminBarterPageData;
};

function UserListItem({
  user,
  selected,
  onSelect,
}: {
  user: UserUploadStats;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
        selected
          ? "border-emerald/50 bg-emerald/10"
          : "border-transparent bg-transparent hover:bg-ink/[0.04]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            selected ? "bg-emerald text-ivory" : "bg-forest/12 text-forest"
          }`}
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
          <p className="truncate text-xs text-ink/50">{user.email}</p>
        </div>
      </div>
      <div className="mt-2 flex gap-2 pl-[52px]">
        <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[11px] font-medium text-ink/70">
          {user.barterCount} barter
        </span>
        <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[11px] text-ink/50">
          {user.uploadCount} upload
        </span>
      </div>
    </button>
  );
}

export function AdminBarterExplorer({ data }: AdminBarterExplorerProps) {
  const { users, guestStats, listings } = data;

  const listingsByUser = useMemo(() => {
    const map = new Map<SelectedKey, BarterListing[]>();
    for (const listing of listings) {
      const key = listing.userId ?? "guest";
      const list = map.get(key) ?? [];
      list.push(listing);
      map.set(key, list);
    }
    return map;
  }, [listings]);

  const usersWithActivity = useMemo(
    () =>
      users.filter(
        (u) =>
          (listingsByUser.get(u.id)?.length ?? 0) > 0 || u.uploadCount > 0,
      ),
    [users, listingsByUser],
  );

  const defaultSelection = useMemo((): SelectedKey | null => {
    if (usersWithActivity.length > 0) return usersWithActivity[0].id;
    if (guestStats.barterCount > 0) return "guest";
    return null;
  }, [usersWithActivity, guestStats.barterCount]);

  const [selectedKey, setSelectedKey] = useState<SelectedKey | null>(null);
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const activeKey = selectedKey ?? defaultSelection;

  const selectedUser = users.find((u) => u.id === activeKey);
  const selectedListings =
    activeKey === "guest"
      ? (listingsByUser.get("guest") ?? [])
      : activeKey
        ? (listingsByUser.get(activeKey) ?? [])
        : [];

  const panelTitle =
    activeKey === "guest"
      ? "Upload tamu"
      : selectedUser
        ? selectedUser.name
        : "Detail barter";

  const selectUser = (key: SelectedKey) => {
    setSelectedKey(key);
    setMobileShowDetail(true);
  };

  const selectListing = (listingId: string) => {
    const ownerKey =
      listings.find((row) => row.id === listingId)?.userId ?? "guest";
    setSelectedKey(ownerKey);
    setMobileShowDetail(true);
  };

  const userList = (
    <ul className="divide-y divide-ink/6">
      {usersWithActivity.map((user) => (
        <li key={user.id}>
          <UserListItem
            user={user}
            selected={activeKey === user.id}
            onSelect={() => selectUser(user.id)}
          />
        </li>
      ))}

      {guestStats.uploadCount > 0 && (
        <li>
          <button
            type="button"
            onClick={() => selectUser("guest")}
            className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
              activeKey === "guest"
                ? "border-emerald/50 bg-emerald/10"
                : "border-transparent hover:bg-ink/[0.04]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink/8 text-sm font-bold text-ink/45">
                ?
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">Upload tamu</p>
                <p className="text-xs text-ink/50">Tanpa login</p>
              </div>
            </div>
            <div className="mt-2 flex gap-2 pl-[52px]">
              <span className="rounded-md bg-emerald/10 px-2 py-0.5 text-[11px] font-medium text-emerald">
                {guestStats.barterCount} barter
              </span>
              <span className="rounded-md bg-ink/5 px-2 py-0.5 text-[11px] text-ink/50">
                {guestStats.uploadCount} upload
              </span>
            </div>
          </button>
        </li>
      )}

      {usersWithActivity.length === 0 && guestStats.uploadCount === 0 && (
        <li className="px-4 py-10 text-center text-sm text-ink/50">
          Belum ada upload.
        </li>
      )}
    </ul>
  );

  const detailContent = !activeKey ? (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="max-w-sm text-sm text-ink/55">
        Pilih pengguna di daftar untuk melihat barang yang siap dibarter.
      </p>
    </div>
  ) : selectedListings.length > 0 ? (
    <div className="space-y-4 p-4 sm:p-5">
      {selectedListings.map((listing) => (
        <AdminBarterCard key={listing.id} listing={listing} />
      ))}
    </div>
  ) : (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-medium text-ink">Belum ada item barter aktif</p>
      <p className="mt-2 max-w-sm text-sm text-ink/55">
        Pengguna ini sudah upload, tetapi belum mempublikasikan ke List Barter.
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl">
      {/* Desktop: split pane */}
      <div className="hidden overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card lg:flex lg:h-[calc(100vh-9.5rem)]">
        {/* Kolom kiri — daftar user */}
        <aside className="flex w-72 shrink-0 flex-col border-r border-ink/10 bg-ivory/60">
          <div className="shrink-0 border-b border-ink/8 px-4 py-4">
            <h2 className="text-sm font-semibold text-ink">Pengguna</h2>
            <p className="mt-0.5 text-xs text-ink/50">
              Klik untuk lihat item barter
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">{userList}</div>
        </aside>

        {/* Kolom kanan — detail */}
        <main className="flex min-w-0 flex-1 flex-col bg-surface">
          <div className="shrink-0 border-b border-ink/8 bg-surface px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                  Item siap barter
                </p>
                <h2 className="truncate font-display text-lg font-semibold text-ink">
                  {panelTitle}
                </h2>
                {selectedUser && (
                  <p className="truncate text-xs text-ink/50">
                    {selectedUser.email}
                  </p>
                )}
              </div>
              <span className="shrink-0 rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                {selectedListings.length} item
              </span>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="border-b border-ink/8 p-4">
              <AdminBarterMap
                listings={listings}
                onPickListing={selectListing}
              />
            </div>
            {detailContent}
          </div>
        </main>
      </div>

      {/* Mobile: list ATAU detail (tidak ditumpuk) */}
      <div className="lg:hidden">
        {!mobileShowDetail ? (
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card">
            <div className="border-b border-ink/8 px-4 py-4">
              <h2 className="text-sm font-semibold text-ink">Pengguna upload</h2>
              <p className="mt-0.5 text-xs text-ink/50">
                Ketuk nama untuk melihat barang barter
              </p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">{userList}</div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-card">
            <div className="flex items-center gap-3 border-b border-ink/8 px-4 py-3">
              <button
                type="button"
                onClick={() => setMobileShowDetail(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/10 text-ink/70 hover:bg-ink/5"
                aria-label="Kembali ke daftar pengguna"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-forest">
                  Item barter
                </p>
                <h2 className="truncate font-display text-base font-semibold text-ink">
                  {panelTitle}
                </h2>
              </div>
              <span className="shrink-0 rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-medium text-forest">
                {selectedListings.length}
              </span>
            </div>
            <div className="max-h-[75vh] overflow-y-auto">
              <div className="border-b border-ink/8 p-4">
                <AdminBarterMap
                  listings={listings}
                  onPickListing={selectListing}
                />
              </div>
              {detailContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
