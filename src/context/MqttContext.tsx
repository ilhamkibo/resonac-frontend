"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import mqtt, { MqttClient } from "mqtt";
import { env } from "@/lib/env";

type Message = {
  topic: string;
  payload: string;
};

type MqttContextType = {
  client: MqttClient | null;
  messages: Message[];
  publish: (topic: string, message: string) => void;
  status: string;
};

const MqttContext = createContext<MqttContextType | undefined>(undefined);

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const newClient = mqtt.connect(env.mqttUrl);

    newClient.on("connect", () => setStatus("Connected"));
    newClient.on("reconnect", () => setStatus("Reconnecting..."));
    newClient.on("close", () => setStatus("Disconnected"));
    newClient.on("error", () => setStatus("Error ⚠️"));

    newClient.on("message", (topic, payload) => {
        const msg = { topic, payload: payload.toString() };
        console.log("📥 New MQTT message:", msg);  // ✅ log setiap pesan masuk
        setMessages((prev) => [...prev, msg]);
    });

    

    // subscribe contoh topic
    newClient.subscribe("ecommerce/sales");

    setClient(newClient);

    return () => {
      newClient.end(true);
    };
  }, []);

  const publish = (topic: string, message: string) => {
    if (client) client.publish(topic, message);
  };

  return (
    <MqttContext.Provider value={{ client, messages, publish, status }}>
      {children}
    </MqttContext.Provider>
  );
};

export const useMqttContext = () => {
  const ctx = useContext(MqttContext);
  if (!ctx) throw new Error("useMqttContext must be used inside MqttProvider");
  return ctx;
};
