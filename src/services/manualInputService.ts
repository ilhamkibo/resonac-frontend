import { axiosInstance } from "@/lib/api/axios";
import { RealtimeData } from "@/types/mqttType"; // Asumsi tipe data Anda

// Fungsi untuk mengirim data manual
interface ApiManualInputPayload {
  userId: number; // Sesuaikan tipenya jika user.id bukan number
  timestamp: string;
  details: any[];
}

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

    async getManualInputs(page: number, limit: number) {
        try {
        // Kirim 'page' dan 'limit' sebagai query params ke backend
        const response = await axiosInstance.get('/manual-inputs', {
            params: {
            page,
            limit
            }
        });
        
        // Kembalikan data dan totalCount
        return response.data; 

        } catch (error) {
            // Kembalikan data kosong jika error
            return { data: [], totalCount: 0, page: 1, limit: 10 };
        }
    }

};