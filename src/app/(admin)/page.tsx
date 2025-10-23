// app/dashboard/page.tsx

import type { Metadata } from "next";
import React from "react";

// ✅ 1. Impor service yang dibutuhkan di level server
import { measurementService } from "@/services/measurementService";
import { thresholdService } from "@/services/thresholdService";

// Impor komponen-komponen anak
import OilTemperature from "@/components/dashboard/OilTemperature";
import PumpArea from "@/components/dashboard/PumpArea";

// Metadata tetap di sini
export const metadata: Metadata = {
  title: "Utility Dashboard | Resonac Utility Monitoring",
  description: "Resonac Realtime Utility Monitoring Dashboard",
};

// ✅ 2. Ubah menjadi async function untuk fetching data
export default async function Page() {
  // ✅ 3. Ambil semua data awal secara paralel untuk efisiensi
  const getDashboardData = async (area: string) => {
    const [measurements, thresholds] = await Promise.all([
      measurementService.getMeasurementsDashboardData(area),
      thresholdService.getAllThreshold(area),
    ]);
    return { measurements, thresholds };
  };

  const [
    initialOilData,
    initialMainPumpData,
    initialPilotPumpData,
  ] = await Promise.all([
    getDashboardData("oil"),
    getDashboardData("main"),
    getDashboardData("pilot"),
  ]);

  return (
    <div>
      <div className="mt-4 shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
        {/* ✅ 4. Lewatkan data awal sebagai props */}
        <OilTemperature
          initialMeasurements={initialOilData.measurements}
          initialThresholds={initialOilData.thresholds}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mt-8">
        <section className="relative rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 border border-slate-200 p-4 shadow-sm">
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-xl">
            Main Pump
          </div>
          {/* ✅ 4. Lewatkan data awal sebagai props */}
          <PumpArea
            type={"main"}
            initialMeasurements={initialMainPumpData.measurements}
            initialThresholds={initialMainPumpData.thresholds}
          />
        </section>
        
        <section className="relative rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700 border border-slate-200 p-4 shadow-sm">
          <div className="absolute dark:text-white text-gray-800 dark:bg-gray-800 dark:border-gray-700 left-4 top-0 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-black/5 font-semibold text-xl">
            Pilot Pump
          </div>
          {/* ✅ 4. Lewatkan data awal sebagai props */}
          <PumpArea
            type={"pilot"}
            initialMeasurements={initialPilotPumpData.measurements}
            initialThresholds={initialPilotPumpData.thresholds}
          />
        </section>
      </div>
    </div>
  );
}