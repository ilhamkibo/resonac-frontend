"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function randAround(base: number, spread = 0.05): number {
  const delta = (Math.random() * 2 - 1) * spread * base;
  return Math.max(0, +(base + delta).toFixed(2));
}

const MAX_POINTS = 50; // maksimal titik data

function createInitialSeries(base: number, variance = 0.05): { x: number; y: number }[] {
  const now = Date.now();
  return Array.from({ length: MAX_POINTS }, (_, i) => ({
    x: now + i * 1000, // 1 detik per data
    y: randAround(base, variance),
  }));
}

export default function LineChart({ title }: { title: string }) {
  const [series, setSeries] = useState([
    { name: "R", data: createInitialSeries(110, 0.08) },
    { name: "S", data: createInitialSeries(115, 0.08) },
    { name: "T", data: createInitialSeries(108, 0.08) },
  ]);

  // Update tiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setSeries((prev) =>
        prev.map((s, idx) => {
          const base = idx === 0 ? 110 : idx === 1 ? 115 : 108;
          const newPoint = { x: now, y: randAround(base, 0.01) };

          // ✅ Geser data agar panjang tidak lebih dari MAX_POINTS
          const newData =
            s.data.length >= MAX_POINTS
              ? [...s.data.slice(1), newPoint] // buang 1, tambah 1
              : [...s.data, newPoint];

          return { ...s, data: newData };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const threshold = 120;

  const options: ApexOptions = {
    chart: { 
      type: "line", 
      height: 200,
      toolbar: { show: false }
    },
    stroke: { width: 2, curve: "smooth" },
    colors: ["#ff0000", "#858585", "#000"],
    tooltip: { enabled: true, theme: "light", x: { format: "HH:mm:ss" } },
    xaxis: {
      type: "datetime",
      labels: { datetimeUTC: false, format: "HH:mm:ss" },
    },
    yaxis: {
      labels: { formatter: (val) => `${val.toFixed(0)} A` },
    },
    annotations: {
      yaxis: [
        {
          y: threshold,
          borderColor: "#FF0000",
          label: {
            borderColor: "#FF0000",
            style: { color: "#fff", background: "#FF0000" },
            text: `Max ${threshold}`,
          },
        },
      ],
    },
  };

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium dark:text-gray-200">{title}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {series.map((s) => `${s.data[s.data.length - 1].y.toFixed(2)} A`).join(" | ")}
        </div>
      </div>
      <ReactApexChart options={options} series={series} type="line" height={200} />
    </>
  );
}
