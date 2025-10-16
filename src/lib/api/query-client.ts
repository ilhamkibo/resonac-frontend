import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            //Kapan perlu refresh data
            staleTime: 5*60*1000, //5 minutes
            //Seberapa lambat perlu refresh data
            gcTime: 10*60*1000, //10 minutes
            retry: (failureCount, error) => {
                if (error instanceof AxiosError && error.status && error.status >= 400 && error.status < 500) {
                    return false;
                }
                return failureCount < 3;
            },
            refetchOnWindowFocus: false,
            refetchOnReconnect: true
        },
        mutations: {
             onError: (error: unknown) => {
                if (error instanceof AxiosError) {
                toast.error(error.response?.data?.message || "Gagal melakukan aksi.");
                } else {
                toast.error("Terjadi kesalahan tak terduga saat mengirim data.");
                }
            }
        }
    }
})