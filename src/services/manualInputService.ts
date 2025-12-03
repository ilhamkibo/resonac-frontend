import { axiosInstance } from "@/lib/api/axios";
import { ApiResponseWrapper } from "@/types/apiType";
import { ManualInputQuery, ManualInputQueryCsv, ManualInputResponse } from "@/types/manualInputType";
import { RealtimeData } from "@/types/mqttType"; // Asumsi tipe data Anda

// Fungsi untuk mengirim data manual
interface ApiManualInputPayload {
  userId: number; // Sesuaikan tipenya jika user.id bukan number
  timestamp: string;
  // details: any[];
  details: Array<Record<string, unknown>>; // ⬅ aman, bukan any
}

const cleanParams = (params: Record<string, unknown>) => {
  const cleaned: Record<string, string> = {};
  for (const key in params) {
    const value = params[key];
    if (value !== null && value !== undefined && value !== "") {
      // Ubah Date menjadi string ISO, biarkan sisanya sebagai string
      if (value instanceof Date) {
        cleaned[key] = value.toISOString();
      } else {
        cleaned[key] = String(value);
      }
    }
  }
  return cleaned;
};
 
export const manualInputService = {
    async submitInput(data: RealtimeData, userId: number) {// ✅ 3. Buat timestamp
        const timestamp = new Date().toISOString();

        // ✅ 4. Transformasi data 'details'
        const details = [
        {
            area: "oil",
            oil_temperature: data.oil.temperature
        },
        {
            area: "pilot",
            ...data.pilot // Salin semua properti dari data.pilot
        },
        {
            area: "main",
            ...data.main // Salin semua properti dari data.main
        }
        ];

        // ✅ 5. Bangun payload final
        const payload: ApiManualInputPayload = {
            userId: userId,
            timestamp: timestamp,
            details: details
        };

        // ✅ 6. Kirim payload yang sudah ditransformasi
        const response = await axiosInstance.post('/manual-inputs', payload); 
        return response; 
    },

    async getManualInputs(params: ManualInputQuery): Promise<ApiResponseWrapper<ManualInputResponse>> {
        try {
        const cleaned = cleanParams(params);
        // Kirim 'page' dan 'limit' sebagai query params ke backend
        const response = await axiosInstance.get('/manual-inputs', {
            params: cleaned
        });
        
        // Kembalikan data dan totalCount
        return response.data; 

        } catch (error) {
            // Kembalikan data kosong jika error
            console.error('Failed to fetch manual inputs:', error);
            throw new Error('Failed to fetch manual inputs. Please try again later.');
        }
    },

    async exportManualInputsCsv(query: ManualInputQueryCsv) {
      const cleaned = cleanParams(query);
      const queryString = new URLSearchParams(cleaned).toString();
        
      // 1. PENTING: Konfigurasi Axios untuk mengharapkan respons dalam bentuk TEXT
      const response = await axiosInstance.get(
        `/manual-inputs/export?${queryString}`,
        {
          responseType: "blob",
        }
      );
      
      // 2. Kembalikan data mentah (yang kini berupa string CSV)
      // Pastikan Anda memanggil endpoint '/export' atau '/export-csv' sesuai router Anda.
      return response.data; 
    }
};