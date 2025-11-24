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
export type Area = "main" | "pilot" | "oil";
export type Period = "hour" | "day" | "week" | "month" | "none";
export type AggregationType = "min" | "max" | "avg" | "none";

// Custom Hook untuk mengelola state filter
export const useDashboardFilters = (initialLimit = 50) => {
  const [activeTab, setActiveTab] = useState<Area>("main");
  const [period, setPeriod] = useState<Period | undefined>("none");
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
  
  const filters = useDashboardFilters(50);

  const {
    activeTab, aggregationType, period, startDate, endDate, limit, page, setPage, resetPage,
  } = filters;

  const {
    data: aggregatedData,
    isLoading: isLoadingAggregated,
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

  const chartData = aggregatedData?.data?.[activeTab] ?? [];
  const tableData = aggregatedData?.data?.[activeTab] ?? [];
  
  // Membalik data hanya sekali untuk chart
  const reversedChartData = useMemo(() => [...chartData].reverse(), [chartData]);
  const timestamps = reversedChartData.map((d) => new Date(d.timestamp).toLocaleString("id-ID"));
  const ampereRSeries = reversedChartData.map((d) => d.ampere_rs ?? 0);
  const ampereTSeries = reversedChartData.map((d) => d.ampere_st ?? 0);
  const oilTempSeries = reversedChartData.map((d) => d.oil_temperature ?? 0);
  const ampereSSeries = reversedChartData.map((d) => d.ampere_tr ?? 0);
  const oilPressureSeries = reversedChartData.map((d) => d.oil_pressure ?? 0);

  const seriesMap: Record<string, any[]> = {
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
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      
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
      />

      {/* 3. Filter Panel */}
      <FilterPanel 
        filters={filters} 
        ChevronDownIcon={ChevronDownIcon} 
      />

      {/* 4. Table Panel */}
      <DataTable 
        tableData={tableData} 
        aggregatedData={aggregatedData} 
        handlePageChange={handlePageChange} 
      />
    </div>
  );
}