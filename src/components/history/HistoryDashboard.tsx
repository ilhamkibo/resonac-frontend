"use client";

import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { measurementService } from "@/services/measurementService";
import { AggregatedDataResponse } from "@/types/measurementType";
import flatpickr from "flatpickr";
import { ChevronDownIcon } from "lucide-react";

// Components
import DashboardTabs from "./DashboardTabs";
import ChartPanel from "./ChartPanel";
import FilterPanel from "./FilterPanel";
import DataTable from "./DataTable";

// ---- helper types ----
export type Area = "main" | "pilot" | "oil" ;
export type Period = "hour" | "day" | "week" | "month" | "none";
export type AggregationType = "min" | "max" | "avg" | "none";

export type DashboardFilterMode = "period" | "date";

type SeriesItem = {
  name: string;
  data: number[];
};

export interface UseDashboardFiltersReturn {
  activeTab: Area;
  setActiveTab: React.Dispatch<React.SetStateAction<Area>>;

  period: Period | undefined;
  setPeriod: React.Dispatch<React.SetStateAction<Period | undefined>>;

  aggregationType: AggregationType | undefined;
  setAggregationType: (newType: AggregationType) => void;

  startDate: string;
  handleStartChange: (selectedDates: Date[]) => void;

  endDate: string;
  handleEndChange: (selectedDates: Date[]) => void;

  limit: number;
  setLimit: (newLimit: number) => void;

  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;

  activeFilterMode: DashboardFilterMode;
  setActiveFilterMode: React.Dispatch<React.SetStateAction<DashboardFilterMode>>;

  resetPage: () => void;
}

// Custom Hook untuk mengelola state filter
export const useDashboardFilters = (initialLimit: number = 100): UseDashboardFiltersReturn => {
  const [activeTab, setActiveTab] = useState<Area>("main");
  const [period, setPeriod] = useState<Period | undefined>("month");
  const [aggregationType, setAggregationType] = useState<AggregationType | undefined>("none");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [limit, setLimit] = useState(initialLimit);
  const [page, setPage] = useState(1);
  const [activeFilterMode, setActiveFilterMode] = useState<"period" | "date">("period");

  const resetPage = useCallback(() => setPage(1), []);

  const handleStartChange = useCallback((selectedDates: Date[]) => {
    setStartDate(
        selectedDates[0]
        ? flatpickr.formatDate(selectedDates[0], "Y-m-d")
        : ""
    );
    resetPage();
  }, [resetPage]);

  const handleEndChange = useCallback((selectedDates: Date[]) => {
    setEndDate(
      selectedDates[0]
      ? flatpickr.formatDate(selectedDates[0], "Y-m-d")
      : ""
    );
    resetPage();
  }, [resetPage]);

  const setLimitAndResetPage = useCallback((newLimit: number) => {
    setLimit(newLimit);
    resetPage();
  }, [resetPage]);

  const setAggregationTypeAndResetPage = useCallback((newType: AggregationType) => {
    setAggregationType(newType === "none" ? undefined : newType);
    resetPage();
  }, [resetPage]);

  return {
    activeTab, setActiveTab,
    period, setPeriod,
    aggregationType, setAggregationType: setAggregationTypeAndResetPage,
    startDate, handleStartChange,
    endDate, handleEndChange,
    limit, setLimit: setLimitAndResetPage,
    page, setPage,
    activeFilterMode, setActiveFilterMode,
    resetPage,
  };
};

export default function HistoryDashboard({initialDashboard}: {initialDashboard: AggregatedDataResponse} ) {
  
  const filters = useDashboardFilters(100);

  const {
    activeTab, aggregationType, period, startDate, endDate, limit, page, setPage, resetPage,
  } = filters;

  const {
    data: aggregatedData,
    isLoading: isLoadingAggregated,
    isError: isErrorAggregated,
  } = useQuery({
    queryKey: ['aggregatedData', activeTab, aggregationType, period, startDate, endDate, limit, page],
    queryFn: () =>
      measurementService.getMeasurementsAggregateData({
        areas: activeTab,
        aggregationType: aggregationType === "none" 
          ? undefined 
          : aggregationType,        
        period: filters.activeFilterMode === 'period' ? (period === "none" ? undefined : period) : undefined, // Hanya kirim period jika mode aktif
        startDate: filters.activeFilterMode === 'date' ? startDate : undefined, // Hanya kirim start/end date jika mode aktif
        endDate: filters.activeFilterMode === 'date' ? endDate : undefined,
        limit,
        page,
      }),
    placeholderData: initialDashboard,
    staleTime: 20000,
  });

  const [isExporting, setIsExporting] = useState(false);

    const exportToCSV = useCallback(async () => {
        // 1. Dapatkan parameter filter (Hapus page dan limit)
        const exportQuery = {
            areas: activeTab,
            aggregationType: aggregationType === "none" ? undefined : aggregationType,
            ...(filters.activeFilterMode === "period" && period !== "none" ? { period } : {}),
            ...(filters.activeFilterMode === "date" && startDate && endDate ? { startDate, endDate } : {}),
        };

        setIsExporting(true);

        try {
            const csvString = await measurementService.exportMeasurementData(exportQuery);

            // 3. Buat dan unduh file
            const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            
            // Cek browser support
            if (link.download !== undefined) { 
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", `measurement-histories-${new Date().toLocaleString("id-ID")}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url); // Bersihkan URL object
            } else {
                // Fallback for older browsers
                window.open(`data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`);
            }
        } catch (error) {
            console.error("CSV Export Failed:", error);
            alert("Gagal mengunduh CSV. Silakan coba lagi.");
        } finally {
            // ⭐ 3. SET LOADING FALSE di blok finally (akan selalu dipanggil)
            setIsExporting(false); 
        }
    }, [filters.activeFilterMode, period, startDate, endDate, activeTab, aggregationType]);
    

  // const chartData = aggregatedData?.data?.[activeTab] ?? [];
  const tableData = aggregatedData?.data?.[activeTab] ?? [];
  const chartData = useMemo(() => aggregatedData?.data?.[activeTab] ?? [], [aggregatedData, activeTab]);

  // Membalik data hanya sekali untuk chart
  const reversedChartData = useMemo(() => [...chartData].reverse(), [chartData]);
  const timestamps = reversedChartData.map((d) => new Date(d.timestamp).toLocaleString("id-ID"));
  const ampereRSeries = reversedChartData.map((d) => d.ampere_rs ?? 0);
  const ampereTSeries = reversedChartData.map((d) => d.ampere_st ?? 0);
  const oilTempSeries = reversedChartData.map((d) => d.oil_temperature ?? 0);
  const ampereSSeries = reversedChartData.map((d) => d.ampere_tr ?? 0);
  const oilPressureSeries = reversedChartData.map((d) => d.oil_pressure ?? 0);

  const seriesMap: Record<string, SeriesItem[]> = {
    main: [
      { name: "Ampere R", data: ampereRSeries },
      { name: "Ampere S", data: ampereSSeries },
      { name: "Ampere T", data: ampereTSeries },
      { name: "Oil Pressure", data: oilPressureSeries },
    ],
    pilot: [
      { name: "Ampere R", data: ampereRSeries },
      { name: "Ampere S", data: ampereSSeries },
      { name: "Ampere T", data: ampereTSeries },
      { name: "Oil Pressure", data: oilPressureSeries },
    ],
    oil: [
      { name: "Oil Temperature", data: oilTempSeries },
    ],
  };

  const series = seriesMap[activeTab] ?? [];
  
  const handlePageChange = (newPage: number) => setPage(newPage);

  return (
    <div className="p-6 mx-auto space-y-8 min-h-screen">
    
      {/* 1. Tabs Area */}
      <DashboardTabs 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          filters.setActiveTab(tab);
          resetPage();
        }}
      />
      
      {/* 2. Chart Panel */}
      <ChartPanel 
        series={series} 
        timestamps={timestamps} 
        isLoading={isLoadingAggregated}
        isError={isErrorAggregated}
      />

      {/* 3. Filter Panel */}
      <FilterPanel 
        filters={filters} 
        ChevronDownIcon={ChevronDownIcon} 
        exportToCSV={exportToCSV}
        isExporting={isExporting} // <-- BARU
      />

      {/* 4. Table Panel */}
      <DataTable 
        tableData={tableData} 
        isLoading={isLoadingAggregated}
        isError={isErrorAggregated}
        aggregatedData={aggregatedData} 
        handlePageChange={handlePageChange} 
      />
    </div>
  );
}