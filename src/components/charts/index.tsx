"use client";

import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the heavy chart component (recharts is ~50KB)
const GlucoseChartLazy = lazy(() => import("./glucose-chart").then(m => ({ default: m.GlucoseChart })));

// Re-export with lazy loading + Suspense fallback
export function GlucoseChart(props: any) {
  return (
    <Suspense fallback={<Skeleton className="w-full h-64 rounded-3xl" />}>
      <GlucoseChartLazy {...props} />
    </Suspense>
  );
}

export type { GlucoseChartProps, GlucoseDataPoint } from "./glucose-chart";
export { StatCard } from "./stat-card";
export type { StatCardProps } from "./stat-card";