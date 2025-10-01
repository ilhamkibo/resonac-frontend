"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import mqttService from "@/lib/mqtt-client"; // Impor service kita
import { RealtimeData, LogsData } from "@/types/mqtt";

// Tipe data tetap sama
type MqttContextType = {
  realtime: RealtimeData | null;
  logs: LogsData | null;
  status: string;
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: React.ReactNode }) => {
  const [realtime, setRealtime] = useState<RealtimeData | null>(null);
  const [logs, setLogs] = useState<LogsData | null>(null);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    // Gunakan service untuk terhubung
    mqttService.connect(
      () => setStatus("Connected"),
      () => setStatus("Disconnected"),
      () => setStatus("Error ⚠️")
    );

    // Gunakan service untuk subscribe
    mqttService.subscribe("toho/resonac/value", (_, payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        setRealtime(msg.realtime);
        setLogs(msg.logs);
      } catch (e) {
        console.error("Invalid MQTT payload", e);
      }
    });

    // Cleanup
    return () => {
      mqttService.disconnect();
    };
  }, []);

  return (
    <MqttContext.Provider value={{ realtime, logs, status }}>
      {children}
    </MqttContext.Provider>
  );
};

// Hook useMqtt tetap sama
export const useMqtt = () => {
  const ctx = useContext(MqttContext);
  if (!ctx) throw new Error("useMqtt must be used inside MqttProvider");
  return ctx;
};