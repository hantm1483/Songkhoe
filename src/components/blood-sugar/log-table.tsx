"use client";

import { useState, useEffect } from "react";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import type { GlucoseLog } from "@/lib/supabase/database.types";

export function GlucoseLog() {
  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/glucose?limit=50");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setLogs(data.data?.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/glucose/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLogs(logs.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const getStatusLabel = (value: number) => {
    if (value < 3.9) return { label: "Thấp", className: "bg-amber-50 text-amber-600 border-amber-100" };
    if (value <= 7.0) return { label: "An toàn", className: "bg-emerald-50 text-emerald-600 border-emerald-100" };
    if (value <= 10.0) return { label: "Cao", className: "bg-orange-50 text-orange-600 border-orange-100" };
    return { label: "Rất cao", className: "bg-rose-50 text-rose-600 border-rose-100" };
  };

  const getTimingLabel = (timing: string | null) => {
    const map: Record<string, string> = {
      fasting: "Trước ăn sáng",
      before_meal: "Trước bữa ăn",
      after_meal: "Sau bữa ăn",
      bedtime: "Trước ngủ",
    };
    return timing ? map[timing] || timing : "Khác";
  };

  if (loading) {
    return (
      <div className="min-w-[600px] py-12 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
        <p className="mt-4 text-sm text-slate-400 font-medium">Đang tải...</p>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="min-w-[600px] py-16 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-natural-light flex items-center justify-center">
          <Calendar className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-400 font-bold">Chưa có dữ liệu đường huyết</p>
        <p className="text-xs text-slate-300 mt-1">Nhấn "Nhập chỉ số mới" để bắt đầu</p>
      </div>
    );
  }

  return (
    <div className="min-w-[600px]">
      <table className="w-full text-left border-separate border-spacing-y-4">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <th className="pb-2 pl-4">Ngày</th>
            <th className="pb-2">Thời điểm đo</th>
            <th className="pb-2">Giờ đo</th>
            <th className="pb-2">Chỉ số</th>
            <th className="pb-2 text-center">Mức độ</th>
            <th className="pb-2 text-right pr-4">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y-4 divide-transparent">
          {[...logs].reverse().map((log) => {
            const status = getStatusLabel(log.value);
            return (
              <tr key={log.id} className="group bg-natural-light/20 hover:bg-white transition-all rounded-[24px] shadow-sm hover:shadow-md border border-transparent hover:border-natural-primary/20">
                <td className="py-5 pl-6 rounded-l-[24px]">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-natural-primary" />
                    <span className="font-bold text-natural-primary-dark">{formatDate(log.measured_at)}</span>
                  </div>
                </td>
                <td className="py-5">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">{getTimingLabel(log.timing)}</span>
                </td>
                <td className="py-5">
                  <span className="text-xs font-mono font-bold text-natural-primary-dark">{formatTime(log.measured_at)}</span>
                </td>
                <td className="py-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-natural-primary-dark leading-none">{log.value}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase">mmol/L</span>
                  </div>
                </td>
                <td className="py-5 text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${status.className}`}>
                    {status.label}
                  </span>
                </td>
                <td className="py-5 pr-6 text-right rounded-r-[24px]">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all shadow-sm">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-2.5 rounded-xl bg-white border border-natural-border text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}