"use client";
import ValueCard from "../utils/ValueCard";
import React from "react";


export default function ValueRealtime() {
  return (
    <div className="lg:col-span-3 flex flex-col rounded-xl items-stretch justify-between space-y-6">
      {/* Baris pertama */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <ValueCard label="Ampere R" />
        <ValueCard label="Ampere S" />
        <ValueCard label="Ampere T" />
        <ValueCard label="kWh (W)" />
      </div>

      {/* Baris kedua */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <ValueCard label="Voltage R" />
        <ValueCard label="Voltage S" />
        <ValueCard label="Voltage T" />
        <ValueCard label="Power Factor" />
      </div>
    </div>
  );
}
