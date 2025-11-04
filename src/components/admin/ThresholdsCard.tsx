import Link from 'next/link'
import React from 'react'

export default function ThresholdsCard() {
  return (
    <div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-5">
            <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Thresholds</h3>
            <Link href="/admin/thresholds" className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500">
                Manage Thresholds
            </Link>
            </div>
            <table className="w-full mt-5">
            <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min</th>
                <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max</th>
                </tr>
            </thead>
            <tbody>
                {[
                { parameter: "Oil Pressure", area: "Oil", min: 10, max: 20 },
                {parameter: "Oil Temperature", area: "Oil", min: 30, max: 40 },
                {parameter: "Ampere R", area: "Main Pump", min: 10, max: 20 },
                {parameter: "Ampere S", area: "Main Pump", min: 10, max: 20 },
                {parameter: "Ampere T", area: "Main Pump", min: 10, max: 20 },
                ].map((threshold, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                    {threshold.parameter}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                    {threshold.area}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                    {threshold.min}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                    {threshold.max}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
    </div>
  )
}
