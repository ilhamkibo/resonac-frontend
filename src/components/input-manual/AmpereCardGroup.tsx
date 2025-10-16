"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AmpereCardProps {
  title: string;
  data: { label: string; value: number }[];
}

export function AmpereCardGroup({ title, data }: AmpereCardProps) {
  const [series, setSeries] = useState([
    { name: "R", data: Array(10).fill(data[0].value) },
    { name: "S", data: Array(10).fill(data[1].value) },
    { name: "T", data: Array(10).fill(data[2].value) },
  ]);

  const [labels, setLabels] = useState(
    Array.from({ length: 10 }, (_, i) => {
      const date = new Date(Date.now() - (9 - i) * 1000);
      return date.toLocaleTimeString("id-ID", { hour12: false });
    })
  );

  const colors = ["#ef4444", "#f59e0b", "#3b82f6"];

  const options: ApexCharts.ApexOptions = {
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth", width: 3 },
    colors,
    grid: { borderColor: "#334155", strokeDashArray: 4 },
    xaxis: { categories: labels, labels: { style: { colors: "#9CA3AF" } } },
    yaxis: {
      min: 0,
      max: 40,
      labels: { style: { colors: "#9CA3AF" }, formatter: (v) => v + " A" },
    },
    annotations: {
      yaxis: [
        { y: 30, borderColor: "#ef4444", label: { text: "Max (30A)" } },
        { y: 10, borderColor: "#3b82f6", label: { text: "Min (10A)" } },
      ],
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date().toLocaleTimeString("id-ID", { hour12: false });
      setLabels((prev) => [...prev.slice(1), newTime]);
      setSeries((prev) =>
        prev.map((s) => ({
          ...s,
          data: [...s.data.slice(1), s.data[s.data.length - 1] + (Math.random() * 2 - 1)],
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-700 shadow-md">
      <div className="absolute -top-3 left-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 text-sm font-medium border border-slate-100 dark:border-slate-700 rounded-md">
        {title}
      </div>
      <div className="text-center font-semibold text-lg mb-3">Current</div>
      <ReactApexChart options={options} series={series} type="line" height={200} />
      <div className="grid grid-cols-3 gap-3 mt-4">
        {data.map((item, i) => (
          <div key={item.label} className="bg-slate-100 dark:bg-slate-700/20 rounded-lg py-3 flex flex-col items-center">
            <div style={{ color: colors[i] }} className="text-2xl font-semibold">
              {series[i].data.at(-1)?.toFixed(1)} A
            </div>
            <div className="text-gray-400 text-sm font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
