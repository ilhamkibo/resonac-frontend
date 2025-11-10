import { ThresholdResponseSchema, ThresholdSchema, UpdateThresholdSchema } from "@/validations/thresholdSchema";
import z from "zod";
import { ApiResponseWrapper } from "./apiType";

export type ApiThresholdResponseWrapper = ApiResponseWrapper<ThresholdResponse>;

export type Threshold = z.infer<typeof ThresholdSchema>
export type ThresholdResponse = z.infer<typeof ThresholdResponseSchema>
export type UpdateThresholdInput = z.infer<typeof UpdateThresholdSchema>