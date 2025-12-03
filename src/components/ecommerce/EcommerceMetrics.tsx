"use client";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export const EcommerceMetrics = () => {
   const series = [75.55];
    const options: ApexOptions = {
      colors: ["#465FFF"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        type: "radialBar",
        height: 330,
        sparkline: {
          enabled: true,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -85,
          endAngle: 85,
          hollow: {
            size: "80%",
          },
          track: {
            background: "#E4E7EC",
            strokeWidth: "100%",
            margin: 5, // margin is in pixels
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              fontSize: "36px",
              fontWeight: "600",
              offsetY: -40,
              color: "#1D2939",
              formatter: function (val) {
                return val + "%";
              },
            },
          },
        },
      },
      fill: {
        type: "solid",
        colors: ["#465FFF"],
      },
      stroke: {
        lineCap: "round",
      },
      labels: ["Progress"],
    };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <ReactApexChart options={options} series={series} type="radialBar" />
      <ReactApexChart options={options} series={series} type="radialBar" />
    </div>
  );
};
