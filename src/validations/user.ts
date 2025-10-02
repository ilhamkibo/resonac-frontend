// validations/user.ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
}).strict();

export const CreateUserSchema = z.object({
  name: z.string().min(3, "Name minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
