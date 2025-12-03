"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from 'js-cookie'; // ✅ 1. Impor js-cookie

import { useAuthModal } from "@/context/AuthModalContext";
import { AxiosError } from "axios";

// ✅ 1. Pastikan path dan nama impor sesuai dengan file validasi Anda
import { LoginPayload, authSchema } from "@/validations/authSchema"; 
import { authService } from "@/services/authService";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";

// ❌ Fungsi loginAction ini tidak diperlukan dan dihapus
// karena kita sudah menggunakan authService dan TanStack Query.

export default function SignInForm() {
  const { setView } = useAuthModal();  
  const [showPassword, setShowPassword] = useState(false);

  // ✅ 2. Setup React Hook Form & Zod Resolver (Sudah benar)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
      resolver: zodResolver(authSchema),
      // ✅ 2. Provide default values for all fields
      defaultValues: {
          email: "",
          password: "",
      },
  });

  // ✅ 3. Setup React Query Mutation untuk handle API call
    const mutation = useMutation({
      mutationFn: authService.login, // Langsung gunakan fungsi dari service
      onSuccess: (response) => {
        const { token } = response.data.data;
        if (!token) {
          toast.error("Login berhasil, tetapi token tidak diterima.");
          return;
        }
        // ✅ 3. Simpan token secara manual di cookie
        Cookies.set('accessToken', token, { 
          expires: 1, // Cookie berlaku selama 1 hari
          path: '/',
          httpOnly: false,
          secure: false, // Hanya via HTTPS di produksi
          sameSite: 'lax' // 'lax' adalah pilihan yang baik
        });

        toast.success("Login berhasil!");
        // router.push("/"); // Ganti dengan path dashboard Anda, misal: "/dashboard"
        window.location.reload();
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        const message = error.response?.data?.message || "Login gagal. Periksa kembali data Anda.";
        toast.error(message);
      },
    });

  // Fungsi yang dipanggil saat form di-submit dan valid
  const onSubmit = (data: LoginPayload) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col flex-1 w-full">

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username or email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    {/* ✅ 4. Ganti label menjadi lebih sesuai */}
                    Email or Username <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="youremail@example.com"
                    type="text" 
                    {...register("email")} 
                  />
                  {/* ✅ Tampilkan error untuk field "identifier" */}
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password")}
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"> 
                      {showPassword ? ( 
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> 
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {/* Tampilkan error untuk password */}
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>
            <div className="mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Don&apos;t have an account yet?{" "}
                {/* ✅ 3. Ganti <Link> menjadi <button> */}
                <button
                  type="button"
                  onClick={() => setView('signUp')} // Panggil setView
                  className="text-brand-500 underline hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </button>
              </span>
            </div>
            {/* ... bagian footer (contact admin) ... */}
          </div>
        </div>
      </div>
    </div>
  );
}