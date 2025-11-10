// "use client";
// import React, { useEffect, useState } from "react";
// import LineChart from "./LineChart";
// import AreaChart from "./AreaChart";
// import ValueCard from "../utils/ValueCard";
// import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
// import { RealtimeData } from "@/types/mqttType";
// import { useQuery } from "@tanstack/react-query";
// import { measurementService } from "@/services/measurementService";
// import { thresholdService } from "@/services/thresholdService";

// type PumpAreaProps = {
//   type: "main" | "pilot";
//   initialMeasurements: any;
//   initialThresholds: any;
// };

// export default function PumpArea({ type, initialMeasurements, initialThresholds }: PumpAreaProps) {

//   const { 
//     data: measurementData,
//     isLoading: isLoadingMeasurement, 
//   } = useQuery({
//     queryKey: [`measurements-${type}`],
//     queryFn: () => measurementService.getMeasurementsDashboardData(type),
//     initialData: initialMeasurements,
//   });
//     console.log("🚀 ~ PumpArea ~ measurementData:", measurementData, initialMeasurements)

//   const { 
//     data: thresholdData,
//     isLoading: isLoadingThreshold, 
//   } = useQuery({
//     queryKey: [`thresholds-${type}`],
//     queryFn: () => thresholdService.getAllThreshold(type),
//     initialData: initialThresholds,
//   });

//   const dataMqtt = useMqttSubscription<{realtime: RealtimeData}>("toho/resonac/value");
//   const pumpData = dataMqtt?.realtime?.[type];
//   const [ampereSeries, setAmpereSeries] = useState<any[]>([]);
  
//   useEffect(() => {
//     if (measurementData?.data?.length) {
//       const initialSeries = [
//         { name: 'R', data: measurementData.data.map((d: any) => [new Date(d.timestamp).getTime(), d.ampere_r]) },
//         { name: 'S', data: measurementData.data.map((d: any) => [new Date(d.timestamp).getTime(), d.ampere_s]) },
//         { name: 'T', data: measurementData.data.map((d: any) => [new Date(d.timestamp).getTime(), d.ampere_t]) }
//       ];
//       setAmpereSeries(initialSeries);
//     }
//   }, [measurementData]);
  
//   useEffect(() => {
//     // Update real-time dari MQTT
//     if (pumpData) {
//       const now = new Date().getTime();
//       setAmpereSeries(prevSeries => {
//         // Logika untuk menambahkan data baru dan menghapus data lama
//         // (disesuaikan dengan kebutuhan Anda)
//         return prevSeries; 
//       });
//     }
//   }, [pumpData]);

//   // ✅ Ganti loading state awal agar bergantung pada query, bukan MQTT
//   if (isLoadingMeasurement || isLoadingThreshold) {
//     return (
//       <div className="flex items-center justify-center h-[calc(100vh-400px)]">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
//       </div>
//     );
//   }

//   // Ambil nilai terbaru dari MQTT jika ada, jika tidak, dari data API terakhir
//   const latestData = pumpData ?? measurementData?.data?.[measurementData.data.length - 1];

//   return (
//     <div>
//       {/* Bagian Voltage, PF, KWh */}
//       <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
//         <div className="lg:col-span-3 flex flex-col rounded-xl items-stretch justify-between space-y-6">
//           <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
//             <ValueCard label="Voltage R-S" size="2xl" unit="V" value={pumpData?.volt_r} color="text-red-500 dark:text-red-400" />
//             <ValueCard label="Voltage S-T" size="2xl" unit="V" value={pumpData?.volt_s} color="text-yellow-500 dark:text-yellow-400" />
//             <ValueCard label="Voltage T-R" size="2xl" unit="V" value={pumpData?.volt_t} color="text-gray-500 dark:text-gray-400" />
//             <ValueCard label="PF" size="2xl" value={pumpData?.pf} color="text-green-500 dark:text-green-400" />
//             <ValueCard label="KWh (Total)" size="2xl" unit="KWh" value={pumpData?.kwh} style="col-span-2" color="text-blue-500 dark:text-blue-400" />
//           </div>
//         </div>
//       </div>

//       {/* Bagian Ampere */}
//       <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
//         <div className="bg-slate-50 dark:bg-slate-800 p-3 col-span-4 rounded-lg">
//           <LineChart title="Ampere R-S-T" />
//         </div>
//         <div className="flex flex-col gap-2">
//           <ValueCard color="text-red-500 dark:text-red-400" label="Ampere R-S" unit="A" value={pumpData?.ampere_r} />
//           <ValueCard color="text-yellow-500 dark:text-yellow-400" label="Ampere S-T" unit="A" value={pumpData?.ampere_s} />
//           <ValueCard color="text-gray-500 dark:text-gray-400" label="Ampere T-R" unit="A" value={pumpData?.ampere_t} />
//         </div>          
//       </div>

//       {/* Bagian Oil Pressure */}
//       <div className="mt-2 grid grid-cols-1 lg:grid-cols-5 gap-4">
//         <div className="bg-slate-50 px-3 rounded-lg lg:col-span-4 dark:bg-slate-800">
//           <AreaChart title="Oil Pressure" unit="Bar" />
//         </div>
//         <div className="flex w-full items-center justify-center">
//           <ValueCard value={pumpData?.oil_pressure} size="4xl" unit="Bar" fixed={0} />   
//         </div>
//       </div>
//   </div>
//   )
// }

"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ValueCard from "../utils/ValueCard";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { RealtimeData } from "@/types/mqttType";
import { useQuery } from "@tanstack/react-query";
import { measurementService } from "@/services/measurementService";
import { thresholdService } from "@/services/thresholdService";
import AreaChart from "./AreaChart";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type PumpAreaProps = {
  type: "main" | "pilot";
  initialMeasurements: any;
  initialThresholds: any;
};

const MAX_POINTS = 50;

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

  const [series, setSeries] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // ✅ Inisialisasi dari database
  useEffect(() => {
    if (measurementData?.data?.length) {
      const ampereR = measurementData.data.map((d: any) => d.ampere_rs || d.ampere_r || 0);
      const ampereS = measurementData.data.map((d: any) => d.ampere_st || d.ampere_s || 0);
      const ampereT = measurementData.data.map((d: any) => d.ampere_tr || d.ampere_t || 0);
      const times = measurementData.data.map((d: any) =>
        new Date(d.timestamp).toLocaleTimeString("id-ID", { hour12: false })
      );

      setSeries([
        { name: "R", data: ampereR.slice(-MAX_POINTS) },
        { name: "S", data: ampereS.slice(-MAX_POINTS) },
        { name: "T", data: ampereT.slice(-MAX_POINTS) },
      ]);
      setCategories(times.slice(-MAX_POINTS));
    }
  }, [measurementData]);

  // ✅ Update realtime MQTT
  useEffect(() => {
    if (!pumpData?.ampere_r && !pumpData?.ampere_s && !pumpData?.ampere_t) return;

    const now = new Date().toLocaleTimeString("id-ID", { hour12: false });

    setSeries((prev) => {
      if (prev.length === 0) return prev;

      const updated = [
        { ...prev[0], data: [...prev[0].data, pumpData.ampere_r].slice(-MAX_POINTS) },
        { ...prev[1], data: [...prev[1].data, pumpData.ampere_s].slice(-MAX_POINTS) },
        { ...prev[2], data: [...prev[2].data, pumpData.ampere_t].slice(-MAX_POINTS) },
      ];
      return updated;
    });

    setCategories((prev) => {
      const updated = [...prev, now];
      return updated.slice(-MAX_POINTS);
    });
  }, [pumpData]);

  // Threshold dari database
  const thresholdAmp = thresholdData?.find((t: any) => t.parameter === "ampere");
  const upper = thresholdAmp?.upperLimit ?? 120;
  const lower = thresholdAmp?.lowerLimit ?? 0;

  const options: ApexOptions = {
    chart: { type: "line", height: 200, toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#ef4444", "#facc15", "#6b7280"],
    xaxis: {
      categories,
      labels: { 
        rotate: 0, 
        style: { 
          colors: "#9ca3af" 
        },
        formatter: function (value) {
          if (value) {
            const parts = value.split('.');
            if (parts.length !== 3) return '';
            const [hour, minute, second] = parts.map(Number);
            const date = new Date();
            date.setHours(hour, minute, second, 0);

            const seconds = date.getSeconds();
            // tampilkan label hanya tiap 5 detik
            if (seconds % 5 === 0) {
              return date.toLocaleTimeString('id-ID', { hour12: false });
            } else {
              return '';
            }
          }
          return "";
        }
      },
    },
    yaxis: { min: lower - 5, max: upper + 5 },
    annotations: {
      yaxis: [
        {
          y: upper,
          borderColor: "#ef4444",
          label: {
            borderColor: "#ef4444",
            style: { color: "#fff", background: "#ef4444" },
            text: `Max ${upper}`,
          },
        },
      ],
    },
    legend: { position: "top", horizontalAlign: "right" },
  };

  if (isLoadingMeasurement || isLoadingThreshold) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-400px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
      <div className="bg-slate-50 dark:bg-slate-800 p-3 col-span-4 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Ampere R-S-T</h3>
        <ReactApexChart options={options} series={series} type="line" height={200} />
      </div>
      <div className="flex flex-col gap-2">
        <ValueCard color="text-red-500 dark:text-red-400" label="Ampere R" unit="A" value={pumpData?.ampere_r} />
        <ValueCard color="text-yellow-500 dark:text-yellow-400" label="Ampere S" unit="A" value={pumpData?.ampere_s} />
        <ValueCard color="text-gray-500 dark:text-gray-400" label="Ampere T" unit="A" value={pumpData?.ampere_t} />
      </div>

       {/* Bagian Oil Pressure */}
      <div className="mt-2 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="bg-slate-50 px-3 rounded-lg lg:col-span-4 dark:bg-slate-800">
          <AreaChart title="Oil Pressure" unit="Bar" />
        </div>
        <div className="flex w-full items-center justify-center">
          <ValueCard value={pumpData?.oil_pressure} size="4xl" unit="Bar" fixed={0} />   
        </div>
      </div>
    </div>
  );
}
