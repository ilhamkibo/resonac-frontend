import React, { useState } from "react";

type Row = {
  id: number;
  time: string;
  oilPressMain: number;
  oilPressPilot: number;
  operator: string;
  mainR: number;
  mainS: number;
  mainT: number;
  pilotR: number;
  pilotS: number;
  pilotT: number;
  oilTemp: number;
};

interface HistoryTableProps {
  tableData: Row[];
}

export default function HistoryTable({ tableData }: HistoryTableProps) {

     // ✅ State untuk tabel

  const [lastSaved, setLastSaved] = useState<{
    waktu: string;
    operator: string;
  } | null>(null);


  // ✅ Function simpan data
 

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-lg p-4">
      <h2 className="text-gray-800 dark:text-gray-100 text-lg font-semibold mb-3">
        History Penyimpanan Data
      </h2>

      <table className="min-w-full text-sm text-gray-700 dark:text-gray-300 border-collapse">
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
            {tableData.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-3 py-2">{row.time}</td>
                <td className="px-3 py-2">{row.operator}</td>
                <td className="text-center text-red-500">{row.mainR} A</td>
                <td className="text-center text-yellow-500">{row.mainS} A</td>
                <td className="text-center text-blue-500">{row.mainT} A</td>
                <td className="text-center text-emerald-500">{row.oilPressMain} bar</td>
                <td className="text-center text-emerald-500">{row.oilPressPilot} bar</td>
                <td className="text-center text-red-500">{row.pilotR} A</td>
                <td className="text-center text-yellow-500">{row.pilotS} A</td>
                <td className="text-center text-blue-500">{row.pilotT} A</td>
                <td className="text-center text-emerald-500">{row.oilPressPilot} bar</td>
                <td className="text-center text-orange-500">{row.oilTemp} °C</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
}
