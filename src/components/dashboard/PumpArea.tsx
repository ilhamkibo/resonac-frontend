"use client";
import React, { useEffect, useState } from "react";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";
import ValueCard from "../utils/ValueCard";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { RealtimeData } from "@/types/mqtt";

type PumpAreaProps = {
  type: "main" | "pilot";
};

export default function PumpArea({ type }: PumpAreaProps) {

  const data = useMqttSubscription<{realtime: RealtimeData}>("toho/resonac/value")

  const pumpData = data?.realtime?.[type];

  // const data = realtime?.[type]; // ambil data sesuai type
  if (!pumpData) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-400px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        {/* <p className="ml-4">Waiting for realtime data...</p> */}
      </div>
    );
  }

  return (
    <div>
      {/* Bagian Voltage, PF, KWh */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 flex flex-col rounded-xl items-stretch justify-between space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
            <ValueCard label="Voltage R-S" size="2xl" unit="V" value={pumpData?.volt_r} color="text-red-500 dark:text-red-400" />
            <ValueCard label="Voltage S-T" size="2xl" unit="V" value={pumpData?.volt_s} color="text-yellow-500 dark:text-yellow-400" />
            <ValueCard label="Voltage T-R" size="2xl" unit="V" value={pumpData?.volt_t} color="text-gray-500 dark:text-gray-400" />
            <ValueCard label="PF" size="2xl" value={pumpData?.pf} color="text-green-500 dark:text-green-400" />
            <ValueCard label="KWh (Total)" size="2xl" unit="KWh" value={pumpData?.kwh} style="col-span-2" color="text-blue-500 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Bagian Ampere */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 col-span-4 rounded-lg">
          <LineChart title="Ampere R-S-T" />
        </div>
        <div className="flex flex-col gap-2">
          <ValueCard color="text-red-500 dark:text-red-400" label="Ampere R-S" unit="A" value={pumpData?.ampere_r} />
          <ValueCard color="text-yellow-500 dark:text-yellow-400" label="Ampere S-T" unit="A" value={pumpData?.ampere_s} />
          <ValueCard color="text-gray-500 dark:text-gray-400" label="Ampere T-R" unit="A" value={pumpData?.ampere_t} />
        </div>          
      </div>

      {/* Bagian Oil Pressure */}
      <div className="mt-2 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="bg-slate-50 px-3 rounded-lg lg:col-span-4 dark:bg-slate-800">
          <AreaChart title="Oil Pressure" unit="Bar" />
        </div>
        <div className="flex w-full items-center justify-center">
          <ValueCard value={pumpData?.oil_pressure} size="3xl" unit="Bar" fixed={0} />   
        </div>
      </div>
  </div>
  )
}
