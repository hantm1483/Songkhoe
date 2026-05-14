"use client";

import { useState } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { LabResult } from "@/lib/supabase/database.types";
import { useLabResults } from "@/hooks/use-lab-results";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function getStatus(value: number, type: string | null): "normal" | "high" | "low" {
  if (type === "hba1c") {
    if (value < 4.0) return "low";
    if (value > 7.0) return "high";
    return "normal";
  }
  if (type === "cholesterol") {
    if (value > 200) return "high";
    return "normal";
  }
  if (type === "creatinine") {
    if (value < 0.7) return "low";
    if (value > 1.3) return "high";
    return "normal";
  }
  return "normal";
}

// Lab Type Tabs
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

// Lab Result Card
function LabResultCard({ result }: { result: LabResult }) {
  const status = getStatus(result.value, result.type);

  return (
    <Card variant="elevated" className="w-full rounded-2xl">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-body-lg text-on-surface-variant">{(result.type || "other").toUpperCase()}</h3>
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
                {result.unit || ""}
              </span>
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
          {new Date(result.recorded_at).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Trend Chart
function LabTrendChart({
  results,
  type,
}: {
  results: LabResult[];
  type: LabResult["type"];
}) {
  const filteredResults = results
    .filter((r) => r.type === type)
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());

  const data = filteredResults.map((r) => ({
    date: new Date(r.recorded_at).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "short",
    }),
    value: r.value,
    refMin: type === "hba1c" ? 4.0 : type === "creatinine" ? 0.7 : 0,
    refMax: type === "hba1c" ? 7.0 : type === "cholesterol" ? 200 : 1.3,
  }));

  if (data.length < 2) return null;

  const Colors: Record<string, string> = {
    hba1c: "#008B8B",
    cholesterol: "#136299",
    creatinine: "#943b23",
    other: "#6f7979",
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
                        getStatus(data.value, type) === "normal"
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
            stroke={Colors[type || "other"]}
            strokeWidth={3}
            dot={{ fill: Colors[type || "other"], strokeWidth: 2, r: 4 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Main Page Component
export default function XetNghiemPage() {
  const [activeType, setActiveType] = useState<"hba1c" | "cholesterol" | "creatinine">("hba1c");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  // React Query hook for data fetching
  const { data: labResultsData, isLoading } = useLabResults({ limit: 50 });
  const results = labResultsData?.results || [];

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

        {isLoading ? (
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
