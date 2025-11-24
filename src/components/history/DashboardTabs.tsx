// components/dashboard/DashboardTabs.tsx
import { Area } from "./HistoryDashboard";

interface DashboardTabsProps {
    activeTab: Area;
    setActiveTab: (tab: Area) => void;
}

export default function DashboardTabs({ activeTab, setActiveTab }: DashboardTabsProps) {
    return (
        <div className="flex space-x-4 justify-center">
            {(["main", "pilot", "oil"] as Area[]).map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-400 hover:bg-gray-500"
                }`}
            >
                {tab === "main" ? "Main Pump" : tab === "pilot" ? "Pilot Pump" : "Oil Temp"}
            </button>
            ))}
        </div>
    );
}