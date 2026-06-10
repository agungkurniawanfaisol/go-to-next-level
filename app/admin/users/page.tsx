export const dynamic = "force-dynamic";

import { AdminTopBar } from "@/components/admin/AdminTopBar";
import { getUsers } from "@/lib/api/appraisals";

function formatRole(role: string): string {
  const map: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    CURATOR: "Curator",
    MEMBER: "Member",
  };
  return map[role] ?? role;
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <>
      <AdminTopBar title="Pengguna" description="Manajemen akun komunitas" />
      <div className="space-y-3 p-6 lg:p-8 dark:text-[#f0ebe3]">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ink/8 bg-surface/80 px-5 py-4 shadow-card transition-shadow hover:shadow-elevated"
            >
              <div>
                <p className="font-semibold text-ink">{user.name}</p>
                <p className="text-sm text-ink/60">{user.email}</p>
              </div>
              <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-ink">
                {formatRole(user.role)}
              </span>
            </div>
          ))
        ) : (
          <p className="py-8 text-center text-sm text-ink/50">
            Belum ada pengguna terdaftar.
          </p>
        )}
      </div>
    </>
  );
}
