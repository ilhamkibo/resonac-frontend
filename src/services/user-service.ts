import { apiClient } from "@/lib/api-client";
import { z } from "zod";
import { CreateUserInput, CreateUserSchema, UserSchema } from "@/validations/user";

export async function getUsers() {
  const data = await apiClient<unknown>("/users", {
    method: "GET",
  });
  return z.array(UserSchema).parse(data);
}

export async function createUser(input: CreateUserInput) {
  // validasi sebelum kirim
  const parsed = CreateUserSchema.parse(input);

  const data = await apiClient<unknown>("/users", {
    method: "POST",
    data: parsed, // ✅ axios pakai `data`, bukan `body`
  });

  return UserSchema.parse(data);
}
