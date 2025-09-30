"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Tipe untuk data yang akan kita bagikan
type WebSocketContextType = {
  status: string;
  messages: string[]; // Pesan WebSocket biasanya berupa string atau data biner
  sendMessage: (message: string) => void;
};

// Buat Context
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// Buat komponen Provider
export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState("Disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Alamat server WebSocket Anda (misalnya dari Node-RED)
    // Pastikan path-nya benar, contoh: /ws/data
    const ws = new WebSocket("ws://localhost:1881/ws/data/realtime");

    // Event handler saat koneksi berhasil dibuka
    ws.onopen = () => {
      setStatus("Connected ✅");
      console.log("WebSocket connection established.");
    };

    // Event handler saat menerima pesan dari server
    ws.onmessage = (event) => {
      // event.data berisi payload pesan
      setMessages((prevMessages) => [...prevMessages, event.data]);
      console.log("📥 New WebSocket message:", event.data);
    };

    // Event handler saat koneksi ditutup
    ws.onclose = () => {
      setStatus("Disconnected ❌");
      console.log("WebSocket connection closed.");
    };

    // Event handler untuk error
    ws.onerror = (error) => {
      setStatus("Error ⚠️");
      console.error("WebSocket error: ", error);
    };

    setSocket(ws);

    // Cleanup function: tutup koneksi saat komponen di-unmount
    return () => {
      ws.close();
    };
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  // Fungsi untuk mengirim pesan ke server
  const sendMessage = (message: string) => {
    // Pastikan koneksi dalam keadaan OPEN sebelum mengirim
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    } else {
      console.error("Cannot send message, WebSocket is not open.");
    }
  };

  const value = { status, messages, sendMessage };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Buat custom hook untuk mempermudah penggunaan context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};