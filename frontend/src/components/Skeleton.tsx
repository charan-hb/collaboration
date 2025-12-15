export const Skeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="card space-y-2">
    {Array.from({ length: lines }).map((_, idx) => (
      <div
        key={idx}
        className="h-4 animate-pulse rounded bg-slate-200"
        style={{ width: `${70 + idx * 5}%` }}
      />
    ))}
  </div>
);


