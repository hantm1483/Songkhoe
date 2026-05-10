"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Types
interface LabResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  type: "hba1c" | "cholesterol" | "creatinine";
  date: string;
  reference_min: number;
  reference_max: number;
}

// Generate mock lab results
function generateMockLabResults(): LabResult[] {
  const results: LabResult[] = [
    // HbA1c - target < 7%
    {
      id: "1",
      name: "HbA1c",
      value: 6.8,
      unit: "%",
      type: "hba1c",
      date: new Date(-30 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 4.0,
      reference_max: 7.0,
    },
    {
      id: "2",
      name: "HbA1c",
      value: 7.2,
      unit: "%",
      type: "hba1c",
      date: new Date(-60 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 4.0,
      reference_max: 7.0,
    },
    {
      id: "3",
      name: "HbA1c",
      value: 7.5,
      unit: "%",
      type: "hba1c",
      date: new Date(-90 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 4.0,
      reference_max: 7.0,
    },
    // Cholesterol - target < 200 mg/dL
    {
      id: "4",
      name: "Cholesterol",
      value: 185,
      unit: "mg/dL",
      type: "cholesterol",
      date: new Date(-30 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 0,
      reference_max: 200,
    },
    {
      id: "5",
      name: "Cholesterol",
      value: 195,
      unit: "mg/dL",
      type: "cholesterol",
      date: new Date(-60 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 0,
      reference_max: 200,
    },
    {
      id: "6",
      name: "Cholesterol",
      value: 210,
      unit: "mg/dL",
      type: "cholesterol",
      date: new Date(-90 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 0,
      reference_max: 200,
    },
    // Creatinine - normal range 0.7-1.3 mg/dL
    {
      id: "7",
      name: "Creatinine",
      value: 1.0,
      unit: "mg/dL",
      type: "creatinine",
      date: new Date(-30 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 0.7,
      reference_max: 1.3,
    },
    {
      id: "8",
      name: "Creatinine",
      value: 1.1,
      unit: "mg/dL",
      type: "creatinine",
      date: new Date(-60 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 0.7,
      reference_max: 1.3,
    },
    {
      id: "9",
      name: "Creatinine",
      value: 1.2,
      unit: "mg/dL",
      type: "creatinine",
      date: new Date(-90 * 24 * 60 * 60 * 1000).toISOString(),
      reference_min: 0.7,
      reference_max: 1.3,
    },
  ];

  return results.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function getStatus(value: number, min: number, max: number): "normal" | "high" | "low" {
  if (value < min) return "low";
  if (value > max) return "high";
  return "normal";
}

function getTrend(
  current: number,
  previous: number,
  min: number,
  max: number
): "up" | "down" | "stable" {
  const range = max - min;
  const diff = current - previous;
  if (Math.abs(diff) < range * 0.05) return "stable";
  return diff > 0 ? "up" : "down";
}

// Lab Result Card
function LabResultCard({
  results,
  type,
}: {
  results: LabResult[];
  type: LabResult["type"];
}) {
  const filteredResults = results.filter((r) => r.type === type);
  const latest = filteredResults[0];
  const previous = filteredResults[1];

  if (!latest) return null;

  const status = getStatus(
    latest.value,
    latest.reference_min,
    latest.reference_max
  );
  const trend = previous
    ? getTrend(latest.value, previous.value, latest.reference_min, latest.reference_max)
    : "stable";

  const TrendIcon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    trend === "up"
      ? status === "high"
        ? "text-error"
        : "text-primary"
      : trend === "down"
      ? status === "low"
        ? "text-error"
        : "text-primary"
      : "text-on-surface-variant";

  return (
    <Card variant="elevated" className="w-full">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-body-lg text-on-surface-variant">{latest.name}</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={cn(
                  "text-display-lg font-bold",
                  status === "normal"
                    ? "text-primary"
                    : status === "high"
                    ? "text-error"
                    : "text-warning"
                )}
              >
                {latest.value}
              </span>
              <span className="text-body-md text-on-surface-variant">
                {latest.unit}
              </span>
            </div>
            <div className="text-label-lg text-on-surface-variant mt-1">
              {latest.reference_min}-{latest.reference_max}
              {latest.unit}
            </div>
          </div>
          <div className="text-right">
            <Badge
              variant={
                status === "normal"
                  ? "success"
                  : status === "high"
                  ? "error"
                  : "warning"
              }
            >
              {status === "normal"
                ? "Bình thường"
                : status === "high"
                ? "Cao"
                : "Thấp"}
            </Badge>
            <div className={cn("flex items-center gap-1 mt-2", trendColor)}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-label-lg">
                {trend === "up"
                  ? "Tăng"
                  : trend === "down"
                  ? "Giảm"
                  : "Ổn định"}
              </span>
            </div>
          </div>
        </div>
        <div className="text-label-lg text-on-surface-variant mt-2 flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(latest.date).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Lab Result Chart
function LabResultChart({
  results,
  type,
}: {
  results: LabResult[];
  type: LabResult["type"];
}) {
  const filteredResults = results
    .filter((r) => r.type === type)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const data = filteredResults.map((r) => ({
    date: new Date(r.date).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
    }),
    value: r.value,
    refMin: r.reference_min,
    refMax: r.reference_max,
  }));

  if (data.length < 2) return null;

  const Colors: Record<LabResult["type"], string> = {
    hba1c: "#006262",
    cholesterol: "#136299",
    creatinine: "#943b23",
  };

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#6f7979" }}
            axisLine={{ stroke: "#bec9c8" }}
          />
          <YAxis
            domain={["dataMin - 1", "dataMax + 1"]}
            tick={{ fontSize: 12, fill: "#6f7979" }}
            axisLine={{ stroke: "#bec9c8" }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload?.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-surface-container-low rounded-lg px-3 py-2 shadow-soft-elevation">
                    <p className="text-label-lg text-on-surface-variant">{label}</p>
                    <p
                      className={cn(
                        "text-body-lg font-semibold",
                        getStatus(data.value, data.refMin, data.refMax) === "normal"
                          ? "text-primary"
                          : "text-error"
                      )}
                    >
                      {data.value} {data.refMax > 10 ? "mg/dL" : "%"}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={Colors[type]}
            strokeWidth={3}
            dot={{ fill: Colors[type], strokeWidth: 2, r: 4 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Main Page Component
export default function XetNghiemPage() {
  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setResults(generateMockLabResults());
      setLoading(false);
    }, 300);
  }, []);

  const handleAISummary = async () => {
    setAiLoading(true);

    try {
      // Call the lab summary API
      const response = await fetch("/api/lab-results/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labResults: results }),
      });

      if (!response.ok) throw new Error("Failed to get summary");

      const data = await response.json();
      setAiSummary(data.summary);
    } catch (error) {
      console.error("AI summary error:", error);

      // Fallback mock summary
      setAiSummary(
        "Các chỉ số xét nghiệm của bạn đang ở mức ổn định. HbA1c gần đạt mục tiêu, cần duy trì chế độ ăn uống và tập thể dục đều đặn. Cholesterol trong giới hạn cho phép. Creatinine bình thường, chức năng thận tốt."
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <Page title="Xét nghiệm">
      <div className="space-y-4 p-6">
        {/* AI Summary Button */}
        <Card variant="elevated" className="w-full">
          <CardContent className="pt-4">
            {aiSummary ? (
              <div className="space-y-3">
                <h3 className="text-body-lg font-semibold text-on-surface flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Tóm tắt AI
                </h3>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {aiSummary}
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setAiSummary(null)}
                  className="w-full"
                >
                  Tóm tắt khác
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleAISummary}
                disabled={aiLoading}
                className="w-full"
              >
                <Sparkles className="w-5 h-5" />
                {aiLoading ? "Đang tạo..." : "Tóm tắt bằng AI"}
              </Button>
            )}
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-8 text-on-surface-variant">Đang tải...</div>
        ) : (
          <>
            {/* HbA1c */}
            <div>
              <h2 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-primary" />
                HbA1c (Hemoglobin A1c)
              </h2>
              <div className="space-y-3">
                <LabResultCard results={results} type="hba1c" />
                <Card variant="default">
                  <CardContent className="pt-4">
                    <LabResultChart results={results} type="hba1c" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Cholesterol */}
            <div>
              <h2 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-secondary" />
                Cholesterol
              </h2>
              <div className="space-y-3">
                <LabResultCard results={results} type="cholesterol" />
                <Card variant="default">
                  <CardContent className="pt-4">
                    <LabResultChart results={results} type="cholesterol" />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Creatinine */}
            <div>
              <h2 className="text-headline-md text-on-surface mb-3 flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-tertiary" />
                Creatinine
              </h2>
              <div className="space-y-3">
                <LabResultCard results={results} type="creatinine" />
                <Card variant="default">
                  <CardContent className="pt-4">
                    <LabResultChart results={results} type="creatinine" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </Page>
  );
}