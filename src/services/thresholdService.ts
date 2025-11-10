import { axiosInstance } from "@/lib/api/axios";
import { ApiThresholdResponseWrapper, UpdateThresholdInput } from "@/types/thresholdType";

export const thresholdService = {
    async getAllThreshold(area?: string) {
        try {
            const response = await axiosInstance.get<ApiThresholdResponseWrapper>(`/thresholds`, { params: { area } });
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch thresholds:", error);
            throw new Error("Failed to fetch thresholds. Please try again later.");
        }
    },

    async getThreshold(id: number) {
        try {
            const response = await axiosInstance.get(`/thresholds/${id}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch threshold:", error);
            throw new Error("Failed to fetch threshold. Please try again later.");
        }   
    },

    async updateThreshold(id: number, data: UpdateThresholdInput) {
        try {
            const response = await axiosInstance.patch(`/thresholds/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Failed to update threshold:", error);
            throw new Error("Failed to update threshold. Please try again later.");
        }   
    },
} 