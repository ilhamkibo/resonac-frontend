// "use client";

// import React, { useEffect, useState } from "react";
// import { useMqttContext } from "@/context/MqttContext";

// export default function DailyInfo() {
//   const [dateTime, setDateTime] = useState(new Date());
//   const { status } = useMqttContext();

//   useEffect(() => {
//     const timer = setInterval(() => setDateTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   const formattedTime = dateTime.toLocaleTimeString("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   });

//   return (
//     <div className="grid grid-cols-2 xl:grid-cols-3 items-center text-gray-600 dark:text-gray-200 text-center md:text-2xl text-lg">
//       <div className="text-left">
//         <img
//           src="/images/brand/resonac-clean.png"
//           alt="logo"
//           className="w-60 -ml-8"
//         />
//       </div>

//       <div className="hidden xl:block text-center">
//         <h1 className="font-semibold text-gray-300 dark:text-gray-400">
//           Realtime Utility Monitoring
//         </h1>
//       </div>

//       <div className="text-right flex items-center gap-2 justify-end">
//         {/* MQTT Status langsung di sini */}
//         <div
//           className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full ${
//             status === "Connected"
//               ? "bg-green-100 text-green-800"
//               : status === "Reconnecting..."
//               ? "bg-yellow-100 text-yellow-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           <span
//             className={`w-2 h-2 rounded-full ${
//               status === "Connected"
//                 ? "bg-green-600"
//                 : status === "Reconnecting..."
//                 ? "bg-yellow-600"
//                 : "bg-red-600"
//             }`}
//           />
//           <span id="connText">{status}</span>
//         </div>

//         {/* Clock */}
//         <span className="font-semibold text-gray-300 dark:text-gray-400 text-lg md:text-xl">
//           {formattedTime}
//         </span>
//       </div>
//     </div>
//   );
// }

"use client";

import { useWebSocket } from "@/context/WebSocketContext";
import React, { useEffect, useState } from "react";
// 1. Ganti import dari useMqttContext menjadi useWebSocket

export default function DailyInfo() {
  const [dateTime, setDateTime] = useState(new Date());
  // 2. Ganti pemanggilan hook
  const { status } = useWebSocket();
  console.log("🚀 ~ DailyInfo ~ status:", status)

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = dateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 items-center text-gray-600 dark:text-gray-200 text-center md:text-2xl text-lg">
      <div className="text-left">
        <img
          src="/images/brand/resonac-clean.png"
          alt="logo"
          className="w-60 -ml-8"
        />
      </div>

      <div className="hidden xl:block text-center">
        <h1 className="font-semibold text-gray-300 dark:text-gray-400">
          Realtime Utility Monitoring
        </h1>
      </div>

      <div className="text-right flex items-center gap-2 justify-end">
        {/* MQTT Status langsung di sini */}
        <div
          // 3. Ubah logika pengecekan status agar sesuai dengan output WebSocketContext
          className={`text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full ${
            status.includes("Connected")
              ? "bg-green-100 text-green-800"
              : status === "Reconnecting..."
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              status.includes("Connected")
                ? "bg-green-600"
                : status === "Reconnecting..."
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
          />
          <span id="connText">{status}</span>
        </div>

        {/* Clock */}
        <span className="font-semibold text-gray-300 dark:text-gray-400 text-lg md:text-xl">
          {formattedTime}
        </span>
      </div>
    </div>
  );
}