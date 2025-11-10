import { UpdateUserSchema, UserQuerySchema, UserResponseSchema, UserSchema, UserStatsSchema } from "@/validations/userSchema";
import z from "zod";
import { ApiResponseWrapper } from "./apiType";


export type ApiUserResponseWrapper = ApiResponseWrapper<UserResponse>;
export type ApiStatsResponseWrapper = ApiResponseWrapper<UserStats>;

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserStats = z.infer<typeof UserStatsSchema>;
export type UserQuery = z.infer<typeof UserQuerySchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
