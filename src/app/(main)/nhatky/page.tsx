"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { GlucoseChart, GlucoseDataPoint } from "@/components/charts/glucose-chart";
import { glucoseThresholds } from "@/lib/design-system";
import { cn } from "@/lib/utils";

// Types
interface GlucoseReading {
  id: string;
  value: number;
  timing: "fasting" | "before_meal" | "after_meal" | "bedtime";
  notes?: string;
  created_at: string;
}

const TIMING_OPTIONS = [
  { value: "fasting", label: "Lúc đói" },
  { value: "before_meal", label: "Trước ăn" },
  { value: "after_meal", label: "Sau ăn" },
  { value: "bedtime", label: "Trước ngủ" },
];

// Generate mock data
function generateMockGlucoseData(): GlucoseReading[] {
  const today = new Date();
  const data: GlucoseReading[] = [];

  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const readingsCount = Math.floor(Math.random() * 2) + 2;
    const timings = ["fasting", "before_meal", "after_meal", "bedtime"] as const;

    for (let j = 0; j < readingsCount; j++) {
      const timing = timings[Math.floor(Math.random() * timings.length)];
      let baseValue = 5.5 + Math.random() * 2;
      if (timing === "after_meal") baseValue += 2;
      if (timing === "fasting") baseValue -= 0.5;

      const value = Math.round((baseValue + (Math.random() - 0.5)) * 10) / 10;

      data.push({
        id: `${i}-${j}`,
        value: Math.max(3, Math.min(12, value)),
        timing,
        created_at: new Date(date.setHours(7 + j * 4, Math.floor(Math.random() * 60))).toISOString(),
      });
    }
  }

  return data.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function getStatus(value: number): "normal" | "high" | "low" {
  if (value < glucoseThresholds.low) return "low";
  if (value > glucoseThresholds.high) return "high";
  return "normal";
}

// Glucose Chart Card with chart-grid background
function GlucoseChartCard({ data }: { data: GlucoseDataPoint[] }) {
  const latestValue = data[0]?.value || 0;
  const status = getStatus(latestValue);

  const statusLabels = {
    normal: "Ổn định",
    high: "Cao",
    low: "Thấp",
  };

  return (
    <Card variant="elevated" className="w-full rounded-3xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="timeline" className="w-5 h-5 text-primary" filled />
            Đường huyết 7 ngày
          </CardTitle>
          <span className={cn(
            "px-3 py-1 rounded-full text-label-lg font-medium bg-primary text-on-primary",
            status === "high" && "bg-error text-white",
            status === "low" && "bg-warning text-amber-900"
          )}>
            {statusLabels[status]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-grid rounded-2xl p-4 min-h-[200px]">
          {data.length > 0 ? (
            <GlucoseChart data={data} showNormalRange />
          ) : (
            <div className="h-64 flex items-center justify-center text-on-surface-variant">
              Chưa có dữ liệu
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Glucose History Item with color coding
function GlucoseHistoryItem({ reading }: { reading: GlucoseReading }) {
  const status = getStatus(reading.value);
  const timingLabel =
    reading.timing === "fasting"
      ? "Lúc đói"
      : reading.timing === "before_meal"
      ? "Trước ăn"
      : reading.timing === "after_meal"
      ? "Sau ăn"
      : "Trước ngủ";

  const timeLabel = reading.timing === "fasting" ? "Sáng" : reading.timing === "after_meal" ? "Chiều" : "";

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant",
      status === "normal" && "border-l-4 border-l-primary",
      status === "high" && "border-l-4 border-l-error",
      status === "low" && "border-l-4 border-l-tertiary"
    )}>
      <div className="flex items-center gap-3">
        <Icon
          name="water_drop"
          className={cn(
            "w-5 h-5",
            status === "normal" ? "text-primary" :
            status === "high" ? "text-error" : "text-tertiary"
          )}
          filled
        />
        <div>
          <div className="text-body-lg font-semibold text-on-surface">
            {timingLabel} {timeLabel && `(${timeLabel})`}
          </div>
          <div className="text-label-lg text-on-surface-variant">
            {reading.value} mmol/L
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-body-lg font-semibold text-on-surface">
          {reading.value}
        </div>
        <div className="text-label-lg text-on-surface-variant">
          {new Date(reading.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

// Add Glucose Card
function AddGlucoseCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-primary-container text-on-primary-container shadow-lg active:scale-95 transition-transform"
    >
      <Icon name="add" className="w-8 h-8" />
      <span className="text-label-lg font-medium">Thêm mới</span>
    </button>
  );
}

// Reminder Card
function ReminderCard({ count }: { count: number }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-secondary-container text-on-secondary-container">
      <Icon name="notifications" className="w-8 h-8" filled />
      <span className="text-label-lg font-medium">{count} thuốc</span>
    </div>
  );
}

// Globe Chart Data Converter
function getChartData(readings: GlucoseReading[]): GlucoseDataPoint[] {
  const last7Days = readings.filter((r) => {
    const readingDate = new Date(r.created_at);
    const today = new Date();
    const diffDays = Math.floor(
      (today.getTime() - readingDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 6;
  });

  const grouped: Record<string, number[]> = {};
  last7Days.forEach((r) => {
    const dateKey = new Date(r.created_at).toISOString().split("T")[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(r.value);
  });

  return Object.entries(grouped).map(([date, values]) => ({
    date,
    value: Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10,
  }));
}

// Main Page Component
export default function NhatkyPage() {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setReadings(generateMockGlucoseData());
      setLoading(false);
    }, 300);
  }, []);

  const chartData = getChartData(readings);
  const todayReadings = readings.filter((r) => {
    const today = new Date().toDateString();
    return new Date(r.created_at).toDateString() === today;
  });

  return (
    <Page title="Theo dõi tiểu đường">
      <div className="p-6 space-y-4">
        {/* Glucose Chart Card */}
        <GlucoseChartCard data={chartData} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-surface-container-lowest text-center border border-outline-variant">
            <div className="text-label-lg text-on-surface-variant">Số lần đo hôm nay</div>
            <div className="text-headline-md text-primary">{todayReadings.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-surface-container-lowest text-center border border-outline-variant">
            <div className="text-label-lg text-on-surface-variant">Trung bình</div>
            <div className="text-headline-md text-primary">
              {todayReadings.length > 0
                ? (todayReadings.reduce((a, b) => a + b.value, 0) / todayReadings.length).toFixed(1)
                : "--"}
            </div>
          </div>
        </div>

        {/* Add and Reminder buttons */}
        <div className="grid grid-cols-2 gap-3">
          <AddGlucoseCard onClick={() => {}} />
          <ReminderCard count={3} />
        </div>

        {/* History */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-3">Lịch sử hôm nay</h2>
          {!loading && todayReadings.length > 0 ? (
            <div className="space-y-2">
              {todayReadings.slice(0, 5).map((reading) => (
                <GlucoseHistoryItem key={reading.id} reading={reading} />
              ))}
            </div>
          ) : loading ? (
            <div className="text-center py-8 text-on-surface-variant">Đang tải...</div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              Chưa có dữ liệu hôm nay
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}