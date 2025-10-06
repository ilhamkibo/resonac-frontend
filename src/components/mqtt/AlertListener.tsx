"use client";

import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertItem, AlertPayload } from "@/types/mqtt";

export default function AlertNotif() {
  const mqttData = useMqttSubscription<AlertPayload>("mqtt/alert");
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    if (!mqttData) return;

    setAlerts((prev) => {
      const newAlert: AlertItem = {
        ...mqttData,
        id: crypto.randomUUID(),
      };

      // Maksimal 3 notifikasi, hapus yang tertua jika lebih
      const updated = [newAlert, ...prev];
      if (updated.length > 3) updated.pop();
      return updated;
    });
  }, [mqttData]);

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
            <div>
              <p className="font-semibold text-sm">{alert.topic} {alert.timestamp}</p>
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