"use client";

import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertItem, AlertPayload } from "@/types/mqttType";
import { v4 as uuidv4 } from "uuid";


export default function AlertNotif() {
  const mqttData = useMqttSubscription<AlertPayload>("mqtt/alert");
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // Tambahkan alert baru setiap kali mqttData datang
  useEffect(() => {
    if (!mqttData) return;

    const id = uuidv4();
    const newAlert: AlertItem = { ...mqttData, id };

    setAlerts((prev) => {
      const updated = [newAlert, ...prev];
      if (updated.length > 3) updated.pop();
      return updated;
    });
  }, [mqttData]);

  // Timer auto-hapus 30 detik untuk setiap alert
  useEffect(() => {
    if (alerts.length === 0) return;

    // buat timer untuk setiap alert yang belum punya timer
    const timers = alerts.map((alert) =>
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
      }, 30000)
    );

    // bersihkan semua timer saat komponen unmount atau alert berubah
    return () => timers.forEach((t) => clearTimeout(t));
  }, [alerts]);

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {alerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`rounded-xl shadow-lg p-4 w-80 flex justify-between items-start border-l-4 ${
              alert.status === "HIGH"
                ? "bg-red-50 border-red-500 text-red-700"
                : alert.status === "LOW"
                ? "bg-yellow-50 border-yellow-500 text-yellow-700"
                : "bg-blue-50 border-blue-500 text-blue-700"
            }`}
          >
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {alert.topic} {alert.timestamp}
              </p>
              <p className="text-sm">{alert.message}</p>
            </div>
            <button
              onClick={() => removeAlert(alert.id)}
              className="text-gray-400 hover:text-gray-600 ml-3"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
