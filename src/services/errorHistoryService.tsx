import { axiosInstance } from "@/lib/api/axios";
import { ApiResponseWrapper } from "@/types/apiType";
import {
  ErrorHistoryResponse,
  ErrorHistoryCompare,
  ErrorHistoryQuery,
  ErrorHistoryCsvQuery,
} from "@/types/errorHistoryType";

import { isAxiosError } from "axios";

export const errorHistoryService = {
  /**
   * Get history error dengan filter dan pagination
   */
  async getErrorHistory(query: ErrorHistoryQuery): Promise<ErrorHistoryResponse> {
    try {
      const params = new URLSearchParams();

      // Append query only if exists
      if (query.page) params.append("page", query.page);
      if (query.limit) params.append("limit", query.limit);
      if (query.period) params.append("period", query.period);
      if (query.startDate) params.append("startDate", query.startDate);
      if (query.endDate) params.append("endDate", query.endDate);
      if (query.area) params.append("area", query.area);

      if (Array.isArray(query.parameter)) {
        query.parameter.forEach((p) => params.append("parameter", p));
      } else if (query.parameter) {
        params.append("parameter", query.parameter);
      }

      const response = await axiosInstance.get<ApiResponseWrapper<ErrorHistoryResponse>>(
        "/error-histories",
        { params }
      );

      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch error history:", error);
      throw new Error("Failed to fetch error history. Please try again later.");
    }
  },

  /**
   * Get perbandingan weekly & monthly
   */
  async getErrorHistoryCompare(): Promise<ErrorHistoryCompare | null>  {
    try {
      const response = await axiosInstance.get<ApiResponseWrapper<ErrorHistoryCompare>>(
        "/error-histories/compare"
      );

      return response.data.data;
    } catch (error) {
      console.warn(error)
      return null;
    }
  },

  async exportErrorHistory(query: ErrorHistoryCsvQuery) {
    try {
      const cleanedQuery = Object.fromEntries(
        Object.entries(query).filter(([, v]) => v !== undefined && v !== "")
      );

      const queryString = new URLSearchParams(cleanedQuery).toString();
      
      // 1. PENTING: Konfigurasi Axios untuk mengharapkan respons dalam bentuk TEXT
      const response = await axiosInstance.get(
        `/error-histories/export?${queryString}`,
        {
          responseType: 'text', // <-- Ini memastikan respons tidak diparse sebagai JSON
        }
      );
      
      // 2. Kembalikan data mentah (yang kini berupa string CSV)
      // Pastikan Anda memanggil endpoint '/export' atau '/export-csv' sesuai router Anda.
      return response.data as string; 
    } catch (error: unknown) {
      console.error('Failed to export manual inputs:', error);
      

      if (isAxiosError(error) && error.response) {
        // Error ini memiliki response dari server (ini adalah error Axios)
        throw new Error(error.response.data.message || "Validation failed on server.");
      }

      throw new Error('Failed to export manual inputs. Please try again later.');
    }
  }
};
