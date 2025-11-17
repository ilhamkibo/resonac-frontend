import ManualInputDashboard from "@/components/input-manual/ManualInputDashboard";
import SkeletonDashboard from "@/components/input-manual/SkeletonDashboard";
import { manualInputService } from "@/services/manualInputService";
import { thresholdService } from "@/services/thresholdService";
import { Suspense } from "react";

export default async function Page() {
  const thresholds = await thresholdService.getAllThreshold();
  const historyInputManualData = await manualInputService.getManualInputs({
    page: 1,
    limit: 10,
    period: "monthly",
  });

  return (
    <Suspense fallback={<SkeletonDashboard />}>
      <ManualInputDashboard
        thresholds={thresholds}
        initialManualInputs={historyInputManualData}
      />
    </Suspense>
  );
}
