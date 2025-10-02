import axios, { AxiosRequestConfig } from "axios";
import { refreshTokenService } from "@/lib/api/services/auth-service";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true, // ⬅️ penting: biar cookie dikirim otomatis
});

// Tidak perlu interceptor request untuk inject token manual
// karena token sudah tersimpan di cookie (httpOnly)

// Interceptor: refresh token kalau expired
let isRefreshing = false;
let failedQueue: any[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // kalau expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest)) // setelah refresh berhasil
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshTokenService(); // refresh pakai cookie refresh_token
        failedQueue.forEach((req) => req.resolve());
        failedQueue = [];

        return api(originalRequest);
      } catch (err) {
        failedQueue.forEach((req) => req.reject(err));
        failedQueue = [];
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export async function apiClient<T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<T> {
  const response = await api.request<T>({
    url: endpoint,
    ...options,
  });
  return response.data;
}

export default api;
