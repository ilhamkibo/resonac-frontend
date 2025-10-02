import { z } from 'zod';

// Skema untuk membuat produk baru (payload untuk POST/PUT)
export const createProductSchema = z.object({
  name: z.string().min(3, "Nama produk minimal 3 karakter"),
  price: z.number().positive("Harga harus angka positif"),
  description: z.string().optional(),
});

// Skema untuk data produk yang diterima dari API (respons GET)
export const productSchema = createProductSchema.extend({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
});

// Skema untuk array produk
export const productsSchema = z.array(productSchema);

// Infer tipe TypeScript dari skema Zod
export type CreateProductPayload = z.infer<typeof createProductSchema>;
export type Product = z.infer<typeof productSchema>;