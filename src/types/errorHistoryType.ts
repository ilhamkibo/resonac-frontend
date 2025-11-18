import z from "zod";
import { ErrorHistoryCompareSchema, ErrorHistoryResponseSchema, ErrorHistorySchema } from "@/validations/erroHistortSchema";

export type ErrorHistory = z.infer<typeof ErrorHistorySchema>;
export type ErrorHistoryResponse = z.infer<typeof ErrorHistoryResponseSchema>;
export type ErrorHistoryCompare = z.infer<typeof ErrorHistoryCompareSchema>;

