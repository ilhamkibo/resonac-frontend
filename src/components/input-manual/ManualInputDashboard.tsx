// components/input-manual/ManualInputDashboard.tsx
"use client"; // ✅ INI adalah Client Component

import { useState } from "react";
import HistoryTable from "@/components/input-manual/HistoryTable";
import SaveButton from "@/components/input-manual/SaveButton";
import { AmpereCardGroup } from "@/components/input-manual/AmpereCardGroup";
import { OilPressureCard } from "@/components/input-manual/OilPressureCard";
import { OilTemperatureCard } from "@/components/input-manual/OilTemperatureCard";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { RealtimeData } from "@/types/mqttType";
import { useAuth } from "@/hooks/useAuth";

// Tentukan tipe props yang diterima dari Server Component
type Row = { /* ... Tipe Row Anda ... */ };
type Thresholds = { /* ... Tipe Thresholds Anda ... */ };

interface DashboardProps {
  initialTableData: Row[];
  thresholdData: Thresholds;
}

export default function ManualInputDashboard({ 
  initialTableData, 
  thresholdData 
}: DashboardProps) {

  // 1. 'tableData' diinisialisasi dengan data dari server
  const [tableData, setTableData] = useState<Row[]>(initialTableData);
  
  // 2. Logika client-side (MQTT, Auth) tetap di sini
  const mqttData = useMqttSubscription<{realtime: RealtimeData}>("toho/resonac/value");
  const { user } = useAuth();

  // 3. Fungsi untuk update tabel (seperti sebelumnya)
  const handleSaveSuccess = (savedData: RealtimeData, savedTime: string) => {
    const newRow: Row = {
      id: new Date().getTime(), // (Atau ID dari respons server)
      time: new Date(savedTime).toLocaleString('id-ID'),
      operator: user?.name || "Unknown",
      oilPressMain: savedData.main.oil_pressure,
      oilPressPilot: savedData.pilot.oil_pressure,
      mainR: savedData.main.ampere_r,
      mainS: savedData.main.ampere_s,
      mainT: savedData.main.ampere_t,
      pilotR: savedData.pilot.ampere_r,
      pilotS: savedData.pilot.ampere_s,
      pilotT: savedData.pilot.ampere_t,
      oilTemp: savedData.oil.temperature,
    };
    setTableData(prevData => [newRow, ...prevData]);
  };

  // 4. Render layout (sama seperti page.tsx Anda sebelumnya)
  return (
    <div className="p-6">
      
      <div className="grid md:grid-cols-2 gap-4">
        <AmpereCardGroup
          title="Main Pump"
          data={[
            { label: "R", value: mqttData?.realtime?.main?.ampere_r },
            { label: "S", value: mqttData?.realtime?.main?.ampere_s },
            { label: "T", value: mqttData?.realtime?.main?.ampere_t },
          ]}
          // 5. Teruskan threshold ke kartu
          thresholds={thresholdData.mainPump} 
        />
        <AmpereCardGroup
          title="Pilot Pump"
          data={[
             { label: "R", value: mqttData?.realtime?.pilot?.ampere_r },
             { label: "S", value: mqttData?.realtime?.pilot?.ampere_s },
             { label: "T", value: mqttData?.realtime?.pilot?.ampere_t },
          ]}
          thresholds={thresholdData.pilotPump}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <OilPressureCard 
          value={mqttData?.realtime?.main?.oil_pressure} 
          title="Main Oil Pressure"
          thresholds={thresholdData.oil} // (Sesuaikan)
        />
        <OilTemperatureCard 
          value={mqttData?.realtime?.oil?.temperature} 
          thresholds={thresholdData.oil} // (Sesuaikan)
        />
      </div>

      <div className="mt-6">
        <SaveButton 
          mqttData={mqttData?.realtime} 
          onSaveSuccess={handleSaveSuccess} 
        />
      </div>

      <div className="mt-6">
        {/* 6. Tabel diisi dengan state yang sudah diinisialisasi */}
        <HistoryTable tableData={tableData} />
      </div>
      
    </div>
  );
}