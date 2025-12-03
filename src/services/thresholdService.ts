import { axiosInstance } from "@/lib/api/axios";
import { ApiResponseWrapper } from "@/types/apiType";
import { Threshold, UpdateThresholdInput } from "@/types/thresholdType";

export const thresholdService = {
    async getAllThreshold(area?: string): Promise<Threshold[]> {
        try {
            const response = await axiosInstance.get<ApiResponseWrapper<Threshold[]>>(`/thresholds`, { params: { area } });
            return response.data.data;
        } catch {
            throw new Error("Failed to fetch thresholds. Please try again later.");
        }
    },

    async getThreshold(id: number): Promise<Threshold> {
        try {
            const response = await axiosInstance.get<ApiResponseWrapper<Threshold>>(`/thresholds/${id}`);
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch threshold:", error);
            throw new Error("Failed to fetch threshold. Please try again later.");
        }   
    },

    async updateThreshold(id: number, data: UpdateThresholdInput): Promise<Threshold> {
        try {
            const response = await axiosInstance.patch(`/thresholds/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Failed to update threshold:", error);
            throw new Error("Failed to update threshold. Please try again later.");
        }   
    },
} 