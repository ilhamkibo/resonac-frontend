// components/dashboard/DataTable.tsx
import Pagination from "../tables/Pagination";
import { AggregatedDataResponse } from "@/types/measurementType";

// types/measurementType.ts (gunakan existing file)
export interface MeasurementRow {
  timestamp: string;
  ampere_rs?: number;
  ampere_st?: number;
  ampere_tr?: number;
  volt_rs?: number;
  volt_st?: number;
  volt_tr?: number;
  pf?: number;
  kwh?: number;
  oil_pressure?: number;
  oil_temperature?: number;
  area?: string;
}


interface DataTableProps {
    tableData: MeasurementRow[];
    aggregatedData: AggregatedDataResponse | undefined;
    handlePageChange: (newPage: number) => void;
    isLoading: boolean;
    isError: boolean;
}

export default function DataTable({
    tableData,
    aggregatedData,
    handlePageChange,
    isLoading,
    isError,
}: DataTableProps) {
    const meta = aggregatedData?.meta;

    // 🔹 Loading
    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow animate-pulse">
                <h2 className="h-6 bg-gray-300 dark:bg-gray-600 w-40 mb-4 rounded"></h2>
                <div className="space-y-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    // 🔹 Error
    if (isError) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center">
                <h2 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">Error</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Failed to fetch log data. Please try again later.
                </p>
            </div>
        );
    }

    // 🔹 Empty
    if (tableData.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Log History</h2>
                <div className="p-4 text-sm text-gray-500">No log data</div>
            </div>
        );
    }

    const columns = (Object.keys(tableData[0]) as (keyof MeasurementRow)[])
    .sort((a, b) => (a === "area" ? -1 : b === "area" ? 1 : 0));

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Log History</h2>

            {/* Pagination Info */}
            {/* <div className="flex items-center justify-between my-5">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                    Page <span className="font-semibold">{meta?.page ?? 1}</span> of{" "}
                    <span className="font-semibold">{meta?.totalPages ?? 1}</span>
                    <span className="hidden sm:inline"> (Total: {meta?.total} data)</span>
                </span>
                {meta && (
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div> */}

            {/* Table */}
            <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="px-4 py-3">{col.replace(/_/g, " ")}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y bg-white dark:bg-gray-800 dark:divide-gray-700">
                    {tableData.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => {
                                let value = row[col];
                                if (col === "timestamp" && value) {
                                    value = new Date(value).toLocaleString("id-ID", {
                                        timeZone: "Asia/Jakarta",
                                    });
                                }
                                return (
                                    <td key={col} className="px-4 py-3 dark:text-gray-400">
                                        {String(value ?? "")}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex items-center justify-between my-5">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                    Page <span className="font-semibold">{meta?.page ?? 1}</span> of{" "}
                    <span className="font-semibold">{meta?.totalPages ?? 1}</span>
                    <span className="hidden sm:inline"> (Total: {meta?.total} data)</span>
                </span>
                {meta && (
                    <Pagination
                        currentPage={meta.page}
                        totalPages={meta.totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}
