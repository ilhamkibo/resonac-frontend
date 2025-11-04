import { Pagination } from '@/types/apiType';
import { z } from 'zod';

// Skema untuk memvalidasi query parameter
export const userQuerySchema = z.object({
    status: z.enum(['approved', 'unapproved']).optional(),
    role: z.enum(['operator', 'admin']).optional(),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
});

// Skema untuk update user
export const updateUserSchema = z.object({
    email: z.string().email('Email tidak valid.').optional(),
    name: z.string().min(3, 'Nama minimal 3 karakter.').optional(),
    role: z.enum(['operator', 'admin']).optional(),
    isApproved: z.boolean().optional(),
});

// Tipe TypeScript dari Skema Zod
export type UserQuery = z.infer<typeof userQuerySchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
