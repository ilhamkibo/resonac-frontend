export default function AreaItem({ item, maxErrorCount }: { item: any; maxErrorCount: number }) {
  const percentage = Math.round((item.total / maxErrorCount) * 100);
  const topIssue =
    item.parameters?.length > 0
      ? item.parameters.reduce((a: any, b: any) => (a.count > b.count ? a : b))
      : null;

  return (
    <div className="group flex-1 px-4 py-4 border border-gray-100 rounded-xl bg-gray-50/50 dark:bg-gray-800 hover:shadow-lg dark:border-gray-600 hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
            {item.area?.substring(0, 2).toUpperCase() || "??"}
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider dark:text-gray-300">Area Name</p>
            <p className="font-bold text-gray-800 text-base capitalize line-clamp-1 dark:text-white">{item.area}</p>
          </div>
        </div>

        <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-indigo-600">{item.total}</p>
      </div>

      <div>
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs text-gray-400">Error Load</span>
          <span className="text-xs font-bold text-gray-600">{percentage}%</span>
        </div>

        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-600 transition-all duration-1000"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {topIssue && (
          <div className="inline-flex items-center gap-1.5 bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-500 w-full">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            <p className="text-xs text-gray-500 truncate dark:text-gray-300">
              Main issue: <span className="font-semibold text-gray-700 dark:text-white">{topIssue.parameter}</span> ({topIssue.count})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}