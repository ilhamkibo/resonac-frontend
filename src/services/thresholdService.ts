import { axiosInstance } from "@/lib/api/axios";

export const thresholdService = {
    async getAllThreshold(area: string = "main") {
        try {
            const response = await axiosInstance.get(`/thresholds?area=${area}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch thresholds:", error);
            return null;
        }
    },

    async getThreshold(id: number) {
        try {
            const response = await axiosInstance.get(`/thresholds/${id}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch threshold:", error);
            return null;
        }
    }
} 