import HistoryCompareCard from "@/components/error-history/HistoryCompareCard";
import { errorHistoryService } from "@/services/errorHistoryService";
import React from "react";

export default async function Page() {

  const compareData = await errorHistoryService.getErrorHistoryCompare();

  return (
    <div className="p-6">
      <HistoryCompareCard {...compareData.data} />
    </div>
  );
}
