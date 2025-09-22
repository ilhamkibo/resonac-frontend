"use client";

import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;

export function getMqttClient() {
  if (!client) {
    client = mqtt.connect("ws://broker.emqx.io:8083/mqtt", {
      reconnectPeriod: 2000, // reconnect tiap 2 detik
      connectTimeout: 5000,  // timeout koneksi 5 detik
      clientId: "nextjs-dashboard-" + Math.random().toString(16).substr(2, 8),
      clean: true,
    });

    client.on("connect", () => {
      console.log("✅ MQTT Connected");
    });

    client.on("reconnect", () => {
      console.log("🔄 Reconnecting to MQTT...");
    });

    client.on("close", () => {
      console.log("❌ MQTT Disconnected");
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
    });
  }

  return client;
}
