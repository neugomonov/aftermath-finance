export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-slate-700/50 rounded-lg w-3/4"></div>
      <div className="h-8 bg-slate-700/50 rounded-lg"></div>
    </div>
  );
}

export function EstimateSkeleton() {
  return (
    <div className="animate-pulse bg-slate-800/30 border border-slate-700/50 rounded-lg sm:rounded-xl p-4 sm:p-5 space-y-2 sm:space-y-3 backdrop-blur-sm">
      <div className="h-3 sm:h-4 bg-slate-700/50 rounded-lg w-1/2"></div>
      <div className="h-6 sm:h-8 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-lg w-3/4"></div>
    </div>
  );
}

