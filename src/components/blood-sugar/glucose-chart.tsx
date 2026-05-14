"use client";

import { useState, useEffect, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { GlucoseLog } from "@/lib/supabase/database.types";

interface ChartDataPoint {
  date: string;
  value: number;
}

interface GlucoseChartProps {
  refreshTrigger?: number;
}

type ViewMode = "day" | "week" | "month";

interface DateOption {
  label: string;
  value: string;
}

interface WeekOption {
  label: string;
  value: string;
  startDate: string;
  endDate: string;
}

interface MonthOption {
  label: string;
  value: string;
}

export function GlucoseChart({ refreshTrigger }: GlucoseChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("week");

  // Selection options derived from data
  const [availableDates, setAvailableDates] = useState<DateOption[]>([]);
  const [availableWeeks, setAvailableWeeks] = useState<WeekOption[]>([]);
  const [availableMonths, setAvailableMonths] = useState<MonthOption[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const [allLogs, setAllLogs] = useState<GlucoseLog[]>([]);

  // Load all data once for building filter options
  useEffect(() => {
    async function loadAllData() {
      try {
        const res = await fetch("/api/glucose?limit=365");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const logs: GlucoseLog[] = json.data?.logs || [];
        setAllLogs(logs);
      } catch (err) {
        console.error(err);
      }
    }
    loadAllData();
  }, []);

  // Build filter options from data
  useEffect(() => {
    if (allLogs.length === 0) return;

    // Build date options (unique dates)
    const dateMap = new Map<string, string>();
    allLogs.forEach(log => {
      const d = new Date(log.measured_at);
      const dateKey = d.toISOString().split("T")[0];
      const label = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, label);
      }
    });
    setAvailableDates(
      Array.from(dateMap.entries())
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => b.value.localeCompare(a.value))
    );
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].value);
    }

    // Build week options
    const weekMap = new Map<string, WeekOption>();
    allLogs.forEach(log => {
      const d = new Date(log.measured_at);
      const year = d.getFullYear();
      const month = d.getMonth();
      const firstDayOfYear = new Date(year, 0, 1);
      const pastDays = (d.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
      const weekNum = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
      const weekKey = `${year}-W${weekNum}`;
      const startOfWeek = new Date(d);
      startOfWeek.setDate(d.getDate() - d.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          label: `Tuần ${weekNum} - ${d.toLocaleDateString("vi-VN", { month: "short", year: "numeric" })}`,
          value: weekKey,
          startDate: startOfWeek.toISOString().split("T")[0],
          endDate: endOfWeek.toISOString().split("T")[0],
        });
      }
    });
    setAvailableWeeks(
      Array.from(weekMap.values()).sort((a, b) => b.value.localeCompare(a.value))
    );
    if (availableWeeks.length > 0 && !selectedWeek) {
      setSelectedWeek(availableWeeks[0].value);
    }

    // Build month options
    const monthMap = new Map<string, MonthOption>();
    allLogs.forEach(log => {
      const d = new Date(log.measured_at);
      const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          label: d.toLocaleDateString("vi-VN", { month: "long", year: "numeric" }),
          value: monthKey,
        });
      }
    });
    setAvailableMonths(
      Array.from(monthMap.values()).sort((a, b) => b.value.localeCompare(a.value))
    );
    if (availableMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(availableMonths[0].value);
    }
  }, [allLogs]);

  // Load chart data based on selection
  useEffect(() => {
    async function loadData() {
      if (allLogs.length === 0) return;

      setLoading(true);
      try {
        let filteredLogs: GlucoseLog[] = [];

        if (viewMode === "day" && selectedDate) {
          filteredLogs = allLogs.filter(log => log.measured_at.startsWith(selectedDate));
        } else if (viewMode === "week" && selectedWeek) {
          const weekOption = availableWeeks.find(w => w.value === selectedWeek);
          if (weekOption) {
            filteredLogs = allLogs.filter(log => {
              const logDate = log.measured_at.split("T")[0];
              return logDate >= weekOption.startDate && logDate <= weekOption.endDate;
            });
          }
        } else if (viewMode === "month" && selectedMonth) {
          filteredLogs = allLogs.filter(log => log.measured_at.startsWith(selectedMonth));
        }

        const formatted = filteredLogs.map(log => {
          const d = new Date(log.measured_at);
          return {
            date: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
            value: log.value,
          };
        });

        setData(formatted.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [viewMode, selectedDate, selectedWeek, selectedMonth, allLogs, availableWeeks, refreshTrigger]);

  const average = data.length > 0
    ? (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)
    : "0";

  const status = data.length > 0
    ? (parseFloat(average) <= 7.0 ? "Kiểm soát tốt" : "Cần cải thiện")
    : "Chưa có dữ liệu";

  const statusColor = data.length > 0 && parseFloat(average) <= 7.0
    ? "text-emerald-600 bg-emerald-50 border-emerald-100"
    : "text-orange-600 bg-orange-50 border-orange-100";

  const chartTitle = useMemo(() => {
    if (viewMode === "day" && selectedDate) {
      const d = new Date(selectedDate);
      return `Xu hướng đường huyết ngày ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
    }
    if (viewMode === "week" && selectedWeek) {
      const weekOption = availableWeeks.find(w => w.value === selectedWeek);
      return weekOption ? `Xu hướng ${weekOption.label}` : "Xu hướng đường huyết";
    }
    if (viewMode === "month" && selectedMonth) {
      const monthOption = availableMonths.find(m => m.value === selectedMonth);
      return monthOption ? `Xu hướng tháng ${monthOption.label}` : "Xu hướng đường huyết";
    }
    return "Xu hướng đường huyết";
  }, [viewMode, selectedDate, selectedWeek, selectedMonth, availableWeeks, availableMonths]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-20">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">{chartTitle}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              {data.length > 0 ? `${data.length} lần đo • mmol/L` : "Chưa có dữ liệu"}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("day")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                viewMode === "day"
                  ? "bg-natural-primary text-white"
                  : "border border-natural-border text-slate-500 hover:border-natural-primary hover:text-natural-primary"
              }`}
            >
              Ngày
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                viewMode === "week"
                  ? "bg-natural-primary text-white"
                  : "border border-natural-border text-slate-500 hover:border-natural-primary hover:text-natural-primary"
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                viewMode === "month"
                  ? "bg-natural-primary text-white"
                  : "border border-natural-border text-slate-500 hover:border-natural-primary hover:text-natural-primary"
              }`}
            >
              Tháng
            </button>
          </div>
        </div>

        {/* Selection Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {viewMode === "day" && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none appearance-none cursor-pointer"
              >
                {availableDates.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {viewMode === "week" && (
            <div className="flex items-center gap-2">
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none appearance-none cursor-pointer"
              >
                {availableWeeks.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {viewMode === "month" && (
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none appearance-none cursor-pointer"
              >
                {availableMonths.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="h-8 w-[1px] bg-natural-border mx-2" />

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TB</span>
            <span className="text-2xl font-black text-natural-primary">{average}</span>
          </div>

          <span className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest border flex items-center gap-2 ${statusColor}`}>
            <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${data.length > 0 ? "bg-current" : "bg-slate-300"}`} />
            {status}
          </span>
        </div>
      </div>

      <div className="h-[350px] w-full mt-4">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 font-bold">
            Chưa có dữ liệu để hiển thị
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8BA888" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8BA888" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6E2D3" opacity={0.5} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6B705C', fontWeight: 600 }}
                dy={10}
                interval={viewMode === "month" ? 4 : viewMode === "week" ? 1 : 0}
              />
              <YAxis domain={[3, 12]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B705C', fontWeight: 600 }} dx={-10} />
              <Tooltip
                contentStyle={{ borderRadius: '24px', border: '1px solid #E6E2D3', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)', padding: '16px', fontWeight: 800 }}
                cursor={{ stroke: '#8BA888', strokeWidth: 2, strokeDasharray: '4 4' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8BA888"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}