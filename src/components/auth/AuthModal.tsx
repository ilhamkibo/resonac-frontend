"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import SignInForm from "@/components/auth/SignInForm";

export default function AuthModal() {
  const { isOpen, closeModal } = useAuthModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 dark:bg-white/40 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md relative">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          ✕
        </button>
        <SignInForm />
      </div>
    </div>
  );
}
