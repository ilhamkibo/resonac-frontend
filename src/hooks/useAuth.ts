// hooks/useAuth.ts
"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { decodeJwt } from 'jose'; // ✅ 1. Impor 'decodeJwt' dari 'jose'
import { UserPayload } from '@/types/userType';

export function useAuth() {
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        // ✅ 2. Gunakan 'decodeJwt' untuk membaca payload token
        const decoded = decodeJwt<UserPayload>(token);

        // Cek apakah token sudah kedaluwarsa
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          // Token expired
          Cookies.remove('accessToken');
          setUser(null);
        } else {
          // Token masih valid
          setUser(decoded);
        }
      } catch (error) {
        // Token tidak valid atau rusak
        console.error("Invalid token format:", error);
        Cookies.remove('accessToken');
        setUser(null);
      }
    }
  }, []);

  return { user };
}