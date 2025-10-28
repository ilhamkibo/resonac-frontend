"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form"; // ✅ 1. Impor
import { zodResolver } from "@hookform/resolvers/zod"; // ✅ 2. Impor
import { useMutation } from "@tanstack/react-query"; // ✅ 3. Impor
import { toast } from "sonner"; // ✅ 4. Impor

import { useAuthModal } from "@/context/AuthModalContext";
import { authService } from "@/services/authService"; // ✅ 5. Impor
import { RegisterPayload, registerSchema } from "@/validations/authSchema"; // ✅ 6. Impor (Anda perlu membuatnya)

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button"; // ✅ 7. Impor Button (asumsi dari referensi)
import { EyeCloseIcon, EyeIcon } from "@/icons";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { setView } = useAuthModal(); // Untuk beralih kembali ke Sign In

  // ✅ 8. Setup React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // ✅ 9. Setup React Query Mutation
  const mutation = useMutation({
    mutationFn: authService.register, // Asumsi Anda punya fungsi ini di service
    onSuccess: (response) => {
      // Tampilkan pesan sukses dari API atau pesan kustom
      const message = response.data.message || "Registrasi berhasil.";
      toast.success(`${message} Silakan tunggu persetujuan admin.`);
      
      // Beralih kembali ke tampilan Sign In
      setView('signIn'); 
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login gagal. Periksa kembali data Anda.";
      toast.error(message);
    },
  });

  // ✅ 10. Fungsi OnSubmit
  const onSubmit = (data: RegisterPayload) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to sign up!
            </p>
          </div>
          <div>
            {/* ✅ 11. Terapkan handleSubmit */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                {/* */}
                <div>
                  <Label>
                    Name<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter your first name"
                    {...register("name")} // ✅ Terapkan register
                  />
                  {/* Tampilkan error */}
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* */}
                <div>
                  <Label>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")} // ✅ Terapkan register
                  />
                  {/* Tampilkan error */}
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* */}
                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")} // ✅ Terapkan register
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {/* Tampilkan error */}
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  {/* ✅ 12. Gunakan Button component */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="sm"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Signing up..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView('signIn')} // Ini sudah benar
                  className="text-brand-500 underline hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}