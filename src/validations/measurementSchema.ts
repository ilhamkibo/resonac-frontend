import { z } from "zod";

export const MeasurementSchema = z.object({
  bucket: z.string(),
  area: z.string(),
  ampere_rs_avg: z.number().nullable(),
  ampere_rs_max: z.number().nullable(),
  ampere_st_avg: z.number().nullable(),
  ampere_st_max: z.number().nullable(),
  ampere_tr_avg: z.number().nullable(),
  ampere_tr_max: z.number().nullable(),
  volt_rs_avg: z.number().nullable(),
  volt_rs_max: z.number().nullable(),
  volt_st_avg: z.number().nullable(),
  volt_st_max: z.number().nullable(),
  volt_tr_avg: z.number().nullable(),
  volt_tr_max: z.number().nullable(),
  oil_pressure_avg: z.number().nullable(),
  oil_pressure_max: z.number().nullable(),
  oil_temperature_avg: z.number().nullable(),
  oil_temperature_max: z.number().nullable(),
  pf_avg: z.number().nullable(),
  pf_max: z.number().nullable(),
  kwh_avg: z.number().nullable(),
  kwh_max: z.number().nullable(),
});

export const MeasurementDashboardSchema = z.object({
  id: z.number(),
  timestamp: z.string().datetime(),
  area: z.string().nullable(),
  ampere_rs: z.number().nullable(),
  ampere_st: z.number().nullable(),
  ampere_tr: z.number().nullable(),
  volt_rs: z.number().nullable(),
  volt_st: z.number().nullable(),
  volt_tr: z.number().nullable(),
  pf: z.number().nullable(),
  kwh: z.number().nullable(),
  oil_pressure: z.number().nullable(),
  oil_temperature: z.number().nullable(),
})

export const measurementListSchema = z.array(MeasurementSchema);
