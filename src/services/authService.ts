import { api } from "@/lib/api-client";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginService(payload: LoginPayload) {
  const res = await api.post("/api/login", payload);
  return res.data; // misal { token: "...", user: {...} }
}

export async function getProfileService() {
  const res = await api.get("/auth/profile");
  return res.data;
}
