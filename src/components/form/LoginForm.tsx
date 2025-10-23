"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie'; // ✅ 1. Impor js-cookie

// ✅ Impor skema dan tipe yang baru saja kita buat
import { authSchema, LoginPayload } from "@/validations/authSchema";
import { authService } from "@/services/authService";

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({ // <-- Gunakan tipe LoginPayload di sini
    resolver: zodResolver(authSchema), // <-- Gunakan skema di sini
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: () => {
      // Redirect setelah login berhasil
      router.push("/");
    },
  });

  const onSubmit = (data: LoginPayload) => {
    loginMutation.mutate(data);
  };

  // ... sisa JSX form Anda (input `identifier`, `password`, dan tombol submit)
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ... input fields ... */}
    </form>
  );
}