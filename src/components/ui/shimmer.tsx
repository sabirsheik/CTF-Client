export const ShimmerCard = () => {
  return (
    <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-6 animate-pulse">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-full bg-slate-700/50"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-700/50 rounded w-32 mb-2"></div>
              <div className="h-3 bg-slate-700/50 rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-700/50 rounded w-full"></div>
          <div className="h-3 bg-slate-700/50 rounded w-5/6"></div>
        </div>
        <div className="h-10 bg-slate-700/50 rounded w-full mt-4"></div>
      </div>
    </div>
  );
};

export const ShimmerGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
};

export const ShimmerStatCard = () => {
  return (
    <div className="bg-slate-900/70 border-2 border-green-500/30 rounded-lg p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 bg-slate-700/50 rounded w-24 mb-2"></div>
          <div className="h-8 bg-slate-700/50 rounded w-16"></div>
        </div>
        <div className="w-14 h-14 rounded-full bg-slate-700/50"></div>
      </div>
    </div>
  );
};

export const ShimmerSearchBar = () => {
  return (
    <div className="h-12 bg-slate-800/50 border border-green-500/30 rounded-lg animate-pulse"></div>
  );
};
