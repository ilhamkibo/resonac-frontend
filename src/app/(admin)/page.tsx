import type { Metadata } from "next";
import React from "react";
import DailyInfo from "@/components/dashboard/DailyInfo";
import OilTemperature from "@/components/dashboard/OilTemperature";
import SectionArea from "@/components/dashboard/SectionArea";
import PumpArea from "@/components/dashboard/PumpArea";

export const metadata: Metadata = {
  title:
    "Utility Dashboard | Resonac Utility Monitoring",
  description: "Resonac Realtime Utility Monitoring Dashboard"
};

export default function Page() {
  const pumps = [
    { key: "main", label: "Main Pump" },
    { key: "pilot", label: "Pilot Pump" },
  ] as const;

  return (
    <div>
      <div className="mt-4 shadow-sm bg-white dark:bg-gray-800 p-4 rounded-xl">
        <OilTemperature />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4 mt-6">
        {pumps.map((pump) => (
        <SectionArea key={pump.key} area={pump.label}>
          <PumpArea type={pump.key as "main" | "pilot"} />
        </SectionArea>
      ))}
      </div>
  
    </div>
  );
}
