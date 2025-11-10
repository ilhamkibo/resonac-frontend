import { thresholdService } from "@/services/thresholdService"; // (Asumsi)
import ManualInputDashboard from "@/components/input-manual/ManualInputDashboard"; // Komponen Klien BARU

export default async function Page() {
  
  const thresholdData = await thresholdService.getAllThreshold();

  return (
    <ManualInputDashboard 
      thresholds={thresholdData} 
    />
  );
}