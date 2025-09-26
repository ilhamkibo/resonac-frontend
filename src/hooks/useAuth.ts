"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileService } from "@/services/authService";

export function useAuth() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getProfileService,
    retry: false,
  });
}
