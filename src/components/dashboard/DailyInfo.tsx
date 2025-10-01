"use client";

import React, { useEffect, useState } from "react";
import { useMqtt } from "@/context/MqttContext";

export default function DailyInfo() {
  const [dateTime, setDateTime] = useState(new Date());
  const { status } = useMqtt();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ✅ sudah di client
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  
  if (!mounted) {
    // Saat SSR, return kosong → tidak terjadi mismatch
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
        <div
          className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full ${
            status === "Connected"
              ? "bg-green-100 text-green-800"
              : status === "Reconnecting..."
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              status === "Connected"
                ? "bg-green-600"
                : status === "Reconnecting..."
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
          />
          <span id="connText">{status}</span>
        </div>

        {/* Clock */}
        <span suppressHydrationWarning className="font-semibold text-gray-300 dark:text-gray-400 text-lg md:text-xl">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}
