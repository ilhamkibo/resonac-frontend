"use server";

import { loginService } from "@/services/authService";
import { setAuthCookie, clearAuthCookie } from "@/lib/auth";

export async function loginAction(email: string, password: string) {
  try {
    const data = await loginService({ email, password });

    // simpan token ke cookie
    if (data?.token) {
      await setAuthCookie(data.token);
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Login failed" };
  }
}

export async function logoutAction() {
  await clearAuthCookie();
}
