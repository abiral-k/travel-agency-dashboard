export function TripCardSkeleton() {
  return (
    <div
      className="trip-card shadow-300 bg-white rounded-[20px] overflow-hidden flex-col w-full"
      role="status"
      aria-label="Loading trip card"
    >
      {/* Image placeholder - h-[160px] to match actual trip card */}
      <div className="w-full h-[160px] bg-light-200 skeleton-shimmer" />

      {/* Article content */}
      <article className="flex flex-col gap-3 mt-4 pl-[18px] pr-3.5 pb-4">
        {/* Title - text-sm md:text-lg font-semibold line-clamp-2 */}
        <div className="space-y-2">
          <div className="h-5 w-3/4 rounded bg-light-200 skeleton-shimmer" />
          <div className="h-5 w-1/2 rounded bg-light-200 skeleton-shimmer" />
        </div>

        {/* Location - flex items-center gap-2 */}
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-light-200 skeleton-shimmer flex-shrink-0" />
          <div className="h-4 w-32 rounded bg-light-200 skeleton-shimmer flex-1" />
        </div>
      </article>

      {/* Tags/Chips placeholder */}
      <div className="mt-5 pl-[18px] pr-3.5 pb-5 flex gap-2">
        <div className="h-7 w-16 rounded-full bg-light-200 skeleton-shimmer" />
        <div className="h-7 w-16 rounded-full bg-light-200 skeleton-shimmer" />
      </div>

      {/* Price/Bottom info placeholder */}
      <div className="h-12 w-full bg-light-200 skeleton-shimmer" />
    </div>
  );
}
