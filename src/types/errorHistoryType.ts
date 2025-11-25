import z from "zod";
import { AreaParameterSchema, ErrorHistoryCompareSchema, ErrorHistoryQuerySchema,ErrorHistoryCsvQuerySchema, ErrorHistoryResponseSchema, ErrorHistorySchema, ParameterInAreaSchema } from "@/validations/erroHistortSchema";

export type ErrorHistory = z.infer<typeof ErrorHistorySchema>;
export type ErrorHistoryResponse = z.infer<typeof ErrorHistoryResponseSchema>;
export type ErrorHistoryCompare = z.infer<typeof ErrorHistoryCompareSchema>;
export type ErrorHistoryQuery = z.infer<typeof ErrorHistoryQuerySchema>;
export type ErrorHistoryCsvQuery = z.infer<typeof ErrorHistoryCsvQuerySchema>;
export type AreaParameter = z.infer<typeof AreaParameterSchema>;
export type ParameterInArea = z.infer<typeof ParameterInAreaSchema>;