"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import mqttService from "@/services/mqtt/mqttService";

type MqttContextType = {
  status: "Connected" | "Disconnected" | "Error" | "Connecting";
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

// ✅ Flag untuk memastikan connect() hanya dipanggil sekali
let hasInitialized = false;

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {

  const [status, setStatus] = useState(() => mqttService.getStatus());

  useEffect(() => {
    // ✅ Pastikan listener hanya dipasang sekali
    if (!hasInitialized) {
      mqttService.connect(
        () => setStatus("Connected"),
        () => setStatus("Disconnected"),
        (err) => setStatus("Error"),
        () => setStatus("Connecting"),
        () => setStatus("Disconnected")
      );
      hasInitialized = true;
    }
  }, []); // Dependency kosong, hanya berjalan sekali

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
