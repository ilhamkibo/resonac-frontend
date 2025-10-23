import axios from "axios";
import Cookies from 'js-cookie'; // Impor js-cookie di sini juga

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    // withCredentials sekarang tidak lagi wajib, tapi tidak apa-apa jika tetap ada
    withCredentials: true, 
});

// ✅ Buat Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Ambil token dari cookie
    const token = Cookies.get('accessToken');

    // Jika token ada, tempelkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);