import { ThresholdSchema, UpdateThresholdSchema } from "@/validations/thresholdSchema";
import z from "zod";

export type Threshold = z.infer<typeof ThresholdSchema>
export type UpdateThresholdInput = z.infer<typeof UpdateThresholdSchema>