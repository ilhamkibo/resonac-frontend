// components/dashboard/DataTable.tsx
import Pagination from "../tables/Pagination";
import { AggregatedDataResponse } from "@/types/measurementType";

interface DataTableProps {
    tableData: Record<string, any>[];
    aggregatedData: AggregatedDataResponse | undefined;
    handlePageChange: (newPage: number) => void;
}

export default function DataTable({ tableData, aggregatedData, handlePageChange }: DataTableProps) {
    const meta = aggregatedData?.meta;

    if (tableData.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Log History</h2>
                <div className="p-4 text-sm text-gray-500">No log data</div>
            </div>
        );
    }

    // Mendapatkan header kolom (memastikan kolom 'id' tidak ikut)
    const columns = Object.keys(tableData[0])
        .filter((col) => col !== "id")
        // Sortir agar 'area' muncul di awal jika ada
        .sort((a, b) => (a === "area" ? -1 : b === "area" ? 1 : 0));

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Log History</h2>

            <div className="flex items-center justify-between my-5">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                    Page <span className="font-semibold">{meta?.page ?? 1}</span> of <span className="font-semibold">{meta?.totalPages ?? 1}</span>
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
            
            <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
                    <tr>
                        {columns.map((col) => (
                            <th key={col} className="px-4 py-3 text-left text-gray-500 dark:text-gray-400">{col.replace(/_/g, ' ')}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y bg-white dark:bg-gray-800 dark:divide-gray-700">
                    {tableData.map((row, i) => (
                        <tr key={i} className="border-t">
                        {columns.map((col) => {
                            let value = row[col];

                            // Format khusus timestamp → ke waktu lokal (WIB, dll)
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
        </div>
    );
}