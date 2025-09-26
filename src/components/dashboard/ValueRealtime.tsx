"use client";
import ValueCard from "../utils/ValueCard";
import React from "react";


export default function ValueRealtime() {
  return (
    <div className="lg:col-span-3 flex flex-col rounded-xl items-stretch justify-between space-y-6">
      {/* Baris pertama */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        <ValueCard label="Voltage R" />
        <ValueCard label="Voltage S" />
        <ValueCard label="Voltage T" />
        <ValueCard label="Power Factor" />
        <div className="col-span-2">
          <h1 className="text-lg text-gray-800 dark:text-gray-400 ">KWh (Total)</h1>
          <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
            <h1 className="text-center px-2 text-4xl font-bold text-gray-800 dark:text-gray-400">
              14560012
            </h1>
          </div>
        </div>      
      </div>
    </div>
  );
}
