// "use client";


// import Button from '@/components/ui/button/Button'
// import React, { useEffect, useState } from "react";
// import { User, MapPin, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
// import dynamic from "next/dynamic";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
// interface AmpereCardProps {
//   title: string;
//   data: { label: string; value: number }[];
// }
// export default function Page() {

//     const chartOptions: ApexCharts.ApexOptions = {
//     chart: {
//       type: "line",
//       sparkline: { enabled: true },
//     },
//     stroke: {
//       width: 2,
//       curve: "smooth",
//     },
//     colors: ["#10b981"], // Warna hijau (Tailwind emerald-500)
//     tooltip: { enabled: false },
//   };

//   const chartSeries = [
//     {
//       data: [20, 30, 25, 40, 35, 50, 45],
//     },
//   ];

//   const mainData = [
//     { label: "R", value: 24.5 },
//     { label: "S", value: 22.1 },
//     { label: "T", value: 20.8 },
//   ];

//   const pilotData = [
//     { label: "R", value: 24.5 },
//     { label: "S", value: 22.1 },
//     { label: "T", value: 20.8 },
//   ];

//   return (
//     <div>
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4'> 
//             {/* <div className="relative mt-4 shadow-sm border border-gray-200 dark:border-gray-800 p-2 rounded-xl">
//                 <div className='absolute dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm dark:text-white'>
//                     Main
//                 </div>
//                 <div>
//                     <h1 className='text-2xl font-bold text-gray-400 dark:text-gray-300 text-center'>Ampere</h1>
//                 </div>
//                 <div className="grid mt-2 grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="shadow-sm text-center bg-white dark:bg-gray-800 p-4 rounded-xl">
//                         <p className="mt-1 text-4xl text-gray-500 dark:text-gray-300">
//                             24.5 A
//                         </p>
//                         <h3 className="text-xl font-medium text-gray-800 dark:text-white/90">
//                              R
//                         </h3>
//                     </div>
//                     <div className="text-center shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
//                         <p className="mt-1 text-4xl text-gray-500 dark:text-gray-300">
//                             22.1 A
//                         </p>
//                         <h3 className="text-xl font-medium text-gray-800 dark:text-white/90">
//                              S
//                         </h3>
//                     </div>
//                     <div className="text-center shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
//                         <p className="mt-1 text-4xl text-gray-500 dark:text-gray-300">
//                             20.8 A
//                         </p>
//                         <h3 className="text-xl font-medium text-gray-800 dark:text-white/90">
//                              T
//                         </h3>
//                     </div>
//                 </div>
//             </div>
//             <div className="relative mt-4 shadow-sm border border-gray-200 dark:border-gray-800 p-2 rounded-xl">
//                 <div className='absolute dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm dark:text-white'>
//                     Pilot
//                 </div>
//                 <div>
//                     <h1 className='text-2xl font-bold text-gray-400 dark:text-gray-300 text-center'>Ampere</h1>
//                 </div>
//                 <div className="grid mt-2 grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="shadow-sm text-center bg-white dark:bg-gray-800 p-4 rounded-xl">
//                         <p className="mt-1 text-4xl text-gray-500 dark:text-gray-300">
//                             24.5 A
//                         </p>
//                         <h3 className="text-xl font-medium text-gray-800 dark:text-white/90">
//                              R
//                         </h3>
//                     </div>
//                     <div className="text-center shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
//                         <p className="mt-1 text-4xl text-gray-500 dark:text-gray-300">
//                             22.1 A
//                         </p>
//                         <h3 className="text-xl font-medium text-gray-800 dark:text-white/90">
//                              S
//                         </h3>
//                     </div>
//                     <div className="text-center shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
//                         <p className="mt-1 text-4xl text-gray-500 dark:text-gray-300">
//                             20.8 A
//                         </p>
//                         <h3 className="text-xl font-medium text-gray-800 dark:text-white/90">
//                              T
//                         </h3>
//                     </div>
//                 </div>
//             </div> */}
//             <AmpereCardGroup title="Main" data={mainData} />
//             <AmpereCardGroup title="Pilot" data={pilotData} />
//         </div>
//         <div className='flex gap-4 justify-center mt-4'>
//             <div className="bg-white shadow-sm rounded-2xl p-5 w-80 border grid border-gray-100">
//                 <div className="flex items-center justify-between mb-3">
//                     <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
//                     <MoreHorizontal className="w-4 h-4 text-gray-400" />
//                 </div>

//                 <div className="flex items-center justify-between">
//                     {/* Kiri */}
//                     <div className="flex flex-col items-center w-1/2 border-r border-gray-100 pr-2">
//                     <div className="flex items-center gap-2 mb-1">
//                         <div className="p-2 bg-emerald-100 rounded-full">
//                         <User className="w-4 h-4 text-emerald-600" />
//                         </div>
//                         <span className="flex items-center text-xs text-emerald-500 font-medium">
//                         <ArrowUpRight className="w-3 h-3 mr-0.5" /> +3.48%
//                         </span>
//                     </div>
//                     <h2 className="text-2xl font-semibold text-gray-900">178,080</h2>
//                     </div>

//                     {/* Kanan */}
//                     <div className="flex flex-col items-center w-1/2 pl-2">
//                     <div className="flex items-center gap-2 mb-1">
//                         <div className="p-2 bg-indigo-100 rounded-full">
//                         <MapPin className="w-4 h-4 text-indigo-600" />
//                         </div>
//                         <span className="flex items-center text-xs text-red-500 font-medium">
//                         <ArrowDownRight className="w-3 h-3 mr-0.5" /> -0.42%
//                         </span>
//                     </div>
//                     <h2 className="text-2xl font-semibold text-gray-900">178,080</h2>
//                     </div>
//                 </div>
//             </div>
//             <div className="p-4 bg-white rounded-2xl shadow-sm w-[250px]">
//                 {/* Header */}
//                 <div className="text-sm text-gray-500 font-medium">Revenue</div>

//                 {/* Value & Growth */}
//                 <div className="flex items-center justify-between mt-1 mb-2">
//                     <div className="text-2xl font-semibold">$84,952</div>
//                     <div className="flex items-center text-emerald-500 text-sm font-medium">
//                     <ArrowUpRight size={14} className="mr-1" /> +0.19%
//                     </div>
//                 </div>

//                 {/* Sparkline */}
//                 <ReactApexChart
//                     options={chartOptions}
//                     series={chartSeries}
//                     type="line"
//                     height={60}
//                 />

//                 {/* Footer */}
//                 <div className="flex justify-between mt-2 text-sm text-gray-500">
//                     <span>Direct visits</span>
//                     <span className="font-semibold text-gray-800">32.72%</span>
//                 </div>
//             </div>
//         </div>
//         <div className='mt-4 text-center'>
//             <Button>Simpan Data</Button>
//             <h1 className='mt-4 text-gray-300 dark:text-gray-400'>
//                 Penyimpanan terakhir: <span id="last-saved-time">10/10/2023 10:00</span>
//             </h1>
//         </div>

//     </div>
//   )
// }

// const AmpereCardGroup: React.FC<AmpereCardProps> = ({ title, data }) => {

//     const [series, setSeries] = useState([
//     {
//       name: "Ampere",
//       data: data.map((d) => d.value),
//     },
//   ]);

//   const lineChartOptions: ApexCharts.ApexOptions = {
//     chart: {
//       type: "line",
//       toolbar: { show: false },
//       zoom: { enabled: false },
//       animations: {
//         enabled: true,
//         speed: 800,
//       },
//     },
//     stroke: {
//       curve: "smooth",
//       width: 3,
//     },
//     grid: {
//       borderColor: "#374151",
//       strokeDashArray: 4,
//     },
//     colors: ["#22d3ee"],
//     xaxis: {
//       categories: data.map((d) => d.label),
//       labels: { style: { colors: "#9CA3AF" } },
//     },
//     yaxis: {
//       labels: { style: { colors: "#9CA3AF" } },
//     },
//     tooltip: {
//       theme: "dark",
//     },
//   };

//   // 🔁 Simulasi update data otomatis tiap 2 detik
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setSeries([
//         {
//           name: "Ampere",
//           data: series[0].data.map(
//             (val) => val + (Math.random() * 2 - 1) // naik/turun acak
//           ),
//         },
//       ]);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [series]);
    
//   return (
//     <div className="relative p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-md w-full">
//       {/* Label atas */}
//       <div className="absolute -top-3 left-4 bg-slate-900 text-gray-300 px-2 text-sm font-medium border border-slate-700 rounded-md">
//         {title}
//       </div>

//       <div className="text-center text-gray-300 font-semibold text-lg mb-3">
//         Ampere
//       </div>

//       {/* Line Chart */}
//       <div className="mt-2 mb-4 bg-slate-800 rounded-lg p-2">
//         <ReactApexChart
//           options={lineChartOptions}
//           series={series}
//           type="line"
//           height={200}
//         />
//       </div>

//       {/* Isi Card */}
//       <div className="grid grid-cols-3 gap-3">
//         {data.map((item) => (
//           <div
//             key={item.label}
//             className="bg-slate-800 hover:bg-slate-700 transition-colors rounded-xl shadow-inner flex flex-col items-center justify-center py-4"
//           >
//             <div className="text-2xl font-semibold text-slate-100">
//               {item.value.toFixed(1)} A
//             </div>
//             <div className="text-gray-400 text-sm font-medium mt-1">
//               {item.label}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  User,
  MapPin,Gauge,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface AmpereCardProps {
  title: string;
  data: { label: string; value: number }[];
}

export default function Page() {
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
    },
    stroke: {
      width: 2,
      curve: "smooth",
    },
    colors: ["#10b981"],
    tooltip: { enabled: false },
  };

  const chartSeries = [
    {
      data: [20, 30, 25, 40, 35, 50, 45],
    },
  ];

  const mainData = [
    { label: "R", value: 24.5 },
    { label: "S", value: 22.1 },
    { label: "T", value: 20.8 },
  ];

  const pilotData = [
    { label: "R", value: 23.8 },
    { label: "S", value: 21.9 },
    { label: "T", value: 19.6 },
  ];

  const gaugeOptions = (label: string, color: string): ApexCharts.ApexOptions => ({
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
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
            formatter: (val: number) => `${val.toFixed(1)} bar`,
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
    labels: [label],
  });

  const mainValue = 5.6;
  const pilotValue = 5.3;
  const maxPressure = 10; // batas maksimal untuk gauge


  return (
    <div className="text-gray-800 dark:text-gray-200 p-6">
        {/* GRID: MAIN & PILOT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AmpereCardGroup title="Main" data={mainData} />
            <AmpereCardGroup title="Pilot" data={pilotData} />
        </div>

        {/* STATISTIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
             <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md p-6 w-full max-w-2xl ml-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-700 dark:text-gray-300 text-sm font-semibold uppercase tracking-wide">
                    Oil Pressure Overview
                    </h3>
                </div>

                {/* Gauges */}
                <div className="grid grid-cols-2 gap-6">
                    {/* MAIN */}
                    <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                    <div className="flex gap-2 items-center">
                        <Gauge className="w-6 h-6 text-emerald-600" />
                        <h1 className="text-xl">Main</h1>
                    </div>
                    <ReactApexChart
                        options={gaugeOptions("", "#22c55e")}
                        series={[(mainValue / maxPressure) * 100]}
                        type="radialBar"
                        height={230}
                    />
                    </div>

                    {/* PILOT */}
                    <div className="flex flex-col items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl">
                    <div className="flex gap-2 items-center">
                        <Gauge className="w-6 h-6 text-blue-600" />
                        <h1 className="text-xl">Pilot</h1>
                    </div>
                    <ReactApexChart
                        options={gaugeOptions("", "#3b82f6")}
                        series={[(pilotValue / maxPressure) * 100]}
                        type="radialBar"
                        height={230}
                    />
                    </div>
                </div>
            </div>

            {/* REVENUE CARD */}
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm w-[250px] border dark:border-slate-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Revenue
            </div>

            <div className="flex items-center justify-between mt-1 mb-2">
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                $84,952
                </div>
                <div className="flex items-center text-emerald-500 text-sm font-medium">
                <ArrowUpRight size={14} className="mr-1" /> +0.19%
                </div>
            </div>

            <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={60}
            />

            <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Direct visits</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                32.72%
                </span>
            </div>
            </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="my-6 text-center">
            <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition">
            Simpan Data
            </button>
            <h1 className="mt-3 text-gray-500 dark:text-gray-400 text-sm">
            Penyimpanan terakhir:{" "}
            <span id="last-saved-time">10/10/2023 10:00</span>
            </h1>
        </div>

        <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-lg p-4">
            <h2 className="text-gray-800 dark:text-gray-100 text-lg font-semibold mb-3 flex items-center gap-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
                </svg>
                History Penyimpanan Data
            </h2>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300 border-collapse">
                <thead className="bg-gray-100 dark:bg-slate-800/70 text-gray-700 dark:text-gray-200 uppercase text-xs tracking-wide">
                    <tr>
                    <th className="px-3 py-2 text-left">Waktu</th>
                    <th className="px-3 py-2 text-center">Main R</th>
                    <th className="px-3 py-2 text-center">Main S</th>
                    <th className="px-3 py-2 text-center">Main T</th>
                    <th className="px-3 py-2 text-center">Pilot R</th>
                    <th className="px-3 py-2 text-center">Pilot S</th>
                    <th className="px-3 py-2 text-center">Pilot T</th>
                    <th className="px-3 py-2 text-center">Main Oil Pressure</th>
                    <th className="px-3 py-2 text-center">Pilot Oil Pressure</th>
                    <th className="px-3 py-2 text-center">Oil Temp</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                    {
                        waktu: "10/10/2025 10:00:12",
                        mainR: 23.5,
                        mainS: 21.7,
                        mainT: 20.9,
                        pilotR: 22.8,
                        pilotS: 21.3,
                        pilotT: 19.8,
                        oilPress: 5.6,
                        oilPressP: 5.6,
                        oilTemp: 42.3,
                    },
                    {
                        waktu: "10/10/2025 09:58:09",
                        mainR: 23.1,
                        mainS: 21.6,
                        mainT: 21.0,
                        pilotR: 22.7,
                        pilotS: 21.1,
                        pilotT: 19.5,
                        oilPress: 5.5,
                        oilPressP: 5.5,
                        oilTemp: 41.9,
                    },
                    ].map((row, idx) => (
                    <tr
                        key={idx}
                        className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                        <td className="px-3 py-2">{row.waktu}</td>
                        <td className="text-center text-red-500 dark:text-red-400">{row.mainR}</td>
                        <td className="text-center text-yellow-500 dark:text-yellow-400">{row.mainS}</td>
                        <td className="text-center text-blue-500 dark:text-blue-400">{row.mainT}</td>
                        <td className="text-center text-red-500 dark:text-red-400">{row.pilotR}</td>
                        <td className="text-center text-yellow-500 dark:text-yellow-400">{row.pilotS}</td>
                        <td className="text-center text-blue-500 dark:text-blue-400">{row.pilotT}</td>
                        <td className="text-center text-emerald-500 dark:text-emerald-400">{row.oilPress}</td>
                        <td className="text-center text-emerald-500 dark:text-emerald-400">{row.oilPressP}</td>
                        <td className="text-center text-orange-500 dark:text-orange-400">{row.oilTemp}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

const AmpereCardGroup: React.FC<AmpereCardProps> = ({ title, data }) => {
  // Buat 3 series (R, S, T)
  const [series, setSeries] = useState([
    { name: "R", data: Array(10).fill(data[0].value) },
    { name: "S", data: Array(10).fill(data[1].value) },
    { name: "T", data: Array(10).fill(data[2].value) },
  ]);

  const colors = ["#ef4444", "#f59e0b", "#3b82f6"]; // R=merah, S=kuning, T=biru

  const lineChartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 800 },
      background: "transparent",
    },
    stroke: { curve: "smooth", width: 3 },
    grid: { borderColor: "#334155", strokeDashArray: 4 },
    colors,
    xaxis: {
      categories: Array.from({ length: 10 }, (_, i) => i + 1),
      labels: { style: { colors: "#9CA3AF" } },
    },
    yaxis: {
      labels: { style: { colors: "#9CA3AF" }, formatter: (val) => val + " A" },
    },
    tooltip: { theme: "dark" },
    legend: {
      position: "top",
      labels: { colors: "#9CA3AF" },
    },
  };

  // 🔁 Update data tiap 2 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prev) =>
        prev.map((s) => ({
          ...s,
          data: [
            ...s.data.slice(1),
            s.data[s.data.length - 1] + (Math.random() * 2 - 1),
          ],
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-4 bg-white dark:bg-slate-800  rounded-xl border border-slate-700 shadow-md w-full">
      <div className="absolute -top-3 left-4 bg-white dark:bg-slate-800  text-gray-700 dark:text-gray-300 px-2 text-sm font-medium border border-slate-100 dark:border-slate-700 rounded-md">
        {title}
      </div>

      <div className="text-center text-gray-600 dark:text-gray-400 font-semibold text-lg mb-3">
        Ampere
      </div>

      {/* Grafik 3 garis */}
      <div className="mt-2 mb-4 rounded-lg p-2">
        <ReactApexChart
          options={lineChartOptions}
          series={series}
          type="line"
          height={200}
        />
      </div>

      {/* Nilai terbaru */}
      <div className="grid grid-cols-3 gap-3">
        {data.map((item, i) => (
          <div
            key={item.label}
            className="bg-slate-100 dark:bg-slate-600/10 dark:hover:bg-slate-700 hover:bg-slate-700 transition-colors rounded-xl shadow-inner flex flex-col items-center justify-center py-4"
          >
            <div
              className="text-2xl font-semibold"
              style={{ color: colors[i] }}
            >
              {series[i].data.at(-1)?.toFixed(1)} A
            </div>
            <div className="text-gray-400 text-sm font-medium mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
