// src/lib/env.ts
export const env = {
  mqttUrl: process.env.NEXT_PUBLIC_MQTT_URL ?? "ws://broker.emqx.io:8083/mqtt",
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};
