export function UsersTableSkeleton() {
  return (
    <section
      className="rounded-xl border border-light-200 bg-white shadow-sm overflow-hidden"
      role="status"
      aria-label="Loading users table"
    >
      <div className="px-6 py-4 border-b border-light-200 flex items-center justify-between">
        <div className="h-5 w-32 rounded bg-light-200 skeleton-shimmer" />
        <div className="h-9 w-24 rounded-lg bg-light-200 skeleton-shimmer" />
      </div>

      <div className="px-6 py-4 space-y-2">
        {/* header row */}
        <div className="grid grid-cols-12 gap-4 pb-3 border-b border-light-200">
          <div className="col-span-4 h-3 rounded bg-light-200 skeleton-shimmer" />
          <div className="col-span-4 h-3 rounded bg-light-200 skeleton-shimmer" />
          <div className="col-span-2 h-3 rounded bg-light-200 skeleton-shimmer" />
          <div className="col-span-2 h-3 rounded bg-light-200 skeleton-shimmer" />
        </div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-4 items-center py-4 border-b border-light-300 last:border-b-0"
          >
            <div className="col-span-4 flex items-center gap-3">
              <div className="size-8 rounded-full bg-light-200 skeleton-shimmer flex-shrink-0" />
              <div className="h-3 w-24 rounded bg-light-200 skeleton-shimmer flex-1" />
            </div>
            <div className="col-span-4 h-3 w-full rounded bg-light-200 skeleton-shimmer" />
            <div className="col-span-2 h-3 w-20 rounded bg-light-200 skeleton-shimmer" />
            <div className="col-span-2">
              <div className="h-5 w-16 rounded-full bg-light-200 skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
