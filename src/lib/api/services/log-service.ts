import { apiClient } from "@/lib/api-client";
import { LogSchema } from "../../../validations/log";
import { z } from "zod";

export async function getLogs() {
  const data = await apiClient<unknown>("/logs", { method: "GET" });
  return z.array(LogSchema).parse(data);
}

export async function createLog(payload: {
  ampere_rs: number;
  ampere_st: number;
  ampere_tr: number;
  volt_rs: number;
  volt_st: number;
  volt_tr: number;
  pf: number;
  kwh: number;
  oil_pressure: number;
  oil_temperature: number;
}) {
  const data = await apiClient<unknown>("/logs", {
    method: "POST",
    data: payload,
  });
  return LogSchema.parse(data);
}
