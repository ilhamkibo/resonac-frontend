import { env } from "./env";
import axios from "axios";

export const api = axios.create({
  baseURL: env.BASE_URL,
  withCredentials: true, // penting kalau API pakai cookie session
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchChartData(endpoint: string, params?: Record<string, string>) {
  const url = new URL(`${env.BASE_URL}/${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, val]) => url.searchParams.append(key, val));
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch " + endpoint);
  return res.json();
}