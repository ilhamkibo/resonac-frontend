import React from 'react'

export default function MainKwh() {
  return (
   <div className="bg-slate-50 p-3 rounded-lg lg:col-span-2">
        <div className="flex justify-between items-center mb-2">
            <div className="text-sm font-medium">KWh (total)</div>
            <div className="text-lg font-semibold" id="mainKWh">0 kWh</div>
        </div>
        <div id="mainKWhChart" className="big-chart"></div>
    </div>
  )
}
