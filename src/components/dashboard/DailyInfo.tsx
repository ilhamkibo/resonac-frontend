"use client";
import React, { useEffect, useState } from "react";
import MqttListener from "../mqtt/MqttListener";
import { useMqtt } from "@/hooks/useMqtt";

export default function DailyInfo() {
  const [dateTime, setDateTime] = useState(new Date());
  const messages = useMqtt("test");

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000); // update tiap detik

    return () => clearInterval(timer); // cleanup saat unmount
  }, []);

  const day = dateTime.toLocaleDateString("en-US", { weekday: "long" }); // Sunday
  const formattedDate = dateTime.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); // 19 May 2023
  
  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }); // 10:00:00 AM

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 items-center text-gray-600 dark:text-gray-200 text-center md:text-2xl text-lg">
    {/* <div className="grid grid-cols-2 md:grid-cols-3 items-center text-gray-600 dark:text-gray-200 gap-4 text-center bg-white dark:bg-white/[0.03] p-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-xl"> */}
        {/* <div className="text-left">{day}</div> */}
        <div className="text-left">
        <h1 className="font-semibold text-black text-lg md:text-2xl dark:text-gray-400">
          Realtime Utility Monitoring
        </h1>
        </div>
        <div className="hidden xl:block text-center">
          <h1 className="font-semibold text-black dark:text-gray-400">DASHBOARD</h1>
        </div>
        <div className="text-right flex items-center gap-2 justify-end">
          <MqttListener />
          <span className="font-semibold text-black dark:text-gray-400 text-lg md:text-xl">
          {formattedTime}
          </span>
        </div>
    </div>

  );
}
