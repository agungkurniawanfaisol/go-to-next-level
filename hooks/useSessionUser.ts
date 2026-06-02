"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SessionUser = {
  name: string;
  email: string;
  role: string;
  totalPoints: number;
} | null;

export type SessionProfile = {
  name: string | null;
  totalPoints: number | null;
};

export function useSessionProfile(initial?: {
  name?: string | null;
  totalPoints?: number | null;
}): SessionProfile {
  const pathname = usePathname();
  const [profile, setProfile] = useState<SessionProfile>({
    name: initial?.name ?? null,
    totalPoints: initial?.totalPoints ?? null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
        });
        if (!res.ok || cancelled) return;

        const data = (await res.json()) as { user: SessionUser };
        setProfile({
          name: data.user?.name ?? null,
          totalPoints: data.user?.totalPoints ?? null,
        });
      } catch {
        // Tetap tampilkan nilai SSR jika fetch gagal
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return profile;
}

/** @deprecated Gunakan useSessionProfile */
export function useSessionUser(initialName?: string | null) {
  const { name } = useSessionProfile({ name: initialName });
  return name;
}
