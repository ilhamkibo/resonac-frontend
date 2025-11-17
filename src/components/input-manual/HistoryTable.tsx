// "use client";

// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { manualInputService } from "@/services/manualInputService";
// import { ApiResponseWrapper } from "@/types/apiType";
// import { ManualInput, ManualInputResponse } from "@/types/manualInputType";
// import Pagination from "../tables/Pagination";
// import Button from "../ui/button/Button";

// interface HistoryTableProps {
//   initialData: ApiResponseWrapper<ManualInputResponse>;
// }

// type Row = {
//   id: number | string;
//   time: string;
//   operator: string | number;
//   oilPressMain: number | null;
//   oilPressPilot: number | null;
//   mainR: number | null;
//   mainS: number | null;
//   mainT: number | null;
//   pilotR: number | null;
//   pilotS: number | null;
//   pilotT: number | null;
//   oilTemp: number | null;
// };

// export const formatServerDataToRow = (input: ManualInput): Row => {
//   const mainPump = input.details.find((d) => d.area === "main");
//   const pilotPump = input.details.find((d) => d.area === "pilot");
//   const oil = input.details.find((d) => d.area === "oil");

//   return {
//     id: input.id,
//     time: new Date(input.timestamp).toLocaleString("id-ID"),
//     operator: input.username,
//     oilPressMain: mainPump?.oil_pressure ?? null,
//     mainR: mainPump?.ampere_r ?? null,
//     mainS: mainPump?.ampere_s ?? null,
//     mainT: mainPump?.ampere_t ?? null,
//     oilPressPilot: pilotPump?.oil_pressure ?? null,
//     pilotR: pilotPump?.ampere_r ?? null,
//     pilotS: pilotPump?.ampere_s ?? null,
//     pilotT: pilotPump?.ampere_t ?? null,
//     oilTemp: oil?.oil_temperature ?? null,
//   };
// };

// // CSV Export function
// const exportToCSV = (rows: Row[]) => {
//   const header = Object.keys(rows[0]).join(",");
//   const values = rows
//     .map((r) =>
//       Object.values(r)
//         .map((v) => `"${v ?? ""}"`)
//         .join(",")
//     )
//     .join("\n");

//   const csvContent = [header, values].join("\n");
//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.download = "history-manual-inputs.csv";
//   link.click();
// };

// export default function HistoryTable({ initialData }: HistoryTableProps) {
//   const [page, setPage] = useState(1);

//   // filters
//   const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "">("monthly");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [limit, setLimit] = useState(10);

//   // QUERY
//   const { data: manualInput, isFetching, isLoading } = useQuery({
//     queryKey: ["manual-inputs", page, period, startDate, endDate, limit],
//     queryFn: () =>
//       manualInputService.getManualInputs({
//         page,
//         limit,
//         ...(period ? { period } : {}),
//         ...(!period && startDate && endDate ? { startDate, endDate } : {}),
//       }),
//       placeholderData:initialData,
//   });

//   const rows = manualInput?.data?.data
//     ? manualInput.data.data.map(formatServerDataToRow)
//     : [];

//   const handlePageChange = (newPage: number) => {
//     setPage(newPage);
//   };

//   const [activeFilter, setActiveFilter] = useState<"period" | "date" | null>(null);

//   // Switch to PERIOD mode
//   const activatePeriod = () => {
//     setActiveFilter("period");
//     setStartDate("");
//     setEndDate("");
//     setPage(1);
//   };

//   // Switch to DATE RANGE mode
//   const activateDate = () => {
//     setActiveFilter("date");
//     setPeriod("");
//     setPage(1);
//   };

//   return (
//     <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border p-4 shadow-lg">
//       <h2 className="text-lg font-semibold mb-3">
//         History Penyimpanan Data
//       </h2>

//       <div className="flex gap-4 justify-between items-end">
//         <div className="flex gap-4">
//           {/* FILTER TYPE BUTTONS */}
//           <div className="flex gap-2 mb-4">
//             <Button
//               onClick={activatePeriod}
//               className={`px-4 py-2 rounded border ${
//                 activeFilter === "period"
//                   ? "bg-emerald-600 text-white"
//                   : "bg-gray-200 dark:bg-slate-700"
//               }`}
//             >
//               Period
//             </Button>

//             <Button
//               onClick={activateDate}
//               className={`px-4 py-2 rounded border ${
//                 activeFilter === "date"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200 dark:bg-slate-700"
//               }`}
//             >
//               Date Range
//             </Button>
//           </div>

//           {/* FILTER INPUTS */}
//           <div className="flex flex-wrap gap-4 mb-4 items-end">


//             {/* LIMIT */}
//             <div>
//               <label className="text-sm">Limit</label>
//               <select
//                 className="border rounded px-3 py-2 block mt-1"
//                 value={limit}
//                 onChange={(e) => setLimit(Number(e.target.value))}
//               >
//                 <option value="10">10 rows</option>
//                 <option value="20">20 rows</option>
//                 <option value="50">50 rows</option>
//               </select>
//             </div>

//             {/* PERIOD MODE */}
//             {activeFilter === "period" && (
//               <div>
//                 <label className="text-sm">Select Period</label>
//                 <select
//                   className="border rounded px-3 py-2 block mt-1"
//                   value={period}
//                   onChange={(e) => setPeriod(e.target.value as any)}
//                 >
//                   <option value="daily">Daily</option>
//                   <option value="weekly">Weekly</option>
//                   <option value="monthly">Monthly</option>
//                 </select>
//               </div>
//             )}

//             {/* DATE MODE */}
//             {activeFilter === "date" && (
//               <>
//                 <div>
//                     <label className="text-sm">Start Date</label>
//                     <input
//                       type="date"
//                       value={startDate}
//                       className="border rounded px-3 py-2 block mt-1"
//                       onChange={(e) => setStartDate(e.target.value)}
//                     />
//                 </div>

//                 <div>
//                   <label className="text-sm">End Date</label>
//                   <input
//                     type="date"
//                     value={endDate}
//                     className="border rounded px-3 py-2 block mt-1"
//                     onChange={(e) => setEndDate(e.target.value)}
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//         <div className="mb-4">
//           <Button
//             onClick={() => exportToCSV(rows)}
//             className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
//           >
//             Export CSV
//           </Button>
//         </div>
//       </div>

//       {isFetching && <p className="text-sm">Loading...</p>}

//       {manualInput?.data?.meta ? (
//         <>
//           <table className="min-w-full text-sm text-gray-700 dark:text-gray-300 border-collapse">
//             <thead className="bg-gray-100 dark:bg-slate-800/70 text-gray-700 dark:text-gray-200 uppercase text-xs tracking-wide border border-gray-300 dark:border-slate-700">
//               <tr>
//                 <th className="px-3 py-2 border border-slate-600" rowSpan={2}>Waktu</th>
//                 <th className="px-3 py-2 border border-slate-600" rowSpan={2}>Operator</th>
//                 <th className="px-3 py-2 border border-slate-600" colSpan={4}>
//                   Main Pump
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" colSpan={4}>
//                   Pilot Pump
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" rowSpan={2}>Oil Temp </th>
//               </tr>
//               <tr>
//                 <th className="px-3 py-2 border border-slate-600" >
//                   Ampere R
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" >
//                   Ampere S
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" >
//                   Ampere T
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" >
//                   Oil Pressure
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" >
//                   Ampere R
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" >
//                   Ampere S
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" >
//                   Ampere T
//                 </th>
//                 <th className="px-3 py-2 border border-slate-600" >
//                   Oil Pressure
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {rows.map((row, idx) => (
//                 <tr key={idx} className="border-t border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60">
//                   <td className="px-3 py-2">{row.time}</td>
//                   <td className="px-3 py-2 capitalize">{row.operator}</td>
//                   <td className="text-center text-red-500">{row.mainR} A</td>
//                   <td className="text-center text-yellow-500">{row.mainS} A</td>
//                   <td className="text-center text-blue-500">{row.mainT} A</td>
//                   <td className="text-center text-emerald-500">{row.oilPressMain} bar</td>
//                   <td className="text-center text-emerald-500">{row.pilotR} A</td>
//                   <td className="text-center text-yellow-500">{row.pilotS} A</td>
//                   <td className="text-center text-blue-500">{row.pilotT} A</td>
//                   <td className="text-center text-emerald-500">{row.oilPressPilot} bar</td>
//                   <td className="text-center text-orange-500">{row.oilTemp} °C</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* PAGINATION */}
//           <div className="flex items-center justify-between mt-5">
//             <span className="text-sm text-gray-700 dark:text-gray-400">
//               Page <span className="font-semibold">{manualInput.data.meta.page}</span> of <span className="font-semibold">{manualInput.data.meta.totalPages}</span>
//               <span className="hidden sm:inline"> (Total: {manualInput.data.meta.total} data)</span>
//             </span>

//               <Pagination
//               currentPage={manualInput.data.meta.page}
//               totalPages={manualInput.data.meta.totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </>
//       ) : (
//         <div>Loading...</div>
//       )}
//     </div>
//   );
// }

"use client";

import Pagination from "../tables/Pagination";

export type Row = {
  id: number | string;
  time: string;
  operator: string | number;
  oilPressMain: number | null;
  oilPressPilot: number | null;
  mainR: number | null;
  mainS: number | null;
  mainT: number | null;
  pilotR: number | null;
  pilotS: number | null;
  pilotT: number | null;
  oilTemp: number | null;
};

export const formatServerDataToRow = (input: any): Row => {
  const mainPump = input.details.find((d: any) => d.area === "main");
  const pilotPump = input.details.find((d: any) => d.area === "pilot");
  const oil = input.details.find((d: any) => d.area === "oil");

  return {
    id: input.id,
    time: new Date(input.timestamp).toLocaleString("id-ID"),
    operator: input.username,
    oilPressMain: mainPump?.oil_pressure ?? null,
    mainR: mainPump?.ampere_r ?? null,
    mainS: mainPump?.ampere_s ?? null,
    mainT: mainPump?.ampere_t ?? null,
    oilPressPilot: pilotPump?.oil_pressure ?? null,
    pilotR: pilotPump?.ampere_r ?? null,
    pilotS: pilotPump?.ampere_s ?? null,
    pilotT: pilotPump?.ampere_t ?? null,
    oilTemp: oil?.oil_temperature ?? null,
  };
};

interface Props {
  rows: Row[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | undefined;
  onPageChange: (page: number) => void;
}

export default function HistoryTable({ rows, meta, onPageChange }: Props) {
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
              <td className="px-3 py-2 text-black dark:text-gray-400">{row.time}</td>
              <td className="px-3 py-2 capitalize text-black dark:text-gray-400">{row.operator}</td>
              <td className="text-center text-red-500">{row.mainR} A</td>
              <td className="text-center text-yellow-500 dark:">{row.mainS} A</td>
              <td className="text-center text-blue-500 dark:">{row.mainT} A</td>
              <td className="text-center text-emerald-500 dark:">{row.oilPressMain} bar</td>
              <td className="text-center text-emerald-500 dark:">{row.pilotR} A</td>
              <td className="text-center text-yellow-500 dark:">{row.pilotS} A</td>
              <td className="text-center text-blue-500 dark:">{row.pilotT} A</td>
              <td className="text-center text-emerald-500 dark:">{row.oilPressPilot} bar</td>
              <td className="text-center text-orange-500 dark:">{row.oilTemp} °C</td>
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
