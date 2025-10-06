"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useMqtt } from "@/context/MqttContext";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { RealtimeData } from "@/types/mqtt";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function OilTemperature() {
  const mqttData  = useMqttSubscription<{realtime: RealtimeData}>("toho/resonac/value")

  const realtime = mqttData?.realtime

  const MAX_POINTS = 50; // 🔹 batas max 50 data

  const [series, setSeries] = useState([
    {
      name: "Temperature",
      data: [],
    },
  ]);

  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // 🔹 state untuk loading

  const threshold = 81;

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
      min: 60,
      max: 90,
    },
    annotations: {
      yaxis: [
        {
          y: threshold,
          borderColor: "#FF0000",
          label: {
            borderColor: "#FF0000",
            style: { color: "#fff", background: "#FF0000" },
            text: `Max ${threshold}`,
          },
        },
      ],
    },
  };

  // 🔹 Update chart setiap kali ada data baru dari MQTT
  useEffect(() => {
    if (realtime?.oil?.temperature !== undefined) {
      
      const now = new Date().toLocaleTimeString("id-ID", { hour12: false });
      
      setSeries((prev: any) => {
        const newData = [...prev[0].data, realtime.oil.temperature];
        if (newData.length > MAX_POINTS) newData.shift();
        return [{ ...prev[0], data: newData }];
      });
      
      setCategories((prev) => {
        const newCats = [...prev, now];
        if (newCats.length > MAX_POINTS) newCats.shift();
        return newCats;
      });

      setLoading(false); // 🔹 data pertama sudah datang → stop loading
    }
  }, [mqttData ]);

  // 🔹 tampilkan loading UI sebelum data MQTT pertama kali masuk
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] col-span-5">
        <p className="ml-4 text-gray-500 dark:text-gray-400 animate-pulse">Waiting for realtime data...</p>
      </div>
    );
  }

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
        <h1 className="text-center ">        
          <span className="text-6xl font-bold text-[#00a5c0]">
            {realtime?.oil?.temperature} °C
          </span>
        </h1>
      </div>
    </div>
  );
}
