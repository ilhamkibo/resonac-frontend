import { UpdateUserSchema, UserPayloadSchema, UserQuerySchema, UserResponseSchema, UserSchema, UserStatsSchema } from "@/validations/userSchema";
import z from "zod";

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type UserQuery = z.infer<typeof UserQuerySchema>;
export type UserPayload = z.infer<typeof UserPayloadSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
