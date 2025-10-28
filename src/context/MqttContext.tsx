// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import mqttService from "@/services/mqtt/mqttService";

// type MqttContextType = {
//   status: "Connected" | "Disconnected" | "Error" | "Connecting";
// };

// const MqttContext = createContext<MqttContextType | undefined>(undefined);

// // ✅ Flag untuk memastikan connect() hanya dipanggil sekali
// let hasInitialized = false;

// export const MqttProvider = ({ children }: { children: React.ReactNode }) => {

//   const [status, setStatus] = useState(() => mqttService.getStatus());

//   useEffect(() => {
//     // ✅ Pastikan listener hanya dipasang sekali
//     if (!hasInitialized) {
//       mqttService.connect(
//         () => setStatus("Connected"),
//         () => setStatus("Disconnected"),
//         (err) => setStatus("Error"),
//         () => setStatus("Connecting"),
//         () => setStatus("Disconnected")
//       );
//       hasInitialized = true;
//     }
//   }, []); // Dependency kosong, hanya berjalan sekali

//   return (
//     // Sediakan hanya status, karena komponen lain tidak perlu tahu tentang instance client
//     <MqttContext.Provider value={{ status }}>
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

// Lokasi file: src/context/MqttContext.tsx

"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import mqttService, { ConnectionStatus } from "@/services/mqttService";

type MqttContextType = {
  status: ConnectionStatus;
  reconnect: () => void;
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<ConnectionStatus>(() => mqttService.getStatus());
  const connectionTimer = useRef<NodeJS.Timeout | null>(null);
  const isTimeoutActive = useRef(false);

  const handleSetStatus = (newStatus: ConnectionStatus) => {
    if (newStatus === "Connecting") {
      if (isTimeoutActive.current) {
        setStatus("Connecting");
        return;
      }
      setStatus("Connecting");
      isTimeoutActive.current = true;
      connectionTimer.current = setTimeout(() => {
        console.error("Connection timed out after 15 seconds.");
        setStatus("Error");
        isTimeoutActive.current = false;
      }, 15000);
    } else {
      if (connectionTimer.current) {
        clearTimeout(connectionTimer.current);
      }
      isTimeoutActive.current = false;
      setStatus(newStatus);
    }
  };

  useEffect(() => {
    const onConnectHandler = () => handleSetStatus("Connected");
    const onCloseHandler = () => handleSetStatus("Disconnected");
    const onErrorHandler = (err: Error) => handleSetStatus("Error");
    const onReconnectHandler = () => handleSetStatus("Connecting");
    const onOfflineHandler = () => handleSetStatus("Disconnected");

    mqttService.connect(
      onConnectHandler,
      onCloseHandler,
      onErrorHandler,
      onReconnectHandler,
      onOfflineHandler
    );

    return () => {
      mqttService.cleanupListeners();
    };
  }, []);

  const reconnect = () => {
    handleSetStatus("Connecting");
    mqttService.manualReconnect();
  };

  return (
    <MqttContext.Provider value={{ status, reconnect }}>
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