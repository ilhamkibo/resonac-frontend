import axios, { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // dari .env
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 detik
});

// 🔑 contoh interceptor request (misalnya tambahin token auth)
api.interceptors.request.use((config) => {
  // contoh: ambil token dari cookie / localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🚨 contoh interceptor response (error handling global)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
      throw new Error(error.response.data.message || "API Error");
    }
    throw error;
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
