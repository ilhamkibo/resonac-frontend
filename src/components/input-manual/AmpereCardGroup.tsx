"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AmpereCardProps {
  title: string;
  data: { label: string; value: number | undefined }[];
  thresholds?: { 
    id: number;
    area: string;
    parameter: string;
    lowerLimit: number;
    upperLimit: number;
    createdAt: string; };
}

export function AmpereCardGroup({ title, data, thresholds }: AmpereCardProps) {
  const [labels, setLabels] = useState(() =>
      Array.from({ length: 10 }, (_, i) => {
        const date = new Date(Date.now() - (9 - i) * 1000);
        return date.toLocaleTimeString("id-ID", { hour12: false });
      })
  );

  const [series, setSeries] = useState(() => [
    { name: "R", data: Array(10).fill(data[0].value ?? 0) },
    { name: "S", data: Array(10).fill(data[1].value ?? 0) },
    { name: "T", data: Array(10).fill(data[2].value ?? 0) },
  ]);

 const colors = ["#ef4444", "#f59e0b", "#3b82f6"];

  useEffect(() => {
    if (typeof data[0].value === 'undefined') {
      return;
    }

    const newTime = new Date().toLocaleTimeString("id-ID", { hour12: false });
    setLabels((prevLabels) => [...prevLabels.slice(1), newTime]);
    setSeries((prevSeries) => [
      {
        name: "R",
        data: [...prevSeries[0].data.slice(1), data[0].value ?? 0],
      },
      {
        name: "S",
        data: [...prevSeries[1].data.slice(1), data[1].value ?? 0],
      },
      {
        name: "T",
        data: [...prevSeries[2].data.slice(1), data[2].value ?? 0],
      },
    ]);
  }, [data]);


  const options: ApexCharts.ApexOptions = {
    chart: { 
      type: "line", 
      toolbar: { 
        show: false 
      }, 
      zoom: { 
        enabled: false 
      }, 
      animations: { 
        speed: 800 
      } 
    }, 
    stroke: { 
      curve: "smooth", 
      width: 3 
    },
    colors,
    grid: { 
      borderColor: "#334155", 
      strokeDashArray: 4 
    },
    xaxis: { 
      categories: labels, 
      labels: { 
        style: { 
          colors: "#9CA3AF" 
        } 
      } 
    },
    yaxis: {
      min: thresholds ? thresholds.lowerLimit - 10 : 0,
      max: thresholds ? thresholds.upperLimit + 10 : 100,
      labels: { style: { colors: "#9CA3AF" }, formatter: (v) => v + " A" },
    },
    annotations: {
      yaxis: [
        thresholds ? { y: thresholds.upperLimit, borderColor: "#ef4444", label: { text: `Max (${thresholds.upperLimit}A)` } } : {},
        thresholds ? { y: thresholds.lowerLimit, borderColor: "#3b82f6", label: { text: `Min (${thresholds.lowerLimit}A)` } } : {},
      ],
    },
  };

  return (
    <div className="relative p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-700 shadow-md">
      <div className="absolute -top-3 left-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 text-sm font-medium border border-slate-100 dark:border-slate-700 rounded-md">
        {title}
      </div>
      <div className="text-center font-semibold text-lg mb-3 text-gray-700 dark:text-gray-300">
        Current
      </div>
      <ReactApexChart options={options} series={series} type="line" height={200} />
      <div className="grid grid-cols-3 gap-3 mt-4">
        {data.map((item, i) => (
        <div key={item.label} className="bg-slate-100 dark:bg-slate-700/20 rounded-lg py-3 flex flex-col items-center">
          <div style={{ color: colors[i] }} className="text-2xl font-semibold">
            {item.value?.toFixed(1) ?? "0.0"} A
          </div>
          <div className="text-gray-400 text-sm font-medium">
            {item.label}
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
