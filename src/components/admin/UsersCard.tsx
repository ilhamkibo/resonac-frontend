"use client";

import React, { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';// Impor tipe-tipe yang dibutuhkan
import { userService } from '@/services/userService';
import { UserQuery,  } from '@/validations/userSchema';
import { UserResponse, UserStats } from '@/types/userType';
import { toast } from 'sonner';

export default function UsersCard() {
  // 1. State untuk menyimpan semua query params
  const [query, setQuery] = useState<UserQuery>({
    page: '1',
    limit: '5', // Atur limit default (misal: 5 agar mudah dites)
    status: 'approved', // Status default
    role: undefined, // Role default (semua)
  });

  // 2. useQuery sekarang bergantung pada state 'query'
  const { 
    data: queryResult, // data adalah { data: User[], pagination: ... }
    isLoading, 
    isError, 
    error 
  } = useQuery<UserResponse, Error>({
    queryKey: ['users', query], 
    queryFn: () => userService.getAllUser(query),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60, // Cache selama 1 menit
  });
    console.log("🚀 ~ UsersCard ~ queryResult:", queryResult)

  const {
    data: userStats, // data adalah { data: User[], pagination: ... }
    isLoading: userStatsLoading, 
    isError: userStatsIsError, 
    error: userStatsError
  } = useQuery<UserStats, Error>({
    queryKey: ['userStats'], 
    queryFn: () => userService.getUserStats(),
    staleTime: 1000 * 60, // Cache selama 1 menit
  });
    console.log("🚀 ~ UsersCard ~ userStats:", userStats)

  // Ekstrak data untuk rendering yang lebih mudah
  const users = queryResult?.data;
  const pagination = queryResult?.pagination;
  

  // 3. Handler untuk mengubah filter
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuery(prev => ({
      ...prev,
      [name]: value || undefined, // Set 'undefined' jika value kosong (misal: "All Roles")
      page: '1', // Best Practice: Selalu reset ke halaman 1 saat filter berubah
    }));
  };

  // 4. Handler untuk Pagination
  const handleNextPage = () => {
    if (pagination && pagination.page < pagination.totalPages) {
      setQuery(prev => ({ ...prev, page: String(Number(prev.page) + 1) }));
    }
  };

  const handlePrevPage = () => {
    if (pagination && pagination.page > 1) {
      setQuery(prev => ({ ...prev, page: String(Number(prev.page) - 1) }));
    }
  };

  const handleDeleteUser = async (id: number | string) => {
    toast.success("User deleted successfully.");
  };

  const handleApproveUser = async (id: number | string) => {
    toast.success("User approved successfully.");
  };

  const handleEditUser = async (id: number | string) => {
    toast.success("User edited successfully.");
  };

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User List</h3>
          <h1 className="font-semibold text-gray-800 dark:text-gray-400">
            Total: {userStats?.userCount} | Approved: {userStats?.approvedUserCount} | Unapproved: {userStats?.unapprovedUserCount}
          </h1>
        </div>

        {/* --- Filter Controls --- */}
        <div className="flex gap-4 mb-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={query.status || 'approved'}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 bg-gray-200 dark:border-gray-600 dark:text-white"
            >
              <option value="approved">Approved</option>
              <option value="unapproved">Unapproved</option>
            </select>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={query.role || ''} // Gunakan string kosong untuk "All"
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 bg-gray-200 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="operator">Operator</option>
            </select>
          </div>
        </div>

        {/* --- Loading State --- */}
        {isLoading && (
          <div className="text-center p-5 text-gray-500 dark:text-gray-400">Loading users...</div>
        )}

        {/* --- Error State --- */}
        {isError && (
          <div className="text-center p-5 text-red-500">
            Error fetching users: {error.message}
          </div>
        )}

        {/* --- Data Display --- */}
        {users && (
          <>
            <table className="w-full">
              <thead>
                <tr className="dark:bg-gray-700 bg-gray-200">
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "dark:bg-gray-700 bg-gray-200"}>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                      {user.email}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                      {user.isApproved ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Unapproved
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {user.role}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white flex gap-2">
                      {user.isApproved ? (
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApproveUser(user)}
                          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-5">
              <span className="text-sm text-gray-700 dark:text-gray-400">
                Page <span className="font-semibold">{pagination?.page}</span> of <span className="font-semibold">{pagination?.totalPages}</span>
                <span className="hidden sm:inline"> (Total: {pagination?.total} users)</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  // Disable tombol jika di halaman pertama
                  disabled={!pagination || pagination.page === 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  // Disable tombol jika di halaman terakhir
                  disabled={!pagination || pagination.page === pagination.totalPages}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}