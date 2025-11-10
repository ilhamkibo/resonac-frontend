import { z } from 'zod';
import { PaginationSchema } from '@/types/apiType';
// Schema for a single user
export const UserSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'operator']),
  isApproved: z.boolean(),
  createdAt: z.string().datetime().optional(),
});

// Skema untuk memvalidasi query parameter
export const UserQuerySchema = z.object({
    status: z.enum(['approved', 'unapproved']).optional(),
    role: z.enum(['operator', 'admin']).optional(),
    page: z.string().optional().default('1'),
    limit: z.string().optional().default('10'),
});

// Skema untuk update user
export const UpdateUserSchema = z.object({
    email: z.string().email('Email tidak valid.').optional(),
    name: z.string().min(3, 'Nama minimal 3 karakter.').optional(),
    role: z.enum(['operator', 'admin']).optional(),
    isApproved: z.boolean().optional(),
});

// Schema for the API response when getting all users
export const UserResponseSchema = z.object({
  data: z.array(UserSchema),
  pagination: PaginationSchema
});

// Schema for the user stats
export const UserStatsSchema = z.object({
  userCount: z.number(),
  approvedUserCount: z.number(),
  unapprovedUserCount: z.number(),
});

