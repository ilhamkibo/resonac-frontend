"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// ✅ Import chart hanya di client
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MainOilPressure() {
  const [oilPressure, setOilPressure] = useState(75.55);

  // ✅ Update nilai PF tiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      // random PF antara 70 - 100
      const randomPressure = +(Math.random() * 300);
      setOilPressure(randomPressure);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mainOilPressure: ApexOptions = {
    chart: { type: "radialBar", height: 200, sparkline: { enabled: false } },
    series: [oilPressure],
    labels: ["Bar"],
    plotOptions: {
      radialBar: {
        hollow: { size: "70%" },
        dataLabels: {
          value: {
            formatter: (val) => (val / 100).toFixed(2), // tampilkan dalam 0.xx
          },
        },
        track: {
          background: "#e7e7e7",
          opacity: 1,
          margin: 5, // margin antara track dan label
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: "#999",
            opacity: 1,
            blur: 2,
          },
        },
        
      },
    },
    colors: ["#4f46e5"],
    tooltip: { enabled: false },
  };

  return (
    <div className="bg-slate-50 p-3 rounded-lg text-center">
      <div className="text-sm font-medium mb-1">Oil Pressure</div>
      <ReactApexChart
        options={mainOilPressure}
        series={[oilPressure]}
        type="radialBar"
        height={200}
      />
      {/* <div className="text-sm text-slate-500 mt-1">
        PF: {(oilPressure / 100).toFixed(2)}
      </div> */}
    </div>
  );
}
