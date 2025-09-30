// "use client";

// import React, { useEffect, useState } from "react";
// import { getMqttClient } from "@/lib/mqttClient";

// export default function MqttListener() {
//   const [status, setStatus] = useState("Disconnected");

//   useEffect(() => {
//     const client = getMqttClient();

//     const handleConnect = () => setStatus("Connected");
//     const handleReconnect = () => setStatus("Reconnecting...");
//     const handleClose = () => setStatus("Disconnected");
//     const handleError = () => setStatus("Error ⚠️");
//     // const handleConnect = () => setStatus("Connected ✅");
//     // const handleReconnect = () => setStatus("Reconnecting...");
//     // const handleClose = () => setStatus("Disconnected ❌");
//     // const handleError = () => setStatus("Error ⚠️");

//     client.on("connect", handleConnect);
//     client.on("reconnect", handleReconnect);
//     client.on("close", handleClose);
//     client.on("error", handleError);

//     // Subscribe topik
//     client.subscribe("ecommerce/sales");

//     return () => {
//       client.off("connect", handleConnect);
//       client.off("reconnect", handleReconnect);
//       client.off("close", handleClose);
//       client.off("error", handleError);
//     };
//   }, []);

//   return (
//     <div className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full ${status === "Connected" ? "bg-green-100 text-green-800" : (status === "Reconnecting..." ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800")}`}>
//       <span className={`w-2 h-2 rounded-full ${status === "Connected" ? "bg-green-600" : (status === "Reconnecting..." ? "bg-yellow-600" : "bg-red-600")}`}></span>
//       <span id="connText">{status}</span>
//     </div>
//   );
// }

"use client";

import React from "react";
import { useMqttContext } from "@/context/MqttContext";

export default function MqttListener() {
  const { status } = useMqttContext();

  return (
    <div
      className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full ${
        status === "Connected"
          ? "bg-green-100 text-green-800"
          : status === "Reconnecting..."
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          status === "Connected"
            ? "bg-green-600"
            : status === "Reconnecting..."
            ? "bg-yellow-600"
            : "bg-red-600"
        }`}
      ></span>
      <span id="connText">{status}</span>
    </div>
  );
}
