"use client";

import { useEffect, useState } from "react";
import { getMqttClient } from "@/lib/mqttClient";

export function useMqtt(topic: string) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const client = getMqttClient();

    client.subscribe(topic, (err) => {
      if (err) {
        console.error("❌ Failed to subscribe:", err);
      }
    });

    client.on("message", (t, payload) => {
      if (t === topic) {
        setMessages((prev) => [...prev, payload.toString()]);
      }
    });

    return () => {
      client.unsubscribe(topic);
    };
  }, [topic]);

  return messages;
}
