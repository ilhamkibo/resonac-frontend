"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import HistoryTable from "@/components/input-manual/HistoryTable";
import SaveButton from "@/components/input-manual/SaveButton";
import { AmpereCardGroup } from "@/components/input-manual/AmpereCardGroup";
import { OilPressureCard } from "@/components/input-manual/OilPressureCard";
import { OilTemperatureCard } from "@/components/input-manual/OilTemperatureCard";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { RealtimeData } from "@/types/mqtt";

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
  const mqttData = useMqttSubscription<{realtime: RealtimeData}>("toho/resonac/value");


  const initialTableData: Row[] = []; // contoh: await getHistoryData();


  return (
    <div className="p-6">

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
        <SaveButton mqttData={mqttData?.realtime} />
      </div>

      <div className="mt-6">
        <HistoryTable tableData={tableData} />
      </div>
    </div>
  );
}
