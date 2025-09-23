"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// ✅ Import chart hanya di client
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function AreaChart( {title, unit} : {title: string; unit: string}) {
  function randAround(base: number, spread = 0.05) {
    const delta = (Math.random() * 2 - 1) * spread * base;
    return Math.max(0, +(base + delta).toFixed(2));
  }

  function createInitialSeries(base: number, variance = 0.05) {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push(randAround(base, variance));
    }
    return arr.map((v, i) => ({ x: i, y: v }));
  }

  // ✅ State untuk chart series
  const [series, setSeries] = useState([
    { name: "kWh", data: createInitialSeries(0.5, 0.6) },
  ]);

  // ✅ Update data tiap 1 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prev) => {
        const oldData = prev[0].data;
        const lastX = oldData[oldData.length - 1].x;
        const newY = randAround(0.5, 0.6); // generate angka baru

        const newData = [...oldData.slice(1), { x: lastX + 1, y: newY }];
        return [{ name: "kWh", data: newData }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mainKWhOptions: ApexOptions = {
    chart: { type: "area", 
      zoom: {
        enabled: true,
        allowMouseWheelZoom: false
      }, 
      height: 140, toolbar: { show: false } 
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { labels: { show: false }, axisTicks: { show: false } },
    tooltip: { y: { formatter: (v) => v + " kWh" } },
    colors: ["#f97316"],
    fill: { opacity: 0.15 },
  };

  return (
    <div className="bg-slate-50 px-3 rounded-lg lg:col-span-2 dark:bg-slate-800">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium dark:text-gray-200">{title}</div>
        <div className="text-lg font-semibold dark:text-gray-400">
          {series[0].data[series[0].data.length - 1].y.toFixed(2)} {unit}
        </div>
      </div>
      <ReactApexChart
        options={mainKWhOptions}
        series={series}
        type="area"
        height={140}
      />
    </div>
  );
}
