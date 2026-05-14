"use client";

import { useState, useEffect, useMemo } from "react";
import { Calendar, Edit2, Trash2, ChevronLeft, ChevronRight, Search, Check, X } from "lucide-react";
import type { GlucoseLog } from "@/lib/supabase/database.types";

interface GlucoseLogProps {
  refreshTrigger?: number;
}

const TIMING_OPTIONS = [
  { value: "fasting", label: "Trước ăn sáng" },
  { value: "before_meal", label: "Trước bữa ăn" },
  { value: "after_meal", label: "Sau bữa ăn" },
  { value: "bedtime", label: "Trước ngủ" },
];

export function GlucoseLog({ refreshTrigger }: GlucoseLogProps) {
  const [logs, setLogs] = useState<GlucoseLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [daysPerPage, setDaysPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);

  // Column-specific search
  const [dateSearch, setDateSearch] = useState("");
  const [timingSearch, setTimingSearch] = useState("");
  const [valueSearch, setValueSearch] = useState("");

  // Sorting
  const [sortField, setSortField] = useState<"measured_at" | "value" | "timing">("measured_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Inline editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editTiming, setEditTiming] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);

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

  const handleEdit = (log: GlucoseLog) => {
    setEditingId(log.id);
    setEditValue(log.value.toString());
    setEditTiming(log.timing || "fasting");
    setEditNotes(log.notes || "");
  };

  const handleSaveEdit = async (id: string) => {
    const numValue = parseFloat(editValue);
    if (isNaN(numValue) || numValue <= 0) {
      alert("Vui lòng nhập chỉ số hợp lệ");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/glucose/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: numValue,
          timing: editTiming,
          notes: editNotes || undefined,
        }),
      });

      if (res.ok) {
        // Update local state
        setLogs(logs.map(log =>
          log.id === id
            ? { ...log, value: numValue, timing: editTiming as GlucoseLog["timing"], notes: editNotes || null }
            : log
        ));
        setEditingId(null);
      } else {
        alert("Lưu thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue("");
    setEditTiming("fasting");
    setEditNotes("");
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
    const found = TIMING_OPTIONS.find(t => t.value === timing);
    return found ? found.label : "Khác";
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

  // Filter by column-specific searches
  const filteredGroups = useMemo(() => {
    let result = groupedLogs;

    if (dateSearch) {
      const query = dateSearch.toLowerCase();
      result = result.filter(([_, dayLogs]) =>
        dayLogs.some(log => formatDate(log.measured_at).toLowerCase().includes(query))
      );
    }

    if (timingSearch) {
      const query = timingSearch.toLowerCase();
      result = result.filter(([_, dayLogs]) =>
        dayLogs.some(log => getTimingLabel(log.timing).toLowerCase().includes(query))
      );
    }

    if (valueSearch) {
      const query = valueSearch.toLowerCase();
      result = result.filter(([_, dayLogs]) =>
        dayLogs.some(log => log.value.toString().toLowerCase().includes(query))
      );
    }

    return result;
  }, [groupedLogs, dateSearch, timingSearch, valueSearch]);

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
      <span className="ml-1 inline-block text-natural-primary">
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  const renderLogRow = (log: GlucoseLog, status: { label: string; className: string }) => {
    const isEditing = editingId === log.id;

    if (isEditing) {
      return (
        <tr
          key={log.id}
          className="bg-white border-2 border-natural-primary/30 rounded-xl shadow-md"
        >
          <td className="py-3 pl-6 rounded-l-xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 text-natural-primary" />
              <span className="font-bold text-natural-primary-dark text-xs">{formatDate(log.measured_at)}</span>
              <span className="text-[10px] font-mono text-slate-400">{formatTime(log.measured_at)}</span>
            </div>
          </td>
          <td className="py-3">
            <select
              value={editTiming}
              onChange={(e) => setEditTiming(e.target.value)}
              className="w-full px-2 py-1 rounded-lg border border-natural-border bg-natural-light/50 text-[10px] font-bold text-natural-primary-dark focus:border-natural-primary outline-none"
            >
              {TIMING_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </td>
          <td className="py-3">
            <input
              type="number"
              step="0.1"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-20 px-2 py-1 rounded-lg border border-natural-border bg-natural-light/50 text-sm font-bold text-natural-primary-dark focus:border-natural-primary outline-none"
            />
          </td>
          <td className="py-3 text-center">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${status.className}`}>
              {status.label}
            </span>
          </td>
          <td className="py-3 pr-6 text-right rounded-r-xl">
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={() => handleSaveEdit(log.id)}
                disabled={saving}
                className="p-1.5 rounded-lg bg-natural-primary text-white hover:bg-natural-primary-dark transition-all shadow-sm"
              >
                <Check className="w-3 h-3" />
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={saving}
                className="p-1.5 rounded-lg bg-slate-200 text-slate-500 hover:bg-slate-300 transition-all shadow-sm"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr
        key={log.id}
        className="group bg-natural-light/10 hover:bg-natural-light/30 transition-all rounded-xl border border-transparent hover:border-natural-primary/20"
      >
        <td className="py-3 pl-6 rounded-l-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-natural-primary" />
            <span className="font-bold text-natural-primary-dark text-xs">{formatDate(log.measured_at)}</span>
            <span className="text-[10px] font-mono text-slate-400">{formatTime(log.measured_at)}</span>
          </div>
        </td>
        <td className="py-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{getTimingLabel(log.timing)}</span>
        </td>
        <td className="py-3">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-natural-primary-dark leading-none">{log.value}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase">mmol/L</span>
          </div>
        </td>
        <td className="py-3 text-center">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${status.className}`}>
            {status.label}
          </span>
        </td>
        <td className="py-3 pr-6 text-right rounded-r-xl">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => handleEdit(log)}
              className="p-1.5 rounded-lg bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all shadow-sm"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleDelete(log.id)}
              className="p-1.5 rounded-lg bg-white border border-natural-border text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-w-[600px] space-y-4">
      {/* Table - compact rows */}
      <table className="w-full text-left border-separate border-spacing-y-2">
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
          {/* Search row */}
          <tr className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            <th className="pb-2 pl-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm..."
                  value={dateSearch}
                  onChange={(e) => {
                    setDateSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-7 pr-2 py-1 rounded-lg border border-natural-border/50 bg-natural-light/30 text-[10px] font-medium text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none placeholder:text-slate-400"
                />
              </div>
            </th>
            <th className="pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm..."
                  value={timingSearch}
                  onChange={(e) => {
                    setTimingSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-7 pr-2 py-1 rounded-lg border border-natural-border/50 bg-natural-light/30 text-[10px] font-medium text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none placeholder:text-slate-400"
                />
              </div>
            </th>
            <th className="pb-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm..."
                  value={valueSearch}
                  onChange={(e) => {
                    setValueSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-7 pr-2 py-1 rounded-lg border border-natural-border/50 bg-natural-light/30 text-[10px] font-medium text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none placeholder:text-slate-400"
                />
              </div>
            </th>
            <th className="pb-2"></th>
            <th className="pb-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-transparent">
          {paginatedGroups.map(([dateKey, dayLogs]) =>
            dayLogs.map((log) => {
              const status = getStatusLabel(log.value);
              return renderLogRow(log, status);
            })
          )}
        </tbody>
      </table>

      {/* Controls moved below table, near pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-natural-border">
        <div className="flex items-center gap-3">
          <select
            value={daysPerPage}
            onChange={(e) => {
              setDaysPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary focus:ring-0 outline-none appearance-none cursor-pointer"
          >
            <option value={1}>1 ngày</option>
            <option value={3}>3 ngày</option>
            <option value={5}>5 ngày</option>
            <option value={7}>7 ngày</option>
            <option value={10}>10 ngày</option>
          </select>
          <span className="text-xs font-medium text-slate-500">
            Trang {currentPage}/{totalPages}
          </span>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                page === currentPage
                  ? "bg-natural-primary text-white shadow-md"
                  : "bg-white border border-natural-border text-slate-500 hover:border-natural-primary hover:text-natural-primary"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-white border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}