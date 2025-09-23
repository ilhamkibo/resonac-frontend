"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function OilTemperature() {
  function randomPoint(base: number, spread = 5) {
    return +(base + (Math.random() * spread - spread / 2)).toFixed(2);
  }

  // 🔹 state untuk data chart
  const [series, setSeries] = useState([
    {
      name: "Temperature",
      data: Array.from({ length: 30 }, () => randomPoint(70)),
    },
  ]);

  const [categories, setCategories] = useState(
    Array.from({ length: 30 }, (_, i) => `${i}s`)
  );

  // 🔹 Apex chart options
  const options: ApexOptions = {
    chart: { type: "line", height: 180, animations: { enabled: false } }, // disable animasi biar smooth manual
    stroke: { curve: "smooth", width: 2 },
    colors: ["#eab308"],
    xaxis: { categories },
  };

  // 🔹 Update tiap 1 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setSeries((prev) => {
        const newData = [...prev[0].data];
        newData.push(randomPoint(70)); // tambah di depan
        newData.shift(); // buang data lama
        return [{ ...prev[0], data: newData }];
      });

      setCategories((prev) => {
        const last = parseInt(prev[prev.length - 1]) + 1;
        const newCats = [...prev, `${last}s`];
        newCats.shift();
        return newCats;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Oil Temperature</h2>
        <span className="text-lg font-bold text-amber-600">
          {series[0].data[series[0].data.length - 1]} °C
        </span>
      </div>
      <ReactApexChart options={options} series={series} type="line" height={180} />
    </>
  );
}
