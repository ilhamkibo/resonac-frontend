"use client";

import React, { useCallback, useState } from "react";
import { ErrorHistory, ErrorHistoryQuery, ErrorHistoryResponse } from "@/types/errorHistoryType";
import { useQuery } from "@tanstack/react-query";
import { errorHistoryService } from "@/services/errorHistoryService";
import Pagination from "../tables/Pagination";
import DatePicker from "../form/date-picker";
import flatpickr from "flatpickr";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import { ChevronDownIcon } from "lucide-react";

interface Props extends ErrorHistoryResponse {}

export default function DataErrorTable(props: Props) {
  const [page, setPage] = useState("1");
  const [limit, setLimit] = useState("10");

    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [area, setArea] = useState("");
    const [parameter, setParameter] = useState("");

    const [activeFilter, setActiveFilter] = useState<"period" | "date" | null>("period");

  const { data, isLoading, isError } = useQuery({
    queryKey: [
        "error-history",
        page,
        limit,
        activeFilter,
        period,
        startDate,
        endDate,
        area,
        parameter,
    ],
    queryFn: () => {
        const payload: ErrorHistoryQuery = {
        page,
        limit,
        area ,
        parameter,
        };

        if (activeFilter === "period") {
            payload.period = period; // hanya period
        }

        if (activeFilter === "date" && startDate && endDate) {
            payload.startDate = startDate;
            payload.endDate = endDate; // hanya date
        }
        if (area === "all") delete payload.area 
        if (parameter === "all") delete payload.parameter 

        return errorHistoryService.getErrorHistory(payload);
    },
    placeholderData: props,
  });

  const rows = data?.data || [];
  const meta = data?.meta;

  const handleStartChange = useCallback((selectedDates: Date[]) => {
    setStartDate(
        selectedDates[0]
        ? flatpickr.formatDate(selectedDates[0], "Y-m-d")
        : ""
    );
    }, []);

    const handleEndChange = useCallback((selectedDates: Date[]) => {
    setEndDate(
        selectedDates[0]
        ? flatpickr.formatDate(selectedDates[0], "Y-m-d")
        : ""
    );
    }, []);

    if(isError) {
        return (
            <div className="bg-red-100 text-red-700 p-2 rounded">
            Terjadi kesalahan memuat data.
            </div>
        );
    }

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-500 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">

            {/* FILTER LEFT */}
            <div className="flex flex-wrap gap-3">
                <Button
                    size="sm"     
                    className={`px-4 py-2 rounded ${activeFilter === "period" ? "bg-emerald-600 text-white" : "bg-gray-300 dark:bg-gray-700"} hover:bg-emerald-700`}
                    onClick={() => {
                        setActiveFilter("period");
                        setStartDate("");
                        setEndDate("");
                    }}
                >
                    Period
                </Button>


                <Button
                    size="sm"
                    className={`px-4 py-2 rounded ${activeFilter === "date" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"} hover:bg-blue-700`}
                    onClick={() => {
                        setActiveFilter("date");
                        setPeriod("monthly"); // reset tapi TIDAK DIKIRIM
                    }}
                >
                    Date Range
                </Button>

                {activeFilter === "period" && (
                    <div className="relative">
                        <Select
                            defaultValue={period}
                            className="border px-2 py-1 rounded text-gray-600 dark:text-gray-400"
                            onChange={(value) => setPeriod(value as "daily" | "weekly" | "monthly")}
                            options={[
                                { value: "daily", label: "Daily" },
                                { value: "weekly", label: "Weekly" },
                                { value: "monthly", label: "Monthly" },
                            ]}
                        />
                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                            <ChevronDownIcon/>
                        </span>
                    </div>
                )}
                
                {/* DATE PICKERS */}
                {activeFilter === "date" && (
                    <div className="flex gap-3">
                        <DatePicker
                            id="startDate"
                            placeholder="Pilih tanggal mulai"
                            onChange={handleStartChange}
                        />

                        <DatePicker
                            id="endDate"
                            placeholder="Pilih tanggal akhir"
                            onChange={handleEndChange}
                        />
                    </div>
                )}

                <div className="relative">
                    <Select
                        options={[
                            { value: "all", label: "All" },
                            { value: "main", label: "Main Pump" },
                            { value: "pilot", label: "Pilot Pump" },
                            { value: "oil", label: "Oil Pump" },
                        ]}
                        defaultValue={area}
                        placeholder="Area"
                        onChange={(e) => setArea(e)}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon/>
                    </span>
                </div>
                <div className="relative">
                    <Select
                        placeholder="Parameter"
                        options={[
                            { value: "all", label: "All" },
                            { value: "ampere", label: "Current" },
                            { value: "volt", label: "Voltage" },
                            { value: "pressure", label: "Pressure" },
                            { value: "pf", label: "Power Factor" },
                            { value: "temp", label: "Temperature" },
                        ]}
                        defaultValue={parameter}
                        onChange={(e) => setParameter(e)}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon/>
                    </span>
                </div>
                

            
            </div>

            {/* LIMIT RIGHT */}
            <div className="relative">
                <Select
                    options={[
                        { value: "5", label: "5 Rows" },
                        { value: "10", label: "10 Rows" },
                        { value: "25", label: "25 Rows" },
                        { value: "50", label: "50 Rows" },
                    ]}
                    defaultValue={limit}
                    onChange={(e) => {
                        setPage("1");
                        setLimit(e);
                    }}
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon/>
                </span>
            </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 uppercase text-xs">
                <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Threshold</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y bg-white dark:bg-gray-800 dark:divide-gray-700">

                {/* LOADING SKELETON */}
                {isLoading &&
                [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                    <td className="px-4 py-3">
                        <div className="h-4 w-12 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </td>
                    <td className="px-4 py-3">
                        <div className="h-4 w-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
                    </td>
                    </tr>
                ))}

                {/* DATA ROW */}
                {!isLoading &&
                rows.map((item: ErrorHistory) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 dark:text-gray-400">{item.id}</td>
                    <td className="px-4 py-3 dark:text-gray-400">{item.area}</td>
                    <td className="px-4 py-3 dark:text-gray-400">{item.parameter}</td>
                    <td className="px-4 py-3 dark:text-gray-400">{item.timestamp}</td>
                    <td className="px-4 py-3 dark:text-gray-400">Min: {item.threshold.lowerLimit} | Max: {item.threshold.upperLimit}</td>
                    <td className="px-4 py-3 dark:text-gray-400">{item.value}</td>
                    <td className="px-4 py-3 dark:text-gray-400">{item.status}</td>
                    </tr>
                ))}

                {!isLoading && rows.length === 0 && (
                <tr>
                    <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                    >
                    Tidak ada data ditemukan
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between mt-5">
            <span className="text-sm text-gray-700 dark:text-gray-400">
            Page <span className="font-semibold">{meta?.page}</span> of <span className="font-semibold">{meta?.totalPages}</span>
            <span className="hidden sm:inline"> (Total: {meta?.total} data)</span>
            </span>

            <Pagination
                currentPage={Number(page)}
                totalPages={Number(meta?.totalPages)}
                onPageChange={(newPage: number) => setPage(String(newPage))}
            />
        </div>    
    </div>
  );
}
