import { axiosInstance } from '@/lib/api/axios';
import { LoginPayload, RegisterPayload } from '@/validations/authSchema';

export const authService = {
  // Mengirim kredensial, server akan membalas dengan Set-Cookie header
  async login(payload: LoginPayload) {
    const response = axiosInstance.post('/auth/login', payload);
    // Mungkin berisi data user, tapi token sudah di-set oleh server di cookie
    return response;
  },

  // Memberitahu server untuk menghapus cookie
  async logout() {
    // Server akan merespons dengan Set-Cookie header yang meng-expire-kan token
    await axiosInstance.post('/auth/logout');
  },

  async register(payload: RegisterPayload) {
    const response = axiosInstance.post('/auth/register', payload);
    // Mungkin berisi data user, tapi token sudah di-set oleh server di cookie
    return response;
  },
};