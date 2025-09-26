"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// ✅ Dynamic import ApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function History() {
  const [activeTab, setActiveTab] = useState<"main" | "pilot" | "oil">("main");
  const [dark, setDark] = useState(true);

  // ✅ toggle dark/light mode
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // ✅ Dummy data chart
  const lineOptions: ApexOptions = {
    chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false } },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 4 },
    xaxis: { categories: ["08:00", "09:00", "10:00", "11:00", "12:00"] },
    yaxis: { decimalsInFloat: 1 },
    tooltip: { theme: dark ? "dark" : "light" },
    theme: { mode: dark ? "dark" : "light" },
  };

  const seriesAmpere = [
    { name: "R", data: [12, 14, 13, 15, 16] },
    { name: "S", data: [11, 13, 12, 14, 15] },
    { name: "T", data: [13, 12, 14, 13, 17] },
  ];

  const seriesVolt = [
    { name: "R", data: [380, 381, 382, 383, 384] },
    { name: "S", data: [379, 380, 381, 382, 383] },
    { name: "T", data: [381, 382, 383, 384, 385] },
  ];

  const seriesOilTemp = [{ name: "Oil Temp", data: [60, 62, 64, 66, 68] }];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6  min-h-screen text-gray-900 dark:text-gray-100">
      {/* Header */}
      {/* <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pump Monitoring - Log History</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Realtime & Historical Data Visualization
        </p>
      </header> */}

      {/* Tabs */}
      <div className="flex space-x-4 justify-center">
        {["main", "pilot", "oil"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
            }`}
          >
            {tab === "main"
              ? "Main Pump"
              : tab === "pilot"
              ? "Pilot Pump"
              : "Oil Temperature"}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div>
        {/* MAIN TAB */}
        {activeTab === "main" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Ampere RST Trend</h2>
                <ReactApexChart
                  options={lineOptions}
                  series={seriesAmpere}
                  type="line"
                  height={300}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Voltage RST Trend</h2>
                <ReactApexChart
                  options={lineOptions}
                  series={seriesVolt}
                  type="line"
                  height={300}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow mt-6">
              <label className="text-sm font-medium">From:</label>
              <input
                type="date"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
              />
              <label className="text-sm font-medium">To:</label>
              <input
                type="date"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm text-white">
                Apply
              </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mt-4 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">Main Pump Log</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Time</th>
                    <th className="p-2">Ampere RST</th>
                    <th className="p-2">Volt RST</th>
                    <th className="p-2">PF</th>
                    <th className="p-2">KWh</th>
                    <th className="p-2">Oil Pressure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-300 dark:border-gray-600">
                    <td className="p-2">08:00</td>
                    <td className="p-2">12 / 11 / 13</td>
                    <td className="p-2">380 / 381 / 382</td>
                    <td className="p-2">0.89</td>
                    <td className="p-2">102</td>
                    <td className="p-2">2.5 bar</td>
                  </tr>
                  <tr className="border-t border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50">
                    <td className="p-2">09:00</td>
                    <td className="p-2">14 / 13 / 12</td>
                    <td className="p-2">381 / 382 / 382</td>
                    <td className="p-2">0.91</td>
                    <td className="p-2">108</td>
                    <td className="p-2">2.6 bar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* PILOT TAB */}
        {activeTab === "pilot" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Ampere RST Trend</h2>
                <ReactApexChart
                  options={lineOptions}
                  series={seriesAmpere}
                  type="line"
                  height={300}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                <h2 className="text-lg font-semibold mb-4">Voltage RST Trend</h2>
                <ReactApexChart
                  options={lineOptions}
                  series={seriesVolt}
                  type="line"
                  height={300}
                />
              </div>
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow mt-6">
              <label className="text-sm font-medium">From:</label>
              <input
                type="date"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
              />
              <label className="text-sm font-medium">To:</label>
              <input
                type="date"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm text-white">
                Apply
              </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mt-4 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">Pilot Pump Log</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Time</th>
                    <th className="p-2">Ampere RST</th>
                    <th className="p-2">Volt RST</th>
                    <th className="p-2">PF</th>
                    <th className="p-2">KWh</th>
                    <th className="p-2">Oil Pressure</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-300 dark:border-gray-600">
                    <td className="p-2">08:00</td>
                    <td className="p-2">8 / 7 / 8</td>
                    <td className="p-2">379 / 380 / 381</td>
                    <td className="p-2">0.92</td>
                    <td className="p-2">75</td>
                    <td className="p-2">2.1 bar</td>
                  </tr>
                  <tr className="border-t border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50">
                    <td className="p-2">09:00</td>
                    <td className="p-2">9 / 8 / 7</td>
                    <td className="p-2">380 / 380 / 381</td>
                    <td className="p-2">0.93</td>
                    <td className="p-2">78</td>
                    <td className="p-2">2.2 bar</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* OIL TAB */}
        {activeTab === "oil" && (
          <>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                Oil Temperature Trend
              </h2>
              <ReactApexChart
                options={lineOptions}
                series={seriesOilTemp}
                type="line"
                height={300}
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-xl shadow mt-6">
              <label className="text-sm font-medium">From:</label>
              <input
                type="date"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
              />
              <label className="text-sm font-medium">To:</label>
              <input
                type="date"
                className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-2 py-1"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm text-white">
                Apply
              </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mt-4 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">Oil Temperature Log</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Time</th>
                    <th className="p-2">Oil Temp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-300 dark:border-gray-600">
                    <td className="p-2">08:00</td>
                    <td className="p-2">60 °C</td>
                  </tr>
                  <tr className="border-t border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/50">
                    <td className="p-2">09:00</td>
                    <td className="p-2">62 °C</td>
                  </tr>
                  <tr className="border-t border-gray-300 dark:border-gray-600">
                    <td className="p-2">10:00</td>
                    <td className="p-2">65 °C</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
