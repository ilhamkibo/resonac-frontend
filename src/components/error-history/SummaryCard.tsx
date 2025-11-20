import { ErrorHistoryCompare } from "@/types/errorHistoryType";

export default function SummaryCard({ props }: { props: ErrorHistoryCompare }) {
  const SummaryItem = ({
    label,
    current,
    previous,
    color,
    tag,
  }: {
    label: string;
    current: number;
    previous: number;
    color: string;
    tag: string;
  }) => {
    
    let percentage: string | number = "-";

    if (previous !== 0) {
      percentage = (((current - previous) / previous) * 100).toFixed(1);
    }
    
    const isUp = current > previous;

    return (
      <div className="px-5 py-3 flex-1 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${color} rounded-l-xl group-hover:w-2 transition-all`} />
        
        <div className="flex justify-between items-start mb-3">
          <span className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</span>
          <span className={`${color.replace("bg-", "")} bg-opacity-10 dark:text-gray-300 px-2 py-1 rounded text-[10px] font-extrabold`}>
            {tag}
          </span>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <h3 className="text-4xl font-bold text-gray-800 dark:text-white">{current}</h3>
          <span className="text-sm text-gray-400 font-medium mb-1">kasus</span>
        </div>

        <div className="flex items-center gap-2 text-sm bg-white dark:bg-gray-700 p-2 rounded-lg border border-gray-100 dark:border-gray-500 shadow-sm w-max">
          <span className={`p-1 rounded-full ${isUp ? "text-red-500 bg-red-50" : "text-green-500 bg-green-50"}`}>
            {isUp ? "↑" : "↓"}
          </span>
          <span className="font-bold text-gray-700 dark:text-white">{percentage}%</span>
          <span className="text-gray-400 text-xs">vs sebelumnya</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-700 shadow-lg rounded-xl p-2 border border-gray-100 dark:border-gray-500">
      <h3 className="text-gray-800 dark:text-white font-bold text-lg 2xl:mb-3 mb-2">Ringkasan Error</h3>

      <div className="flex md:flex-row flex-col gap-4 min-w-[280px]">
        <SummaryItem
          label="Weekly Error"
          current={props.weekly.thisWeek}
          previous={props.weekly.lastWeek}
          color="bg-[#008FFB]"
          tag="THIS WEEK"
        />
        <SummaryItem
          label="Monthly Error"
          current={props.monthly.thisMonth}
          previous={props.monthly.lastMonth}
          color="bg-[#FF4560]"
          tag="THIS MONTH"
        />
      </div>
    </div>
  );
}
