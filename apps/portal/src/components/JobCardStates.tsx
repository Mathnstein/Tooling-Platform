export function JobCardLoadingSkeleton() {
  return (
    <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm animate-pulse">
      {/* Header: ID and Badge placeholders */}
      <div className="flex justify-between items-start mb-6">
        <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-6 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
      </div>

      {/* Title and Subtitle placeholders */}
      <div className="space-y-3 mb-6">
        <div className="h-5 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-3 w-1/3 bg-zinc-100 dark:bg-zinc-800 rounded" />
      </div>

      {/* Tool Input Box placeholder */}
      <div className="h-16 w-full bg-zinc-50 dark:bg-zinc-950 rounded-xl mb-6 border border-zinc-100 dark:border-zinc-900" />

      {/* Action Button placeholder */}
      <div className="h-10 w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700" />
    </div>
  );
}

export function JobCardErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="p-8 border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-3xl text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
        <span className="text-red-600 dark:text-red-400 text-xl font-bold">!</span>
      </div>
      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Failed to sync queue</h3>
      <p className="text-red-600 dark:text-red-400/80 mb-6 text-sm">{message}</p>
      <button 
        onClick={retry}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-sm active:scale-95"
      >
        Retry Connection
      </button>
    </div>
  );
}