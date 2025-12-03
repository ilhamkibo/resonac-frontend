import axios from "axios";
import Cookies from 'js-cookie'; // Impor js-cookie di sini juga

export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // baseURL: "/api",
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

// ✅ Buat Interceptor
axiosInstance.interceptors.response.use(
 (response) => response,
 (error) => {
  if (error.response && error.response.status === 401) {
   // 1. Hapus token (Tugas interseptor)
   Cookies.remove('accessToken');

   // 2. Lemparkan Error seperti biasa. 
      //    JANGAN lakukan redirect di sini.
   return Promise.reject(error);
  }
  return Promise.reject(error);
 }
);