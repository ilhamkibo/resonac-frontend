import { z } from 'zod';

// Skema ini mendefinisikan bentuk data yang akan divalidasi oleh form.
export const authSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z
    .string()
    .min(6, 'Password minimal harus 6 karakter')
  });

// Mengekspor tipe data dari skema untuk digunakan di komponen form Anda.
// Ini memastikan type safety antara Zod dan React Hook Form.
export type LoginPayload = z.infer<typeof authSchema>;