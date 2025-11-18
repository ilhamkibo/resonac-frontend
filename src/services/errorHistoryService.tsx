import { axiosInstance } from "@/lib/api/axios";
import { ApiResponseWrapper } from "@/types/apiType";
import {
  ErrorHistoryResponse,
  ErrorHistoryCompare,
  ErrorHistory,
} from "@/types/errorHistoryType";
import { ApiStatsResponseWrapper } from "@/types/userType";

interface ErrorHistoryQuery {
  page?: string;
  limit?: string;
  period?: string; // daily, weekly, monthly
  startDate?: string;
  endDate?: string;
  area?: string;
  parameter?: string | string[];
}

export const errorHistoryService = {
  /**
   * Get history error dengan filter dan pagination
   */
  async getErrorHistory(query: ErrorHistoryQuery): Promise<ApiResponseWrapper<ErrorHistoryResponse>> {
    try {
      const params = new URLSearchParams();

      // Append query only if exists
      if (query.page) params.append("page", query.page);
      if (query.limit) params.append("limit", query.limit);
      if (query.period) params.append("period", query.period);
      if (query.startDate) params.append("startDate", query.startDate);
      if (query.endDate) params.append("endDate", query.endDate);
      if (query.area) params.append("area", query.area);

      // parameter bisa array
      if (Array.isArray(query.parameter)) {
        query.parameter.forEach((p) => params.append("parameter", p));
      } else if (query.parameter) {
        params.append("parameter", query.parameter);
      }

      const response = await axiosInstance.get<ApiResponseWrapper<ErrorHistoryResponse>>(
        "/error-history",
        { params }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch error history:", error);
      throw new Error("Failed to fetch error history. Please try again later.");
    }
  },

  /**
   * Get perbandingan weekly & monthly
   */
  async getErrorHistoryCompare(): Promise<ApiResponseWrapper<ErrorHistoryCompare>> {
    try {
      const response = await axiosInstance.get<ApiResponseWrapper<ErrorHistoryCompare>>(
        "/error-histories/compare"
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch error compare stats:", error);
      throw new Error(
        "Failed to fetch error comparison data. Please try again later."
      );
    }
  },
};
