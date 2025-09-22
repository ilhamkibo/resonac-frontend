"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// ✅ Import chart hanya di client
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MainPowerFactor() {
  const [pfValue, setPfValue] = useState(75.55);

  // ✅ Update nilai PF tiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      // random PF antara 70 - 100
      const randomPF = +(70 + Math.random() * 30).toFixed(2);
      setPfValue(randomPF);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const mainPFOptions: ApexOptions = {
    chart: { type: "radialBar", height: 200, sparkline: { enabled: true } },
    series: [pfValue],
    labels: ["PF"],
    plotOptions: {
      radialBar: {
        hollow: { size: "70%" },
        dataLabels: {
          value: {
            formatter: (val) => (val / 100).toFixed(2), // tampilkan dalam 0.xx
          },
        },
      },
    },
    colors: ["#4f46e5"],
    tooltip: { enabled: false },
  };

  return (
    <div className="bg-slate-50 p-3 rounded-lg text-center">
      <div className="text-sm font-medium mb-1">Power Factor</div>
      <ReactApexChart
        options={mainPFOptions}
        series={[pfValue]}
        type="radialBar"
        height={200}
      />
      {/* <div className="text-sm text-slate-500 mt-1">
        PF: {(pfValue / 100).toFixed(2)}
      </div> */}
    </div>
  );
}
