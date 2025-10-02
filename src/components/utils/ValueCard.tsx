"use client";
import React, { useState, useEffect }from 'react'

type Props = {
  label?: string;
  value?: number;
  style?: string;
  size?: string;
  fixed?: number;
  color?: string;
  unit?: string
}

export default function ValueCard({label, value, style, size="4xl", fixed=1, color="text-gray-800 dark:text-gray-300", unit}: Props) {

  return (
    <div className={style}>
      <h1 className={`text-lg font-bold ${color}`}>{label}</h1>
      <div className="border py-1 rounded-lg px-1.5 shadow">
        <h1 className={`text-center text-${size} font-bold text-gray-800 dark:text-gray-300 `}>
          {Number(value).toFixed(fixed)} {unit}
        </h1>
      </div>
    </div>
  );
}


  