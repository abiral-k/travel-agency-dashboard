export function StatsCardSkeleton({ label }: { label: string }) {
  return (
    <div
      className="stats-card bg-white rounded-20 shadow-400 p-6 overflow-hidden"
      role="status"
      aria-label="Loading stat card"
    >
      <h3 className="text-base font-medium text-dark-400 mb-6">{label}</h3>

      <div className="flex flex-row md:flex-col-reverse xl:flex-row xl:items-center gap-3 justify-between">
        <div className="flex flex-col gap-4 flex-1">
          {/* Large number placeholder */}
          <div className="h-12 w-32 rounded-lg bg-light-200 skeleton-shimmer" />

          {/* Trend info */}
          <div className="flex items-center gap-2">
            <div className="size-5 rounded bg-light-200 skeleton-shimmer" />
            <div className="h-4 w-32 rounded bg-light-200 skeleton-shimmer" />
          </div>
        </div>

        {/* Icon/Graph placeholder */}
        <div className="w-24 h-20 md:h-24 xl:h-20 rounded-lg bg-light-200 skeleton-shimmer flex-shrink-0" />
      </div>
    </div>
  );
}
