import z from "zod";
import { AreaParameterSchema, ErrorHistoryCompareSchema, ErrorHistoryQuerySchema, ErrorHistoryResponseSchema, ErrorHistorySchema, ParameterInAreaSchema } from "@/validations/erroHistortSchema";

export type ErrorHistory = z.infer<typeof ErrorHistorySchema>;
export type ErrorHistoryResponse = z.infer<typeof ErrorHistoryResponseSchema>;
export type ErrorHistoryCompare = z.infer<typeof ErrorHistoryCompareSchema>;
export type ErrorHistoryQuery = z.infer<typeof ErrorHistoryQuerySchema>;
export type AreaParameter = z.infer<typeof AreaParameterSchema>;
export type ParameterInArea = z.infer<typeof ParameterInAreaSchema>;