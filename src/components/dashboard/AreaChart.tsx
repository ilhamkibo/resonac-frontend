"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function LineChart({
  title,
  unit,
  upperThreshold = 0.8,
  lowerThreshold = 0.3,
}: {
  title: string;
  unit: string;
  upperThreshold?: number;
  lowerThreshold?: number;
}) {
  const [mounted, setMounted] = useState(false);

  // 🔹 fungsi random data sekitar base value
  function randAround(base: number, spread = 0.05) {
    const delta = (Math.random() * 2 - 1) * spread * base;
    return Math.max(0, +(base + delta).toFixed(2));
  }

  // 🔹 buat data awal (30 titik)
  function createInitialSeries(base: number, variance = 0.05) {
    const now = Date.now();
    return Array.from({ length: 30 }, (_, i) => ({
      x: new Date(now - (29 - i) * 1000).getTime(),
      y: randAround(base, variance),
    }));
  }

  // 🔹 state data
  const [series, setSeries] = useState([
    { name: "bar", data: createInitialSeries(0.5, 0.6) },
  ]);

  // 🔹 update setiap 1 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prev) => {
        const oldData = prev[0].data;
        const newY = randAround(0.5, 0.6);
        const newPoint = { x: Date.now(), y: newY };
        const newData = [...oldData.slice(1), newPoint];
        return [{ name: "bar", data: newData }];
      });
      setMounted(true);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 konfigurasi chart
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 200,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, easing: "easeinout", speed: 600 },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#fbbf24"], // kuning lembut
    },
    markers: {
      size: 4,
      colors: ["#fbbf24"],
      strokeWidth: 2,
      strokeColors: "#1e293b",
      hover: { size: 6 },
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "#94a3b8" },
        datetimeFormatter: { second: "HH:mm:ss" },
      },
      axisTicks: { show: false },
      axisBorder: { color: "#475569" },
    },
    yaxis: {
      min: 0,
      max: 1,
      labels: { style: { colors: "#94a3b8" } },
    },
    tooltip: {
      theme: "dark",
      x: { format: "HH:mm:ss" },
      y: { formatter: (v) => `${v.toFixed(2)} ${unit}` },
    },
    annotations: {
      yaxis: [
        {
          y: upperThreshold,
          borderColor: "#ef4444",
          label: {
            borderColor: "#ef4444",
            style: {
              color: "#ffffff !important",  // 🧊 pastikan pakai !important
              background: "#ef4444",
              fontWeight: "bold",
              fontSize: "12px",
            },
            text: `Max (${upperThreshold})`,
          },
        },
        {
          y: lowerThreshold,
          borderColor: "#3b82f6",
          label: {
            borderColor: "#3b82f6",
             style: {
              color: "#ffffff !important",  // 🧊 teks putih kuat
              background: "#3b82f6",
              fontWeight: "bold",
              fontSize: "12px",
            },
            text: `Lower Limit (${lowerThreshold})`,
          },
        },
      ],
    },
  };

  return (
    <>
    {/* <div className="p-3 bg-[#1e293b] rounded-2xl shadow-md"> */}
      <div className="text-center">
        <h1 className="text-lg font-semibold text-gray-100">{title}</h1>
      </div>
      {mounted && (
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={200}
        />
      )}
    {/* </div> */}
    </>
  );
}
