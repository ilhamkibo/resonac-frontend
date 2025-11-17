"use client";

export default function SkeletonDashboard() {
  return (
    <div className="p-6 animate-pulse">

      {/* Realtime Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border rounded-lg p-4 shadow"
          >
            <div className="h-6 w-32 bg-gray-300 dark:bg-slate-700 rounded mb-4" />

            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="bg-gray-200 dark:bg-slate-800 rounded-lg h-20"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pressure + Temp */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-4 border rounded-lg shadow"
          >
            <div className="h-6 w-40 bg-gray-300 dark:bg-slate-700 rounded mb-4" />
            <div className="h-24 w-full bg-gray-200 dark:bg-slate-800 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <div className="h-10 w-40 bg-gray-300 dark:bg-slate-700 rounded"></div>
      </div>

      {/* Filter Section */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-lg shadow border mt-8">
        <div className="flex gap-4 items-center">
          <div className="h-8 w-24 bg-gray-300 dark:bg-slate-700 rounded" />
          <div className="h-8 w-24 bg-gray-300 dark:bg-slate-700 rounded" />
          <div className="h-8 w-28 bg-gray-300 dark:bg-slate-700 rounded" />

          <div className="h-8 w-28 bg-gray-300 dark:bg-slate-700 rounded" />
          <div className="h-8 w-28 bg-gray-300 dark:bg-slate-700 rounded" />

          <div className="ml-auto h-8 w-28 bg-gray-300 dark:bg-slate-700 rounded" />
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white dark:bg-slate-900 rounded-lg shadow border p-4">
        
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 border-b pb-3 mb-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-full bg-gray-300 dark:bg-slate-700 rounded"
            />
          ))}
        </div>

        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 gap-4 py-3 border-b last:border-none"
          >
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={j}
                className="h-4 w-full bg-gray-200 dark:bg-slate-800 rounded"
              />
            ))}
          </div>
        ))}

        {/* Pagination */}
        <div className="flex justify-end gap-2 mt-4">
          <div className="h-8 w-8 bg-gray-300 dark:bg-slate-700 rounded" />
          <div className="h-8 w-20 bg-gray-300 dark:bg-slate-700 rounded" />
          <div className="h-8 w-8 bg-gray-300 dark:bg-slate-700 rounded" />
        </div>
      </div>
    </div>
  );
}
