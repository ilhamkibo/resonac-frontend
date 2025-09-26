import type { Metadata } from "next";
import React from "react";
import DailyInfo from "@/components/dashboard/DailyInfo";
import OilTemperature from "@/components/dashboard/OilTemperature";
import LineChart from "@/components/dashboard/LineChart";
import RadialChart from "@/components/dashboard/RadialChart";
import AreaChart from "@/components/dashboard/AreaChart";
import ValueRealtime from "@/components/dashboard/ValueRealtime";
import ValueCard from "@/components/utils/ValueCard";

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
      <div className="mt-4 shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
        <OilTemperature />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mt-6">

        <section className="relative rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 border border-slate-200 p-4 shadow-sm">
            <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm">Main Pump</div>
          <div>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <ValueRealtime />
            </div>
            <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 p-3 col-span-4 rounded-lg">
                <LineChart title="Ampere R-S-T" />
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <h1 className="text-gray-800 dark:text-gray-400">Ampere R-S</h1>
                  <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
                    <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                    123
                    </h1>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 dark:text-gray-400">Ampere S-T</h1>
                  <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
                    <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                    123
                    </h1>
                  </div>
                </div>
                <div>
                  <h1 className="text-gray-800 dark:text-gray-400">Ampere T-R</h1>
                  <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
                    <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                    123
                    </h1>
                  </div>
                </div>
              </div>
              {/* <LineChart title="Voltage R-S-T" /> */}

            </div>
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
            
              <div className="bg-slate-50 px-3 rounded-lg lg:col-span-4 dark:bg-slate-800">
                <AreaChart title="Oil Pressure" unit="Bar" />
              </div>
              <div className="flex w-full items-center justify-center">
                  <h1 className="text-center text-6xl font-bold text-gray-800 dark:text-gray-400">
                    200
                  </h1>
              </div>
          
            </div>
        

          </div>
          

        </section>
        <section className="relative rounded-xl bg-white border border-slate-200 dark:bg-gray-900 dark:border-gray-700 p-4 shadow-sm">
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ValueRealtime />
          </div>
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm">Pilot Pump</div>
           <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 p-3 col-span-4 rounded-lg">
              <LineChart title="Ampere R-S-T" />
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-gray-800 dark:text-gray-400">Ampere R-S</h1>
                <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
                  <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                  123
                  </h1>
                </div>
              </div>
              <div>
                <h1 className="text-gray-800 dark:text-gray-400">Ampere S-T</h1>
                <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
                  <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                  123
                  </h1>
                </div>
              </div>
              <div>
                <h1 className="text-gray-800 dark:text-gray-400">Ampere T-R</h1>
                <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
                  <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
                  123
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="bg-slate-50 px-3 rounded-lg lg:col-span-4 dark:bg-slate-800">
              <AreaChart title="Oil Pressure" unit="Bar" />
            </div>
            <div className="flex w-full items-center justify-center">
              <h1 className="text-center text-6xl font-bold text-gray-800 dark:text-gray-400">
                200
              </h1>
            </div>
          </div>
      

        </section>


      </div>
  
    </div>
  );
}
