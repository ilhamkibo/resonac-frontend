"use client";
import React, { useState, useEffect }from 'react'

export default function ValueCard({label, value}: {label: string; value?: number}) {



  return (
    <div>
      <h1 className="text-lg text-gray-800 dark:text-gray-400">{label}</h1>
      <div className="border dark:bg-gray-800 bg-white py-1 rounded-lg shadow">
        <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-gray-400">
          {Number(value).toFixed(2)}
        </h1>
      </div>
    </div>
  );
}


  