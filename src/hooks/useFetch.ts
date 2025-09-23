// "use client";
// import { useQuery } from "@tanstack/react-query";
// import { fetchHistory, fetchLatest } from "@/lib/api";

// // history data
// export function useHistory() {
//   return useQuery({
//     queryKey: ["history"],
//     queryFn: fetchHistory,
//     refetchOnWindowFocus: false,
//     staleTime: 1000 * 60, // 1 menit
//   });
// }

// // latest data (polling tiap 5s)
// export function useLatest() {
//   return useQuery({
//     queryKey: ["latest"],
//     queryFn: fetchLatest,
//     refetchInterval: 5000,
//   });
// }
