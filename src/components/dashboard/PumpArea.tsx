"use client";
import React from "react";
import { useMqtt } from "@/context/MqttContext";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";
import ValueCard from "../utils/ValueCard";

type PumpAreaProps = {
  type: "main" | "pilot";
};

export default function PumpArea({ type }: PumpAreaProps) {
  const { realtime } = useMqtt();
  const data = realtime?.[type]; // ambil data sesuai type

  return (
    <div>
      {/* Bagian Voltage, PF, KWh */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-3 flex flex-col rounded-xl items-stretch justify-between space-y-6">
          <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
            <ValueCard label="Voltage R" value={data?.volt_r} />
            <ValueCard label="Voltage S" value={data?.volt_s} />
            <ValueCard label="Voltage T" value={data?.volt_t} />
            <ValueCard label="Power Factor" value={data?.pf} />
            <div className="col-span-2">
              <h1 className="text-lg text-gray-800 dark:text-gray-400">
                KWh (Total)
              </h1>
              <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
                <h1 className="text-center px-2 text-4xl font-bold text-gray-800 dark:text-gray-400">
                  {Number(data?.kwh || 0).toFixed(2)}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Ampere */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800 p-3 col-span-4 rounded-lg">
          <LineChart title="Ampere R-S-T" />
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="text-gray-800 dark:text-gray-400">Ampere R-S</h1>
            <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
              <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                {data?.ampere_r}
              </h1>
            </div>
          </div>
          <div>
            <h1 className="text-gray-800 dark:text-gray-400">Ampere S-T</h1>
            <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
              <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                {data?.ampere_s}
              </h1>
            </div>
          </div>
          <div>
            <h1 className="text-gray-800 dark:text-gray-400">Ampere T-R</h1>
            <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
              <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                {data?.ampere_t}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Oil Pressure */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="bg-slate-50 px-3 rounded-lg lg:col-span-4 dark:bg-slate-800">
          <AreaChart title="Oil Pressure" unit="Bar" />
        </div>
        <div className="flex w-full items-center justify-center">
          <h1 className="text-center text-6xl font-bold text-gray-800 dark:text-gray-400">
            {data?.oil_pressure}
          </h1>
        </div>
      </div>
    </div>
  );
}
