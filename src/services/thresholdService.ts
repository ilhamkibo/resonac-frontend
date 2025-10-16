import { axiosInstance } from "@/lib/api/axios";

export const thresholdService = {
    async getAllThreshold(area: string = "main") {
        const response = await axiosInstance.get(`/thresholds?area=${area}`);
        return response.data;
    },

    async getThreshold(id: number) {
        const response = await axiosInstance.get(`/thresholds/${id}`);
        return response.data;
    }
} 