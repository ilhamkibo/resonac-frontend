"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner"; // Library notifikasi (opsional)

import { LoginPayload, loginSchema } from "@/validations/authSchema";
import { authService } from "@/services/authService"; // Pastikan path benar

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Checkbox from "@/components/form/input/Checkbox";
// ✅ Contoh login action
async function loginAction(username: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Login gagal");
  }

  return res.json();
}

export default function SignInForm() {
    const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // 1. Setup React Hook Form & Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Setup React Query Mutation untuk handle API call
  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => {
      return authService.login(payload);
    },
    onSuccess: () => {
      toast.success("Login berhasil!");
      // Redirect ke dashboard setelah login berhasil
      router.push("/"); 
      router.refresh(); // Memastikan server-side components di-refresh
    },
    onError: (error: any) => {
      // Tampilkan pesan error dari API
      const message = error.response?.data?.message || "Login gagal. Periksa kembali email dan password Anda.";
      toast.error(message);
    },
  });

  // 3. Fungsi yang dipanggil saat form di-submit dan valid
  const onSubmit = (data: LoginPayload) => {
    mutation.mutate(data);
  };
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
         <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  {/* 5. Daftarkan input ke react-hook-form */}
                  <Input
                    placeholder="youremail@example.com"
                    type="email"
                    {...register("email")} // Ganti onChange dengan register
                  />
                  {/* Tampilkan error validasi */}
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
                      {...register("password")} // Ganti onChange dengan register
                    />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"> 
                      {showPassword ? (   
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />    
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}   
                      </span>   
                    </div>
                  </div>  
                  <div className="flex items-center justify-between">   
                    <div className="flex items-center gap-3">   
                      <Checkbox checked={isChecked} onChange={setIsChecked} />   
                      <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">    
                        Keep me logged in   
                        </span>   
                    </div>  
                  </div>
                <div>
                  <Button
                    className="w-full"
                    size="sm"
                    type="submit"
                    // 6. Gunakan status dari useMutation
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Signing in..." : "Sign in"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                If you are not a member, please contact the{" "}
                <span className="font-semibold text-brand-500 dark:text-brand-400">
                  Admin
                </span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
