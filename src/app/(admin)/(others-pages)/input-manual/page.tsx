// app/input-manual/page.tsx
// ✅ Ini adalah Server Component (TIDAK ADA "use client")

import { manualInputService } from "@/services/manualInputService"; // (Asumsi)
import { thresholdService } from "@/services/thresholdService"; // (Asumsi)
import ManualInputDashboard from "@/components/input-manual/ManualInputDashboard"; // Komponen Klien BARU

// Fungsi untuk mengambil data di server
async function getHistoryData() {
  try {
    // Ganti ini dengan fungsi Anda, misal: mengambil 20 data terakhir
    const history = await manualInputService.getManualInputs(1, 20); 
    return history; 
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return []; // Kembalikan array kosong jika gagal
  }
}

async function getThresholds() {
   try {
    const thresholds = await thresholdService.getAllThreshold();
    return thresholds;
  } catch (error) {
    console.error("Failed to fetch thresholds:", error);
    // Kembalikan nilai default jika gagal
    return {
      mainPump: { min: 10, max: 30 },
      pilotPump: { min: 5, max: 20 },
      oil: { tempMax: 60, pressureMin: 2.0 }
    };
  }
}


// Komponen Halaman (Server)
export default async function Page() {
  
  // 1. Ambil data di server saat request halaman
  const initialTableData = await getHistoryData();
  console.log("🚀 ~ Page ~ initialTableData:", initialTableData)
  const thresholdData = await getThresholds();

  // 2. Render komponen KLIEN dan teruskan data sebagai props
  return (
    <ManualInputDashboard 
      initialTableData={initialTableData} 
      thresholdData={thresholdData} 
    />
  );
}