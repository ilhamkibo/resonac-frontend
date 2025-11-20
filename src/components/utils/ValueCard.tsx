"use client";
import React from "react";

type Props = {
  label?: string;
  value?: number | string;
  style?: string;
  size?: string;
  fixed?: number;
  color?: string;
  unit?: string;
};

export default function ValueCard({
  label,
  value,
  style,
  size = "4xl",
  fixed = 1,
  color = "text-gray-800 dark:text-gray-300",
  unit,
}: Props) {

  // ❗ Check apakah value valid number
  const isValid =
    value !== undefined &&
    value !== null &&
    !Number.isNaN(Number(value));

  return (
    <div className={style}>
      <h1 className={`text-lg font-bold ${color}`}>{label}</h1>

      <div className="border py-1 rounded-lg px-1.5 shadow min-h-[60px] flex items-center justify-center">
        {isValid ? (
          // ====== VALUE NORMAL ======
          <h1 className={`text-${size} font-bold text-gray-800 dark:text-gray-300`}>
            {Number(value).toFixed(fixed)} {unit}
          </h1>
        ) : (
          // ====== SKELETON ======
          <div className="w-20 h-8 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse" />
        )}
      </div>
    </div>
  );
}
