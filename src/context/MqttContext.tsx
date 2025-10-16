// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import mqttService from "@/services/mqtt/mqttService";
// import { MqttClient } from "mqtt";

// type MqttContextType = {
//   status: "Connected" | "Disconnected" | "Error" | "Connecting";
//   client: MqttClient | null;
// };

// const MqttContext = createContext<MqttContextType | undefined>(undefined);

// export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
//   const [status, setStatus] = useState<
//     "Connected" | "Disconnected" | "Error" | "Connecting"
//   >("Connecting");
//   const [client, setClient] = useState<MqttClient | null>(null);

//   useEffect(() => {
//     mqttService.connect(
//       () => {
//         console.log("✅ MQTT Connected");
//         setStatus("Connected");
//         // @ts-ignore
//         setClient(mqttService.client);
//       },
//       () => {
//         console.warn("❌ MQTT Disconnected");
//         setStatus("Disconnected");
//       },
//       (err) => {
//         console.error("🚨 MQTT Connection Error:", err);
//         setStatus("Error");
//       },
//       () => {
//         console.log("🔁 MQTT Reconnecting...");
//         setStatus("Connecting");
//       },
//       () => {
//         console.warn("⚠️ MQTT Offline");
//         setStatus("Disconnected");
//       }
//     );

//     return () => {
//       mqttService.disconnect();
//     };
//   }, []);

//   return (
//     <MqttContext.Provider value={{ status, client }}>
//       {children}
//     </MqttContext.Provider>
//   );
// };

// export const useMqtt = () => {
//   const context = useContext(MqttContext);
//   if (!context) {
//     throw new Error("useMqtt must be used within an MqttProvider");
//   }
//   return context;
// };

// GEMINI
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import mqttService from "@/services/mqtt/mqttService";
// ✅ Hapus import MqttClient jika tidak digunakan langsung di sini
// import { MqttClient } from "mqtt";

type MqttContextType = {
  status: "Connected" | "Disconnected" | "Error" | "Connecting";
  // ✅ Client tidak perlu di-expose ke seluruh aplikasi,
  // ini adalah detail implementasi dari service.
  // client: MqttClient | null; 
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

// ✅ Flag untuk memastikan connect() hanya dipanggil sekali
let isMqttConnected = false;

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<
    "Connected" | "Disconnected" | "Error" | "Connecting"
  >("Connecting");
  // Hapus state client dari sini

  useEffect(() => {
    // ✅ Hanya jalankan setup koneksi jika belum pernah dijalankan sebelumnya
    if (!isMqttConnected) {
      mqttService.connect(
        () => {
          console.log("✅ MQTT Connected");
          setStatus("Connected");
          isMqttConnected = true; // Tandai sudah terhubung
        },
        () => {
          console.warn("❌ MQTT Disconnected");
          setStatus("Disconnected");
          isMqttConnected = false; // Tandai sudah terputus
        },
        (err) => {
          console.error("🚨 MQTT Connection Error:", err);
          setStatus("Error");
          isMqttConnected = false;
        },
        () => {
          console.log("🔁 MQTT Reconnecting...");
          setStatus("Connecting");
        },
        () => {
          console.warn("⚠️ MQTT Offline");
          setStatus("Disconnected");
          isMqttConnected = false;
        }
      );
    }

    // ✅ HAPUS FUNGSI CLEANUP DISCONNECT
    // Fungsi ini adalah penyebab utama masalah saat Fast Refresh.
    // Biarkan koneksi tetap hidup selama aplikasi berjalan.
    // return () => {
    //   mqttService.disconnect(); 
    // };

  }, []); // Dependency array kosong, hanya berjalan sekali per siklus hidup aplikasi

  return (
    // Sediakan hanya status, karena komponen lain tidak perlu tahu tentang instance client
    <MqttContext.Provider value={{ status }}>
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

// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import mqttService from "@/services/mqtt/mqttService";
// import { MqttClient } from "mqtt";

// type MqttContextType = {
//   status: "Connected" | "Disconnected" | "Error" | "Connecting";
//   client: MqttClient | null;
// };

// const MqttContext = createContext<MqttContextType | undefined>(undefined);

// export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
//   const [status, setStatus] = useState<
//     "Connected" | "Disconnected" | "Error" | "Connecting"
//   >("Connecting");
//   const [client, setClient] = useState<MqttClient | null>(null);

//   useEffect(() => {
//     mqttService.connect(
//       () => {
//         console.log("✅ MQTT Connected");
//         setStatus("Connected");
//         // @ts-ignore
//         setClient(mqttService.client);
//       },
//       () => {
//         console.warn("❌ MQTT Disconnected");
//         setStatus("Disconnected");
//       },
//       (err) => {
//         console.error("🚨 MQTT Connection Error:", err);
//         setStatus("Error");
//       },
//       () => {
//         console.log("🔁 MQTT Reconnecting...");
//         setStatus("Connecting");
//       },
//       () => {
//         console.warn("⚠️ MQTT Offline");
//         setStatus("Disconnected");
//       }
//     );

//     // ⛔ tambahkan listener unload agar koneksi diputus sebelum reload
//     const handleUnload = () => {
//       console.log("💡 Disconnecting MQTT before unload...");
//       mqttService.disconnect();
//     };

//     window.addEventListener("beforeunload", handleUnload);

//     return () => {
//       window.removeEventListener("beforeunload", handleUnload);
//       mqttService.disconnect();
//     };
//   }, []);

//   return (
//     <MqttContext.Provider value={{ status, client }}>
//       {children}
//     </MqttContext.Provider>
//   );
// };

// export const useMqtt = () => {
//   const context = useContext(MqttContext);
//   if (!context) {
//     throw new Error("useMqtt must be used within an MqttProvider");
//   }
//   return context;
// };
