import z from "zod";

export const createUserSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.email(),
    password: z.string().min(6, "Password minimal 6 karakter"),
});

export const userSchema = z.strictObject({
    name: z.string(),
    email: z.email()
});

export const loginSchema = z.object({
    email: z.string().min(1, "Email wajib diisi.").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
     message: "Format email tidak valid",
    }),
    password: z.string().min(1, {
        message: "Password wajib diisi."
    }),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;