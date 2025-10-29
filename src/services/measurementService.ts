import { axiosInstance } from "@/lib/api/axios";

export const measurementService = {
    async getMeasurementsDashboardData(area: string = "main") {
        try {
            const response = await axiosInstance.get(`/measurements/dashboard?area=${area}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch measurements:", error);
            return null;
        }
    }
} 