"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
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
  return [
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
  ];
}

function getStatus(value: number, min: number, max: number): "normal" | "high" | "low" {
  if (value < min) return "low";
  if (value > max) return "high";
  return "normal";
}

// Lab Type Tabs - segmented control, rounded-full
function LabTypeTabs({
  activeType,
  onChange,
}: {
  activeType: "hba1c" | "cholesterol" | "creatinine";
  onChange: (type: "hba1c" | "cholesterol" | "creatinine") => void;
}) {
  const tabs = [
    { value: "hba1c", label: "HbA1c", icon: "timeline" },
    { value: "cholesterol", label: "Cholesterol", icon: "favorite" },
    { value: "creatinine", label: "Creatinine", icon: "science" },
  ] as const;

  return (
    <div className="flex gap-2 p-1 rounded-full bg-surface-container">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 py-2 px-4 rounded-full min-h-touch-target",
            "transition-colors duration-200",
            activeType === tab.value
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Icon name={tab.icon} className="w-5 h-5" />
          <span className="text-label-lg">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Lab Result Card - surface-container-lowest, rounded-2xl
function LabResultCard({ result }: { result: LabResult }) {
  const status = getStatus(result.value, result.reference_min, result.reference_max);

  return (
    <Card variant="elevated" className="w-full rounded-2xl">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-body-lg text-on-surface-variant">{result.name}</h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={cn(
                  "text-display-lg font-bold",
                  status === "normal" ? "text-primary" :
                  status === "high" ? "text-error" : "text-warning"
                )}
              >
                {result.value}
              </span>
              <span className="text-body-md text-on-surface-variant">
                {result.unit}
              </span>
            </div>
            <div className="text-label-lg text-on-surface-variant mt-1">
              Mục tiêu: {result.reference_min}-{result.reference_max}
            </div>
          </div>
          <Badge
            variant={status === "normal" ? "success" : status === "high" ? "error" : "warning"}
          >
            {status === "normal" ? "Bình thường" : status === "high" ? "Cao" : "Thấp"}
          </Badge>
        </div>
        <div className="text-label-lg text-on-surface-variant mt-2 flex items-center gap-1">
          <Icon name="event" className="w-4 h-4" />
          {new Date(result.date).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Trend Chart with chart-grid background
function LabTrendChart({
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
    <div className="h-48 chart-grid rounded-2xl p-4">
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
                  <div className="bg-surface-container-low rounded-xl px-3 py-2 shadow-lg">
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
  const [activeType, setActiveType] = useState<"hba1c" | "cholesterol" | "creatinine">("hba1c");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setResults(generateMockLabResults());
      setLoading(false);
    }, 300);
  }, []);

  const currentResults = results.filter((r) => r.type === activeType);

  const handleAISummary = async () => {
    if (currentResults.length === 0) return;

    const result = currentResults[0];
    setSummarizing(true);
    setAiSummary(null);

    try {
      const response = await fetch("/api/lab-results/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lab_result_id: result.id }),
      });

      const data = await response.json();

      if (response.ok && data.data?.summary) {
        setAiSummary(data.data.summary);
      } else {
        setAiSummary("Không thể tạo tóm tắt lúc này. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("AI Summary error:", error);
      setAiSummary("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <Page title="Kết quả xét nghiệm">
      <div className="p-6 space-y-4">
        {/* Lab Type Tabs */}
        <LabTypeTabs activeType={activeType} onChange={setActiveType} />

        {/* AI Summary Button */}
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleAISummary}
          disabled={summarizing || currentResults.length === 0}
        >
          <Icon name="auto_awesome" className="w-5 h-5" />
          {summarizing ? "Đang tạo tóm tắt..." : "Tóm tắt bằng AI"}
        </Button>

        {/* AI Summary Display */}
        {aiSummary && (
          <div className="p-4 rounded-2xl bg-primary-container/30 border border-primary/30">
            <div className="flex items-start gap-2">
              <Icon name="auto_awesome" className="w-5 h-5 text-primary mt-0.5" />
              <p className="text-body-md text-on-surface">{aiSummary}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 text-on-surface-variant">Đang tải...</div>
        ) : (
          <>
            {/* Current Result */}
            {currentResults.length > 0 && (
              <LabResultCard result={currentResults[0]} />
            )}

            {/* Trend Chart */}
            <LabTrendChart results={results} type={activeType} />
          </>
        )}
      </div>
    </Page>
  );
}