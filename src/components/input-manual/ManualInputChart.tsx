

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

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export interface ManualChartHandle {
  getChartImages: () => Promise<{ main: string; pilot: string; oil: string }>;
}

type Props = {
  ManualinputData: ManualInputTable[];
};

const ManualInputChart = forwardRef<ManualChartHandle, Props>(
  ({ ManualinputData }, ref) => {

    const mainDivRef = useRef<HTMLDivElement>(null);
    const pilotDivRef = useRef<HTMLDivElement>(null);
    const oilDivRef = useRef<HTMLDivElement>(null);

   
    const [labels, setLabels] = useState<string[]>([]);
    const [mainSeries, setMainSeries] = useState<{ name: string; data: (number | null)[] }[]>([]);    
    const [pilotSeries, setPilotSeries] = useState<{ name: string; data: (number | null)[] }[]>([]);
    const [oilSeries, setOilSeries] = useState<{ name: string; data: (number | null)[] }[]>([]);    

    // ----------------------------
    // Update data
    // ----------------------------
    useEffect(() => {
      setLabels(
        ManualinputData.map((item) => {
          const date = new Date(item.time);
          return date.toLocaleDateString("id-ID", { hour12: false });
        }).reverse()
      );

      setMainSeries([
        { name: "Ampere R", data: ManualinputData.map((i) => i.mainR).reverse() },
        { name: "Ampere S", data: ManualinputData.map((i) => i.mainS).reverse() },
        { name: "Ampere T", data: ManualinputData.map((i) => i.mainT).reverse() },
        { name: "Pressure", data: ManualinputData.map((i) => i.oilPressMain).reverse() },
      ]);

      setPilotSeries([
        { name: "Ampere R", data: ManualinputData.map((i) => i.pilotR).reverse() },
        { name: "Ampere S", data: ManualinputData.map((i) => i.pilotS).reverse() },
        { name: "Ampere T", data: ManualinputData.map((i) => i.pilotT).reverse() },
        { name: "Pressure", data: ManualinputData.map((i) => i.oilPressPilot).reverse() },
      ]);

      setOilSeries([
        { name: "Oil Temperature", data: ManualinputData.map((i) => i.oilTemp).reverse() },
      ]);
    }, [ManualinputData]);

    // ----------------------------
    // Chart Options
    // ----------------------------
    const options: ApexCharts.ApexOptions = useMemo(
      () => ({
        chart: {
          type: "line",
          toolbar: { show: false },
          animations: { speed: 800 },
        },
        stroke: { curve: "smooth", width: 3 },
        grid: { borderColor: "#334155", strokeDashArray: 4 },
        xaxis: {
          categories: labels,
          labels: { style: { colors: "#9CA3AF" } },
        },
        yaxis: {
          labels: {
            style: { colors: "#9CA3AF" },
            formatter: (v) => v.toFixed(2),
          },
        },
      }),
      [labels]
    );

    useImperativeHandle(ref, () => ({
      async getChartImages() {
        if (!mainDivRef.current || !pilotDivRef.current || !oilDivRef.current) {
          throw new Error("Chart container belum siap");
        }

        // const mainCanvas = await html2canvas(mainDivRef.current);
        // const pilotCanvas = await html2canvas(pilotDivRef.current);
        // const oilCanvas = await html2canvas(oilDivRef.current);
        const mainCanvas = await html2canvas(mainDivRef.current, {
          scale: window.devicePixelRatio * 2,
          useCORS: true,
        });
        const pilotCanvas = await html2canvas(pilotDivRef.current, {
          scale: window.devicePixelRatio * 2,
          useCORS: true,
        });
        const oilCanvas = await html2canvas(oilDivRef.current, {
          scale: window.devicePixelRatio * 2,
          useCORS: true,
        });

        return {
          main: mainCanvas.toDataURL("image/png"),
          pilot: pilotCanvas.toDataURL("image/png"),
          oil: oilCanvas.toDataURL("image/png"),
        };
      }
    }));


    return (
      <div className="flex flex-wrap xl:flex-nowrap gap-4">
        <div ref={mainDivRef} className="w-full bg-white dark:bg-slate-900 rounded-lg p-4">
          <h1>Main Pump</h1>
          <ReactApexChart
            options={options}
            series={mainSeries}
            type="line"
            height={250}
            />
        </div>

        <div ref={pilotDivRef} className="w-full bg-white dark:bg-slate-900 rounded-lg p-4">
          <h1>Pilot Pump</h1>
          <ReactApexChart
            options={options}
            series={pilotSeries}
            type="line"
            height={250}
            />
        </div>

        <div ref={oilDivRef} className="w-full bg-white dark:bg-slate-900 rounded-lg p-4">
          <h1>Oil Area</h1>
          <ReactApexChart
            options={options}
            series={oilSeries}
            type="line"
            height={250}
          />
        </div>
      </div>
    );
  }
);

ManualInputChart.displayName = "ManualInputChart";

export default ManualInputChart;
