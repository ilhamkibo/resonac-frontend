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