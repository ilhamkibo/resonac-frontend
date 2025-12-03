import { PaginationSchema } from "@/types/apiType";
import { z } from "zod";

export const MeasurementSchema = z.object({
  timestamp: z.string().datetime(),
  ampere_rs: z.number().optional(),
  ampere_st: z.number().optional(),
  ampere_tr: z.number().optional(),
  volt_rs: z.number().optional(),
  volt_st: z.number().optional(),
  volt_tr: z.number().optional(),
  pf: z.number().optional(),
  kwh: z.number().optional(),
  oil_pressure: z.number().optional(),
  oil_temperature: z.number().optional(),
})

export const AggregatedDataSchema = z.record(
  z.string(), // nama area: "main", "pilot", dll.
  z.array(MeasurementSchema)
);

export const AggregatedDataResponseSchema = z.object({
  meta: PaginationSchema,
  data: AggregatedDataSchema,
});

export const MeasurementDashboardSchema = z.object({
  id: z.number().optional(),
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
});

export const MeasurementAggregatedQuerySchema = z.object({
  aggregationType: z.enum(['avg', 'max', 'min']).optional(),
  period: z.enum(['hour', 'day', 'week', 'month']).optional(),
  startDate: z
    .string()
    .optional(),
  endDate: z
    .string()
    .optional(),
  areas: z
    .string()
    // .transform((val) => val.split(","))
    // .pipe(z.array(z.enum(["main", "pilot", "oil"])))
    .optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
}).refine((data) => {
  if(data.aggregationType) {
    return (
      (data.period && !data.startDate && !data.endDate) ||
      (!data.period && data.startDate && data.endDate)
    );
  }
  return true;
},
{
  message: "When aggregation type is set, either period or start date and end date must be set",
  path: ['period', 'startDate', 'endDate'],
})
