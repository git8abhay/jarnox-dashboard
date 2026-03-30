const SkeletonCard = () => (
  <div className="soft-card p-5 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl bg-muted" />
      <div className="w-2 h-2 rounded-full bg-muted" />
    </div>
    <div className="h-5 bg-muted rounded-lg w-24 mb-2" />
    <div className="h-3 bg-muted rounded-lg w-32" />
  </div>
);

export const GridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const ChartSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="soft-card p-3 w-40 h-14 animate-pulse">
          <div className="h-2 bg-muted rounded w-16 mb-2" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
      ))}
    </div>
    <div className="soft-card h-[400px] animate-pulse flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-accent/40 border-t-primary animate-spin" />
    </div>
  </div>
);
