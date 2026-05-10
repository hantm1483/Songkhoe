"use client";

import { HTMLAttributes, forwardRef } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO, eachDayOfInterval, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { glucoseThresholds } from "@/lib/design-system";

export interface GlucoseDataPoint {
  date: string; // ISO date string
  value: number;
}

export interface GlucoseChartProps extends HTMLAttributes<HTMLDivElement> {
  data: GlucoseDataPoint[];
  showNormalRange?: boolean;
}

const getStatusColor = (value: number): string => {
  if (value < glucoseThresholds.low) return "#f59e0b"; // low - yellow
  if (value > glucoseThresholds.high) return "#ef4444"; // high - red
  return "#006262"; // normal - primary teal
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    return (
      <div className="bg-surface-container-low rounded-lg px-3 py-2 shadow-soft-elevation">
        <p className="text-label-lg text-on-surface-variant">{label}</p>
        <p
          className={cn("text-body-lg font-semibold")}
          style={{ color: getStatusColor(value) }}
        >
          {value} mmol/L
        </p>
      </div>
    );
  }
  return null;
};

const GlucoseChart = forwardRef<HTMLDivElement, GlucoseChartProps>(
  ({ className, data, showNormalRange = true, ...props }, ref) => {
    // Generate last 7 days date range
    const today = new Date();
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    // Map data to chart format, ensure all 7 days are present
    const chartData = last7Days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const dataPoint = data.find((d) => d.date === dateStr);
      return {
        date: format(day, "dd/MM"),
        value: dataPoint?.value ?? null,
      };
    });

    return (
      <div ref={ref} className={cn("w-full h-64", className)} {...props}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#6f7979" }}
              axisLine={{ stroke: "#bec9c8" }}
              tickLine={{ stroke: "#bec9c8" }}
            />
            <YAxis
              domain={[0, 15]}
              tick={{ fontSize: 12, fill: "#6f7979" }}
              axisLine={{ stroke: "#bec9c8" }}
              tickLine={{ stroke: "#bec9c8" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />

            {showNormalRange && (
              <>
                {/* Upper limit reference line */}
                <ReferenceLine
                  y={glucoseThresholds.high}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
                {/* Lower limit reference line */}
                <ReferenceLine
                  y={glucoseThresholds.low}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeOpacity={0.5}
                />
              </>
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke="#006262"
              strokeWidth={3}
              dot={{
                fill: "#006262",
                strokeWidth: 2,
                r: 4,
              }}
              activeDot={{
                fill: "#006262",
                strokeWidth: 2,
                r: 6,
              }}
              connectNulls={false}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    );
  }
);

GlucoseChart.displayName = "GlucoseChart";

export { GlucoseChart };