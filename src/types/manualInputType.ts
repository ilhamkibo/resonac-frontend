import { ManualInputDetailsSchema, ManualInputQueryCsvSchema, ManualInputQuerySchema, ManualInputResponseSchema, ManualInputSchema, ManualInputTableSchema } from "@/validations/manualInputSchema";
import z from "zod";


export type ManualInput = z.infer<typeof ManualInputSchema>;
export type ManualInputDetails = z.infer<typeof ManualInputDetailsSchema>;
export type ManualInputQuery = z.infer<typeof ManualInputQuerySchema>;
export type ManualInputResponse = z.infer<typeof ManualInputResponseSchema>;
export type ManualInputTable = z.infer<typeof ManualInputTableSchema>;
export type ManualInputQueryCsv = z.infer<typeof ManualInputQueryCsvSchema>;