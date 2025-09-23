"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchChartData } from "@/lib/api";

export function useChart(endpoint: string, params?: Record<string, string>) {
  return useQuery({
    queryKey: ["chart", endpoint, params],
    queryFn: () => fetchChartData(endpoint, params),
    refetchInterval: 5000, // auto refresh tiap 5s
  });
}
