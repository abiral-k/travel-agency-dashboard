export function CardSkeleton({ height = "h-[260px]" }: { height?: string }) {
  return (
    <div
      className={`rounded-xl border border-light-200 bg-light-100 ${height} skeleton-shimmer overflow-hidden`}
      role="status"
      aria-label="Loading content"
    />
  );
}
