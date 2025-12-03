"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import mqttService, { ConnectionStatus } from "@/services/mqttService";

type MqttContextType = {
  status: ConnectionStatus;
  reconnect: () => void;
  publish: (topic: string, message: string | object) => void; // 🆕 Tambahkan
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
    const onErrorHandler = () => handleSetStatus("Error");
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

  const publish = (topic: string, message: string | object) => {
    mqttService.publish(topic, message);
  };

  return (
    <MqttContext.Provider value={{ status, reconnect, publish }}>
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