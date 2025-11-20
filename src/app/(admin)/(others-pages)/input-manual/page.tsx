import ManualInputDashboard from "@/components/input-manual/ManualInputDashboard";
import SkeletonDashboard from "@/components/input-manual/SkeletonDashboard";
import { manualInputService } from "@/services/manualInputService";
import { thresholdService } from "@/services/thresholdService";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page() {
  const thresholds = await thresholdService.getAllThreshold();
  const historyInputManualData = await manualInputService.getManualInputs({
    page: 1,
    limit: 10,
    period: "monthly",
  });

  return (
    <Suspense fallback={<SkeletonDashboard />}>
      {thresholds && historyInputManualData ? (
        <ManualInputDashboard
          thresholds={thresholds}
          initialManualInputs={historyInputManualData}
        />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-12  mx-auto my-12">
        {/* Icon Visual */}
        <svg className="w-16 h-16 text-red-500 mb-6 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
        </svg>
        
        {/* Header dan Pesan */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Gagal Memuat Dashboard Input Manual</h2>
        <p className="text-gray-500 text-center max-w-lg mb-8">
            Terjadi kesalahan fatal saat mengambil data **Thresholds** atau **Riwayat Input Manual**. 
            Pastikan layanan *backend* berjalan dan koneksi stabil.
        </p>

        {/* Tombol Aksi (Reload melalui Link) */}
        <Link 
            href="/input-manual" // Mengarahkan ke halaman root (memicu server side render ulang)
            className="mt-4 px-8 py-3 text-lg font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition duration-150 shadow-md transform hover:scale-105"
        >
            Coba Muat Ulang Halaman
        </Link>
        <p className="text-xs text-gray-400 mt-3">Jika masalah berlanjut, hubungi Administrator.</p>
    </div>
      )
      }
    </Suspense>
  );
}
