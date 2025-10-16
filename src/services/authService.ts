import { LoginPayload } from '@/validations/authSchema';
import api from '../lib/api/api';

export const authService = {
  // Mengirim kredensial, server akan membalas dengan Set-Cookie header
  async login(payload: LoginPayload) {
    const response = await api.post('/auth/login', payload);
    // Mungkin berisi data user, tapi token sudah di-set oleh server di cookie
    return response.data;
  },

  // Memberitahu server untuk menghapus cookie
  async logout() {
    // Server akan merespons dengan Set-Cookie header yang meng-expire-kan token
    await api.post('/auth/logout');
  },
};