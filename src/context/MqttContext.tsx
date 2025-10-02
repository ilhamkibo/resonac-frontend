// "use client";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import mqttService from "@/lib/mqtt-client"; // Impor service kita
// import { RealtimeData, LogsData, NotificationData } from "@/types/mqtt";

// // Tipe data tetap sama
// type MqttContextType = {
//   realtime: RealtimeData | null;
//   logs: LogsData | null;
//   status: string;
//   notification: NotificationData | null;
// };

// const MqttContext = createContext<MqttContextType | undefined>(undefined);

// export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
//   const [realtime, setRealtime] = useState<RealtimeData | null>(null);
//   const [logs, setLogs] = useState<LogsData | null>(null);
//   const [status, setStatus] = useState("Disconnected");
//   const [notification, setNotification] = useState<NotificationData | null>(null);

//   useEffect(() => {
//     // Gunakan service untuk terhubung
//     mqttService.connect(
//       () => setStatus("Connected"),
//       () => setStatus("Disconnected"),
//       () => setStatus("Error ⚠️")
//     );

//      // ✅ Subscribe pertama dengan SATU argumen
//     mqttService.subscribe("toho/resonac/value", (payload) => {
//       try {
//         const msg = JSON.parse(payload.toString());
//         setRealtime(msg.realtime);
//         setLogs(msg.logs);
//       } catch (e) {
//         console.error("Invalid MQTT payload", e);
//       }
//     });

//     // ✅ Subscribe kedua dengan SATU argumen
//     mqttService.subscribe("toho/resonac/notify", (payload) => {
//       try {
//         const msg = JSON.parse(payload.toString()) as NotificationData;
//         setNotification({ ...msg, time: new Date().toISOString() });
//       } catch (e) {
//         console.error("Invalid Notification payload", e);
//       }
//     });
//     // Cleanup
//     return () => {
//       mqttService.disconnect();
//     };
//   }, []);

//   return (
//     <MqttContext.Provider value={{ realtime, logs, status, notification }}>
//       {children}
//     </MqttContext.Provider>
//   );
// };

// // Hook useMqtt tetap sama
// export const useMqtt = () => {
//   const ctx = useContext(MqttContext);
//   if (!ctx) throw new Error("useMqtt must be used inside MqttProvider");
//   return ctx;
// };

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import mqttService from "@/lib/mqtt/mqttService";
import { MqttClient } from "mqtt";

type MqttContextType = {
  status: 'Connected' | 'Disconnected' | 'Error' | 'Connecting';
  client: MqttClient | null; // Sediakan akses ke client jika diperlukan
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'Connected' | 'Disconnected' | 'Error' | 'Connecting'>('Connecting');
  const [client, setClient] = useState<MqttClient | null>(null);

  useEffect(() => {
    // Koneksi hanya dilakukan sekali saat provider di-mount
    mqttService.connect(
      () => {
        setStatus("Connected");
        // @ts-ignore (Akses properti privat untuk dibagikan ke context)
        setClient(mqttService.client); 
      },
      () => setStatus("Disconnected"),
      (err) => {
        console.error("MQTT Connection Error:", err);
        setStatus("Error");
      }
    );

    return () => {
      mqttService.disconnect();
    };
  }, []);

  return (
    <MqttContext.Provider value={{ status, client }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error("useMqtt must be used within an MqttProvider");
  }
  return context;
};