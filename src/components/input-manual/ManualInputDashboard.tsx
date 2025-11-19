"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import HistoryTable from "./HistoryTable";
import SaveButton from "./SaveButton";

import { AmpereCardGroup } from "./AmpereCardGroup";
import { OilPressureCard } from "./OilPressureCard";
import { OilTemperatureCard } from "./OilTemperatureCard";

import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { manualInputService } from "@/services/manualInputService";

import { ThresholdResponse } from "@/types/thresholdType";
import { ApiResponseWrapper } from "@/types/apiType";
import { ManualInputResponse } from "@/types/manualInputType";
import { RealtimeData } from "@/types/mqttType";
import ManualInputFilter from "./ManualInputFilter";

interface DashboardProps {
  thresholds: ThresholdResponse;
  initialManualInputs: ApiResponseWrapper<ManualInputResponse>;
}

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


const formatServerDataToRow = (input: any): Row => {
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

  // Query manual inputs
  const { data: manualInput } = useQuery({
    queryKey: ["manual-inputs", page, period, startDate, endDate, limit],
    queryFn: () =>
      manualInputService.getManualInputs({
        page,
        limit,
        ...(activeFilter === "period" ? { period } : {}),
        ...(activeFilter === "date" && startDate && endDate
          ? { startDate, endDate }
          : {}),
      }),
    placeholderData: initialManualInputs
  });

  const rows: Row[] = useMemo(() => {
    return manualInput?.data?.data
      ? manualInput.data.data.map(formatServerDataToRow)
      : [];
  }, [manualInput]);

  const meta = manualInput?.data?.meta;

  // Export CSV
  const exportToCSV = () => {
    if (!rows.length) return;

    const header = Object.keys(rows[0]).join(",");
    const values = rows
      .map((r) =>
        Object.values(r)
          .map((v) => `"${v ?? ""}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([header + "\n" + values], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "manual-input-history.csv";
    link.click();
  };

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
        <HistoryTable
          rows={rows}
          meta={meta}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
