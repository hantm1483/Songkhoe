"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GlucoseChart, GlucoseDataPoint } from "@/components/charts/glucose-chart";
import { Droplets, Plus, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { glucoseThresholds } from "@/lib/design-system";

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

  // Generate readings for the past 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // 2-3 readings per day
    const readingsCount = Math.floor(Math.random() * 2) + 2;
    const timings = ["fasting", "before_meal", "after_meal", "bedtime"] as const;

    for (let j = 0; j < readingsCount; j++) {
      const timing = timings[Math.floor(Math.random() * timings.length)];
      // Realistic glucose values (4-10 mmol/L)
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

function getStatusBadgeVariant(status: "normal" | "high" | "low") {
  switch (status) {
    case "normal":
      return "success";
    case "high":
      return "error";
    case "low":
      return "warning";
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
  });
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

  // Group by date and get average
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

// Glucose Log Form
function GlucoseLogForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { value: number; timing: string; notes?: string }) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState("");
  const [timing, setTiming] = useState("fasting");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 20) {
      setError("Vui lòng nhập giá trị hợp lệ (1-20)");
      return;
    }

    onSubmit({ value: numValue, timing, notes: notes || undefined });
  };

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle>Thêm đường huyết mới</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Chỉ số đường huyết (mmol/L)"
          type="number"
          step="0.1"
          min="1"
          max="20"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          error={error}
          placeholder="VD: 6.5"
        />

        <Select
          label="Thời điểm đo"
          options={TIMING_OPTIONS}
          value={timing}
          onChange={(e) => setTiming(e.target.value)}
        />

        <Input
          label="Ghi chú (tuỳ chọn)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="VD: Ăn sáng hơi muộn..."
        />

        <div className="flex gap-3 pt-2">
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            <Plus className="w-5 h-5" />
            Lưu
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Huỷ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Glucose History List
function GlucoseHistoryList({
  readings,
  onLoadMore,
}: {
  readings: GlucoseReading[];
  onLoadMore?: () => void;
}) {
  // Group by date
  const grouped: Record<string, GlucoseReading[]> = {};
  readings.forEach((r) => {
    const dateKey = new Date(r.created_at).toLocaleDateString("vi-VN");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(r);
  });

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-label-lg font-semibold text-on-surface-variant mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {date}
          </h3>
          <div className="space-y-2">
            {items.map((reading) => {
              const status = getStatus(reading.value);
              const timingLabel =
                reading.timing === "fasting"
                  ? "Lúc đói"
                  : reading.timing === "before_meal"
                  ? "Trước ăn"
                  : reading.timing === "after_meal"
                  ? "Sau ăn"
                  : "Trước ngủ";

              return (
                <div
                  key={reading.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg bg-surface-container-low"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Droplets
                      className={cn(
                        "w-5 h-5",
                        status === "normal"
                          ? "text-primary"
                          : status === "high"
                          ? "text-error"
                          : "text-warning"
                      )}
                    />
                    <div>
                      <div className="text-body-lg font-semibold text-on-surface">
                        {reading.value} mmol/L
                      </div>
                      <div className="text-label-lg text-on-surface-variant">
                        {timingLabel}
                        {reading.notes && ` - ${reading.notes}`}
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(status)}>
                    {status === "normal"
                      ? "Bình thường"
                      : status === "high"
                      ? "Cao"
                      : "Thấp"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {onLoadMore && readings.length > 0 && (
        <Button variant="ghost" onClick={onLoadMore} className="w-full">
          Xem thêm
          <ChevronRight className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}

// Main Page Component
export default function NhatkyPage() {
  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setReadings(generateMockGlucoseData());
      setLoading(false);
    }, 500);
  }, []);

  const chartData = getChartData(readings);

  const handleSubmit = (data: { value: number; timing: string; notes?: string }) => {
    const newReading: GlucoseReading = {
      id: Date.now().toString(),
      value: data.value,
      timing: data.timing as GlucoseReading["timing"],
      notes: data.notes,
      created_at: new Date().toISOString(),
    };

    setReadings((prev) => [newReading, ...prev]);
    setShowForm(false);
  };

  const todayStats = readings
    .filter((r) => {
      const today = new Date().toDateString();
      return new Date(r.created_at).toDateString() === today;
    })
    .reduce(
      (acc, r) => {
        acc.count++;
        acc.sum += r.value;
        return acc;
      },
      { count: 0, sum: 0 }
    );

  const avgGlucose = todayStats.count > 0 ? todayStats.sum / todayStats.count : null;

  return (
    <Page title="Nhật ký">
      <div className="space-y-4 p-6">
        {/* Today's Stats */}
        <Card variant="elevated" className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-primary" />
              Đường huyết 7 ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <GlucoseChart data={chartData} showNormalRange />
            ) : (
              <div className="h-64 flex items-center justify-center text-on-surface-variant">
                {loading ? "Đang tải..." : "Chưa có dữ liệu"}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card variant="default" className="text-center">
            <CardContent className="py-3">
              <div className="text-label-lg text-on-surface-variant">
                Số lần đo hôm nay
              </div>
              <div className="text-headline-md text-primary">{todayStats.count}</div>
            </CardContent>
          </Card>
          <Card variant="default" className="text-center">
            <CardContent className="py-3">
              <div className="text-label-lg text-on-surface-variant">Trung bình hôm nay</div>
              <div className="text-headline-md text-primary">
                {avgGlucose ? `${avgGlucose.toFixed(1)}` : "--"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Button / Form */}
        {showForm ? (
          <GlucoseLogForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowForm(true)}
            className="w-full"
          >
            <Plus className="w-5 h-5" />
            Thêm đường huyết
          </Button>
        )}

        {/* History */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-3">Lịch sử</h2>
          {!loading && readings.length > 0 ? (
            <GlucoseHistoryList readings={readings.slice(0, 20)} />
          ) : loading ? (
            <div className="text-center py-8 text-on-surface-variant">Đang tải...</div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              Chưa có dữ liệu đường huyết
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}