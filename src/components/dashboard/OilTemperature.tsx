"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { RealtimeData } from "@/types/mqtt";
import { useQuery } from "@tanstack/react-query";
import { measurementService } from "@/services/measurementService";
import { thresholdService } from "@/services/thresholdService";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OilTemperature() {
  // ====== HOOKS & STATE ======
  const mqttData = useMqttSubscription<{ realtime: RealtimeData }>("toho/resonac/value");
  const realtime = mqttData?.realtime;

  const [series, setSeries] = useState([{ name: "Temperature", data: [] as number[] }]);
  const [categories, setCategories] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);

  const MAX_POINTS = 50;

  // ====== FETCH INITIAL DATA ======
  const {
    data: measurementData,
    isLoading: isLoadingMeasurements,
    isError: isErrorMeasurements,
  } = useQuery({
    queryKey: ["measurements-oil"],
    queryFn: () => measurementService.getMeasurementsDashboardData("oil"),
  });

  const {
    data: thresholdData,
    isLoading: isLoadingThreshold,
    isError: isErrorThreshold,
  } = useQuery({
    queryKey: ["thresholds-oil"],
    queryFn: () => thresholdService.getAllThreshold("oil"),
  });

  // ====== INITIALIZE CHART WITH BACKEND DATA ======
  useEffect(() => {
    if (!measurementData?.data?.length || initialized) return;

    const temps = measurementData.data.map((item: any) => item.oil_temperature);
    const times = measurementData.data.map((item: any) =>
      new Date(item.timestamp).toLocaleTimeString("id-ID", { hour12: false })
    );

    setSeries([{ name: "Temperature", data: temps.slice(-MAX_POINTS) }]);
    setCategories(times.slice(-MAX_POINTS));
    setInitialized(true);
  }, [measurementData, initialized]);

  // ====== UPDATE CHART WITH REALTIME MQTT ======
  useEffect(() => {
    if (realtime?.oil?.temperature === undefined) return;

    const now = new Date().toLocaleTimeString("id-ID", { hour12: false });

    setSeries((prev) => {
      const newData = [...prev[0].data, realtime.oil.temperature];
      if (newData.length > MAX_POINTS) newData.shift();
      return [{ ...prev[0], data: newData }];
    });

    setCategories((prev) => {
      const newCats = [...prev, now];
      if (newCats.length > MAX_POINTS) newCats.shift();
      return newCats;
    });

    setLoading(false);
  }, [realtime]);

  // ====== CHART OPTIONS ======
  const lowerLimit = thresholdData?.data?.[0]?.lowerLimit ?? 0;
  const upperLimit = thresholdData?.data?.[0]?.upperLimit ?? 100;

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

  // ====== LOADING UI ======
  if (
    loading ||
    isLoadingMeasurements ||
    isLoadingThreshold ||
    isErrorMeasurements ||
    isErrorThreshold
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] col-span-5">
        <p className="ml-4 text-gray-500 dark:text-gray-400 animate-pulse">
          Waiting for realtime data...
        </p>
      </div>
    );
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
        <h1 className="text-center">
          <span className="text-6xl font-bold text-[#00a5c0]">
            {realtime?.oil?.temperature ?? "-"} °C
          </span>
        </h1>
      </div>
    </div>
  );
}
