"use client";

import { memo, useCallback } from "react";
import DatePicker from "../form/date-picker";
import flatpickr from "flatpickr";
import Select from "../form/Select";
import { ChevronDownIcon } from "lucide-react";
import Button from "../ui/button/Button";

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
  isExporting: boolean; // <-- BARU
  exportToCSV: () => void;
}

function ManualInputFilter({
  activeFilter,
  setActiveFilter,
  period,
  setPeriod,
  setStartDate,
  setEndDate,
  limit,
  setLimit,
  exportToCSV,
  isExporting
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
        <Button
          size="sm"
          className={`px-4 py-2 rounded ${activeFilter === "period" ? "bg-emerald-600 text-white" : "bg-gray-400 dark:bg-gray-700"} hover:bg-emerald-700 hover:text-white`}
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
          className={`px-4 py-2 rounded ${activeFilter === "date" ? "bg-blue-600 text-white" : "bg-gray-400 dark:bg-gray-700"} hover:bg-blue-700 hover:text-white`}
          onClick={() => {
            setActiveFilter("date");
            setPeriod("monthly");
          }}
        >
          Date Range
        </Button>

        

        {/* PERIOD FILTER */}
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

        <div className="ml-auto space-x-4 flex">
          {/* LIMIT SELECT */}
          <div className="relative">
            <Select 
              defaultValue={limit.toString()}
              className="border px-2 py-1 rounded text-gray-600 dark:text-gray-400"
              onChange={(value) => setLimit(Number(value))}
              options={[
                { value: "5", label: "5 rows" },
                { value: "10", label: "10 rows" },
                { value: "25", label: "25 rows" },
                { value: "50", label: "50 rows" },
              ]}
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
              <ChevronDownIcon/>
            </span>
          </div>
          <Button
            size="sm"
            className="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700"
            onClick={exportToCSV}
            disabled={isExporting} // <-- NONAKTIFKAN saat loading
          >
              {/* ⭐ 5. TAMPILKAN SPINNER SAAT LOADING */}
              {isExporting ? (
                  <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                  </div>
              ) : (
                  "Export CSV" 
              )}
          </Button>
        </div>

      </div>
    </div>
  );
}

export default memo(ManualInputFilter);
