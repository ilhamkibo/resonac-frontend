"use client";

import { thresholdService } from "@/services/thresholdService";
import {
  Threshold,
  ThresholdResponse,
  UpdateThresholdInput,
} from "@/types/thresholdType";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "sonner";
import Button from "../ui/button/Button";
import { useMqtt } from "@/context/MqttContext"; // ✅ Import MQTT context

export default function ThresholdsCard() {
  const queryClient = useQueryClient();
  const { status, publish } = useMqtt(); // ✅ Dapatkan fungsi publish dari context

  const {
    data: thresholds,
    isLoading,
    isError,
    error,
  } = useQuery<ThresholdResponse, Error>({
    queryKey: ["thresholds"],
    queryFn: () => thresholdService.getAllThreshold(),
    staleTime: 1000 * 60,
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    lowerLimit: number;
    upperLimit: number;
  }>({ lowerLimit: 0, upperLimit: 0 });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateThresholdInput }) =>
      thresholdService.updateThreshold(id, data),
    onSuccess: () => {
      toast.success("Threshold updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["thresholds"] });
      setEditingId(null);

      try {
        publish("toho/resonac/config/reload", { updated: true, timestamp: Date.now() });
        console.log("✅ MQTT message published to toho/resonac/config/reload");
      } catch (err) {
        console.error("❌ Failed to publish MQTT reload message", err);
      }
    },
    onError: (err: Error) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  const handleEdit = (threshold: Threshold) => {
    setEditingId(threshold.id);
    setEditValues({
      lowerLimit: threshold.lowerLimit,
      upperLimit: threshold.upperLimit,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleUpdate = () => {
    if (!editingId) return;
    if (status !== "Connected") {
      toast.error(`MQTT connection is in ${status} status. Please make sure MQTT is connected.`);
      return;
    }
    updateMutation.mutate({
      id: editingId,
      data: {
        lowerLimit: editValues.lowerLimit,
        upperLimit: editValues.upperLimit,
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Thresholds
        </h3>
        <h3 className="font-semibold text-gray-800 dark:text-gray-400">
          Threshold has min and max value
        </h3>
      </div>

      {isLoading && <div className="text-center p-5 text-gray-500 dark:text-gray-400">Loading thresholds...</div>}
      {isError && (
        <div className="text-center p-5 text-red-500">
            Error: {error.message}</div>
        )}
      {thresholds && (
        
        <table className="w-full mt-5">
            <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/10">
                    Area
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-3/10">
                    Parameter
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/10">
                    Min
                    </th>
                    <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/10">
                    Max
                    </th>
                    <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                    </th>
                </tr>
            </thead>
            <tbody>
            {thresholds?.map((threshold, index) => {
                const isEditing = editingId === threshold.id;
                return (
                <tr
                    key={index}
                    className={
                    index % 2 === 0
                        ? "bg-white dark:bg-gray-800"
                        : "bg-gray-50 dark:bg-gray-700"
                    }
                >
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                    {threshold.area}
                    </td>
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                    {threshold.parameter}
                    </td>

                    {/* MIN input */}
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                    {isEditing ? (
                        <div className="relative flex items-center">
                        <input
                            type="number"
                            value={editValues.lowerLimit}
                            onChange={(e) =>
                            setEditValues({
                                ...editValues,
                                lowerLimit: parseFloat(e.target.value),
                            })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleUpdate();
                                else if (e.key === "Escape") handleCancel();
                            }}
                            disabled={updateMutation.isPending}
                            className={`w-full px-2 py-1 text-left rounded-md outline-none transition ${
                            updateMutation.isPending
                                ? "bg-gray-200 dark:bg-gray-600 text-gray-400"
                                : "bg-gray-100 dark:bg-gray-600"
                            }`}
                        />
                        {updateMutation.isPending && (
                            <div className="absolute right-10 animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 dark:border-gray-200"></div>
                        )}
                        </div>
                    ) : (
                        threshold.lowerLimit
                    )}
                    </td>

                    {/* MAX input */}
                    <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">
                    {isEditing ? (
                        <div className="relative flex items-center ">
                        <input
                            type="number"
                            value={editValues.upperLimit}
                            onChange={(e) =>
                            setEditValues({
                                ...editValues,
                                upperLimit: parseFloat(e.target.value),
                            })
                            }
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleUpdate();
                                else if (e.key === "Escape") handleCancel();
                            }}
                            disabled={updateMutation.isPending}
                            className={`w-full px-2 py-1 text-left rounded-md outline-none transition ${
                            updateMutation.isPending
                                ? "bg-gray-200 dark:bg-gray-600 text-gray-400"
                                : "bg-gray-100 dark:bg-gray-600"
                            }`}
                        />
                        {updateMutation.isPending && (
                            <div className="absolute right-10 animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 dark:border-gray-200"></div>
                        )}
                        </div>
                    ) : (
                        threshold.upperLimit
                    )}
                    </td>

                    {/* ACTION buttons */}
                    <td className="p-3 text-sm text-gray-900 dark:text-white text-right">
                    {isEditing ? (
                        <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            onClick={handleUpdate}
                            disabled={updateMutation.isPending}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
                        >
                            {updateMutation.isPending ? "Saving..." : "Update"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleCancel}
                            disabled={updateMutation.isPending}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded disabled:opacity-70"
                        >
                            Cancel
                        </Button>
                        </div>
                    ) : (
                        <div className="flex justify-end gap-2">
                        <Button
                            size="sm"
                            onClick={() => handleEdit(threshold)}
                        >
                            Edit
                        </Button>
                        </div>
                    )}
                    </td>
                </tr>
                );
            })}
            </tbody>
        </table>

      )}
    </div>
  );
}
