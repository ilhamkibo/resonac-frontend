"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AmpereCardProps {
  title: string;
  data: { label: string; value: number | undefined }[];
}

export function AmpereCardGroup({ title, data }: AmpereCardProps) {
 // Inisialisasi state untuk labels (cukup 10 timestamp awal)
 const [labels, setLabels] = useState(() =>
  Array.from({ length: 10 }, (_, i) => {
   const date = new Date(Date.now() - (9 - i) * 1000);
   return date.toLocaleTimeString("id-ID", { hour12: false });
  })
 );

 // Inisialisasi state untuk series (cukup 10 data awal)
 const [series, setSeries] = useState(() => [
  { name: "R", data: Array(10).fill(data[0].value ?? 0) },
  { name: "S", data: Array(10).fill(data[1].value ?? 0) },
  { name: "T", data: Array(10).fill(data[2].value ?? 0) },
 ]);

 const colors = ["#ef4444", "#f59e0b", "#3b82f6"];

 // ✅ PERBAIKAN UTAMA: Gunakan useEffect untuk bereaksi terhadap perubahan 'data'
 useEffect(() => {
    // Cek apakah data baru valid (minimal data R ada)
    // Ini mencegah update jika mqttData masih undefined
  if (typeof data[0].value === 'undefined') {
   return;
  }

    // Ambil timestamp baru
  const newTime = new Date().toLocaleTimeString("id-ID", { hour12: false });
    
    // Update label (hapus yg lama, tambah yg baru)
  setLabels((prevLabels) => [...prevLabels.slice(1), newTime]);

    // Update series dengan data baru dari props
  setSeries((prevSeries) => [
   {
    name: "R",
        // Hapus data lama, tambahkan data[0].value (data R baru dari props)
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
    // ... Opsi chart Anda (sudah benar) ...
  chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false }, animations: { easing: 'linear', speed: 800 } }, // Tambahkan animasi
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

  return (
    <div className="relative p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-700 shadow-md">
   {/* ... Judul ... */}
   <div className="absolute -top-3 left-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-2 text-sm font-medium border border-slate-100 dark:border-slate-700 rounded-md">
    {title}
   </div>
   <div className="text-center font-semibold text-lg mb-3">Current</div>
   <ReactApexChart options={options} series={series} type="line" height={200} />
   
      {/* ✅ PERBAIKAN TAMPILAN: Tampilkan nilai dari 'data' (props) agar selalu instan */}
   <div className="grid grid-cols-3 gap-3 mt-4">
    {data.map((item, i) => (
     <div key={item.label} className="bg-slate-100 dark:bg-slate-700/20 rounded-lg py-3 flex flex-col items-center">
      <div style={{ color: colors[i] }} className="text-2xl font-semibold">
              {/* Tampilkan nilai dari props 'data', bukan dari state 'series' */}
       {item.value?.toFixed(1) ?? "0.0"} A
      </div>
      <div className="text-gray-400 text-sm font-medium">{item.label}</div>
     </div>
    ))}
   </div>
  </div>
  );
}
