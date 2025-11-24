import { MeasurementDashboardSchema, MeasurementSchema, MeasurementAggregatedQuerySchema, AggregatedDataResponseSchema, AggregatedDataSchema } from "@/validations/measurementSchema";
import z from "zod";

export type MeasurementDashboard = z.infer<typeof MeasurementDashboardSchema>;
export type MeasurementSchema = z.infer<typeof MeasurementSchema>;
export type MeasurementAggregatedQuery = z.infer<typeof MeasurementAggregatedQuerySchema>;
export type AggregatedDataResponse = z.infer<typeof AggregatedDataResponseSchema>;
export type AggregatedDataSchema = z.infer<typeof AggregatedDataSchema>;