"use client";

import { useState, useEffect } from "react";
import mqttService from "@/services/mqtt/mqttService";
import { useMqtt } from "@/context/MqttContext";

// Tipe generic <T> agar hook ini bisa digunakan untuk berbagai bentuk data
export function useMqttSubscription<T>(topic: string): T | null {
  const { status } = useMqtt(); // Dapatkan status koneksi
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    // Pastikan kita hanya subscribe saat client sudah terhubung
    if (status !== 'Connected') {
      return;
    }

    const handleMessage = (payload: Buffer) => {
      try {
        const message = JSON.parse(payload.toString());
        console.log("🚀 ~ handleMessage ~ message:", message)
        setData(message);
      } catch (e) {
        console.error(`Failed to parse MQTT message from topic: ${topic}`, e);
      }
    };

    // Gunakan service untuk subscribe
    mqttService.subscribe(topic, handleMessage);

    // ✅ Fungsi cleanup yang sangat penting
    return () => {
        // Saat komponen unmount, kita perlu "unsubscribe" dari service kita
        // Tambahkan method unsubscribe di MqttService Anda
        // mqttService.unsubscribe(topic); 
        // Note: `mqtt.js` tidak punya unsubscribe per-handler, jadi modifikasi MqttService diperlukan
        // atau biarkan saja jika topiknya akan selalu aktif.
        mqttService.unsubscribe(topic, handleMessage);
    };
  }, [topic, status]); // Jalankan ulang effect jika topik atau status koneksi berubah

  return data;
}