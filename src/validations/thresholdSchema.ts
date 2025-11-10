import {z} from "zod";

export const ThresholdSchema = z.object({
    id: z.number(),
    area: z.string(),
    parameter: z.string(),
    lowerLimit: z.number(),
    upperLimit: z.number(),
    createdAt: z.string(),
})

export const UpdateThresholdSchema = z.object({
    area: z.string().optional(),
    parameter: z.string().optional(),
    lowerLimit: z.number().optional(),
    upperLimit: z.number().optional(),
})

export const ThresholdResponseSchema = z.array(ThresholdSchema);
