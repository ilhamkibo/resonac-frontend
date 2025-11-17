"use client";

import { memo, useCallback } from "react";
import DatePicker from "../form/date-picker";
import flatpickr from "flatpickr";

interface FiltersProps {
  activeFilter: "period" | "date" | null;
  setActiveFilter: (v: "period" | "date") => void;

  period: "daily" | "weekly" | "monthly";
  setPeriod: (v: "daily" | "weekly" | "monthly") => void;

  startDate: string;
  endDate: string;
  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;

  limit: number;
  setLimit: (v: number) => void;

  exportToCSV: () => void;
}

function ManualInputFilter({
  activeFilter,
  setActiveFilter,
  period,
  setPeriod,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  limit,
  setLimit,
  exportToCSV
}: FiltersProps) {

  const handleStartChange = useCallback(
    (selectedDates: Date[]) => {
      setStartDate(
        selectedDates[0] ? flatpickr.formatDate(selectedDates[0], "Y-m-d") : ""
      );
    },
    [setStartDate]
  );

  const handleEndChange = useCallback(
    (selectedDates: Date[]) => {
      setEndDate(
        selectedDates[0] ? flatpickr.formatDate(selectedDates[0], "Y-m-d") : ""
      );
    },
    [setEndDate]
  );

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-lg shadow border mt-8">
      <div className="flex gap-4 items-center">

        {/* FILTER BUTTONS */}
        <button
          className={`px-4 py-2 rounded ${activeFilter === "period" ? "bg-emerald-600 text-white" : "bg-gray-300"}`}
          onClick={() => {
            setActiveFilter("period");
            setStartDate("");
            setEndDate("");
          }}
        >
          Period
        </button>

        <button
          className={`px-4 py-2 rounded ${activeFilter === "date" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
          onClick={() => {
            setActiveFilter("date");
            setPeriod("monthly");
          }}
        >
          Date Range
        </button>

        {/* LIMIT SELECT */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border px-2 py-1 rounded text-gray-600 dark:text-gray-400"
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
          <option value={50}>50 rows</option>
        </select>

        {/* PERIOD FILTER */}
        {activeFilter === "period" && (
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="border px-2 py-1 rounded text-gray-600 dark:text-gray-400"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        )}

        {/* DATE PICKERS */}
        {activeFilter === "date" && (
          <div className="flex gap-3">
            <DatePicker
              id="startDate"
              label="Start Date"
              placeholder="Pilih tanggal mulai"
              onChange={handleStartChange}
            />

            <DatePicker
              id="endDate"
              label="End Date"
              placeholder="Pilih tanggal akhir"
              onChange={handleEndChange}
            />
          </div>
        )}

        <button onClick={exportToCSV} className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded">
          Export CSV
        </button>
      </div>
    </div>
  );
}

export default memo(ManualInputFilter);
