import { axiosInstance } from "@/lib/api/axios";

export const measurementService = {
    async getMeasurementsDashboardData(area: string = "main") {
        const response = await axiosInstance.get(`/measurements/dashboard?area=${area}`);
        return response.data;
    }
} 