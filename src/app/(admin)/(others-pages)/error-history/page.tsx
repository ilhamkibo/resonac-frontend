import DataErrorTable from "@/components/error-history/DataErrorTable";
import HistoryCompareCard from "@/components/error-history/HistoryCompareCard";
import { errorHistoryService } from "@/services/errorHistoryService";
import React from "react";

export default async function Page() {

  const compareData = await errorHistoryService.getErrorHistoryCompare();
  const errorData = await errorHistoryService.getErrorHistory({page: "1", limit: "10", period: "monthly"});
  
  return (
    <div className="p-6">
      <HistoryCompareCard {...compareData.data} />
      <DataErrorTable {...errorData} />
    </div>
  );
}
