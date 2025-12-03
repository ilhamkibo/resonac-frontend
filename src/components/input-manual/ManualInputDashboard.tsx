"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
import Button from "../ui/button/Button";
import ManualInputChart, { ManualChartHandle } from "./ManualInputChart";
import { toast } from "sonner";

interface DashboardProps {
  thresholds: Threshold[];
  initialManualInputs: ApiResponseWrapper<ManualInputResponse>;
}

type ExcelRow = {
  Waktu: string;
  Operator: string;
  Main_Ampere_R: number | null;
  Main_Ampere_S: number | null;
  Main_Ampere_T: number | null;
  Main_Oil_Pressure: number | null;
  Pilot_Ampere_R: number | null;
  Pilot_Ampere_S: number | null;
  Pilot_Ampere_T: number | null;
  Pilot_Oil_Pressure: number | null;
  Oil_Temp: number | null;
};


const formatServerDataToRow = (input: ManualInput): ManualInputTable => {
  const mainPump = input.details.find(d => d.area === "main");
  const pilotPump = input.details.find(d => d.area === "pilot");
  const oil = input.details.find(d => d.area === "oil");

  return {
    id: input.id,
    // time: new Date(input.timestamp).toLocaleString("id-ID"),
    time: input.timestamp,
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

const convertToExcelRow = (row: ManualInputTable): ExcelRow => ({
  Waktu: new Date(row.time).toLocaleString("id-ID"),
  Operator: row.operator ?? "-",
  Main_Ampere_R: row.mainR != null ? parseFloat(Number(row.mainR).toFixed(2)) : 0,
  Main_Ampere_S: row.mainS != null ? parseFloat(Number(row.mainS).toFixed(2)) : 0,
  Main_Ampere_T: row.mainT != null ? parseFloat(Number(row.mainT).toFixed(2)) : 0,
  Main_Oil_Pressure: row.oilPressMain != null ? parseFloat(Number(row.oilPressMain).toFixed(2)) : 0,
  Pilot_Ampere_R: row.pilotR != null ? parseFloat(Number(row.pilotR).toFixed(2)) : 0,
  Pilot_Ampere_S: row.pilotS != null ? parseFloat(Number(row.pilotS).toFixed(2)) : 0,
  Pilot_Ampere_T: row.pilotT != null ? parseFloat(Number(row.pilotT).toFixed(2)) : 0,
  Pilot_Oil_Pressure: row.oilPressPilot != null ? parseFloat(Number(row.oilPressPilot).toFixed(2)) : 0,
  Oil_Temp: row.oilTemp != null ? parseFloat(Number(row.oilTemp).toFixed(2)) : 0,
});



export default function ManualInputDashboard({
  thresholds,
  initialManualInputs
}: DashboardProps) {

  const mqttData = useMqttSubscription<RealtimeData>("toho/resonac/value");
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [activeFilter, setActiveFilter] = useState<"period" | "date" | null>("period");

  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
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
  const { data: manualInput } = useQuery({
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
      toast.error("Gagal mengunduh CSV. Silakan coba lagi.");
    } finally {
      // ⭐ 3. SET LOADING FALSE di blok finally (akan selalu dipanggil)
      setIsExporting(false); 
    }
  }, [activeFilter, period, startDate, endDate]);

  const chartRef = useRef<ManualChartHandle>(null);

  // const exportToExcel = useCallback(async () => {
  //   try {
  //     setIsExportingExcel(true);

  //     // 1. Ambil data yang tampil di tabel (rows)
  //     const tableData = rows;

  //     if (!tableData.length) {
  //       toast.error("Tidak ada data untuk diexport.");
  //       return;
  //     }

  //     // 2. Import exceljs secara dynamic agar tidak masuk bundle besar
  //     const ExcelJS = (await import("exceljs")).default;

  //     const workbook = new ExcelJS.Workbook();
  //     const sheet = workbook.addWorksheet("Manual Input");

  //     // 3. Buat header
  //     sheet.columns = Object.keys(tableData[0]).map((col) => ({
  //       header: col,
  //       key: col,
  //       width: 20,
  //     }));

  //     // 4. Tambah data tabel
  //     sheet.addRows(tableData);

  //     // 5. Generate file
  //     const buffer = await workbook.xlsx.writeBuffer();
  //     const blob = new Blob([buffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.download = `manual-input-${Date.now()}.xlsx`;
  //     link.click();

  //     URL.revokeObjectURL(url);
  //     toast.success("Export Excel berhasil");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Gagal export Excel");
  //   } finally {
  //     setIsExportingExcel(false);
  //   }
  // }, [rows]);

  // -------------------------------------------------------------

  const exportToExcel = useCallback(async () => {
    try {
      setIsExportingExcel(true);

    const excelRows: ExcelRow[] = rows.map(convertToExcelRow);

    if (excelRows.length === 0) {
        toast.error("Tidak ada data untuk diexport.");
        return;
      }

      // Ambil SEMUA gambar chart
      const charts = await chartRef.current?.getChartImages();
      if (!charts) {
        toast.error("Gagal mengambil gambar grafik.");
        return;
      }

      const ExcelJS = (await import("exceljs")).default;

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Manual Input");

      // ==== HEADER ====
      sheet.columns = [
        { header: "Waktu", key: "Waktu", width: 22 },
        { header: "Operator", key: "Operator", width: 18 },
        { header: "Main_Ampere_R", key: "Main_Ampere_R", width: 18 },
        { header: "Main_Ampere_S", key: "Main_Ampere_S", width: 18 },
        { header: "Main_Ampere_T", key: "Main_Ampere_T", width: 18 },
        { header: "Main_Oil_Pressure", key: "Main_Oil_Pressure", width: 20 },
        { header: "Pilot_Ampere_R", key: "Pilot_Ampere_R", width: 18 },
        { header: "Pilot_Ampere_S", key: "Pilot_Ampere_S", width: 18 },
        { header: "Pilot_Ampere_T", key: "Pilot_Ampere_T", width: 18 },
        { header: "Pilot_Oil_Pressure", key: "Pilot_Oil_Pressure", width: 20 },
        { header: "Oil_Temp", key: "Oil_Temp", width: 14 },
      ];

      // Isi tabel
      sheet.addRows(excelRows);

      const currentRow = sheet.rowCount + 2;

      // ====== INSERT GAMBAR MAIN ======
      const mainImageId = workbook.addImage({
        base64: charts.main,
        extension: "png",
      });

      sheet.addImage(mainImageId, {
        tl: { col: 0, row: currentRow },
        ext: { width: 540, height: 280 }, // gambar high DPI butuh space lebih besar
      });


      // ====== INSERT GAMBAR PILOT ======
      const pilotImageId = workbook.addImage({
        base64: charts.pilot,
        extension: "png",
      });

      sheet.addImage(pilotImageId, {
        tl: { col: 4, row: currentRow },
        ext: { width: 540, height: 280 }, // gambar high DPI butuh space lebih besar
      });

      // ====== INSERT GAMBAR OIL ======
      const oilImageId = workbook.addImage({
        base64: charts.oil,
        extension: "png",
      });

      sheet.addImage(oilImageId, {
        tl: { col: 8, row: currentRow },
        ext: { width: 540, height: 280 }, // gambar high DPI butuh space lebih besar
      });

      // Download file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `manual-input-${new Date().toLocaleString("id-ID")}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Export Excel berhasil");
    } catch (err) {
      console.error(err);
      toast.error("Gagal export Excel");
    } finally {
      setIsExportingExcel(false);
    }
  }, [rows]);

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
      <div className="text-center space-x-4 mb-10">
        <Button
          onClick={() => setActiveTab(0)}
          variant="primary"
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 0 ? "bg-blue-600 text-white" : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          Input Data
        </Button>
        <Button
          onClick={() => setActiveTab(1)}
          variant="primary"
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 1 ? "bg-blue-600 text-white" : "bg-gray-400 hover:bg-gray-500"
          }`}
        >
          History Data
        </Button>
      </div>
      
      {activeTab === 0 ? (
        <>
        {/* Realtime Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <AmpereCardGroup
          title="Main Pump"
          data={[
            { label: "R", value: mqttData?.main?.ampere_r },
            { label: "S", value: mqttData?.main?.ampere_s },
            { label: "T", value: mqttData?.main?.ampere_t },
          ]}
          thresholds={minMaxAmpereMainPump}
        />

        <AmpereCardGroup
          title="Pilot Pump"
          data={[
            { label: "R", value: mqttData?.pilot?.ampere_r },
            { label: "S", value: mqttData?.pilot?.ampere_s },
            { label: "T", value: mqttData?.pilot?.ampere_t },
          ]}
          thresholds={minMaxAmperePilotPump}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <OilPressureCard
          title="Main Oil Pressure"
          data={{
            main: mqttData?.main?.oil_pressure,
            pilot: mqttData?.pilot?.oil_pressure,
          }}
          thresholds={minMaxOilPressure}
        />

        <OilTemperatureCard
          title="Oil Temperature"
          data={{ value: mqttData?.oil?.temperature }}
          thresholds={minMaxOilTemp}
        />
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <SaveButton 
          mqttData={mqttData} 
          lastManualInput={lastManualInput}
        />     
      </div>

        </>
      ) : (
        <>
          <div>
            <ManualInputChart ref={chartRef} ManualinputData={rows} />
          </div>

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
            isExporting={isExporting} // <-- BARU
            exportToExcel={exportToExcel}   // ← tambahkan ini
            isExportingExcel={isExportingExcel} // <-- BARU
          />

          {/* Table */}
          <div className="mt-6">
            <InputManualHistoryTable
              rows={rows}
              meta={meta}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
      {/* Filters */}
      
    </div>
  );
}
