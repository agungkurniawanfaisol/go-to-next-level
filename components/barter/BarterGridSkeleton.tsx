export function BarterGridSkeleton() {
  return (
    <div>
      {/* Skeleton search bar */}
      <div className="mb-4 h-11 w-full animate-pulse rounded-xl bg-ink/8" />

      {/* Skeleton filters row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-ink/8" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 animate-pulse rounded-full bg-ink/8"
            />
          ))}
        </div>
      </div>

      {/* Skeleton result count */}
      <div className="mt-5 h-4 w-44 animate-pulse rounded bg-ink/8" />

      {/* Skeleton grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl bg-surface shadow-card"
          >
            {/* Image area */}
            <div className="aspect-[4/3] animate-pulse bg-gradient-to-br from-forest/10 to-emerald/5">
              {/* Badge placeholder */}
              <div className="m-3 inline-block h-5 w-24 rounded-full bg-ink/12" />
            </div>

            {/* Content area */}
            <div className="space-y-3 p-5">
              {/* Title */}
              <div className="h-5 w-3/4 animate-pulse rounded bg-ink/10" />
              <div className="h-5 w-1/2 animate-pulse rounded bg-ink/8" />

              {/* Owner */}
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 animate-pulse rounded-full bg-ink/10" />
                <div className="h-4 w-28 animate-pulse rounded bg-ink/8" />
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-emerald/10" />
                <div className="h-5 w-24 animate-pulse rounded-full bg-ink/8" />
              </div>

              {/* Wanted item */}
              <div className="h-4 w-2/3 animate-pulse rounded bg-ink/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
