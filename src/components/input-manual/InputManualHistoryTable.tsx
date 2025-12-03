"use client";

import { ManualInputTable } from "@/types/manualInputType";
import Pagination from "../tables/Pagination";

interface Props {
  rows: ManualInputTable[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | undefined;
  onPageChange: (page: number) => void;
}

export default function InputManualHistoryTable({ rows, meta, onPageChange }: Props) {
  if (!meta) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-3 text-black dark:text-gray-400">History Penyimpanan Data</h2>

      <table className="min-w-full text-sm border-collapse">
        <thead className="bg-gray-100 dark:bg-slate-800/70 text-gray-700 dark:text-gray-200 uppercase text-xs tracking-wide border border-gray-300 dark:border-slate-700">
          <tr>
            <th className="px-3 py-2 border border-slate-600" rowSpan={2}>Waktu</th>
            <th className="px-3 py-2 border border-slate-600" rowSpan={2}>Operator</th>
            <th className="px-3 py-2 border border-slate-600" colSpan={4}>
              Main Pump
            </th>
            <th className="px-3 py-2 border border-slate-600" colSpan={4}>
              Pilot Pump
            </th>
            <th className="px-3 py-2 border border-slate-600" rowSpan={2}>Oil Temp </th>
          </tr>
          <tr>
            <th className="px-3 py-2 border border-slate-600" >
              Ampere R
            </th>
            <th className="px-3 py-2 border border-slate-600" >
              Ampere S
            </th>
            <th className="px-3 py-2 border border-slate-600" >
              Ampere T
            </th>
            <th className="px-3 py-2 border border-slate-600" >
              Oil Pressure
            </th>
            <th className="px-3 py-2 border border-slate-600" >
              Ampere R
            </th>
            <th className="px-3 py-2 border border-slate-600" >
              Ampere S
            </th>
            <th className="px-3 py-2 border border-slate-600" >
              Ampere T
            </th>
            <th className="px-3 py-2 border border-slate-600" >
              Oil Pressure
            </th>
          </tr>
        </thead>

        <tbody>
            {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60">
              <td className="px-3 py-2 text-black dark:text-gray-400">{new Date(row.time).toLocaleString("id-ID")}</td>
              <td className="px-3 py-2 capitalize text-black dark:text-gray-400">{row.operator}</td>
              <td className="text-center text-red-500">{Number(row.mainR).toFixed(2)} A</td>
              <td className="text-center text-yellow-500 dark:">{Number(row.mainS).toFixed(2)} A</td>
              <td className="text-center text-blue-500 dark:">{Number(row.mainT).toFixed(2)} A</td>
              <td className="text-center text-emerald-500 dark:">{Number(row.oilPressMain).toFixed(2)} bar</td>
              <td className="text-center text-emerald-500 dark:">{Number(row.pilotR).toFixed(2)} A</td>
              <td className="text-center text-yellow-500 dark:">{Number(row.pilotS).toFixed(2)} A</td>
              <td className="text-center text-blue-500 dark:">{Number(row.pilotT).toFixed(2)} A</td>
              <td className="text-center text-emerald-500 dark:">{Number(row.oilPressPilot).toFixed(2)} bar</td>
              <td className="text-center text-orange-500 dark:">{Number(row.oilTemp).toFixed(2)} °C</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-5">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Page <span className="font-semibold">{meta.page}</span> of <span className="font-semibold">{meta.totalPages}</span>
          <span className="hidden sm:inline"> (Total: {meta.total} data)</span>
        </span>

        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
        />
      </div>

    </div>
  );
}
