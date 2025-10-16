"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import HistoryTable from "@/components/input-manual/HistoryTable";
import SaveButton from "@/components/input-manual/SaveButton";
import { AmpereCardGroup } from "@/components/input-manual/AmpereCardGroup";
import { OilPressureCard } from "@/components/input-manual/OilPressureCard";
import { OilTemperatureCard } from "@/components/input-manual/OilTemperatureCard";

type Row = {
  id: number;
  time: string;
  oilPressMain: number;
  oilPressPilot: number;
  operator: string;
  mainR: number;
  mainS: number;
  mainT: number;
  pilotR: number;
  pilotS: number;
  pilotT: number;
  oilTemp: number;
};

export default function Page() {
  const [pilotValue, setPilotValue] = useState<number>(5.5);
  const [tableData, setTableData] = useState<Row[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const handleSaveData = () => {
    const now = new Date();
    const timeString = now.toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const newEntry: Row = {
      id: tableData.length + 1,
      time: timeString,
      oilPressMain: parseFloat(pilotValue.toFixed(1)),
      oilPressPilot: parseFloat(pilotValue.toFixed(1)),
      operator: "OperatorX",
      mainR: 24.5,
      mainS: 22.1,
      mainT: 20.8,
      pilotR: 23.8,
      pilotS: 21.9,
      pilotT: 19.6,
      oilTemp: 40,
    };

    setTableData((prev) => [newEntry, ...prev].slice(0, 10)); // max 10 rows
    setLastSaved(`${timeString} oleh OperatorX`);
    toast.success("Data berhasil disimpan!");
  };

  return (
    <div className="p-6">
      <Toaster position="top-center" richColors />

      <div className="grid md:grid-cols-2 gap-4">
        <AmpereCardGroup
          title="Main Pump"
          data={[
            { label: "R", value: 24.5 },
            { label: "S", value: 22.1 },
            { label: "T", value: 20.8 },
          ]}
        />
        <AmpereCardGroup
          title="Pilot Pump"
          data={[
            { label: "R", value: 23.8 },
            { label: "S", value: 21.9 },
            { label: "T", value: 19.6 },
          ]}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        {/* Pass setPilotValue only if you want the card to be able to change the value */}
        <OilPressureCard value={pilotValue} onChange={setPilotValue} />
        <OilTemperatureCard />
      </div>

      <div className="mt-6">
        <SaveButton onSave={handleSaveData} lastSavedText={lastSaved} />
      </div>

      <div className="mt-6">
        <HistoryTable tableData={tableData} />
      </div>
    </div>
  );
}
