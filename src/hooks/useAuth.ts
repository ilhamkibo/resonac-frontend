"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileService } from "@/lib/api/services/auth-service";

export function useAuth() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getProfileService,
    retry: false,
  });
}
