import z from "zod";
import { ThresholdSchema } from "./thresholdSchema";
import { PaginationSchema } from "@/types/apiType";

export const ErrorHistorySchema = z.object({
  id: z.number(),
  timestamp: z.string().datetime(),
  area: z.string(),
  threshold: ThresholdSchema,
  parameter: z.string(),
  value: z.number(),
  status: z.string(),
});

export const ErrorHistoryResponseSchema = z.object({
  data: z.array(ErrorHistorySchema),
  meta: PaginationSchema
});

// ===== NEW SCHEMAS FOR COMPARISON =====

const AreaCountSchema = z.object({
  area: z.string().nullable(),
  count: z.number(),
});

const ParameterCountSchema = z.object({
  parameter: z.string().nullable(),
  count: z.number(),
});

export const ParameterInAreaSchema = z.object({
  parameter: z.string().nullable(),
  count: z.number(),
});

export const AreaParameterSchema = z.object({
  area: z.string().nullable(),
  total: z.number(),
  parameters: z.array(ParameterInAreaSchema),
});

export const ErrorHistoryCompareSchema = z.object({
  weekly: z.object({
    thisWeek: z.number(),
    lastWeek: z.number(),
  }),
  monthly: z.object({
    thisMonth: z.number(),
    lastMonth: z.number(),
  }),
  details: z.object({
    byArea: z.array(AreaCountSchema),
    byParameter: z.array(ParameterCountSchema),
    byAreaParameter: z.array(AreaParameterSchema),
  }),
});

export const ErrorHistoryQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  period: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  area: z.string().optional(),
  parameter: z.string().optional(),
});