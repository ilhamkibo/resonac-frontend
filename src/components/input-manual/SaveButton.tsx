import React from "react";

interface SaveButtonProps {
  onSave: () => void;
  lastSavedText?: string | null; // menerima string sederhana
}

export default function SaveButton({ onSave, lastSavedText }: SaveButtonProps) {
  return (
    <div className="my-6 text-center">
      <button
        onClick={onSave}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition"
      >
        Simpan Data
      </button>

      <h1 className="mt-3 text-gray-500 dark:text-gray-400 text-xl">
        {lastSavedText ? `Penyimpanan terakhir: ${lastSavedText}` : "Belum ada penyimpanan"}
      </h1>
    </div>
  );
}
