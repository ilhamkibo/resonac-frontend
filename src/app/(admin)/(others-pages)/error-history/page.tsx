import DataErrorTable from "@/components/error-history/DataErrorTable";
import HistoryCompareCard from "@/components/error-history/HistoryCompareCard";
import { errorHistoryService } from "@/services/errorHistoryService";
import React from "react";
import Link from "next/link"; // Gunakan Link Next.js untuk navigasi/reload

// --- Komponen Inline untuk Tampilan Error yang Lebih Baik ---
export const dynamic = "force-dynamic";
export const revalidate = 0;
// Komponen Card Error Sederhana (untuk data perbandingan)
const SimpleErrorCard = ({ title, message }: { title: string; message: string }) => (
    <div className="flex items-center justify-between p-5 bg-white border-l-4 border-red-500 rounded-lg shadow-md mb-6 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center">
            {/* Icon Peringatan */}
            <svg className="w-6 h-6 text-red-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
                <h3 className="text-md font-semibold text-red-800">{title}</h3>
                <p className="text-sm text-red-600 mt-1">{message}</p>
            </div>
        </div>
        {/* Menggunakan Link untuk 'Coba Lagi' (solusi Server Component) */}
        <Link href="/error-history" className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-150 shadow-sm">
            Coba Lagi
        </Link>
    </div>
);

// Komponen Full Page Error (untuk data tabel utama)
const FullDataError = ({ title, message }: { title: string; message: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-10 bg-white rounded-xl border border-gray-200 shadow-xl mt-8">
        {/* Icon Besar */}
        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">{title}</h3>
        <p className="text-gray-500 text-center max-w-lg mb-6">
            {message}
        </p>
        {/* Menggunakan Link untuk 'Muat Ulang Halaman' */}
        <Link 
            href="/" // Mengarahkan ke halaman utama (memicu reload server)
            className="mt-4 px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-150 shadow-lg"
        >
            Muat Ulang Halaman
        </Link>
    </div>
);

// --- Halaman Utama (Server Component) ---

export default async function Page() {

 const compareData = await errorHistoryService.getErrorHistoryCompare();
 const errorData = await errorHistoryService.getErrorHistory({page: "1", limit: "10", period: "monthly"});
 
 return (
  <div className="p-6 min-h-screen">
   
   {compareData ? (
    <HistoryCompareCard {...compareData} />
   ) : (
    <SimpleErrorCard
        title="Gagal Memuat Data Perbandingan"
        message="Kami tidak dapat mengambil metrik perbandingan bulanan. Periksa koneksi Anda."
    />
   )}

   {/* 2. Display Data Error Utama */}
   {errorData ? (
    <DataErrorTable {...errorData} />
   ) : (
    <FullDataError
      title="Data Riwayat Error Tidak Tersedia"
      message="Terjadi kesalahan saat mengambil daftar riwayat error. Mungkin ada masalah koneksi atau server."
    />
   )}

  </div>
 );
}