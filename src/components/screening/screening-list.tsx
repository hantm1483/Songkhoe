"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import type { LabResult } from "@/lib/supabase/database.types";

const items = [
  { title: 'HbA1c', target: '< 7.0%', frequency: 'Mỗi 3-6 tháng', meaning: 'Đánh giá kiểm soát đường huyết trong 3 tháng qua.' },
  { title: 'Đường huyết lúc đói', target: '3.9 - 7.2 mmol/L', frequency: 'Hàng ngày / Định kỳ', meaning: 'Kiểm soát đường huyết tại thời điểm đo.' },
  { title: 'Huyết áp', target: '< 130/80 mmHg', frequency: 'Mỗi lần thăm khám', meaning: 'Giảm nguy cơ đột quỵ và biến chứng tim mạch.' },
  { title: 'Soi đáy mắt', target: 'Không tổn thương', frequency: 'Định kỳ 12 tháng', meaning: 'Phát hiện sớm biến chứng võng mạc gây mù lòa.' },
  { title: 'Protein niệu (Thận)', target: 'Âm tính', frequency: 'Định kỳ 12 tháng', meaning: 'Phát hiện sớm dấu hiệu suy thận do tiểu đường.' },
];

export function ScreeningList() {
  return (
    <div className="space-y-8">
      <div className="p-8 rounded-[32px] bg-natural-beige border border-natural-border flex gap-6 items-center">
        <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
          <AlertCircle className="w-6 h-6 text-natural-accent" />
        </div>
        <div className="space-y-1">
          <p className="text-base font-black text-natural-primary-dark uppercase tracking-tight">Lưu ý quan trọng</p>
          <p className="text-sm font-medium text-slate-500 leading-relaxed">
            Mục tiêu điều trị có thể thay đổi tùy theo độ tuổi và tình trạng sức khỏe cụ thể của bạn. Luôn tham khảo ý kiến bác sĩ chuyên khoa.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-none rounded-[32px] border border-natural-border bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-natural-light/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-natural-border">
              <th className="py-6 pl-8">Nội dung tầm soát</th>
              <th className="py-6 px-4">Ngưỡng mục tiêu</th>
              <th className="py-6 px-4 text-center">Định kỳ</th>
              <th className="py-6 px-4">Nhắc hẹn</th>
              <th className="py-6 pr-8">Ý nghĩa lâm sàng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-natural-border/50">
            {items.map((item, i) => {
              return (
                <tr key={i} className="group hover:bg-natural-light/10 transition-colors">
                  <td className="py-6 pl-8">
                    <span className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">{item.title}</span>
                  </td>
                  <td className="py-6 px-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-bold">
                      {item.target}
                    </span>
                  </td>
                  <td className="py-6 px-4 text-center">
                    <span className="text-xs font-bold text-slate-500 font-mono">{item.frequency}</span>
                  </td>
                  <td className="py-6 px-4">
                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Chưa có lịch</span>
                  </td>
                  <td className="py-6 pr-8">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm">
                      {item.meaning}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-[28px] border border-natural-border bg-white space-y-3">
          <h4 className="text-xs font-black text-natural-primary uppercase tracking-widest">Tiểu đường Type 1</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Cần theo dõi sát sao hơn, đo đường huyết ít nhất 4-7 lần/ngày và xét nghiệm HbA1c định kỳ mỗi 3 tháng.</p>
        </div>
        <div className="p-6 rounded-[28px] border border-natural-border bg-white space-y-3">
          <h4 className="text-xs font-black text-rose-500 uppercase tracking-widest">Biến chứng thần kinh</h4>
          <p className="text-xs text-slate-500 leading-relaxed">Nếu có dấu hiệu tê bì, châm chích bàn chân, cần thực hiện khám bàn chân ngay lập tức.</p>
        </div>
      </div>
    </div>
  );
}

export function ScreeningLog() {
  const [logs, setLogs] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/lab-results?limit=50");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        setLogs(json.data?.results || []);
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
      const res = await fetch(`/api/lab-results/${id}`, { method: "DELETE" });
      if (res.ok) {
        setLogs(logs.filter(log => log.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLevel = (value: number, type: string | null) => {
    if (type === 'hba1c') {
      if (value < 7.0) return { label: 'Tốt', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      if (value < 8.0) return { label: 'Bình thường', className: 'bg-amber-50 text-amber-600 border-amber-100' };
      return { label: 'Cao', className: 'bg-rose-50 text-rose-600 border-rose-100' };
    }
    if (value <= 7.0) return { label: 'Tốt', className: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    if (value <= 10.0) return { label: 'Bình thường', className: 'bg-amber-50 text-amber-600 border-amber-100' };
    return { label: 'Cao', className: 'bg-rose-50 text-rose-600 border-rose-100' };
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const getTypeName = (type: string | null) => {
    const map: Record<string, string> = {
      hba1c: 'HbA1c',
      cholesterol: 'Cholesterol',
      creatinine: 'Creatinine',
      other: 'Khác',
    };
    return type ? map[type] || type : 'Khác';
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Nhật ký tầm soát chi tiết</h3>

      {logs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 font-bold">Chưa có kết quả xét nghiệm nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto scrollbar-none rounded-[32px] border border-natural-border bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-natural-light/30 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-natural-border">
                <th className="py-6 pl-8">Nội dung tầm soát</th>
                <th className="py-6 px-4">Chỉ số</th>
                <th className="py-6 px-4">Ngưỡng mục tiêu</th>
                <th className="py-6 px-4">Mức độ</th>
                <th className="py-6 px-4">Kết quả</th>
                <th className="py-6 px-4">Lưu ý</th>
                <th className="py-6 pr-8 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-natural-border/50">
              {logs.map((log) => {
                const level = getLevel(log.value, log.type);
                return (
                  <tr key={log.id} className="group hover:bg-natural-light/10 transition-colors">
                    <td className="py-6 pl-8">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">{getTypeName(log.type)}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">{formatDate(log.recorded_at)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-sm font-black text-natural-primary-dark">{log.value}</span>
                      <span className="text-[10px] text-slate-400 ml-1">{log.unit}</span>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-xs font-bold text-slate-400 font-mono tracking-tight">
                        {log.type === 'hba1c' ? '< 7.0%' : '3.9 - 7.2 mmol/L'}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${level.className}`}>
                        {level.label}
                      </span>
                    </td>
                    <td className="py-6 px-4">
                      <p className="text-xs font-bold text-natural-primary-dark">{log.value} {log.unit}</p>
                    </td>
                    <td className="py-6 px-4">
                      <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[150px] line-clamp-2">
                        {log.notes || '-'}
                      </p>
                    </td>
                    <td className="py-6 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
      )}
    </div>
  );
}