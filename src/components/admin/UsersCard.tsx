"use client";

import React, { useState } from 'react';
import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import { UpdateUserInput, User, UserQuery, UserResponse, UserStats } from '@/types/userType';
import { toast } from 'sonner';
import { useModal } from '@/hooks/useModal';
import { Modal } from '../ui/modal';
import Button from '../ui/button/Button';
import Pagination from '../tables/Pagination';
import UserStatsCards from './UserStatsCards';
import Select from '../form/Select';
import { ChevronDownIcon } from 'lucide-react';
import Label from '../form/Label';
import { useAuth } from '@/hooks/useAuth';

export default function UsersCard() {
  const [query, setQuery] = useState<UserQuery>({
    page: '1',
    limit: '5',
    status: 'approved',
    role: undefined,
  });
  const [userToDelete, setUserToDelete] = useState<string | number | null>(null);
  const [userNameToDelete, setUserNameToDelete] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | number | null>(null); // 🆕 user yang sedang di-edit
  const [editForm, setEditForm] = useState<UpdateUserInput>({
    email: '',
    name: '',
    isApproved: false,
    role: 'operator',
  });
  const { user } = useAuth(); // ✅ Gunakan hook untuk mendapatkan data user

  const queryClient = useQueryClient();

  const { data: queryResult, isLoading, isError, error } = useQuery<UserResponse, Error>({
    queryKey: ['users', query],
    queryFn: () => {
      return userService.getAllUser(query);
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  const {
    data: userStats,
    isLoading: userStatsLoading,
  } = useQuery<UserStats, Error>({
    queryKey: ['userStats'],
    queryFn: () => userService.getUserStats(),
    staleTime: 1000 * 60,
  });

  const users = queryResult?.data;
  const pagination = queryResult?.meta;
  const { isOpen, openModal, closeModal } = useModal();

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success("User deleted successfully.");
      closeModal();
      setUserToDelete(null);
      setUserNameToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      toast.error((error as Error).message || "Failed to delete user.");
      closeModal();
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string | number) => userService.updateUser(id, { isApproved: true }),
    onSuccess: () => {
      toast.success("User approved successfully.");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      toast.error((error as Error).message || "Failed to approve user.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateUserInput }) => userService.updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully.");
      setEditingUserId(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
    },
    onError: (error) => {
      toast.error((error as Error).message || "Failed to update user.");
    },
  });

  const handleDeleteUser = (id: number | string, name: string) => {
    setUserToDelete(id);
    setUserNameToDelete(name);
    openModal();
  };

  const handleApproveUser = (id: number | string) => {
    approveMutation.mutate(id);
  };

  // 🆕 Saat klik Edit
  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditForm({
      email: user.email,
      name: user.name,
      isApproved: user.isApproved,
      role: user.role === "admin" || user.role === "operator" ? user.role : "operator",
    });
  };

  // 🆕 Saat klik Cancel Edit
  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  // 🆕 Saat submit perubahan
  const handleSaveEdit = (id: string | number) => {
    updateMutation.mutate({ id, data: editForm });
  };

  const confirmDelete = () => {
    if (userToDelete) deleteMutation.mutate(userToDelete);
  };

  return (
    <div className='grid grid-cols-4 gap-4'>   
      <div className="col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-5 ">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User List</h3>
          <h1 className="font-semibold text-gray-800 dark:text-gray-400">
            Only admin role can approve, edit and delete user
          </h1>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-4">
          <div>
            <Label>Status</Label>
            <div className='relative'>
              <Select
                options={[
                  { value: "approved", label: "Approved" },
                  { value: "unapproved", label: "Unapproved" },
                ]}
                defaultValue={query.status}
                placeholder="Status"
                onChange={(value) =>
                  setQuery(prev => ({
                    ...prev,
                    status: value as "approved" | "unapproved" | undefined,
                    page: "1"
                  }))
                }
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  <ChevronDownIcon />
              </span>
            </div>
          </div>
          <div>
            <Label>Role</Label>
            <div className="relative">
                <Select
                  options={[
                    { value: "all", label: "All" },
                    { value: "admin", label: "Admin" }, 
                    { value: "operator", label: "Operator" },
                  ]}
                  defaultValue={query.role ?? "all"} // <= undefined → "" → tampil "All"
                  placeholder="Role"
                  onChange={(value) =>
                    setQuery(prev => ({
                      ...prev,
                      role: value === "all" ? undefined : (value as "operator" | "admin"),
                      page: "1"
                    }))
                  }
                />
                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <ChevronDownIcon />
                </span>
            </div>
          </div>
        </div>

        {/* Table */}
        {isLoading && (
          <div className="text-center p-5 text-gray-500 dark:text-gray-400 animate-pulse">Loading users...</div>
        )}

        {isError && (
          <div className="text-center p-5 text-red-500">
            Error fetching users: {error.message}
          </div>
        )}

        {users && (
          <>
            <table className="w-full border border-gray-200 rounded-md overflow-hidden">
              <thead>
                <tr className="dark:bg-gray-700 bg-gray-200">
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((userTable, index) => (
                    <tr key={userTable.id} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "dark:bg-gray-700 bg-gray-100"}>
                      {editingUserId === userTable.id ? (
                        <>
                          <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                               onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit(userTable.id);
                                if (e.key === "Escape") handleCancelEdit();
                              }}
                              className={`w-full px-2 py-1 text-left rounded-md outline-none transition ${
                                updateMutation.isPending
                                    ? "bg-gray-200 dark:bg-gray-600 text-gray-400"
                                    : "bg-gray-100 dark:bg-gray-600"
                                }`
                              }  
                              />
                          </td>
                          <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit(userTable.id);
                                if (e.key === "Escape") handleCancelEdit();
                              }}
                              className={`w-full px-2 py-1 text-left rounded-md outline-none transition ${
                                updateMutation.isPending
                                    ? "bg-gray-200 dark:bg-gray-600 text-gray-400"
                                    : "bg-gray-100 dark:bg-gray-600"
                                }`
                              }
                            />
                          </td>
                          <td
                              onKeyDown={(e: React.KeyboardEvent) => {
                              if (e.key === "Enter") handleSaveEdit(userTable.id);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                            className="p-3 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            <div className='relative'>
                              <Select
                                options={[
                                  { value: "approved", label: "Approved" },
                                  { value: "unapproved", label: "Unapproved" },
                                ]}
                                defaultValue={editForm.isApproved ? "approved" : "unapproved"}
                                onChange={(value) =>
                                  setEditForm({
                                    ...editForm,
                                    isApproved: value === "approved",
                                  })
                                }
                                className="w-full"
                              />
                              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                  <ChevronDownIcon />
                              </span>
                            </div>
                          </td>
                          <td 
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(userTable.id);
                              if (e.key === "Escape") handleCancelEdit();
                            }}
                            tabIndex={0}
                            className="p-3 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            <div className='relative'>
                              <Select
                                options={[
                                  { value: "operator", label: "Operator" },
                                  { value: "admin", label: "Admin" },
                                ]}
                                defaultValue={editForm.role}
                                onChange={(value) =>
                                  setEditForm({
                                    ...editForm,
                                    role: value as "admin" | "operator",
                                  })
                                }
                                className="w-full"
                              />
                              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon />
                              </span>
                            </div>

                          </td>
                          <td className="p-3 flex gap-2 justify-center">
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(userTable.id)}
                              disabled={updateMutation.isPending}
                              className="bg-green-500 hover:bg-green-600 disabled:bg-green-300"
                            >
                              {updateMutation.isPending ? 'Saving...' : 'Update'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleCancelEdit}
                              disabled={updateMutation.isPending}
                              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
                            >
                              Cancel
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">{userTable.email}</td>
                          <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">{userTable.name}</td>
                          <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                            {userTable.isApproved ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Approved</span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Unapproved</span>
                            )}
                          </td>
                          <td className="p-3 text-sm font-medium text-gray-900 dark:text-white capitalize">{userTable.role}</td>
                          <td className="p-3 text-sm font-medium text-gray-900 dark:text-white flex gap-2 justify-center">
                            {user?.email !== userTable.email && (
                              <>
                                {/* Jika belum approve */}
                                {!userTable.isApproved && (
                                  <>
                                    <Button size="sm" onClick={() => handleApproveUser(userTable.id)}>
                                      Approve
                                    </Button>

                                    <Button
                                      size="sm"
                                      onClick={() => handleDeleteUser(userTable.id, userTable.name)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}

                                {/* Jika sudah approve */}
                                {userTable.isApproved && (
                                  <>
                                    <Button size="sm" onClick={() => handleEditUser(userTable)}>
                                      Edit
                                    </Button>

                                    {/* Hanya operator boleh delete, admin tidak */}
                                    {userTable.role === "operator" && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleDeleteUser(userTable.id, userTable.name)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </Button>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-300">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {users.length > 0 && pagination && (
              <div className="flex items-center justify-between mt-5">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Page <span className="font-semibold">{pagination.page}</span> of <span className="font-semibold">{pagination.totalPages}</span>
                  <span className="hidden sm:inline"> (Total: {pagination.total} users)</span>
                </span>

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setQuery((prev) => ({ ...prev, page: String(page) }))}
                />
              </div>
            )}
          </>
        )}

        {/* Modal Delete */}
        <Modal
          isOpen={isOpen}
          onClose={deleteMutation.isPending ? () => {} : closeModal}
          className="max-w-[500px] p-5 lg:p-8"
        >
          <h4 className="font-semibold text-gray-800 mb-4 text-title-sm dark:text-white/90">
            Confirm Deletion
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-800 dark:text-white">
              {userNameToDelete || "this user"}
            </span>
            ? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal} disabled={deleteMutation.isPending}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal>
      </div>
      <UserStatsCards userStats={userStats} isLoading={userStatsLoading} />
    </div>
  );
}
