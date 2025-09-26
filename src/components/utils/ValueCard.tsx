"use client";
import React, { useState, useEffect }from 'react'

export default function ValueCard({label}: {label: string}) {

    const [value, setValue] = useState(0);

  // Update random setiap 1 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setValue(Number((Math.random() * 500).toFixed(2))); // contoh dummy 0-500
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div>
      <h1 className="text-lg text-gray-800 dark:text-gray-400">{label}</h1>
      <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
        <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
          {value}
        </h1>
      </div>
    </div>
  );
}


  