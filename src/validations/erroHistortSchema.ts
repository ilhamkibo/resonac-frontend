import z from "zod";

export const ErrorHistorySchema = z.object({
  id: z.number(),
  timestamp: z.string().datetime(),
  area: z.string(),
  parameter: z.string(),
  value: z.number(),
});

export const ErrorHistoryResponseSchema = z.object({
  data: z.array(ErrorHistorySchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  })
});

export const ErrorHistoryCompareSchema = z.object({
    weekly: z.object({
      thisWeek: z.number(),
      lastWeek: z.number(),
    }),
    monthly: z.object({
      thisMonth: z.number(),
      lastMonth: z.number(),
    })
});
