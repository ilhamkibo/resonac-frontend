

"use client";
import React, {
  useEffect,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { ManualInputTable } from "@/types/manualInputType";
import dynamic from "next/dynamic";
import html2canvas from "html2canvas";
import { Threshold } from "@/types/thresholdType";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface ManualChartHandle {
  getChartImages: () => Promise<{ mainAmpere: string; pilotAmpere: string; mainPressure: string; pilotPressure: string; oil: string }>;
}

type Props = {
  ManualinputData: ManualInputTable[];
  thresholds: Threshold[];
};

const ManualInputChart = forwardRef<ManualChartHandle, Props>(
  ({ ManualinputData, thresholds }, ref) => {

    const [chartData, setChartData] = useState({
      labels: [] as string[],
      mainAmpereSeries: [] as { name: string; data: (number | null)[] }[],
      mainPressureSeries: [] as { name: string; data: (number | null)[] }[],
      pilotAmpereSeries: [] as { name: string; data: (number | null)[] }[],
      pilotPressureSeries: [] as { name: string; data: (number | null)[] }[],
      oilSeries: [] as { name: string; data: (number | null)[] }[],
    });

    const mainAmpereDivRef = useRef<HTMLDivElement>(null);
    const pilotAmpereDivRef = useRef<HTMLDivElement>(null);
    const mainPressureDivRef = useRef<HTMLDivElement>(null);
    const pilotPressureDivRef = useRef<HTMLDivElement>(null);
    const oilDivRef = useRef<HTMLDivElement>(null);

    // ----------------------------
    // Update data
    // ----------------------------
    useEffect(() => {
      const labels = ManualinputData.map((i) =>
        new Date(i.time).toLocaleDateString("id-ID", { hour12: false })
      ).reverse();

      setChartData({
        labels,
        mainAmpereSeries: [
          { name: "Ampere R", data: ManualinputData.map(i => i.mainR).reverse() },
          { name: "Ampere S", data: ManualinputData.map(i => i.mainS).reverse() },
          { name: "Ampere T", data: ManualinputData.map(i => i.mainT).reverse() },
        ],
        mainPressureSeries: [
          { name: "Pressure", data: ManualinputData.map(i => i.oilPressMain).reverse() },
        ],
        pilotAmpereSeries: [
          { name: "Ampere R", data: ManualinputData.map(i => i.pilotR).reverse() },
          { name: "Ampere S", data: ManualinputData.map(i => i.pilotS).reverse() },
          { name: "Ampere T", data: ManualinputData.map(i => i.pilotT).reverse() },
        ],
        pilotPressureSeries: [
          { name: "Pressure", data: ManualinputData.map(i => i.oilPressPilot).reverse() },
        ],
        oilSeries: [
          { name: "Oil Temperature", data: ManualinputData.map(i => i.oilTemp).reverse() },
        ],
      });
    }, [ManualinputData]);

    // ----------------------------
    // Chart Options
    // ----------------------------

    
    const minMaxAmpereMainPump = thresholds
      .filter((t) => t.area === "main" && t.parameter === "ampere")[0];

    const minMaxAmperePilotPump = thresholds
      .filter((t) => t.area === "pilot" && t.parameter === "ampere")[0];

    const minMaxPressureMainPump = thresholds
      .filter((t) => t.area === "main" && t.parameter === "pressure")[0];

    const minMaxPressurePilotPump = thresholds
      .filter((t) => t.area === "pilot" && t.parameter === "pressure")[0];

    const minMaxOilTemp = thresholds
      .filter((t) => t.area === "oil" && t.parameter === "temp")[0];

    const baseOptions = useMemo<ApexCharts.ApexOptions>(() => ({
      chart: {
        type: "line",
        toolbar: { show: false },
        animations: { enabled: false }, // ANTI KEDIP PALING KUAT
      },
      markers: { size: 4 },
      stroke: { curve: "smooth", width: 3 },
      grid: { borderColor: "#334155", strokeDashArray: 4 },
      xaxis: {
        labels: { style: { colors: "#9CA3AF" } },
      },
    }), []);

    const mainAmpereOptions = useMemo(() => ({
      ...baseOptions,
      xaxis: { 
        ...baseOptions.xaxis,
        categories: chartData.labels,
      },
      yaxis: {
        min: minMaxAmpereMainPump.lowerLimit - 5,
        max: minMaxAmpereMainPump.upperLimit + 5,
        labels: {
          style: { colors: "#9CA3AF" },
          formatter: (v: number) => v.toFixed(2),
        },
      },
      annotations: {
        yaxis: [
          {
            y: minMaxAmpereMainPump.upperLimit,
            borderColor: "#f59e0b",
          },
          {
            y: minMaxAmpereMainPump.lowerLimit,
            borderColor: "#f59e0b",
          },
        ],
      }
    }), [chartData.labels, minMaxAmpereMainPump]);

    const pilotAmpereOptions = useMemo(() => ({
      ...baseOptions,
      xaxis: { 
        ...baseOptions.xaxis,
        categories: chartData.labels,
      },
      yaxis: {
        min: minMaxAmperePilotPump.lowerLimit - 5,
        max: minMaxAmperePilotPump.upperLimit + 5,
        labels: {
          style: { colors: "#9CA3AF" },
          formatter: (v: number) => v.toFixed(2),
        },
      },
      annotations: {
        yaxis: [
          {
            y: minMaxAmperePilotPump.upperLimit,
            borderColor: "#f59e0b",
          },
          {
            y: minMaxAmperePilotPump.lowerLimit,
            borderColor: "#f59e0b",
          },
        ],
      }
    }), [chartData.labels, minMaxAmperePilotPump]);

    const mainPressureOptions = useMemo(() => ({
      ...baseOptions,
      xaxis: { 
        ...baseOptions.xaxis,
        categories: chartData.labels,
      },
      yaxis: {
        min: minMaxPressureMainPump.lowerLimit - 5,
        max: minMaxPressureMainPump.upperLimit + 5,
        labels: {
          style: { colors: "#9CA3AF" },
          formatter: (v: number) => v.toFixed(2),
        },
      },
      annotations: {
        yaxis: [
          {
            y: minMaxPressureMainPump.upperLimit,
            borderColor: "#f59e0b",
          },
          {
            y: minMaxPressureMainPump.lowerLimit,
            borderColor: "#f59e0b",
          },
        ],
      }
    }), [chartData.labels, minMaxPressureMainPump]);

    const pilotPressureOptions = useMemo(() => ({
      ...baseOptions,
      xaxis: { 
        ...baseOptions.xaxis,
        categories: chartData.labels,
      },
      yaxis: {
        min: minMaxPressurePilotPump.lowerLimit - 5,
        max: minMaxPressurePilotPump.upperLimit + 5,
        labels: {
          style: { colors: "#9CA3AF" },
          formatter: (v: number) => v.toFixed(2),
        },
      },
      annotations: {
        yaxis: [
          {
            y: minMaxPressurePilotPump.upperLimit,
            borderColor: "#f59e0b",
          },
          {
            y: minMaxPressurePilotPump.lowerLimit,
            borderColor: "#f59e0b",
          },
        ],
      }
    }), [chartData.labels, minMaxPressurePilotPump]);

    const oilOptions = useMemo(() => ({
      ...baseOptions,
      xaxis: { 
        ...baseOptions.xaxis,
        categories: chartData.labels,
      },
      yaxis: {
        min: minMaxOilTemp.lowerLimit - 5,
        max: minMaxOilTemp.upperLimit + 5,
        labels: {
          style: { colors: "#9CA3AF" },
          formatter: (v: number) => v.toFixed(2),
        },
      },
      annotations: {
        yaxis: [
          {
            y: minMaxOilTemp.upperLimit,
            borderColor: "#f59e0b",
          },
          {
            y: minMaxOilTemp.lowerLimit,
            borderColor: "#f59e0b",
          },
        ],
      }
    }), [chartData.labels, minMaxOilTemp]);


    useImperativeHandle(ref, () => ({
      async getChartImages() {
        if (!mainAmpereDivRef.current || !pilotAmpereDivRef.current || !oilDivRef.current || !mainPressureDivRef.current || !pilotPressureDivRef.current) {
          throw new Error("Chart container belum siap");
        }

        const mainAmpereCanvas = await html2canvas(mainAmpereDivRef.current, {
          scale: window.devicePixelRatio * 2,
          useCORS: true,
        });
        const pilotAmpereCanvas = await html2canvas(pilotAmpereDivRef.current, {
          scale: window.devicePixelRatio * 2,
          useCORS: true,
        });
        const mainPressureCanvas = await html2canvas(mainPressureDivRef.current, {
          scale: window.devicePixelRatio * 2,
          useCORS: true,
        });
        const pilotPressureCanvas = await html2canvas(pilotPressureDivRef.current, {
          scale: window.devicePixelRatio * 2,
          useCORS: true,
        });
        const oilCanvas = await html2canvas(oilDivRef.current, {
          scale: window.devicePixelRatio * 2,
          useCORS: true,
        });

        return {
          mainPressure: mainPressureCanvas.toDataURL("image/png"),
          pilotPressure: pilotPressureCanvas.toDataURL("image/png"),
          mainAmpere: mainAmpereCanvas.toDataURL("image/png"),
          pilotAmpere: pilotAmpereCanvas.toDataURL("image/png"),
          oil: oilCanvas.toDataURL("image/png"),
        };
      }
    }));

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap xl:flex-nowrap gap-4">
          <div ref={mainPressureDivRef} className="w-full bg-white dark:bg-slate-900 rounded-lg p-4">
            <h1>Pressure Main Pump</h1>
            <ReactApexChart
              options={mainPressureOptions}
              series={chartData.mainPressureSeries}
              type="line"
              height={250}
              />
          </div>

          <div ref={pilotPressureDivRef} className="w-full bg-white dark:bg-slate-900 rounded-lg p-4">
            <h1>Pressure Pilot Pump</h1>
            <ReactApexChart
              options={pilotPressureOptions}             
              series={chartData.pilotPressureSeries}
              type="line"
              height={250}
              />
          </div>

          <div ref={oilDivRef} className="w-full bg-white dark:bg-slate-900 rounded-lg p-4">
            <h1>Oil Temperature</h1>
            <ReactApexChart
              options={oilOptions} 
              series={chartData.oilSeries}
              type="line"
              height={250}
            />
          </div>
        </div>
        <div className="flex flex-wrap xl:flex-nowrap gap-4">
          <div ref={mainAmpereDivRef} className="w-full bg-white dark:bg-slate-900 rounded-lg p-4">
            <h1>Ampere Main Pump</h1>
            <ReactApexChart
              options={mainAmpereOptions}               
              series={chartData.mainAmpereSeries}
              type="line"
              height={250}
              />
          </div>
          <div ref={pilotAmpereDivRef} className="w-full bg-white dark:bg-slate-900 rounded-lg p-4">
            <h1>Ampere Pilot Pump</h1>
            <ReactApexChart
              options={pilotAmpereOptions}               
              series={chartData.pilotAmpereSeries}
              type="line"
              height={250}
            />
          </div>
        </div>
      </div>
    );
  }
);

ManualInputChart.displayName = "ManualInputChart";

export default ManualInputChart;
