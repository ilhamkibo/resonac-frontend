import type { Metadata } from "next";
import React from "react";
import DailyInfo from "@/components/dashboard/DailyInfo";
import OilTemperature from "@/components/dashboard/OilTemperature";
import LineChart from "@/components/dashboard/LineChart";
import RadialChart from "@/components/dashboard/RadialChart";
import AreaChart from "@/components/dashboard/AreaChart";
import ValueRealtime from "@/components/dashboard/ValueRealtime";

export const metadata: Metadata = {
  title:
    "Utility Dashboard | Realtime Monitoring",
  description: "Resonac Realtime Utility Monitoring Dashboard",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function Ecommerce() {
  return (
    <div>
      <div className="mb-4">
        <DailyInfo />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mt-6">

        <section className="relative rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 border border-slate-200 p-4 shadow-sm">
          <div>
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm">Main Pump</div>
          <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            <LineChart title="Ampere R-S-T" />
            <LineChart title="Voltage R-S-T" />
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          
            <AreaChart title="kWh (W)" unit="kWh" />
            <RadialChart label="Bar" title="Oil Pressure" />
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          
            <ValueRealtime />
          </div>

          </div>
          

        </section>
        <section className="relative rounded-xl bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-700 p-4 shadow-sm">
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm">Pilot Pump</div>
          <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
            <LineChart title="Ampere R-S-T" />
            <LineChart title="Voltage R-S-T" />
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <RadialChart label="Bar" title="Oil Pressure" />
            <AreaChart title="kWh (W)" unit="kWh" />
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          
            <ValueRealtime />
          </div>

        </section>


      </div>
      <div className="mt-4 shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
        <OilTemperature />
      </div>
    </div>
  );
}
