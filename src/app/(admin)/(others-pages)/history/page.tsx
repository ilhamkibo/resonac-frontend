import HistoryDashboard from "@/components/history/HistoryDashboard";
import { measurementService } from "@/services/measurementService";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const initialDashboard = await measurementService.getMeasurementsAggregateData({
    areas: "main",
    period: "day",
  });

  return (
    <div className="w-full">
      <HistoryDashboard initialDashboard={initialDashboard} />;
    </div>

  ) 
}
