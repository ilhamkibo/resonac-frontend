import type { Metadata } from "next";
import React from "react";
import DailyInfo from "@/components/dashboard/DailyInfo";
import MainAmpere from "@/components/dashboard/main/MainAmpere";
import MainVolt from "@/components/dashboard/main/MainVolt";
import MainPowerFactor from "@/components/dashboard/main/MainPowerFactor";
import MainKwh from "@/components/dashboard/main/MainKwh";
import MainOilPressure from "@/components/dashboard/main/MainOilPressure";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div>
      <div className="mb-4">
        <DailyInfo />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 mt-6">

        <section className="relative rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm">Main Pump</div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MainAmpere />
            <MainVolt />
            <MainPowerFactor />
          </div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          
            <MainKwh />
            <MainOilPressure />
          </div>
          

        </section>
        <section className="relative rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-sm">Pilot Pump</div>
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <MainAmpere />
            <MainVolt />
            <MainPowerFactor />
          </div>
        </section>


      </div>
    </div>
  );
}
