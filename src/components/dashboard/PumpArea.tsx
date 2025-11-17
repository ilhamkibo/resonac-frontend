// "use client";
// import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { ApexOptions } from "apexcharts";
// import ValueCard from "../utils/ValueCard";
// import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
// import { RealtimeData } from "@/types/mqttType";
// import { useQuery } from "@tanstack/react-query";
// import { measurementService } from "@/services/measurementService";
// import { thresholdService } from "@/services/thresholdService";

// const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// type PumpAreaProps = {
//   type: "main" | "pilot";
//   initialMeasurements: any;
//   initialThresholds: any;
// };

// const MAX_POINTS = 50;

// export default function PumpArea({ type, initialMeasurements, initialThresholds }: PumpAreaProps) {
//   const { data: measurementData, isLoading: isLoadingMeasurement } = useQuery({
//     queryKey: [`measurements-${type}`],
//     queryFn: () => measurementService.getMeasurementsDashboardData(type),
//     initialData: initialMeasurements,
//   });

//   const { data: thresholdData, isLoading: isLoadingThreshold } = useQuery({
//     queryKey: [`thresholds-${type}`],
//     queryFn: () => thresholdService.getAllThreshold(type),
//     initialData: initialThresholds,
//   });

//   const dataMqtt = useMqttSubscription<{ realtime: RealtimeData }>("toho/resonac/value");
//   const pumpData = dataMqtt?.realtime?.[type];

//   // STATE untuk Ampere dan Pressure
//   const [series, setSeries] = useState<any[]>([]);
//   const [seriesPressure, setSeriesPressure] = useState<any[]>([]);
//   const [categories, setCategories] = useState<string[]>([]);
//   const [categoriesPressure, setCategoriesPressure] = useState<string[]>([]);

//   // ✅ Inisialisasi dari database
//   useEffect(() => {
//     if (measurementData?.data?.length) {
//       const ampereR = measurementData.data.map((d: any) => d.ampere_rs || d.ampere_r || 0).reverse();
//       const ampereS = measurementData.data.map((d: any) => d.ampere_st || d.ampere_s || 0).reverse();
//       const ampereT = measurementData.data.map((d: any) => d.ampere_tr || d.ampere_t || 0).reverse();
//       const pressure = measurementData.data.map((d: any) => d.oil_pressure || 0).reverse();
//       const times = measurementData.data.map((d: any) =>
//         new Date(d.timestamp).toLocaleTimeString("id-ID", { hour12: false })
//       ).reverse();

//       setSeries([
//         { name: "R", data: ampereR.slice(-MAX_POINTS) },
//         { name: "S", data: ampereS.slice(-MAX_POINTS) },
//         { name: "T", data: ampereT.slice(-MAX_POINTS) },
//       ]);
//       setCategories(times.slice(-MAX_POINTS));

//       // ✅ Inisialisasi chart tekanan (Oil Pressure)
//       setSeriesPressure([{ name: "Oil Pressure", data: pressure.slice(-MAX_POINTS) }]);
//       setCategoriesPressure(times.slice(-MAX_POINTS));
//     }
//   }, [measurementData]);

//   // ✅ Update realtime MQTT - AMPERE
//   useEffect(() => {
//     if (!pumpData?.ampere_r && !pumpData?.ampere_s && !pumpData?.ampere_t) return;
//     const now = new Date().toLocaleTimeString("id-ID", { hour12: false });

//     setSeries((prev) => {
//       if (prev.length === 0) return prev;
//       const updated = [
//         { ...prev[0], data: [...prev[0].data, pumpData.ampere_r].slice(-MAX_POINTS) },
//         { ...prev[1], data: [...prev[1].data, pumpData.ampere_s].slice(-MAX_POINTS) },
//         { ...prev[2], data: [...prev[2].data, pumpData.ampere_t].slice(-MAX_POINTS) },
//       ];
//       return updated;
//     });

//     setCategories((prev) => [...prev, now].slice(-MAX_POINTS));
//   }, [pumpData]);

//   // ✅ Update realtime MQTT - PRESSURE
//   useEffect(() => {
//     if (pumpData?.oil_pressure == null) return;
//     const now = new Date().toLocaleTimeString("id-ID", { hour12: false });

//     setSeriesPressure((prev) => {
//       if (prev.length === 0) return [{ name: "Oil Pressure", data: [pumpData.oil_pressure] }];
//       const updated = [
//         { ...prev[0], data: [...prev[0].data, pumpData.oil_pressure].slice(-MAX_POINTS) },
//       ];
//       return updated;
//     });

//     setCategoriesPressure((prev) => [...prev, now].slice(-MAX_POINTS));
//   }, [pumpData]);

//   // Threshold dari database
//   const thresholdAmp = thresholdData?.find((t: any) => t.parameter === "ampere");
//   const upper = thresholdAmp?.upperLimit ?? 120;

//   const thresholdPressure = thresholdData?.find((t: any) => t.parameter === "pressure");
//   const upperPressure = thresholdPressure?.upperLimit ?? 120;
//   const lowerPressure = thresholdPressure?.lowerLimit ?? 0;

//   // ===================== ⚡ OPTIONS AMPERE =====================
//   const options: ApexOptions = {
//     chart: { type: "line", height: 200, toolbar: { show: false }, zoom: { enabled: false } },
//     stroke: { width: 2, curve: "smooth" },
//     colors: ["#ef4444", "#facc15", "#6b7280"],
//     tooltip: { enabled: false },
//     xaxis: {
//       categories,
//       labels: {
//         rotate: 0,
//         style: { colors: "#9ca3af" },
//         formatter: (value: string) => {
//           if (!value) return "";
//           const parts = value.split(".");
//           if (parts.length !== 3) return "";
//           const [hour, minute, second] = parts.map(Number);
//           const date = new Date();
//           date.setHours(hour, minute, second, 0);
//           const seconds = date.getSeconds();
//           return seconds % 5 === 0
//             ? date.toLocaleTimeString("id-ID", { hour12: false })
//             : "";
//         },
//       },
//     },
//     yaxis: { labels: { formatter: (val) => `${val.toFixed(0)} A` } },
//     annotations: {
//       yaxis: [
//         {
//           y: upper,
//           borderColor: "#ef4444",
//           label: {
//             borderColor: "#ef4444",
//             style: { color: "#fff", background: "#ef4444" },
//             text: `Max ${upper}`,
//           },
//         },
//       ],
//     },
//   };

//   // ===================== 💧 OPTIONS PRESSURE =====================
//   const options2: ApexOptions = {
//       chart: {
//         type: "line",
//         height: 200,
//         background: "transparent",
//         toolbar: { show: false },
//         zoom: { enabled: false },
//         animations: { enabled: true, speed: 600 },
//       },
//       stroke: {
//         curve: "smooth",
//         width: 3,
//         colors: ["#427A76"], // kuning lembut
//       },
//       markers: {
//         size: 0,
//         colors: ["#427A76"],
//         strokeWidth: 2,
//         strokeColors: "#1e293b",
//         hover: { size: 6 },
//       },
//       fill: {
//         type: "solid",
//         opacity: 0, // tanpa area warna
//       },

//       // 🔹 tambahkan ini untuk hilangkan angka di atas titik
//       dataLabels: {
//         enabled: false,
//       },
//       grid: {
//         borderColor: "#334155",
//         strokeDashArray: 4,
//         xaxis: { lines: { show: false } },
//         yaxis: { lines: { show: true } },
//       },
//       xaxis: {
//         categories: categoriesPressure,
//         labels: {
//           rotate: 0,
//           style: { colors: "#9ca3af" },
//           formatter: (value: string) => {
//             if (!value) return "";
//             const parts = value.split(".");
//             if (parts.length !== 3) return "";
//             const [hour, minute, second] = parts.map(Number);
//             const date = new Date();
//             date.setHours(hour, minute, second, 0);
//             const seconds = date.getSeconds();
//             return seconds % 5 === 0
//               ? date.toLocaleTimeString("id-ID", { hour12: false })
//               : "";
//           },
//         },
//         axisTicks: { show: false },
//         axisBorder: { color: "#475569" },
//       },
//       yaxis: {
//         min: lowerPressure - 5,
//         max: upperPressure + 5,
//         labels: { style: { colors: "#94a3b8" } },
//       },
//       tooltip: {
//         enabled: false,
//         theme: "dark",
//         x: { format: "HH:mm:ss" },
//         y: { formatter: (v) => `${v.toFixed(2)} Bar` },
//       },
//       annotations: {
//         yaxis: [
//           {
//             y: upperPressure,
//             borderColor: "#ef4444",
//             label: {
//               borderColor: "#ef4444",
//               style: {
//                 color: "#ffffff !important",  // 🧊 pastikan pakai !important
//                 background: "#ef4444",
//                 fontWeight: "bold",
//                 fontSize: "12px",
//               },
//               text: `Max (${upperPressure})`,
//             },
//           },
//           {
//             y: lowerPressure,
//             borderColor: "#3b82f6",
//             label: {
//               borderColor: "#3b82f6",
//                style: {
//                 color: "#ffffff !important",  // 🧊 teks putih kuat
//                 background: "#3b82f6",
//                 fontWeight: "bold",
//                 fontSize: "12px",
//               },
//               text: `Min (${lowerPressure})`,
//             },
//           },
//         ],
//       },
//     };
  


//   // ===================== RENDER =====================
//   if (isLoadingMeasurement || isLoadingThreshold) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-400px)]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {/* Bagian Voltage, PF, KWh */}
//       <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-3 flex flex-col rounded-xl items-stretch justify-between space-y-6">
//           <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
//             <ValueCard label="Voltage R-S" size="2xl" unit="V" value={pumpData?.volt_r} color="text-red-500" />
//             <ValueCard label="Voltage S-T" size="2xl" unit="V" value={pumpData?.volt_s} color="text-yellow-500" />
//             <ValueCard label="Voltage T-R" size="2xl" unit="V" value={pumpData?.volt_t} color="text-gray-500" />
//             <ValueCard label="PF" size="2xl" value={pumpData?.pf} color="text-green-500" />
//             <ValueCard label="KWh (Total)" size="2xl" unit="KWh" value={pumpData?.kwh} style="col-span-2" color="text-blue-500" />
//           </div>
//         </div>
//       </div>

//       {/* Bagian Ampere */}
//       <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
//         <div className="bg-slate-50 dark:bg-slate-800 p-3 col-span-4 rounded-lg">
//           <div className="flex justify-between items-center mb-2">
//             <div className="text-sm font-medium dark:text-gray-200">Ampere R-S-T</div>
//           </div>
//           <ReactApexChart options={options} series={series} type="line" height={200} />
//         </div>
//         <div className="flex flex-col gap-2">
//           <ValueCard color="text-red-500" label="Ampere R" unit="A" value={pumpData?.ampere_r} />
//           <ValueCard color="text-yellow-500" label="Ampere S" unit="A" value={pumpData?.ampere_s} />
//           <ValueCard color="text-gray-500" label="Ampere T" unit="A" value={pumpData?.ampere_t} />
//         </div>
//       </div>

//       {/* Bagian Oil Pressure */}
//       <div className="mt-2 grid grid-cols-1 lg:grid-cols-5 gap-4">
//         <div className="bg-slate-50 px-3 rounded-lg lg:col-span-4 dark:bg-slate-800">
//           <div className="text-center">
//             <h1 className="text-lg font-semibold dark:text-gray-100 text-gray-800">Oil Pressure</h1>
//           </div>
//           <ReactApexChart options={options2} series={seriesPressure} type="area" height={200} />
//           {/* <AreaChart title="Oil Pressure" unit="Bar" /> */}
//         </div>
//         <div className="flex w-full items-center justify-center">
//           <ValueCard value={pumpData?.oil_pressure} size="4xl" unit="Bar" fixed={0} />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useMemo, useState } from "react"; // ✅ Import useMemo
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ValueCard from "../utils/ValueCard";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { RealtimeData } from "@/types/mqttType";
import { useQuery } from "@tanstack/react-query";
import { measurementService } from "@/services/measurementService";
import { thresholdService } from "@/services/thresholdService";
import { ThresholdResponse } from "@/types/thresholdType";
import { MeasurementData } from "@/types/measurementType";
import { ApiResponseWrapper } from "@/types/apiType";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type PumpAreaProps = {
  type: "main" | "pilot";
  initialMeasurements: ApiResponseWrapper<MeasurementData[]>;
  initialThresholds: ThresholdResponse;
};

const MAX_POINTS = 50;

// ✅ Tipe spesifik untuk data series ApexCharts
type ApexSeriesData = {
  name: string;
  data: number[];
};

// ✅ Tipe data untuk state chart yang digabungkan
type ChartData = {
  series: ApexSeriesData[]; // <-- Diubah dari any[]
  categories: string[];
};

export default function PumpArea({ type, initialMeasurements, initialThresholds }: PumpAreaProps) {
  const { data: measurementData, isLoading: isLoadingMeasurement } = useQuery({
    queryKey: [`measurements-${type}`],
    queryFn: () => measurementService.getMeasurementsDashboardData(type),
    initialData: initialMeasurements,
  });

  const { data: thresholdData, isLoading: isLoadingThreshold } = useQuery({
    queryKey: [`thresholds-${type}`],
    queryFn: () => thresholdService.getAllThreshold(type),
    initialData: initialThresholds,
  });

  const dataMqtt = useMqttSubscription<{ realtime: RealtimeData }>("toho/resonac/value");
  const pumpData = dataMqtt?.realtime?.[type];

  // ✅ STATE yang digabungkan
  const [ampereChartData, setAmpereChartData] = useState<ChartData>({ series: [], categories: [] });
  const [pressureChartData, setPressureChartData] = useState<ChartData>({ series: [], categories: [] });

  // ✅ Inisialisasi dari database (dibuat lebih efisien)
  useEffect(() => {
    // Hanya jalankan jika measurementData ada DAN state chart masih kosong
    if (measurementData?.data?.length && ampereChartData.categories.length === 0) {
      const initial = {
        ampereR: [] as number[],
        ampereS: [] as number[],
        ampereT: [] as number[],
        pressure: [] as number[],
        times: [] as string[],
      };

      // Balik data sekali dan loop sekali saja
      const reversedData = [...measurementData.data].reverse();

      for (const d of reversedData) {
        initial.ampereR.push(d.ampere_rs || d.ampere_r || 0);
        initial.ampereS.push(d.ampere_st || d.ampere_s || 0);
        initial.ampereT.push(d.ampere_tr || d.ampere_t || 0);
        initial.pressure.push(d.oil_pressure || 0);
        initial.times.push(new Date(d.timestamp).toLocaleTimeString("id-ID", { hour12: false }));
      }

      setAmpereChartData({
        series: [
          { name: "R", data: initial.ampereR.slice(-MAX_POINTS) },
          { name: "S", data: initial.ampereS.slice(-MAX_POINTS) },
          { name: "T", data: initial.ampereT.slice(-MAX_POINTS) },
        ],
        categories: initial.times.slice(-MAX_POINTS),
      });

      setPressureChartData({
        series: [{ name: "Oil Pressure", data: initial.pressure.slice(-MAX_POINTS) }],
        categories: initial.times.slice(-MAX_POINTS),
      });
    }
  }, [measurementData, ampereChartData.categories.length]); // ✅ Dependensi

  // ✅ Update realtime MQTT - DIKONSOLIDASI
  useEffect(() => {
    if (!pumpData) return;

    const now = new Date().toLocaleTimeString("id-ID", { hour12: false });
    const hasAmpereData = pumpData.ampere_r != null || pumpData.ampere_s != null || pumpData.ampere_t != null;
    const hasPressureData = pumpData.oil_pressure != null;

    // Update Ampere
    if (hasAmpereData) {
      setAmpereChartData((prev) => {
        // Jangan update jika seri belum terinisialisasi
        if (prev.series.length === 0) return prev;
        return {
          series: [
            { ...prev.series[0], data: [...prev.series[0].data, pumpData.ampere_r ?? 0].slice(-MAX_POINTS) },
            { ...prev.series[1], data: [...prev.series[1].data, pumpData.ampere_s ?? 0].slice(-MAX_POINTS) },
            { ...prev.series[2], data: [...prev.series[2].data, pumpData.ampere_t ?? 0].slice(-MAX_POINTS) },
          ],
          categories: [...prev.categories, now].slice(-MAX_POINTS),
        };
      });
    }

    // Update Pressure
    if (hasPressureData) {
      setPressureChartData((prev) => {
        // Jika belum terinisialisasi, buat baru
        if (prev.series.length === 0) {
          return {
            series: [{ name: "Oil Pressure", data: [pumpData.oil_pressure] }],
            categories: [now],
          };
        }
        // Jika sudah ada, tambahkan
        return {
          series: [
            { ...prev.series[0], data: [...prev.series[0].data, pumpData.oil_pressure].slice(-MAX_POINTS) },
          ],
          categories: [...prev.categories, now].slice(-MAX_POINTS),
        };
      });
    }
  }, [pumpData]); // ✅ Hanya bergantung pada pumpData

  // ✅ Threshold di-memoize agar tidak dihitung ulang setiap render
  const upper = useMemo(() => {
    const thresholdAmp = thresholdData?.find((t: any) => t.parameter === "ampere");
    return thresholdAmp?.upperLimit ?? 120;
  }, [thresholdData]);

  const { upperPressure, lowerPressure } = useMemo(() => {
    const thresholdPressure = thresholdData?.find((t: any) => t.parameter === "pressure");
    return {
      upperPressure: thresholdPressure?.upperLimit ?? 120,
      lowerPressure: thresholdPressure?.lowerLimit ?? 0,
    };
  }, [thresholdData]);

  // ===================== ⚡ OPTIONS AMPERE (Memoized) =====================
  const options: ApexOptions = useMemo(() => ({
    chart: { type: "line", height: 200, toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { width: 2, curve: "smooth" },
    colors: ["#ef4444", "#facc15", "#6b7280"],
    tooltip: { enabled: false },
    xaxis: {
      categories: ampereChartData.categories, // ✅ Gunakan state baru
      labels: {
        rotate: 0,
        style: { colors: "#9ca3af" },
        formatter: (value: string) => {
          if (!value) return "";
          const parts = value.split(".");
          if (parts.length !== 3) return "";
          const [hour, minute, second] = parts.map(Number);
          const date = new Date();
          date.setHours(hour, minute, second, 0);
          const seconds = date.getSeconds();
          return seconds % 5 === 0
            ? date.toLocaleTimeString("id-ID", { hour12: false })
            : "";
        },
      },
    },
    yaxis: { labels: { formatter: (val) => `${val.toFixed(0)} A` } },
    annotations: {
      yaxis: [
        {
          y: upper, // ✅ Gunakan nilai memoized
          borderColor: "#ef4444",
          label: {
            borderColor: "#ef4444",
            style: { color: "#fff", background: "#ef4444" },
            text: `Max ${upper}`,
          },
        },
      ],
    },
  }), [ampereChartData.categories, upper]); // ✅ Dependensi memo

  // ===================== 💧 OPTIONS PRESSURE (Memoized) =====================
  const options2: ApexOptions = useMemo(() => ({
    chart: {
      type: "line",
      height: 200,
      background: "transparent",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 600 },
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#427A76"], // kuning lembut
    },
    markers: {
      size: 0,
      colors: ["#427A76"],
      strokeWidth: 2,
      strokeColors: "#1e293b",
      hover: { size: 6 },
    },
    fill: {
      type: "solid",
      opacity: 0, // tanpa area warna
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#334155",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: pressureChartData.categories, // ✅ Gunakan state baru
      labels: {
        rotate: 0,
        style: { colors: "#9ca3af" },
        formatter: (value: string) => {
          if (!value) return "";
          const parts = value.split(".");
          if (parts.length !== 3) return "";
          const [hour, minute, second] = parts.map(Number);
          const date = new Date();
          date.setHours(hour, minute, second, 0);
          const seconds = date.getSeconds();
          return seconds % 5 === 0
            ? date.toLocaleTimeString("id-ID", { hour12: false })
            : "";
        },
      },
      axisTicks: { show: false },
      axisBorder: { color: "#475569" },
    },
    yaxis: {
      min: lowerPressure - 5, // ✅ Gunakan nilai memoized
      max: upperPressure + 5, // ✅ Gunakan nilai memoized
      labels: { style: { colors: "#94a3b8" } },
    },
    tooltip: {
      enabled: false,
      theme: "dark",
      x: { format: "HH:mm:ss" },
      y: { formatter: (v) => `${v.toFixed(2)} Bar` },
    },
    annotations: {
      yaxis: [
        {
          y: upperPressure, // ✅ Gunakan nilai memoized
          borderColor: "#ef4444",
          label: {
            borderColor: "#ef4444",
            style: {
              color: "#ffffff !important",
              background: "#ef4444",
              fontWeight: "bold",
              fontSize: "12px",
            },
            text: `Max (${upperPressure})`,
          },
        },
        {
          y: lowerPressure, // ✅ Gunakan nilai memoized
          borderColor: "#3b82f6",
          label: {
            borderColor: "#3b82f6",
            style: {
              color: "#ffffff !important",
              background: "#3b82f6",
              fontWeight: "bold",
            },
            text: `Min (${lowerPressure})`,
          },
        },
      ],
    },
  }), [pressureChartData.categories, lowerPressure, upperPressure]); // ✅ Dependensi memo

  // ===================== RENDER =====================
  if (isLoadingMeasurement || isLoadingThreshold) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-400px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Bagian Voltage, PF, KWh */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 flex flex-col rounded-xl items-stretch justify-between space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
            <ValueCard label="Voltage R-S" size="2xl" unit="V" value={pumpData?.volt_r} color="text-red-500" />
            <ValueCard label="Voltage S-T" size="2xl" unit="V" value={pumpData?.volt_s} color="text-yellow-500" />
            <ValueCard label="Voltage T-R" size="2xl" unit="V" value={pumpData?.volt_t} color="text-gray-500" />
            <ValueCard label="PF" size="2xl" value={pumpData?.pf} color="text-green-500" />
            <ValueCard label="KWh (Total)" size="2xl" unit="KWh" value={pumpData?.kwh} style="col-span-2" color="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Bagian Ampere */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 col-span-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium dark:text-gray-200">Ampere R-S-T</div>
          </div>
          {/* ✅ Gunakan state baru */}
          <ReactApexChart options={options} series={ampereChartData.series} type="line" height={200} />
        </div>
        <div className="flex flex-col gap-2">
          <ValueCard color="text-red-500" label="Ampere R" unit="A" value={pumpData?.ampere_r} />
          <ValueCard color="text-yellow-500" label="Ampere S" unit="A" value={pumpData?.ampere_s} />
          <ValueCard color="text-gray-500" label="Ampere T" unit="A" value={pumpData?.ampere_t} />
        </div>
      </div>

      {/* Bagian Oil Pressure */}
      <div className="mt-2 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="bg-slate-50 px-3 rounded-lg lg:col-span-4 dark:bg-slate-800">
          <div className="text-center">
            <h1 className="text-lg font-semibold dark:text-gray-100 text-gray-800">Oil Pressure</h1>
          </div>
          {/* ✅ Gunakan state baru */}
          <ReactApexChart options={options2} series={pressureChartData.series} type="area" height={200} />
        </div>
        <div className="flex w-full items-center justify-center">
          <ValueCard value={pumpData?.oil_pressure} size="4xl" unit="Bar" fixed={0} />
        </div>
      </div>
    </div>
  );
}