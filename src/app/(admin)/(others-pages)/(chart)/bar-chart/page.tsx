import BarChartOne from "@/components/charts/bar/BarChartOne";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Bar Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Bar Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Log History" />
      <div className="space-y-6">
        <ComponentCard title="Chart 1">
          <BarChartOne />
        </ComponentCard>
        <ComponentCard title="Chart 2">
          <BarChartOne />
        </ComponentCard>
      </div>
    </div>
  );
}
