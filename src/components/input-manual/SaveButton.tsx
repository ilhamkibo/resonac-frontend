"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import { useAuth } from "@/hooks/useAuth";
import { RealtimeData } from "@/types/mqtt"; // Pastikan path ini benar
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { manualInputService } from "@/services/manualInputService"; // Pastikan path ini benar


export default function SaveButton({ mqttData }: { mqttData: RealtimeData | undefined }) {  
  const [lastSaved, setLastSaved] = useState<string | null>(null);
 const { user } = useAuth(); // Anda sudah memiliki 'user'
 const { openModal } = useAuthModal();
 const [capturedData, setCapturedData] = useState<RealtimeData | null>(null);

 const mutation = useMutation({
    // ✅ 7. Ubah mutationFn untuk mengirim objek berisi data & userId
  mutationFn: (vars: { data: RealtimeData; userId: number }) => 
      manualInputService.submitInput(vars.data, vars.userId), 
  onSuccess: () => {
   const now = new Date().toLocaleString("id-ID");
   setLastSaved(now);
   toast.success("Data berhasil disimpan!");
   setCapturedData(null); 
  },
  onError: (error: any) => {
   const message = error.response?.data?.message || "Gagal menyimpan data.";
   toast.error(message);
  },
 });

 const handleCaptureData = () => {
    // ... (Fungsi ini tidak perlu diubah)
  if (mqttData) {
   setCapturedData(mqttData);
   toast.info("Data terbaru telah diambil. Silakan periksa dan simpan.");
  } else {
   toast.error("Data MQTT tidak tersedia. Coba lagi sesaat.");
  }
 };

 const handleSaveData = () => {
  if (!capturedData) {
   toast.error("Tidak ada data yang diambil.");
   return;
  }
    
    // ✅ 8. Tambahkan pengecekan untuk user dan user.id
    if (!user || typeof user.userId === 'undefined') {
      toast.error("Sesi pengguna tidak ditemukan. Silakan login ulang.");
      openModal('signIn'); // Buka modal login jika user tidak ada
      return;
    }

    // ✅ 9. Kirim data dan userId ke mutasi
  mutation.mutate({
      data: capturedData,
      userId: user.userId // Asumsi user.id tersedia dari useAuth()
    });
 };

 const handleCancel = () => {
    // ... (Fungsi ini tidak perlu diubah)
  setCapturedData(null);
  toast.info("Penyimpanan data manual dibatalkan.");
 };

  return (
    <div className="my-6 text-center">
      {user ? (
        // === USER SUDAH LOGIN ===
        <>
          {/* ✅ BAGIAN BARU: TAMPILKAN GRID JIKA DATA SUDAH DIAMBIL
          */}
          {capturedData && (
            <div className="w-full max-w-5xl mx-auto mb-6">
              <h2 className="text-xl font-semibold mb-4 text-white dark:text-gray-300">
                Data yang Akan Disimpan
              </h2>
              {/* Container Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                
                {/* Card 1: Main Pump */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Main Pump</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Ampere R</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.main.ampere_r} A</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Ampere S</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.main.ampere_s} A</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Ampere T</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.main.ampere_t} A</span></div>
                    {/* Catatan: Data MQTT Anda menunjukkan 'oil_pressure: 96'. 
                      Jika Anda perlu menampilkannya sebagai '9.6' atau '3.3' seperti di dashboard, 
                      Anda mungkin perlu melakukan konversi (misal: capturedData.main.oil_pressure / 10) 
                    */}
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Oil Pressure</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.main.oil_pressure}</span></div>
                  </div>
                </div>

                {/* Card 2: Pilot Pump */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Pilot Pump</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Ampere R</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.pilot.ampere_r} A</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Ampere S</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.pilot.ampere_s} A</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Ampere T</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.pilot.ampere_t} A</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Oil Pressure</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.pilot.oil_pressure}</span></div>
                  </div>
                </div>

                {/* Card 3: Oil Data */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Oil Data</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-500 dark:text-gray-400">Temperature</span><span className="font-medium text-gray-900 dark:text-white">{capturedData.oil.temperature} °C</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ✅ BAGIAN BARU: KELOMPOK TOMBOL (SIMPAN / BATAL)
          */}
          {capturedData ? (
            <div className="flex justify-center space-x-4">
              {/* Tombol "Simpan Data" */}
              <button
                onClick={handleSaveData}
                disabled={mutation.isPending}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {mutation.isPending ? "Menyimpan..." : "Konfirmasi & Simpan Data"}
              </button>
              {/* Tombol "Batal" */}
              <button
                onClick={handleCancel}
                disabled={mutation.isPending}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          ) : (
            // Tombol "Ambil Data" (default)
            <button
              onClick={handleCaptureData}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Ambil Data Manual
            </button>
          )}

          <h1 className="mt-3 text-gray-500 dark:text-gray-400 text-xl">
            {lastSaved ? `Penyimpanan terakhir: ${lastSaved}` : "Belum ada penyimpanan"}
          </h1>
        </>
      ) : (
        // === USER BELUM LOGIN ===
        <button
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
          onClick={() => openModal('signIn')}
        >
          Sign In Untuk Menyimpan Data
        </button>
      )}
    </div>
  );
}