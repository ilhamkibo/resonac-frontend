import { axiosInstance } from "@/lib/api/axios";
import { ApiResponseWrapper } from "@/types/apiType";
import { MeasurementDashboard } from "@/types/measurementType";

export const measurementService = {
    async getMeasurementsDashboardData(area: string = "main"): Promise<MeasurementDashboard[]> {
        try {
            const response = await axiosInstance.get<ApiResponseWrapper<MeasurementDashboard[]>>(`/measurements/dashboard?area=${area}`);

            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch measurements:", error);
            throw new Error("Failed to fetch measurements. Please try again later.");
        }
    }
} 