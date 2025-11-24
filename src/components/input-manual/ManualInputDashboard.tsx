"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import SaveButton from "./SaveButton";

import { AmpereCardGroup } from "./AmpereCardGroup";
import { OilPressureCard } from "./OilPressureCard";
import { OilTemperatureCard } from "./OilTemperatureCard";

import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { manualInputService } from "@/services/manualInputService";

import { ApiResponseWrapper } from "@/types/apiType";
import { ManualInput, ManualInputResponse, ManualInputTable } from "@/types/manualInputType";
import { RealtimeData } from "@/types/mqttType";
import ManualInputFilter from "./ManualInputFilter";
import { Threshold } from "@/types/thresholdType";
import InputManualHistoryTable from "./InputManualHistoryTable";

interface DashboardProps {
  thresholds: Threshold[];
  initialManualInputs: ApiResponseWrapper<ManualInputResponse>;
}

const formatServerDataToRow = (input: ManualInput): ManualInputTable => {
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

export default function ManualInputDashboard({
  thresholds,
  initialManualInputs
}: DashboardProps) {

  const mqttData = useMqttSubscription<{ realtime: RealtimeData }>("toho/resonac/value");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [activeFilter, setActiveFilter] = useState<"period" | "date" | null>("period");

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  // Memoize query params to pass to service
  const queryParams = useMemo(() => ({
    page,
    limit,
    // TIDAK MENGIRIM LIMIT DAN PAGE KE API EXPORT
    ...(activeFilter === "period" ? { period } : {}),
    ...(activeFilter === "date" && startDate && endDate
      ? { startDate, endDate }
      : {}),
  }), [page, limit, activeFilter, period, startDate, endDate]);

  // Query manual inputs
  const { data: manualInput, isFetching } = useQuery({
    queryKey: ["manual-inputs", queryParams.page, queryParams.period, queryParams.startDate, queryParams.endDate, queryParams.limit],
    queryFn: () =>
      manualInputService.getManualInputs(queryParams),
    placeholderData: initialManualInputs
  });

  const rows: ManualInputTable[] = useMemo(() => {
    return manualInput?.data?.data
      ? manualInput.data.data.map(formatServerDataToRow)
      : [];
  }, [manualInput]);

  const meta = manualInput?.data?.meta;

  const exportToCSV = useCallback(async () => {
    // 1. Dapatkan parameter filter (Hapus page dan limit)
    const exportQuery = {
        ...(activeFilter === "period" ? { period } : {}),
        ...(activeFilter === "date" && startDate && endDate
          ? { startDate, endDate }
          : {}),
        // Tidak perlu limit dan page di sini karena service API akan mengambil semua
    };

    setIsExporting(true);

    try {
      // 2. Panggil service API Export yang mengembalikan string CSV
      // Asumsi: manualInputService.exportManualInputsCsv sudah diimplementasikan
      const csvString = await manualInputService.exportManualInputsCsv(exportQuery);

      // 3. Buat dan unduh file
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      
      // Cek browser support
      if (link.download !== undefined) { 
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", `manual-input-history-${new Date().toLocaleString("id-ID")}.csv`);
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
  }, [activeFilter, period, startDate, endDate]);
  // -------------------------------------------------------------

  const lastManualInput = rows[0];

  // Prepare thresholds
  const minMaxAmpereMainPump = thresholds
    .filter((t) => t.area === "main" && t.parameter === "ampere")[0];

  const minMaxAmperePilotPump = thresholds
    .filter((t) => t.area === "pilot" && t.parameter === "ampere")[0];

  const minMaxOilTemp = thresholds
    .filter((t) => t.area === "oil" && t.parameter === "temp")[0];

  const minMaxOilPressure = thresholds.filter(
    (t) => t.parameter === "pressure"
  );

  useEffect(() => {
    setPage(1);
  }, [limit]);

  return (
    <div className="p-6">
      
      {/* Realtime Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <AmpereCardGroup
          title="Main Pump"
          data={[
            { label: "R", value: mqttData?.realtime?.main?.ampere_r },
            { label: "S", value: mqttData?.realtime?.main?.ampere_s },
            { label: "T", value: mqttData?.realtime?.main?.ampere_t },
          ]}
          thresholds={minMaxAmpereMainPump}
        />

        <AmpereCardGroup
          title="Pilot Pump"
          data={[
            { label: "R", value: mqttData?.realtime?.pilot?.ampere_r },
            { label: "S", value: mqttData?.realtime?.pilot?.ampere_s },
            { label: "T", value: mqttData?.realtime?.pilot?.ampere_t },
          ]}
          thresholds={minMaxAmperePilotPump}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <OilPressureCard
          title="Main Oil Pressure"
          data={{
            main: mqttData?.realtime?.main?.oil_pressure,
            pilot: mqttData?.realtime?.pilot?.oil_pressure,
          }}
          thresholds={minMaxOilPressure}
        />

        <OilTemperatureCard
          title="Oil Temperature"
          data={{ value: mqttData?.realtime?.oil?.temperature }}
          thresholds={minMaxOilTemp}
        />
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <SaveButton 
          mqttData={mqttData?.realtime} 
          lastManualInput={lastManualInput}
        />     
      </div>

      {/* Filters */}
      <ManualInputFilter
        isExporting={isExporting} // <-- BARU
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        period={period}
        setPeriod={setPeriod}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        limit={limit}
        setLimit={setLimit}
        exportToCSV={exportToCSV}
      />

      {/* Table */}
      <div className="mt-6">
        <InputManualHistoryTable
          rows={rows}
          meta={meta}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
