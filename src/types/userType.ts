import { Pagination } from "./apiType";

// Tipe data untuk User (sesuai respons backend Anda)
export type User = {
  id: string | number;
  email: string;
  name: string;
  role: 'operator' | 'admin';
  isApproved: boolean;
  created_at: string | Date; // Sesuaikan dengan tipe data Anda
};

// Tipe untuk data Pagination

// Tipe untuk respons API getAllUsers
export type UserResponse = {
  data: User[];
  pagination: Pagination;
};

export type ApiUserResponseWrapper = {
  status: string;
  message: string;
  data: UserResponse; // <-- Ini adalah tipe { data: User[], pagination: ... }
};

// 2. Definisikan juga tipe untuk Stats (jika Anda menggunakannya)
export type ApiStatsResponseWrapper = {
  status: string;
  message: string;
  data: UserStats; // Asumsi stats Anda juga dibungkus
};

export type UserStats = {
  userCount: number;
  approvedUserCount: number;
  unapprovedUserCount: number;
};