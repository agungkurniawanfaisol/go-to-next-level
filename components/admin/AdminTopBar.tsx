"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useAuth } from "@/lib/auth-context";
import { logoutAction } from "@/lib/actions/auth";

type AdminTopBarProps = {
  title: string;
  description?: string;
};

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    SUPER_ADMIN: "bg-emerald/15 text-emerald border-emerald/30",
    CURATOR: "bg-gold/12 text-ink border-gold/30",
    MEMBER: "bg-ink/8 text-ink/60 border-ink/15",
  };
  const labels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    CURATOR: "Kurator",
    MEMBER: "Member",
  };

  return (
    <span
      className={`hidden rounded-full border px-3 py-1 text-xs font-medium sm:inline ${styles[role] ?? "bg-ink/8 text-ink/60 border-ink/15"}`}
    >
      {labels[role] ?? role}
    </span>
  );
}

export function AdminTopBar({ title, description }: AdminTopBarProps) {
  const user = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      router.push("/");
    });
  };

  return (
    <header className="sticky top-16 z-20 flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-ink/8 bg-ivory/95 px-6 py-5 backdrop-blur-md lg:top-0 lg:px-8">
      <div>
        <h1 className="text-xl font-bold text-ink md:text-2xl">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-ink/60">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <>
            <RoleBadge role={user.role} />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">{user.name}</p>
              <p className="text-xs text-ink/50">{user.email}</p>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-forest text-sm font-semibold text-ivory"
              aria-hidden
            >
              {user.initial}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="text-sm font-medium text-ink/70 transition-colors hover:text-emerald disabled:opacity-50"
        >
          {isPending ? "Keluar..." : "Keluar"}
        </button>
      </div>
    </header>
  );
}
