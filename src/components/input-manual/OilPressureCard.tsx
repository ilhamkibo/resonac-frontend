"use client";

import dynamic from "next/dynamic";
import { Gauge } from "lucide-react";
import { useState, useEffect } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
};

export function OilPressureCard({ value, onChange, max = 10 }: Props) {
  const [mainValue, setMainValue] = useState(5.3);
  const [pilotValue, setPilotValue] = useState(4.7);
  const maxPressure = max;

  // Auto update dummy data tiap 2 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setMainValue((prev) => {
        const newVal = prev + (Math.random() * 0.6 - 0.3); // ±0.3
        return Math.min(Math.max(newVal, 0), maxPressure);
      });
      setPilotValue((prev) => {
        const newVal = prev + (Math.random() * 0.6 - 0.3);
        return Math.min(Math.max(newVal, 0), maxPressure);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [maxPressure]);

  const getColor = (v: number) => {
    const p = (v / maxPressure) * 100;
    if (p >= 90) return "#dc2626";
    if (p >= 70) return "#f59e0b";
    return "#3b82f6";
  };

  const makeGaugeOptions = (color: string): ApexCharts.ApexOptions => ({
    chart: { type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: { size: "60%" },
        track: { background: "#1e293b", strokeWidth: "100%" },
        dataLabels: {
          name: {
            show: true,
            color: "#94a3b8",
            fontSize: "12px",
            offsetY: 50,
          },
          value: {
            show: true,
            fontSize: "24px",
            fontWeight: 600,
            color,
            offsetY: -10,
            formatter: (val: number) =>
              `${((val / 100) * maxPressure).toFixed(1)} bar`,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: [color],
        stops: [0, 100],
      },
    },
    stroke: { lineCap: "round" },
    labels: [""],
  });

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md p-6 w-full h-[340px] flex flex-col">
      <div className="flex items-center justify-center mb-4">
        <h3 className="text-gray-700 dark:text-gray-300 text-lg font-semibold uppercase tracking-wide">
          Oil Pressure
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* MAIN PUMP */}
        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl h-full">
          <div className="flex gap-2 items-center mb-1">
            <Gauge className="w-6 h-6 text-emerald-500" />
            <h1 className="text-sm font-medium dark:text-gray-300 text-gray-500">
              Main Pump
            </h1>
          </div>
          <ReactApexChart
            options={makeGaugeOptions(getColor(mainValue))}
            series={[(mainValue / maxPressure) * 100]}
            type="radialBar"
            height={200}
          />
        </div>

        {/* PILOT PUMP */}
        <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-xl h-full">
          <div className="flex gap-2 items-center mb-1">
            <Gauge className="w-6 h-6 text-blue-500" />
            <h1 className="text-sm font-medium dark:text-gray-300 text-gray-500">
              Pilot Pump
            </h1>
          </div>
          <ReactApexChart
            options={makeGaugeOptions(getColor(pilotValue))}
            series={[(pilotValue / maxPressure) * 100]}
            type="radialBar"
            height={200}
          />
        </div>
      </div>
    </div>
  );
}
