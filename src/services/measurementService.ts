import { axiosInstance } from "@/lib/api/axios";
import { ApiResponseWrapper } from "@/types/apiType";
import { AggregatedDataResponse, MeasurementAggregatedQuery, MeasurementDashboard } from "@/types/measurementType";
import { isAxiosError } from "axios";

export const measurementService = {
    async getMeasurementsDashboardData(area: string = "main"): Promise<MeasurementDashboard[]> {
        try {
            const response = await axiosInstance.get<ApiResponseWrapper<MeasurementDashboard[]>>(`/measurements/dashboard?area=${area}`);

            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch measurements:", error);
            throw new Error("Failed to fetch measurements. Please try again later.");
        }
    },

    async getMeasurementsAggregateData(query: MeasurementAggregatedQuery): Promise<AggregatedDataResponse> {
        try {
            const response = await axiosInstance.get<ApiResponseWrapper<AggregatedDataResponse>>(
            `/measurements`, 
            { params: query }
            );
            return response.data.data;
        } catch {
            throw new Error("Failed to fetch thresholds. Please try again later.");
        }   
    },

    async exportMeasurementData(query: MeasurementAggregatedQuery) {
        try {
          const cleanedQuery = Object.fromEntries(
            Object.entries(query)
                .filter(([, v]) => v !== undefined && v !== '')
                .map(([k, v]) => [k, String(v)]) // ⬅ convert semua value jadi string
            );
    
          const queryString = new URLSearchParams(cleanedQuery).toString();
          
          // 1. PENTING: Konfigurasi Axios untuk mengharapkan respons dalam bentuk TEXT
          const response = await axiosInstance.get(
            `/measurements/export?${queryString}`,
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
                throw new Error(error.response.data.message || "Validation failed on server.");
            }
    
          throw new Error('Failed to export manual inputs. Please try again later.');
        }
      }
} 