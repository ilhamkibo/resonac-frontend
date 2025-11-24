"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { RealtimeData } from "@/types/mqttType";
import { useQuery } from "@tanstack/react-query";
import { measurementService } from "@/services/measurementService";
import { thresholdService } from "@/services/thresholdService";
import { MeasurementDashboard } from "@/types/measurementType";
import { ChartData } from "@/types/chartType";
import { Threshold } from "@/types/thresholdType";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type OilTemperatureProps = {
  initialMeasurements: MeasurementDashboard[];
  initialThresholds: Threshold[];
};

export default function OilTemperature({ initialMeasurements, initialThresholds }: OilTemperatureProps) {
  // ====== HOOKS & STATE ======
  const mqttData = useMqttSubscription<{ realtime: RealtimeData }>("toho/resonac/value");
  console.log("🚀 ~ OilTemperature ~ mqttData:", mqttData)
  const realtime = mqttData?.realtime;

  const MAX_POINTS = 50;

   const [chartData, setChartData] = useState<ChartData>({
    series: [{ name: "Temperature", data: [] }],
    categories: []
  });

  const { series, categories } = chartData;

  // ✅ 2. Gunakan 'initialData' untuk menghidrasi TanStack Query
  const {
    data: measurementData,
    isLoading: isLoadingMeasurements,
    isError: isErrorMeasurements,
  } = useQuery({
    queryKey: ["measurements-oil"],
    queryFn: () => measurementService.getMeasurementsDashboardData("oil"),
    initialData: initialMeasurements,
  });

  const {
    data: thresholdData,
    isLoading: isLoadingThreshold,
    isError: isErrorThreshold,
  } = useQuery({
    queryKey: ["thresholds-oil"],
    queryFn: () => thresholdService.getAllThreshold("oil"),
    initialData: initialThresholds,
  });

  // ✅ 3. Sederhanakan useEffect untuk inisialisasi chart
  // Efek ini sekarang hanya berjalan sekali saat 'measurementData' pertama kali tersedia.
  useEffect(() => {
    if (measurementData?.length) {
      const temps = measurementData
        .map((item) => item.oil_temperature ?? 0)
        .reverse();

      const times = measurementData
        .map((item) =>
          new Date(item.timestamp).toLocaleTimeString("id-ID", { hour12: false })
        )
        .reverse();

      setChartData({
        series: [{ name: "Temperature", data: temps.slice(-MAX_POINTS) }],
        categories: times.slice(-MAX_POINTS),
      });
    }
  }, [measurementData]);

  // useEffect untuk update MQTT (tetap sama)
  useEffect(() => {
    if (realtime?.oil?.temperature === undefined) return;

    const now = new Date().toLocaleTimeString("id-ID", { hour12: false });

    setChartData((prev) => {
      const newData = [...prev.series[0].data, realtime.oil.temperature];
      if (newData.length > MAX_POINTS) newData.shift();

      const newCats = [...prev.categories, now];
      if (newCats.length > MAX_POINTS) newCats.shift();

      return {
        series: [{ ...prev.series[0], data: newData }],
        categories: newCats,
      };
    });
  }, [realtime]);

  // ====== CHART OPTIONS ======
  const lowerLimit = thresholdData[0]?.lowerLimit ?? 0;
  const upperLimit = thresholdData[0]?.upperLimit ?? 100;

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 200,
      animations: { enabled: false },
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#00a5c0"],
    xaxis: {
      categories,
      labels: { rotate: -45 },
    },
    yaxis: {
      min: lowerLimit - 5,
      max: upperLimit + 5,
    },
    tooltip: {
      enabled: false,
    },
    annotations: {
      yaxis: [
        {
          y: lowerLimit,
          borderColor: "#3b82f6",
          label: {
            borderColor: "#3b82f6",
            style: { color: "#fff", background: "#3b82f6" },
            text: `Min ${lowerLimit}°C`,
          },
        },
        {
          y: upperLimit,
          borderColor: "#FF0000",
          label: {
            borderColor: "#FF0000",
            style: { color: "#fff", background: "#FF0000" },
            text: `Max ${upperLimit}°C`,
          },
        },
      ],
    },
  };

  // ✅ 4. Sederhanakan kondisi loading
  // Sekarang hanya bergantung pada query yang berjalan di client untuk refetch
  if (isLoadingMeasurements || isLoadingThreshold) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">
          Loading chart data...
        </p>
      </div>
    );
  }

  if (isErrorMeasurements || isErrorThreshold) {
      return <div>Error loading data...</div>
  }

  // ====== RENDER UI ======
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Oil Temperature
          </h2>
        </div>
        <ReactApexChart options={options} series={series} type="line" height={200} />
      </div>

     <div className="col-span-1 flex flex-col justify-center w-full">
        <div className="flex justify-center">
          {realtime?.oil?.temperature === undefined ? (
            <div className="flex items-end gap-2">
              {/* Skeleton Angka */}
              <div className="w-24 h-12 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />

              {/* Unit */}
              <span className="text-6xl font-bold text-[#00a5c0]">°C</span>
            </div>
          ) : (
            <span className="text-6xl font-bold text-[#00a5c0]">
              {realtime.oil.temperature} °C
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
