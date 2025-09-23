import { env } from "./env";

export async function fetchChartData(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${env.BASE_URL}/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, val]) => url.searchParams.append(key, val));
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch " + endpoint);
  return res.json();
}