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

// ✅ Buat Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Jika token tidak valid, hapus cookie dan redirect ke halaman login
      Cookies.remove('accessToken');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);