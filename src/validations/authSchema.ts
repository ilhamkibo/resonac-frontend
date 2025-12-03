import { z } from 'zod';

// Skema ini mendefinisikan bentuk data yang akan divalidasi oleh form.
export const authSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal harus 6 karakter')
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Name minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal harus 6 karakter')
});

// Mengekspor tipe data dari skema untuk digunakan di komponen form Anda.
// Ini memastikan type safety antara Zod dan React Hook Form.
export type LoginPayload = z.infer<typeof authSchema>;
export type RegisterPayload = z.infer<typeof registerSchema>;