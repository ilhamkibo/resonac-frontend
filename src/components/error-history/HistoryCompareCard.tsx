
// "use client";

// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { ErrorHistoryCompare } from "@/types/errorHistoryType";
// import { ApexOptions } from "apexcharts";

// // Import ApexChart secara dynamic untuk menghindari error SSR Next.js
// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// export default function HistoryCompareCard(props: ErrorHistoryCompare) {
//   const [loading, setLoading] = useState(true);
//   const [series, setSeries] = useState<any[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);

//   useEffect(() => {
//     setSeries([
//       {
//         name: "This Week",
//         data: [props.weekly.thisWeek],
//       },
//       {
//         name: "Last Week",
//         data: [props.weekly.lastWeek],
//       },
//       // --- SERIES PENYEKAT (SPACER) ---
//       // Ini membuat jarak visual antara Week dan Month
//       {
//         name: "",
//         data: [0],
//       },
//       // --------------------------------
//       {
//         name: "Last Month",
//         data: [props.monthly.lastMonth],
//       },
//       {
//         name: "This Month",
//         data: [props.monthly.thisMonth],
//       },
//     ]);

//     setCategories(["Summary"]);
//     setLoading(false);
//   }, [props]);

//   // Konfigurasi Chart
//   const options: ApexOptions = {
//     chart: {
//       type: "bar" as const,
//       toolbar: { show: false },
//       stacked: false,
//     },
//     // Urutan Warna: [Biru, Hijau, TRANSPARAN (Spacer), Kuning, Merah]
//     colors: ['#008FFB', '#00E396', 'transparent', '#FEB019', '#FF4560'],
//     plotOptions: {
//       bar: {
//         borderRadius: 6,
//         columnWidth: "60%", // Lebar bar
//       },
//     },
//     dataLabels: {
//       enabled: true,
//       // Mencegah angka "0" muncul di area kosong (spacer)
//       formatter: function (val: number) {
//         return val === 0 ? "" : val;
//       },
//       style: {
//         fontSize: '12px',
//         colors: ["#304758"]
//       },
//       offsetY: -20, // Geser angka ke atas bar
//     },
//     legend: {
//       show: true,
//       showForSingleSeries: true,
//       showForNullSeries: false,
//       showForZeroSeries: false, // Sembunyikan legend untuk spacer
//       position: 'bottom'
//     },
//     grid: { show: false },
//     xaxis: {
//       categories: categories,
//       labels: { show: false }, // Sembunyikan label sumbu X
//       axisBorder: { show: false },
//       axisTicks: { show: false }
//     },
//     yaxis: {
//       min: 0,
//       show: true // Tampilkan sumbu Y angka
//     },
//     tooltip: {
//       y: {
//         title: {
//           // Formatter: Hanya tampilkan nama series (contoh: "Last Month:")
//           formatter: function (seriesName: string) {
//             return seriesName ? seriesName + ":" : "";
//           },
//         },
//       },
//       x: { show: false }, // Sembunyikan header tooltip "This Week"
//       marker: {
//         show: true,
//       },
//     },
//   };

//   const processParams = (rawParams: { parameter: string | null; count: number }[]) => {
//     const grouped: Record<string, number> = {};

//     rawParams.forEach((item) => {
//       // 2. SAFETY CHECK: Jika parameter null atau kosong, lewati loop ini
//       if (!item.parameter) return;

//       let key = item.parameter.toLowerCase();

//       // LOGIKA PENGGABUNGAN:
//       if (key.includes("ampere")) {
//         key = "Ampere Total";
//       } else if (key.includes("volt")) {
//         key = "Voltage Total";
//       } else {
//         key = key.charAt(0).toUpperCase() + key.slice(1);
//       }

//       // Akumulasi count
//       if (!grouped[key]) {
//         grouped[key] = 0;
//       }
//       grouped[key] += item.count;
//     });

//     return Object.entries(grouped)
//       .map(([key, value]) => ({ parameter: key, count: value }))
//       .sort((a, b) => b.count - a.count);
//   };

//   // Helper: Cari nilai error tertinggi untuk skala Progress Bar (Area)
//   const maxErrorCount = Math.max(...props.details.byArea.map((i) => i.count), 1);

//   return (
//     <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

//       <div className="bg-white shadow-lg col-span-1 xl:col-span-2 rounded-xl p-6 border border-gray-100">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">
//               Perbandingan Error
//             </h2>
//             <p className="text-sm text-gray-500 mt-1">
//               Analisis mingguan dan bulanan
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             {loading ? (
//               <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded-lg animate-pulse">
//                 <p className="text-gray-400 text-sm">Loading Chart...</p>
//               </div>
//             ) : (
//               <ReactApexChart
//                 options={options}
//                 series={series}
//                 type="bar"
//                 height={350}
//               />
//             )}
//           </div>

//           <div className="flex flex-col justify-center gap-4">

//             {/* Card Weekly */}
//             <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
//               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#008FFB] rounded-l-xl group-hover:w-2 transition-all"></div>
//               <div className="flex justify-between items-start mb-3">
//                 <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Weekly Error</span>
//                 <span className="text-[#008FFB] bg-blue-50 px-2 py-1 rounded text-[10px] font-extrabold tracking-wide">THIS WEEK</span>
//               </div>
//               <div className="flex items-end gap-2 mb-3">
//                 <h3 className="text-4xl font-bold text-gray-800 leading-none">{props.weekly.thisWeek}</h3>
//                 <span className="text-sm text-gray-400 font-medium mb-1">kasus</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border border-gray-100 shadow-sm w-max">
//                   {/* Logika warna indikator (Merah jika naik, Hijau jika turun) */}
//                 {props.weekly.thisWeek > props.weekly.lastWeek ? (
//                     <span className="text-red-500 bg-red-50 p-1 rounded-full">
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
//                     </span>
//                 ) : (
//                     <span className="text-green-500 bg-green-50 p-1 rounded-full">
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
//                     </span>
//                 )}
//                 <span className="font-bold text-gray-700">
//                   {props.weekly.lastWeek > 0
//                     ? Number((props.weekly.thisWeek / props.weekly.lastWeek) * 100).toFixed(1)
//                     : 0}%
//                 </span>
//                 <span className="text-gray-400 text-xs">vs minggu lalu</span>
//               </div>
//             </div>

//             {/* Card Monthly */}
//             <div className="p-5 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
//               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF4560] rounded-l-xl group-hover:w-2 transition-all"></div>
//               <div className="flex justify-between items-start mb-3">
//                 <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Monthly Error</span>
//                 <span className="text-[#FF4560] bg-red-50 px-2 py-1 rounded text-[10px] font-extrabold tracking-wide">THIS MONTH</span>
//               </div>
//               <div className="flex items-end gap-2 mb-3">
//                 <h3 className="text-4xl font-bold text-gray-800 leading-none">{props.monthly.thisMonth}</h3>
//                 <span className="text-sm text-gray-400 font-medium mb-1">kasus</span>
//               </div>
//               <div className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border border-gray-100 shadow-sm w-max">
//                 {props.monthly.thisMonth > props.monthly.lastMonth ? (
//                     <span className="text-red-500 bg-red-50 p-1 rounded-full">
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
//                     </span>
//                 ) : (
//                     <span className="text-green-500 bg-green-50 p-1 rounded-full">
//                       <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
//                     </span>
//                 )}
//                 <span className="font-bold text-gray-700">
//                   {props.monthly.lastMonth > 0
//                     ? Number((props.monthly.thisMonth / props.monthly.lastMonth) * 100).toFixed(1)
//                     : 0}%
//                 </span>
//                 <span className="text-gray-400 text-xs">vs bulan lalu</span>
//               </div>
//             </div>

//           </div>
//         </div>
//       </div>

//       <div className="bg-white shadow-lg col-span-1 rounded-xl p-6 border border-gray-100 h-full">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//             <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//               </svg>
//             </span>
//             Total Error per Area
//           </h3>
//           <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
//             {props.details.byAreaParameter.length} Locations
//           </span>
//         </div>

//         {props.details.byAreaParameter.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
//             <p className="text-gray-400 font-medium text-sm">No Data Available</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[370px] pr-2 custom-scrollbar">
//             {props.details.byAreaParameter.map((item, index) => {
//               // 1. Proses Parameter (Gabung Volt & Ampere)
//               const processedParams = processParams(item.parameters);

//               // 2. Hitung Persentase
//               const percentage = Math.round((item.total / maxErrorCount) * 100);

//               return (
//                 <div
//                   key={item.area || index}
//                   className="group p-4 border border-gray-100 rounded-xl bg-white hover:shadow-lg hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
//                 >
//                   <div>
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm">
//                           {item.area ? item.area.substring(0, 2).toUpperCase() : "??"}
//                         </div>
//                         <div>
//                           <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Area</p>
//                           <p className="font-bold text-gray-800 text-base capitalize line-clamp-1">
//                             {item.area}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                          <p className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
//                             {item.total}
//                          </p>
//                       </div>
//                     </div>

//                     <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-4">
//                       <div
//                         className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-600 transition-all duration-1000 ease-out"
//                         style={{ width: `${percentage}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   <div className="mt-2 pt-3 border-t border-dashed border-gray-200">
//                     <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
//                       Top Issues
//                     </p>

//                     <div className="space-y-2">
//                       {processedParams.slice(0, 3).map((param, idx) => (
//                         <div key={idx} className="flex items-center justify-between text-sm group/item">
//                           <div className="flex items-center gap-2 overflow-hidden">
//                             <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${idx === 0 ? 'bg-red-400' : idx === 1 ? 'bg-orange-400' : 'bg-gray-400'}`}></span>
//                             <span className="text-gray-600 truncate group-hover/item:text-gray-900 transition-colors">
//                               {param.parameter}
//                             </span>
//                           </div>
//                           <span className="ml-2 px-2 py-0.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-md border border-gray-100 group-hover/item:bg-indigo-50 group-hover/item:text-indigo-600 group-hover/item:border-indigo-100 transition-colors">
//                             {param.count}
//                           </span>
//                         </div>
//                       ))}

//                       {processedParams.length > 3 && (
//                         <p className="text-xs text-center text-gray-400 italic mt-1">
//                           + {processedParams.length - 3} others
//                         </p>
//                       )}

//                       {processedParams.length === 0 && (
//                         <p className="text-xs text-gray-400 italic">No detail parameters</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ErrorHistoryCompare } from "@/types/errorHistoryType";
import { ApexOptions } from "apexcharts";

// Import ApexChart secara dynamic untuk menghindari error SSR Next.js
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function HistoryCompareCard(props: ErrorHistoryCompare) {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    setSeries([
      {
        name: "This Week",
        data: [props.weekly.thisWeek],
      },
      {
        name: "Last Week",
        data: [props.weekly.lastWeek],
      },
      // --- SERIES PENYEKAT (SPACER) ---
      // Ini membuat jarak visual antara Week dan Month
      {
        name: "",
        data: [0],
      },
      // --------------------------------
      {
        name: "Last Month",
        data: [props.monthly.lastMonth],
      },
      {
        name: "This Month",
        data: [props.monthly.thisMonth],
      },
    ]);

    setCategories(["Summary"]);
    setLoading(false);
  }, [props]);

  // Konfigurasi Chart
  const options: ApexOptions = {
    chart: {
      type: "bar" as const,
      toolbar: { show: false },
      stacked: false,
    },
    // Urutan Warna: [Biru, Hijau, TRANSPARAN (Spacer), Kuning, Merah]
    colors: ['#008FFB', '#00E396', 'transparent', '#FEB019', '#FF4560'],
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "60%", // Lebar bar
      },
    },
    dataLabels: {
      enabled: true,
      // Mencegah angka "0" muncul di area kosong (spacer)
      formatter: function (val: number) {
        return val === 0 ? "" : val;
      },
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      },
      offsetY: -20, // Geser angka ke atas bar
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      showForNullSeries: false,
      showForZeroSeries: false, // Sembunyikan legend untuk spacer
      position: 'bottom'
    },
    grid: { show: false },
    xaxis: {
      categories: categories,
      labels: { show: false }, // Sembunyikan label sumbu X
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      min: 0,
      show: true // Tampilkan sumbu Y angka
    },
    tooltip: {
      y: {
        title: {
          // Formatter: Hanya tampilkan nama series (contoh: "Last Month:")
          formatter: function (seriesName: string) {
            return seriesName ? seriesName + ":" : "";
          },
        },
      },
      x: { show: false }, // Sembunyikan header tooltip "This Week"
      marker: {
        show: true,
      },
    },
  };

  // Helper: Cari nilai error tertinggi untuk skala Progress Bar (Area)
  const maxErrorCount = Math.max(...props.details.byArea.map((i) => i.count), 1);

  return (
    <div>
        {/* <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100"> */}
        <div>

          {/* Wrapper Utama: Mobile = Kolom (turun), Desktop = Baris (samping) */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ========================================== */}
            {/* BAGIAN KIRI: SUMMARY STATS (Weekly/Monthly) */}
            {/* ========================================== */}
            {/* flex-1: Mengambil 1 bagian ruang */}
            <div className="flex-1 bg-white dark:bg-gray-800 h-fit shadow-lg rounded-xl p-2 border border-gray-100">
              <h3 className="text-gray-800 dark:text-white font-bold text-lg mb-3">Ringkasan Error</h3>
              <div className="flex md:flex-row flex-col gap-4 min-w-[280px]">

                {/* Card Weekly */}
                <div className="p-5 flex-1 rounded-xl border border-gray-100 dark:border-gray-700 dark:bg-gray-800 bg-gray-50/50 hover:bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#008FFB] rounded-l-xl group-hover:w-2 transition-all"></div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Weekly Error</span>
                    <span className="text-[#008FFB] bg-blue-50 px-2 py-1 rounded text-[10px] font-extrabold tracking-wide">THIS WEEK</span>
                  </div>
                  <div className="flex items-end gap-2 mb-3">
                    <h3 className="text-4xl font-bold text-gray-800 leading-none dark:text-white">{props.weekly.thisWeek}</h3>
                    <span className="text-sm text-gray-400 font-medium mb-1">kasus</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border border-gray-100 shadow-sm w-max">
                      {/* Logika warna indikator (Merah jika naik, Hijau jika turun) */}
                    {props.weekly.thisWeek > props.weekly.lastWeek ? (
                        <span className="text-red-500 bg-red-50 p-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </span>
                    ) : (
                        <span className="text-green-500 bg-green-50 p-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </span>
                    )}
                    <span className="font-bold text-gray-700">
                      {props.weekly.lastWeek > 0
                        ? Number((props.weekly.thisWeek / props.weekly.lastWeek) * 100).toFixed(1)
                        : 0}%
                    </span>
                    <span className="text-gray-400 text-xs">vs minggu lalu</span>
                  </div>
                </div>

                {/* Card Monthly */}
                <div className="p-5 flex-1 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-800 hover:bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF4560] rounded-l-xl group-hover:w-2 transition-all"></div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Monthly Error</span>
                    <span className="text-[#FF4560] bg-red-50 px-2 py-1 rounded text-[10px] font-extrabold tracking-wide">THIS MONTH</span>
                  </div>
                  <div className="flex items-end gap-2 mb-3">
                    <h3 className="text-4xl font-bold text-gray-800 leading-none dark:text-white">{props.monthly.thisMonth}</h3>
                    <span className="text-sm text-gray-400 font-medium mb-1">kasus</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm bg-white p-2 rounded-lg border border-gray-100 shadow-sm w-max">
                    {props.monthly.thisMonth > props.monthly.lastMonth ? (
                        <span className="text-red-500 bg-red-50 p-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </span>
                    ) : (
                        <span className="text-green-500 bg-green-50 p-1 rounded-full">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                        </span>
                    )}
                    <span className="font-bold text-gray-700">
                      {props.monthly.lastMonth > 0
                        ? Number((props.monthly.thisMonth / props.monthly.lastMonth) * 100).toFixed(1)
                        : 0}%
                    </span>
                    <span className="text-gray-400 text-xs">vs bulan lalu</span>
                  </div>
                </div>
              </div>
            </div>


            {/* ========================================== */}
            {/* PEMBATAS RESPONSIF (Divider)               */}
            {/* ========================================== */}
            {/* Desktop: Vertikal Gradient */}
            <div className="hidden lg:block w-[1px] bg-gradient-to-b from-transparent via-gray-200 to-transparent mx-2"></div>
            {/* Mobile: Horizontal Line */}
            <div className="block lg:hidden h-[1px] w-full bg-gray-100 my-2"></div>

            <div className="flex-[2] bg-white dark:bg-gray-800 h-fit shadow-lg rounded-xl p-2 border border-gray-100 flex flex-col min-w-0"> {/* min-w-0 mencegah flex child overflow */}

              {/* Header Kanan */}
              <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-gray-800 font-bold text-lg">Detail per Area</h3>
                  <span className="text-[10px] uppercase font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md border border-indigo-100">
                    {props.details.byAreaParameter.length} Locations
                  </span>
              </div>

              {props.details.byAreaParameter.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <div className="bg-gray-100 p-3 rounded-full mb-3">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  </div>
                  <p className="text-gray-500 font-medium text-sm">Tidak ada data area</p>
                </div>
              ) : (
                // --- GRID LAYOUT (Responsif: 1 kolom di HP, 2 kolom di Tablet/PC) ---
                <div className="flex flex-col sm:flex-row gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar pb-2">
                  {props.details.byAreaParameter.map((item, index) => {
                    // Hitung persentase width bar
                    const percentage = Math.round((item.total / maxErrorCount) * 100);

                    // Cari parameter penyebab error terbesar (Top Issue)
                    // Asumsi item.parameters sudah ada (bisa kosong)
                    const topIssue = item.parameters && item.parameters.length > 0
                      ? item.parameters.reduce((prev, current) => (prev.count > current.count) ? prev : current)
                      : null;

                    return (
                      <div
                        key={item.area || index}
                        className="group flex-1 p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:shadow-lg hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between relative"
                      >
                        {/* Header Card */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {/* Avatar Inisial */}
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-indigo-100">
                              {item.area ? item.area.substring(0, 2).toUpperCase() : "??"}
                            </div>
                            <div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-tight">Area Name</p>
                              <p className="font-bold text-gray-800 text-base capitalize line-clamp-1">
                                {item.area}
                              </p>
                            </div>
                          </div>

                          {/* Angka Total */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                {item.total}
                            </p>
                          </div>
                        </div>

                        {/* Bagian Bawah: Progress Bar & Top Issue */}
                        <div>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-xs text-gray-400 font-medium">Error Load</span>
                                <span className="text-xs font-bold text-gray-600">{percentage}%</span>
                            </div>

                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                              <div
                                className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>

                            {/* Top Issue Badge (Info tambahan biar makin ciamik) */}
                            {topIssue && (
                                <div className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100 w-full">
                                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
                                    <p className="text-xs text-gray-500 truncate">
                                        Main issue: <span className="font-semibold text-gray-700">{topIssue.parameter}</span> ({topIssue.count})
                                    </p>
                                </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr>
                <th>Area</th>
                <th>Error Count</th>
              </tr>
            </thead>
            <tbody>
              {props.details.byAreaParameter.map((item, index) => (
                <tr key={index}>
                  <td className="text-center">{item.area}</td>
                  <td className="text-center">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}

 {/* <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <div className="bg-white shadow-lg col-span-1 xl:col-span-2 rounded-xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Perbandingan Error
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Analisis mingguan dan bulanan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 min-h-[350px]">
            {loading ? (
              <div className="flex items-center justify-center h-full w-full bg-gray-50 rounded-lg animate-pulse">
                <p className="text-gray-400 text-sm">Loading Chart...</p>
              </div>
            ) : (
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={350}
              />
            )}
          </div>

          <div className="flex flex-col justify-center gap-4">

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#008FFB] rounded-l-xl"></div>
              <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Weekly Error</span>
                  <span className="text-[#008FFB] bg-blue-50 px-2 py-1 rounded text-xs font-bold">
                      THIS WEEK
                  </span>
              </div>
              <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-800">{props.weekly.thisWeek}</h3>
                  <span className="text-sm text-gray-400">kasus</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-600">
                      {props.weekly.lastWeek > 0
                        ? Number((props.weekly.thisWeek / props.weekly.lastWeek) * 100).toFixed(1)
                        : 0}%
                  </span>
                  <span className="text-gray-400 text-xs">dari minggu lalu</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF4560] rounded-l-xl"></div>
              <div className="flex justify-between items-start mb-2">
                  <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Monthly Error</span>
                  <span className="text-[#FF4560] bg-red-50 px-2 py-1 rounded text-xs font-bold">
                      THIS MONTH
                  </span>
              </div>
              <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-800">{props.monthly.thisMonth}</h3>
                  <span className="text-sm text-gray-400">kasus</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-600">
                      {props.monthly.lastMonth > 0
                        ? Number((props.monthly.thisMonth / props.monthly.lastMonth) * 100).toFixed(1)
                        : 0}%
                  </span>
                  <span className="text-gray-400 text-xs">dari bulan lalu</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg col-span-1 rounded-xl p-6 border border-gray-100 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
            Total Error per Area
          </h3>
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
            {props.details.byArea.length} Locations
          </span>
        </div>
        {props.details.byArea.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
            <p className="text-gray-400 font-medium text-sm">No Data Available</p>
          </div>
        ) : (
          // --- DATA GRID ---
          <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {props.details.byAreaParameter.map((item, index) => {
              // Hitung persentase width bar
              const percentage = Math.round((item.total / maxErrorCount) * 100);

              return (
                <div
                  key={item.area || index}
                  className="group p-4 border border-gray-100 rounded-xl bg-white hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        {item.area ? item.area.substring(0, 2).toUpperCase() : "??"}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium leading-tight">Area</p>
                        <p className="font-bold text-gray-800 text-base capitalize line-clamp-1">
                          {item.area}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                       <p className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                          {item.total}
                       </p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-600 transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div> */}