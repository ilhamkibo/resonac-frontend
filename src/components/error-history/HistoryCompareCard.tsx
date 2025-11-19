"use client";
import { ErrorHistoryCompare } from "@/types/errorHistoryType";
import AreaItem from "./AreaItem";
import SummaryCard from "./SummaryCard";

export default function HistoryCompareCard(props: ErrorHistoryCompare) {
  const maxErrorCount = Math.max(...props.details.byArea.map((i) => i.count), 1);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      
      {/* LEFT SUMMARY CARD */}
      <SummaryCard props={props} />

      <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent mx-2" />
      <div className="block lg:hidden h-[1px] w-full bg-gray-100 my-2" />

      {/* RIGHT AREA DETAILS */}
      <div className="flex-[2] bg-white dark:bg-gray-700 shadow-lg rounded-xl p-2 border border-gray-100 dark:border-gray-500 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-gray-800 font-bold text-lg dark:text-white">Detail per Area</h3>
          <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100">
            {props.details.byAreaParameter.length} Locations
          </span>
        </div>

        {props.details.byAreaParameter.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <div className="bg-gray-100 p-3 rounded-full mb-3">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium text-sm">Tidak ada data area</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
            {props.details.byAreaParameter.map((item, idx) => (
              <AreaItem key={item.area || idx} item={item} maxErrorCount={maxErrorCount} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
