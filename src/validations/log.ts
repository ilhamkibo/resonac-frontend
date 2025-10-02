import { z } from "zod";

export const LogSchema = z.object({
  id: z.number(),
  timestamp: z.string().transform((val) => new Date(val)),
  ampere_rs: z.number(),
  ampere_st: z.number(),
  ampere_tr: z.number(),
  volt_rs: z.number(),
  volt_st: z.number(),
  volt_tr: z.number(),
  pf: z.number(),
  kwh: z.number(),
  oil_pressure: z.number(),
  oil_temperature: z.number(),
});

export type Log = z.infer<typeof LogSchema>;
