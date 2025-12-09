"use client";

import { useMqttSubscription } from "@/lib/hooks/useMqttSubscription";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertItem, AlertPayload, ManualInputError } from "@/types/mqttType";
import { v4 as uuidv4 } from "uuid";

export default function AlertNotif() {
  const mqttData = useMqttSubscription<AlertPayload>("toho/resonac/error");
  const mqttReminder = useMqttSubscription<ManualInputError>("toho/resonac/manual_error");

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [reminder, setReminder] = useState<ManualInputError | null>(null);
  const lastReminderTimeout = useRef<NodeJS.Timeout | null>(null);

  /* ----- REMINDER ----- */
  useEffect(() => {
    if (!mqttReminder) return;

    // update reminder dan selalu hanya 1
    setReminder(mqttReminder);

    // reset timeout setiap pesan datang
    if (lastReminderTimeout.current) clearTimeout(lastReminderTimeout.current);

    // jika dalam 10 detik tidak ada MQTT incoming → hilangkan reminder
    lastReminderTimeout.current = setTimeout(() => {
      setReminder(null);
    }, 10000);
  }, [mqttReminder]);

  /* ----- ALERT ERROR ----- */
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

  useEffect(() => {
    if (alerts.length === 0) return;
    const timers = alerts.map((a) =>
      setTimeout(
        () => setAlerts((prev) => prev.filter((x) => x.id !== a.id)),
        30000
      )
    );
    return () => timers.forEach(clearTimeout);
  }, [alerts]);

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <>
      {/* ALERT ERROR — kanan atas */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
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

      {/* REMINDER — kiri bawah (selalu hanya 1) */}
      <div className="fixed top-4 left-4 z-50">
        <AnimatePresence>
          {reminder && (
            <motion.div
              key="reminder"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-red-50 border-l-4 animate-pulse border-red-600 text-red-800 shadow-lg p-4 rounded-xl w-80 flex gap-2"
            >
              <div className="text-2xl">🔔</div>
              <div>
                <p className="font-semibold text-sm">DATA MANUAL INPUT!</p>
                <p className="text-sm">{reminder.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
