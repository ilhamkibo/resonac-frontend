import React from 'react'

export default function StatsCard({
        icon,
        label,
        value,
        color,
        isLoading
    }: {
        icon: React.ReactNode;
        label: string;
        value?: number | string;
        color: string;
        isLoading: boolean
    }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-800 rounded-2xl p-4 min-h-[120px] shadow">
      <div className={`p-2 rounded-md ${color}`}>{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
        {isLoading ? <span className="animate-pulse">...</span> : value ?? "..."}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}