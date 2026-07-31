export function SkeletonCard() {
  return (
    <div className="p-4 border border-border rounded-xl bg-card/60 animate-pulse space-y-3">
      <div className="h-4 bg-muted rounded w-3/4"></div>
      <div className="h-3 bg-muted/60 rounded w-1/2"></div>
      <div className="flex gap-2 pt-2">
        <div className="h-5 w-16 bg-muted/80 rounded-full"></div>
        <div className="h-5 w-12 bg-muted/80 rounded-full"></div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
