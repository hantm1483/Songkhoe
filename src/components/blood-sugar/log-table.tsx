"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, Edit2, Trash2, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import type { GlucoseLog } from "@/lib/supabase/database.types";

interface GlucoseLogProps {
  refreshTrigger?: number;
}

export function GlucoseLog({ refreshTrigger }: GlucoseLogProps) {
  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysPerPage, setDaysPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<"measured_at" | "value" | "timing">("measured_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch("/api/glucose?limit=100");
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
  }, [refreshTrigger]);

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
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
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

  // Group logs by date and sort descending (most recent first)
  const groupedLogs = useMemo(() => {
    const groups: Record<string, GlucoseLog[]> = {};

    logs.forEach(log => {
      const dateKey = new Date(log.measured_at).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    });

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime());
  }, [logs]);

  // Filter by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groupedLogs;

    const query = searchQuery.toLowerCase();
    return groupedLogs.filter(([_, dayLogs]) =>
      dayLogs.some(log =>
        log.value.toString().includes(query) ||
        (log.timing && getTimingLabel(log.timing).toLowerCase().includes(query)) ||
        formatDate(log.measured_at).includes(query)
      )
    );
  }, [groupedLogs, searchQuery]);

  // Sort within groups
  const sortedGroups = useMemo(() => {
    return filteredGroups.map(([date, dayLogs]) => {
      const sorted = [...dayLogs].sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;

        if (sortField === "measured_at") {
          aVal = new Date(a.measured_at).getTime();
          bVal = new Date(b.measured_at).getTime();
        } else if (sortField === "value") {
          aVal = a.value;
          bVal = b.value;
        } else {
          aVal = getTimingLabel(a.timing);
          bVal = getTimingLabel(b.timing);
        }

        if (sortDirection === "asc") {
          return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        }
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      });

      return [date, sorted] as [string, GlucoseLog[]];
    });
  }, [filteredGroups, sortField, sortDirection]);

  const totalDays = sortedGroups.length;
  const totalPages = Math.max(1, Math.ceil(totalDays / daysPerPage));
  const startIdx = (currentPage - 1) * daysPerPage;
  const endIdx = Math.min(startIdx + daysPerPage, totalDays);
  const paginatedGroups = sortedGroups.slice(startIdx, endIdx);

  const handleSort = (field: "measured_at" | "value" | "timing") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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

  const SortIcon = ({ field }: { field: "measured_at" | "value" | "timing" }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1 inline-block">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="min-w-[600px] space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-natural-border">
        {/* Days per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hiển thị:</span>
          <select
            value={daysPerPage}
            onChange={(e) => {
              setDaysPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none appearance-none cursor-pointer"
          >
            <option value={3}>3 ngày</option>
            <option value={5}>5 ngày</option>
            <option value={7}>7 ngày</option>
            <option value={10}>10 ngày</option>
          </select>
        </div>

        {/* Search */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo ngày, chỉ số, thời điểm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-natural-border bg-natural-light/50 text-xs font-medium text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none placeholder:text-slate-400"
          />
        </div>

        {/* Page info */}
        <div className="text-xs font-bold text-slate-500">
          Trang {currentPage}/{totalPages}
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-left border-separate border-spacing-y-4">
        <thead>
          <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <th
              className="pb-2 pl-4 cursor-pointer hover:text-natural-primary transition-colors"
              onClick={() => handleSort("measured_at")}
            >
              Ngày <SortIcon field="measured_at" />
            </th>
            <th
              className="pb-2 cursor-pointer hover:text-natural-primary transition-colors"
              onClick={() => handleSort("timing")}
            >
              Thời điểm đo <SortIcon field="timing" />
            </th>
            <th
              className="pb-2 cursor-pointer hover:text-natural-primary transition-colors"
              onClick={() => handleSort("value")}
            >
              Chỉ số <SortIcon field="value" />
            </th>
            <th className="pb-2 text-center">Mức độ</th>
            <th className="pb-2 text-right pr-4">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y-4 divide-transparent">
          {paginatedGroups.map(([dateKey, dayLogs]) =>
            dayLogs.map((log) => {
              const status = getStatusLabel(log.value);
              return (
                <tr
                  key={log.id}
                  className="group bg-natural-light/20 hover:bg-white transition-all rounded-[24px] shadow-sm hover:shadow-md border border-transparent hover:border-natural-primary/20"
                >
                  <td className="py-5 pl-6 rounded-l-[24px]">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-natural-primary" />
                      <div>
                        <span className="font-bold text-natural-primary-dark">{formatDate(log.measured_at)}</span>
                        <span className="ml-2 text-[10px] font-mono text-slate-400">{formatTime(log.measured_at)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">{getTimingLabel(log.timing)}</span>
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
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 rounded-full bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                page === currentPage
                  ? "bg-natural-primary text-white shadow-md"
                  : "bg-white border border-natural-border text-slate-500 hover:border-natural-primary hover:text-natural-primary"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-3 rounded-full bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}