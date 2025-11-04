import { axiosInstance } from "@/lib/api/axios";
import { ApiUserResponseWrapper, UserResponse } from "@/types/userType";
import { UserQuery } from "@/validations/userSchema";
// Impor tipe dari file schema

export const userService = {
  /**
   * Mengambil daftar user dengan filter dan pagination
   */
  async getAllUser(query: UserQuery): Promise<UserResponse> {
    try {
      // Best Practice: Gunakan URLSearchParams untuk membuat query string
      // Ini akan menangani field yang 'undefined' secara otomatis
      const params = new URLSearchParams();
      
      if (query.page) params.append('page', query.page);
      if (query.limit) params.append('limit', query.limit);
      if (query.status) params.append('status', query.status);
      if (query.role) params.append('role', query.role);

      // Kirim request dengan params
      const response = await axiosInstance.get<ApiUserResponseWrapper>('/users', { 
        params 
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users. Please try again later.');
    }
  },

  async getUserStats() {
    try {
      const response = await axiosInstance.get('/users/stats');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw new Error('Failed to fetch user stats. Please try again later.');
    }
  },
}