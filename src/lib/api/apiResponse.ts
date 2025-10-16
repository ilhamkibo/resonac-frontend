// import axios from 'axios';

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   // Penting untuk mengirim cookie di setiap request
//   withCredentials: true, 
// });

// // Flag untuk menandai apakah proses refresh token sedang berjalan
// let isRefreshing = false;
// // Antrian untuk request yang gagal karena token expired
// let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Cek jika error adalah 401 dan BUKAN dari request refresh token itu sendiri
//     if (error.response?.status === 401 && !originalRequest._retry) {
      
//       if (isRefreshing) {
//         // Jika proses refresh sedang berjalan, masukkan request ke antrian
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(() => api(originalRequest));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // Panggil endpoint refresh token
//         await api.post('/auth/refresh');
        
//         // Proses antrian dengan sukses, dan ulangi request yang gagal
//         processQueue(null);
//         return api(originalRequest);
//       } catch (refreshError) {
//         // Jika refresh token gagal (misalnya sudah expired juga)
//         processQueue(refreshError, null);
        
//         // Di sini Anda bisa membersihkan state user dan redirect ke login
//         console.error("Session expired. Please log in again.");
//         // window.location.href = '/sign-in'; // Redirect ke halaman login
        
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

export function handleApiResponse<T>(response: any): T {
  if (response.status !== "success") throw new Error(response.message);
  return response.data as T;
}

export function handleApiError(error: any): string {
  return error.response?.data?.message || error.message || "Unknown error";
}
