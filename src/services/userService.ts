import { axiosInstance } from "@/lib/api/axios";
import { ApiResponseWrapper } from "@/types/apiType";
import { User, UserQuery, UserResponse, UserStats, UpdateUserInput } from "@/types/userType";
// Impor tipe dari file schema

export const userService = {
  /**
   * Mengambil daftar user dengan filter dan pagination
   */
  async getAllUser(query: UserQuery): Promise<UserResponse> {
    try {
      const params = new URLSearchParams();
      
      if (query.page) params.append('page', query.page);
      if (query.limit) params.append('limit', query.limit);
      if (query.status) params.append('status', query.status);
      if (query.role) params.append('role', query.role);

      const response = await axiosInstance.get<ApiResponseWrapper<UserResponse>>('/users', { 
        params 
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users. Please try again later.');
    }
  },

  async getUserStats(): Promise<UserStats> {
    try {
      const response = await axiosInstance.get<ApiResponseWrapper<UserStats>>('/users/stats');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
      throw new Error('Failed to fetch user stats. Please try again later.');
    }
  },

  async updateUser(id: string | number, data: UpdateUserInput): Promise<User> {
    try {
      const response = await axiosInstance.patch(`/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user. Please try again later.');
    }
  },

  async deleteUser(id: string | number): Promise<void> {
    try {
      await axiosInstance.delete(`/users/${id}`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user. Please try again later.');
    }
  },
}