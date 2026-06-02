import type { UserUploadStats } from "@/lib/api/barter";

type UploaderCardProps = {
  user: UserUploadStats;
};

export function UploaderCard({ user }: UploaderCardProps) {
  return (
    <article className="glass-panel flex items-center gap-4 rounded-2xl border border-ink/8 p-5 transition-shadow hover:shadow-elevated">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest/15 font-display text-lg font-bold text-forest">
        {user.name.charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{user.name}</p>
        <p className="truncate text-sm text-ink/55">{user.email}</p>
      </div>
      <div className="text-right text-sm">
        <p className="font-semibold text-ink">{user.uploadCount} upload</p>
        <p className="text-emerald">{user.barterCount} barter aktif</p>
      </div>
    </article>
  );
}
