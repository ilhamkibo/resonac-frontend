"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function OilTemperatureCard() {
  const [temp, setTemp] = useState(30);
  const [data, setData] = useState<number[]>([20, 25, 28, 32, 29, 35, 30]);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = 25 + Math.random() * 10;
      setTemp(next);
      setData((prev) => [...prev.slice(1), next]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getColor = (val: number) => (val >= 40 ? "#ef4444" : val >= 35 ? "#f59e0b" : "#10b981");

  const options: ApexCharts.ApexOptions = {
    chart: { type: "line", sparkline: { enabled: true } },
    stroke: { width: 2, curve: "smooth" },
    colors: [getColor(temp)],
  };

  return (
    <div className="bg-white dark:bg-slate-800 border rounded-2xl shadow-md p-6 flex flex-col">
      <h3 className="text-center font-semibold mb-4">Oil Temperature</h3>
      <div className="text-4xl font-bold text-center mb-4">{temp.toFixed(1)}°C</div>
      <ReactApexChart options={options} series={[{ data }]} type="line" height={150} />
    </div>
  );
}
