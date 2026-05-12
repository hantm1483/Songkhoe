"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { GlucoseLog } from "@/lib/supabase/database.types";

interface ChartDataPoint {
  date: string;
  value: number;
  hour: string;
}

export function GlucoseChart() {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/glucose?limit=30");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const logs: GlucoseLog[] = json.data?.logs || [];

        const formatted = logs.map(log => {
          const d = new Date(log.measured_at);
          return {
            date: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`,
            hour: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
            value: log.value,
          };
        });

        setData(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const average = data.length > 0
    ? (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1)
    : "0";

  const status = data.length > 0
    ? (parseFloat(average) <= 7.0 ? "Kiểm soát tốt" : "Cần cải thiện")
    : "Chưa có dữ liệu";

  const statusColor = data.length > 0 && parseFloat(average) <= 7.0
    ? "text-emerald-600 bg-emerald-50 border-emerald-100"
    : "text-orange-600 bg-orange-50 border-orange-100";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Xu hướng đường huyết tuần này</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            {data.length > 0 ? `Cập nhật lúc ${data[data.length - 1]?.hour} • mmol/L` : "Chưa có dữ liệu"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đường huyết trung bình</span>
            <span className="text-2xl font-black text-natural-primary">{average}</span>
          </div>
          <div className="h-10 w-[1px] bg-natural-border" />
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
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B705C', fontWeight: 600 }} dy={10} />
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