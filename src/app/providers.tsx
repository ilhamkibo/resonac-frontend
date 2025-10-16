"use client";

import { queryClient } from "@/lib/api/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";


export default function Providers({ children }: { children: React.ReactNode }) {

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
