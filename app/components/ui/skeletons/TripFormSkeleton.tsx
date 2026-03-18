export function TripFormSkeleton() {
  return (
    <div className="space-y-5" role="status" aria-label="Loading form">
      {[...Array(6)].map((_, i) => (
        <div key={i}>
          <div className="h-4 w-24 rounded bg-light-200 skeleton-shimmer mb-2" />
          <div className="h-11 w-full rounded-xl bg-light-200 skeleton-shimmer" />
        </div>
      ))}
      <div>
        <div className="h-4 w-32 rounded bg-light-200 skeleton-shimmer mb-2" />
        <div className="h-64 w-full rounded-xl bg-light-200 skeleton-shimmer" />
      </div>
      <div className="h-11 w-32 rounded-lg bg-light-200 skeleton-shimmer mt-6" />
    </div>
  );
}
