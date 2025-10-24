// components/auth/SignOutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

type SignOutButtonProps = React.ComponentPropsWithoutRef<"button">;

export default function SignOutButton({ className, ...props }: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = () => {
    // 1. Buat sebuah fungsi yang mengembalikan Promise
    const signOutPromise = () => new Promise<void>((resolve) => {
      // Lakukan proses logout di dalam Promise
      Cookies.remove("accessToken");
      
      // Setelah selesai, panggil resolve() untuk menandakan sukses
      // Kita beri sedikit jeda agar prosesnya terasa
      setTimeout(() => {
        resolve();
      }, 500);
    });

    // 2. Gunakan toast.promise untuk menjalankan fungsi tersebut
    toast.promise(signOutPromise(), {
      loading: 'Signing you out...',
      success: () => {
        // 3. Redirect HANYA SETELAH promise berhasil dan toast success muncul
        // router.push("/signin");
        window.location.reload();
        router.refresh();
        return "You have been signed out successfully."; // Pesan untuk toast success
      },
      error: 'Failed to sign out. Please try again.',
    });
  };

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2 text-center ${className}`}
      {...props}
    >
      <LogOut size={16} />
      Sign Out
    </button>
  );
}