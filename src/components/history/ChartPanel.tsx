// components/dashboard/ChartPanel.tsx
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ChartPanelProps {
    series: { name: string; data: (number | null)[] }[];
    timestamps: string[];
    isLoading: boolean;
}

export default function ChartPanel({ series, timestamps, isLoading }: ChartPanelProps) {
    const options: ApexOptions = {
        chart: { type: "line", toolbar: { show: true } },
        stroke: { curve: "smooth", width: 3 },
        xaxis: { categories: timestamps, title: { text: "Time" } },
        yaxis: { title: { text: "Value" } },
        legend: { position: "top" },
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Trend Chart</h2>

            {isLoading && <div>Loading Chart Data...</div>}

            {!isLoading && series[0]?.data.length > 0 ? (
                <ReactApexChart
                    type="line"
                    height={320}
                    series={series}
                    options={options}
                />
            ) : (
                !isLoading && <div className="p-4 text-sm text-gray-500">No data to display</div>
            )}
        </div>
    );
}