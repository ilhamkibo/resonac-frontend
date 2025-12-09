// "use client";

// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// type Props = {
//   value?: number;
//   title: string
//   thresholds?: {max: number, min: number};
// };

// export function OilTemperatureCard({ title, value, thresholds }: Props) {
//   const [temp, setTemp] = useState(30);
//   const [data, setData] = useState<number[]>([20, 25, 28, 32, 29, 35, 30]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const next = 25 + Math.random() * 10;
//       setTemp(next);
//       setData((prev) => [...prev.slice(1), next]);
//     }, 1500);
//     return () => clearInterval(interval);
//   }, []);

//   const getColor = (val: number) => (val >= 40 ? "#ef4444" : val >= 35 ? "#f59e0b" : "#10b981");

//   const options: ApexCharts.ApexOptions = {
//     chart: { type: "line", sparkline: { enabled: true } },
//     stroke: { width: 2, curve: "smooth" },
//     colors: [getColor(temp)],
//   };

//   return (
//     <div className="bg-white dark:bg-slate-800 border rounded-2xl shadow-md p-6 flex flex-col">
//       <h3 className="text-center font-semibold mb-4">Oil Temperature</h3>
//       <div className="text-4xl font-bold text-center mb-4">{temp.toFixed(1)}°C</div>
//       <ReactApexChart options={options} series={[{ data }]} type="line" height={150} />
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface TempCardProps {
  title: string;
  data: { value: number | undefined }; 
  thresholds?: {  
    id: number;
    area: string;
    parameter: string;
    lowerLimit: number;
    upperLimit: number;
    createdAt: string; }; // Threshold dari server
}

export function OilTemperatureCard({ title, data, thresholds }: TempCardProps) {
 
  const value = data.value;
  const currentValue = value ?? 0;
  
  const [labels, setLabels] = useState(() => 
    Array.from({ length: 10 }, (_, i) => new Date(Date.now() - (9 - i) * 1000).toLocaleTimeString("id-ID", { hour12: false }))
  );
  
  const [series, setSeries] = useState(() => [
    { name: "Temp", data: Array(10).fill(currentValue) }
  ]);

  useEffect(() => {
    const newTime = new Date().toLocaleTimeString("id-ID", { hour12: false });
    setLabels((prevLabels) => [...prevLabels.slice(1), newTime]);
    setSeries((prevSeries) => [
    {
      name: "Temp",
      data: [...prevSeries[0].data.slice(1), currentValue], 
    }
    ]);
  }, [data, currentValue]); // Bergantung pada 'value'

 // Opsi Chart
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
    markers: {
      size: 4,
    },
    colors: ["#22c55e"], // Warna hijau untuk suhu
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
      min: thresholds ? thresholds.lowerLimit - 5 : 0, 
      max: thresholds ? thresholds.upperLimit + 5 : 100, // Default upperLimit 100
      labels: { 
        style: { 
          colors: "#9CA3AF" 
        }, 
        formatter: (v) => v.toFixed(0) + " °C" 
      },
    },
    annotations: {
      yaxis: [
        thresholds ? { y: thresholds.upperLimit, borderColor: "#ef4444", label: { text: `Max (${thresholds.upperLimit}°C)` } } : {},
        thresholds ? { y: thresholds.lowerLimit, borderColor: "#3b82f6", label: { text: `Min (${thresholds.lowerLimit}°C)` } } : {},
      ],
    },
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-700 shadow-md p-6 flex flex-col">
      <h3 className="text-center font-semibold mb-4 text-gray-800 dark:text-slate-300 ">{title}</h3>
      <div className="text-4xl font-bold text-center mb-4 text-gray-800 dark:text-slate-300">{currentValue.toFixed(1)}°C</div>
      <ReactApexChart options={options} series={series} type="line" height={150} />
    </div>
  );
}