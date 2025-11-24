"use client";

import React, { useEffect, useState, useRef } from "react";
import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { NotificationData } from "@/types/mqttType";
import { useMqtt } from "@/context/MqttContext";

export default function DailyInfo() {
  const [dateTime, setDateTime] = useState(new Date());
  const notification = useMqttSubscription<{ notificatin: NotificationData }>(
    "toho/resonac/notify"
  );
  const { status, reconnect } = useMqtt();

  const [mounted, setMounted] = useState(false);
  const [isPlcError, setIsPlcError] = useState(false);

  const plcErrorTimer = useRef<NodeJS.Timeout | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const connectingWatchdog = useRef<NodeJS.Timeout | null>(null);

  // ⏰ Update jam realtime
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🚨 Animasi PLC error
  useEffect(() => {
    if (notification) {
      setIsPlcError(true);
      if (plcErrorTimer.current) clearTimeout(plcErrorTimer.current);
      plcErrorTimer.current = setTimeout(() => {
        setIsPlcError(false);
      }, 2500);
    }
    return () => {
      if (plcErrorTimer.current) clearTimeout(plcErrorTimer.current);
    };
  }, [notification]);

  // 🔁 Auto reconnect kalau Disconnected/Error
  useEffect(() => {
    if (status === "Disconnected" || status === "Error") {
      if (!reconnectTimer.current) {
        console.log(`MQTT ${status}. Auto reconnect dalam 5 detik...`);
        reconnectTimer.current = setTimeout(() => {
          console.log("🔁 Menjalankan auto reconnect...");
          reconnect();
          reconnectTimer.current = null;
        }, 5000);
      }
    } else if (status === "Connected" || status === "Connecting") {
      // Batalkan auto reconnect jika sudah nyambung / sedang nyambung
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    }

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };
  }, [status, reconnect]);

  // 🕒 Watchdog untuk "Connecting" stuck terlalu lama
  useEffect(() => {
    if (status === "Connecting") {
      if (!connectingWatchdog.current) {
        connectingWatchdog.current = setTimeout(() => {
          console.warn("⚠️ MQTT stuck in Connecting >10s. Force reconnect...");
          reconnect();
          connectingWatchdog.current = null;
        }, 10000); // 10 detik
      }
    } else {
      // Reset watchdog kalau sudah berubah status
      if (connectingWatchdog.current) {
        clearTimeout(connectingWatchdog.current);
        connectingWatchdog.current = null;
      }
    }

    return () => {
      if (connectingWatchdog.current) {
        clearTimeout(connectingWatchdog.current);
        connectingWatchdog.current = null;
      }
    };
  }, [status, reconnect]);

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  if (!mounted) return null;

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 items-center text-gray-600 dark:text-gray-200 text-center md:text-2xl text-lg">
      {/* 🏢 Logo */}
      <div className="text-left">
        <img
          src="/images/brand/resonac-clean.png"
          alt="logo"
          className="w-60 -ml-8"
        />
      </div>

      {/* 🧭 Title */}
      <div className="hidden xl:block text-center">
        <h1 className="font-semibold text-gray-300 dark:text-gray-400">
          Realtime Utility Monitoring
        </h1>
      </div>

      {/* 🔌 Status + Clock */}
      <div className="text-right flex items-center gap-2 justify-end">
        {isPlcError ? (
          <div className="text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span>PLC Not Connected</span>
          </div>
        ) : (
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

            {/* 🔘 Tombol manual reconnect */}
            {(status === "Disconnected" ||
              status === "Error" ||
              status === "Connecting") && (
              <button
                onClick={reconnect}
                disabled={!!reconnectTimer.current}
                className="ml-1 px-2 py-0.5 text-xs font-medium text-center text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400"
              >
                {reconnectTimer.current
                  ? "Retrying in 5s..."
                  : status === "Connecting"
                  ? "Force Reconnect"
                  : "Reconnect"}
              </button>
            )}
          </div>
        )}

        {/* ⏰ Clock */}
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
