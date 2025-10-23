"use client";

import React, { useEffect, useState, useRef } from "react";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { NotificationData } from "@/types/mqtt";
import { useMqtt } from "@/context/MqttContext";

export default function DailyInfo() {
  
  const [dateTime, setDateTime] = useState(new Date());
  const notification = useMqttSubscription<{notificatin: NotificationData}>("toho/resonac/notify");
  const {status} = useMqtt();

  const [mounted, setMounted] = useState(false);

  // ✅ 1. State baru untuk melacak status koneksi PLC secara spesifik
  const [isPlcError, setIsPlcError] = useState(false);
  // Ref untuk menyimpan ID timer agar bisa di-reset
  const plcErrorTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true); // Sudah di client
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ 2. useEffect untuk memantau notifikasi dan mengatur status error PLC
  useEffect(() => {
    // Jika ada objek notifikasi baru, berarti ada error dari PLC
    if (notification) {
      setIsPlcError(true); // Tampilkan status error PLC

      if (plcErrorTimer.current) {
        clearTimeout(plcErrorTimer.current);
      }

      plcErrorTimer.current = setTimeout(() => {
        setIsPlcError(false);
      }, 2500); // 2.5 detik (sedikit lebih lama dari interval notifikasi 1 detik)
    }

    // Cleanup function jika komponen di-unmount
    return () => {
      if (plcErrorTimer.current) {
        clearTimeout(plcErrorTimer.current);
      }
    };
  }, [notification]); // Hook ini akan berjalan setiap kali objek 'notification' berubah

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  if (!mounted) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 items-center text-gray-600 dark:text-gray-200 text-center md:text-2xl text-lg">
      {/* Logo */}
      <div className="text-left">
        <img
          src="/images/brand/resonac-clean.png"
          alt="logo"
          className="w-60 -ml-8"
        />
      </div>

      {/* Title */}
      <div className="hidden xl:block text-center">
        <h1 className="font-semibold text-gray-300 dark:text-gray-400">
          Realtime Utility Monitoring
        </h1>
      </div>

      {/* Status + Clock */}
      <div className="text-right flex items-center gap-2 justify-end">
        {/* ✅ 3. Tampilan status yang kondisional */}
        {isPlcError ? (
          // Jika ada error PLC, tampilkan ini
          <div className="text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>PLC Not Connected</span>
          </div>
        ) : (
          // Jika tidak ada error PLC, tampilkan status MQTT seperti biasa
          <div
            className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full ${
              status === "Connected"
                ? "bg-green-100 text-green-800"
                : status === "Connecting"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === "Connected"
                  ? "bg-green-600"
                  : status === "Connecting"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            />
            <span id="connText">{status}</span>
          </div>
        )}

        {/* Clock */}
        <span
          suppressHydrationWarning
          className="font-semibold text-gray-300 dark:text-gray-400 text-lg md:text-xl"
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
}