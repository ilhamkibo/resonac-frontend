"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// ✅ Import chart hanya di client
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function randAround(base: number, spread = 0.05): number {
  const delta = (Math.random() * 2 - 1) * spread * base;
  return Math.max(0, +(base + delta).toFixed(2));
}

function createInitialSeries(base: number, variance = 0.05): number[] {
  return Array.from({ length: 30 }, () => randAround(base, variance));
}

export default function MainAmpere() {
  const [series, setSeries] = useState([
    { name: "R", data: createInitialSeries(110, 0.08) },
    { name: "S", data: createInitialSeries(115, 0.08) },
    { name: "T", data: createInitialSeries(108, 0.08) },
  ]);

  // Update nilai tiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setSeries([
        { name: "R", data: createInitialSeries(randAround(110, 0.01), 0.01) },
        { name: "S", data: createInitialSeries(randAround(115, 0.01), 0.01) },
        { name: "T", data: createInitialSeries(randAround(108, 0.01), 0.01) },
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const options: ApexOptions = {
    chart: { type: "line", sparkline: { enabled: true }, height: 200 },
    stroke: { width: 2, curve: "smooth" },
    colors: ["#2563eb", "#06b6d4", "#a78bfa"],
    tooltip: { enabled: true, theme: "light" },
  };

  return (
    <div className="bg-slate-50 p-3 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium">Ampere R-S-T</div>
        <div className="text-xs text-slate-500" id="mainAmpSum">
         {series[0].data[series[0].data.length - 1].toFixed(2)} A | {series[1].data[series[1].data.length - 1].toFixed(2)} A | {series[2].data[series[2].data.length - 1].toFixed(2)} A
        </div>
      </div>
      <ReactApexChart options={options} series={series} type="line" height={200} />
    </div>
  );
}
