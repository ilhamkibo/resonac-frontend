import type { Metadata } from "next";
import React from "react";
import OilTemperature from "@/components/dashboard/OilTemperature";
import PumpArea from "@/components/dashboard/PumpArea";

export const metadata: Metadata = {
  title:
    "Utility Dashboard | Resonac Utility Monitoring",
  description: "Resonac Realtime Utility Monitoring Dashboard"
};


export default function Page() {

  return (
    <div>
      <div className="mt-4 shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
        <OilTemperature />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mt-8">
        <section className="relative rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 border border-slate-200 p-4 shadow-sm">
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-xl">
            Main Pump
          </div>
          <PumpArea type={"main"} />
        </section>
        <section className="relative rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 border border-slate-200 p-4 shadow-sm">
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-xl">
            Pilot Pump
          </div>
          <PumpArea type={"pilot"} />
        </section>

        
      </div>

    </div>
  );
}
