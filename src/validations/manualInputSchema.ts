import { PaginationSchema } from "@/types/apiType";
import z from "zod";

export const ManualInputDetailsSchema = z.object({
    id: z.number(),
    manualInputId: z.number(),
    area: z.enum(['main', 'pilot', 'oil']),
    ampere_r: z.number().nullable(),
    ampere_s: z.number().nullable(),
    ampere_t: z.number().nullable(),
    volt_r: z.number().nullable(),
    volt_s: z.number().nullable(),
    volt_t: z.number().nullable(),
    pf: z.number().nullable(),
    kwh: z.number().nullable(),
    oil_pressure: z.number().nullable(),
    oil_temperature: z.number().nullable(),
})

export const ManualInputTableSchema = z.object({
    id: z.number(),
    time: z.string().datetime(),
    operator: z.string(),
    oilPressMain: z.number().nullable(),
    oilPressPilot: z.number().nullable(),
    mainR: z.number().nullable(),
    mainS: z.number().nullable(),
    mainT: z.number().nullable(),
    pilotR: z.number().nullable(),
    pilotS: z.number().nullable(),
    pilotT: z.number().nullable(),
    oilTemp: z.number().nullable(),  
});

export const ManualInputSchema = z.object({
    id: z.number(),
    username: z.string(),
    timestamp: z.string().datetime(),
    details: z.array(ManualInputDetailsSchema),
})

export const ManualInputQueryCsvSchema = z.object({
    period: z.enum(['daily', 'weekly', 'monthly']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    userId: z.number().optional(),
    area: z.enum(['main', 'pilot', 'oil']).optional(),
})

export const ManualInputQuerySchema = z.object({
    period: z.enum(['daily', 'weekly', 'monthly']).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    userId: z.number().optional(),
    area: z.enum(['main', 'pilot', 'oil']).optional(),
    page: z.number().optional().default(1),
    limit: z.number().optional().default(10),
})

export const ManualInputResponseSchema = z.object({
    data: z.array(ManualInputSchema),
    meta: PaginationSchema
});