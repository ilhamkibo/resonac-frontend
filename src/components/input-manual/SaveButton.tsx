
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function SaveButton({ initialData = [] }: { initialData: any[] }) {
    const [lastSaved, setLastSaved] = useState<string | null>(null);
    const { user } = useAuth();

  const handleSave = () => {
    const now = new Date().toLocaleString("id-ID");
    setLastSaved(now);
    toast.success("Data berhasil disimpan!");
  };

  return (
    <div className="my-6 text-center">
      {user ? (
        <>
      <button
        onClick={handleSave}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
      >
        Simpan Data
      </button>

      <h1 className="mt-3 text-gray-500 dark:text-gray-400 text-xl">
        {lastSaved ? `Penyimpanan terakhir: ${lastSaved}` : "Belum ada penyimpanan"}
      </h1>
        </>

      ) : (
        <Link href="/signin" className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition">
          Sign In Untuk Menyimpan Data
        </Link>
      )}
    </div>
  );
}
