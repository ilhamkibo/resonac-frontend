import { MeasurementDashboardSchema } from "@/validations/measurementSchema";
import z from "zod";

export type MeasurementDashboard = z.infer<typeof MeasurementDashboardSchema>;