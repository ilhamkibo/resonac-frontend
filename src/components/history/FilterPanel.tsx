// components/dashboard/FilterPanel.tsx
import DatePicker from "@/components/form/date-picker";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Period, AggregationType } from "./HistoryDashboard";
import { toast } from "sonner";

interface FilterPanelProps {
    filters: ReturnType<typeof import("./HistoryDashboard").useDashboardFilters>;
    ChevronDownIcon: React.ElementType;
}

const aggregationTypes: { value: AggregationType; label: string }[] = [
    { value: "min", label: "Min" },
    { value: "max", label: "Max" },
    { value: "avg", label: "Average" },
    { value: "none", label: "None" },
];

export default function FilterPanel({ filters, ChevronDownIcon }: FilterPanelProps) {
    const {
        aggregationType, setAggregationType,
        activeFilterMode, setActiveFilterMode,
        period, setPeriod,
        startDate, endDate,
        handleStartChange, handleEndChange,
        limit, setLimit,
        resetPage
    } = filters;

    const handleAggregationClick = (type: AggregationType) => {
        // Cek validitas untuk aggregation selain "none"
        const isPeriodModeValid =
            activeFilterMode === "period" && period !== undefined && period !== "none";

        const isDateModeValid =
            activeFilterMode === "date" && startDate && endDate;

        if (type !== "none" && !isPeriodModeValid && !isDateModeValid) {
            toast.error("Pilih Period atau Date Range terlebih dahulu");
            return;
        }

        // Success → set aggregation
        setAggregationType(type);
        resetPage();
    };

    const handleFilterModeChange = (mode: "period" | "date") => {
        setActiveFilterMode(mode);
        if (mode === "period") {
            // atur ulang Date range
        } else {
            setPeriod("none");
        }
        resetPage();
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow space-y-4">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-300">Aggregation</h1>

            {/* Aggregation Buttons */}
            <div className="flex gap-4">
                {aggregationTypes.map((type) => (
                    <Button
                        key={type.value}
                        size="sm"
                        className={`${
                            type.value === (aggregationType || "none")
                                ? "bg-brand-600 text-white"
                                : "bg-gray-300 dark:bg-gray-700"
                        }`}
                        onClick={() => handleAggregationClick(type.value)}
                    >
                        {type.label}
                    </Button>
                ))}
            </div>

            {/* Filter Modes */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        size="sm"
                        className={`px-4 py-2 rounded ${
                            activeFilterMode === "period"
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-300 dark:bg-gray-700"
                        }`}
                        onClick={() => handleFilterModeChange("period")}
                    >
                        Period
                    </Button>

                    <Button
                        size="sm"
                        className={`px-4 py-2 rounded ${
                            activeFilterMode === "date"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-300 dark:bg-gray-700"
                        }`}
                        onClick={() => handleFilterModeChange("date")}
                    >
                        Date Range
                    </Button>

                    {/* PERIOD SELECT */}
                    {activeFilterMode === "period" && (
                        <div className="relative">
                            <Select
                                defaultValue={period}
                                className="border px-2 py-1 rounded text-gray-600 dark:text-gray-400"
                                onChange={(value) => {
                                    setPeriod(value as Period);
                                    resetPage();
                                }}
                                options={[
                                    { value: "none", label: "None" },
                                    { value: "hour", label: "Hourly" },
                                    { value: "day", label: "Daily" },
                                    { value: "week", label: "Weekly" },
                                    { value: "month", label: "Monthly" },
                                ]}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon size={16} />
                            </span>
                        </div>
                    )}

                    {/* DATE RANGE PICKERS */}
                    {activeFilterMode === "date" && (
                        <div className="flex gap-3">
                            <DatePicker
                                id="startDate"
                                placeholder="Start Date"
                                onChange={handleStartChange}
                            />
                            <DatePicker
                                id="endDate"
                                placeholder="End Date"
                                onChange={handleEndChange}
                            />
                        </div>
                    )}
                </div>

                {/* LIMIT + EXPORT */}
                <div className="flex gap-4 items-end">
                    <div>
                        <Label>Limit</Label>
                        <div className="relative">
                            <Select
                                options={[
                                    { value: "5", label: "5" },
                                    { value: "10", label: "10" },
                                    { value: "25", label: "25" },
                                    { value: "50", label: "50" },
                                ]}
                                className="border px-2 py-1 rounded text-gray-600 dark:text-gray-400"
                                onChange={(value) => setLimit(Number(value))}
                                defaultValue={limit.toString()}
                            />
                            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                <ChevronDownIcon size={16} />
                            </span>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => alert("Export CSV")}
                    >
                        Export CSV
                    </Button>
                </div>
            </div>
        </div>
    );
}
