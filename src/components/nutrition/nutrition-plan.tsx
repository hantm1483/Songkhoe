"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Trash2, Edit2, Calendar, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { clsx } from "clsx";

interface MealEntry {
  id: string;
  name: string;
  gi_level: string | null;
  notes: string | null;
  time: string;
}

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

type ViewMode = "day" | "week" | "month";
const SESSION_TYPES = ["Sáng", "Trưa", "Chiều"];

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  let d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d;
  if (/^\d{1,2}:\d{2}$/.test(dateStr)) {
    const [h, m] = dateStr.split(":").map(Number);
    d = new Date();
    d.setHours(h, m, 0, 0);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
}

function formatDateLabel(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return dateStr;
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
}

function getSessionFromHour(hour: number): string {
  if (hour >= 5 && hour < 12) return "Sáng";
  if (hour >= 12 && hour < 17) return "Trưa";
  return "Chiều";
}

function parseCalories(notes: string | null): number {
  if (!notes) return 0;
  const match = notes.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

export function NutritionPlan() {
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // Add meal form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMealRows, setNewMealRows] = useState<Record<string, { time: string; dish: string; calories: string }[]>>({
    "Sáng": [{ time: "07:00", dish: "", calories: "" }],
    "Trưa": [{ time: "12:00", dish: "", calories: "" }],
    "Chiều": [{ time: "18:00", dish: "", calories: "" }],
  });
  const [saving, setSaving] = useState(false);

  const addMealRow = (session: string) => {
    const defaultTimes: Record<string, string> = { "Sáng": "07:00", "Trưa": "12:00", "Chiều": "18:00" };
    setNewMealRows(prev => ({
      ...prev,
      [session]: [...prev[session], { time: defaultTimes[session] || "12:00", dish: "", calories: "" }],
    }));
  };

  const removeMealRow = (session: string, index: number) => {
    setNewMealRows(prev => ({
      ...prev,
      [session]: prev[session].filter((_, i) => i !== index),
    }));
  };

  const updateMealRow = (session: string, index: number, field: "time" | "dish" | "calories", value: string) => {
    setNewMealRows(prev => ({
      ...prev,
      [session]: prev[session].map((row, i) => i === index ? { ...row, [field]: value } : row),
    }));
  };

  const getDefaultTime = (session: string): string => {
    const times: Record<string, string> = { "Sáng": "07:00", "Trưa": "12:00", "Chiều": "18:00" };
    return times[session] || "12:00";
  };

  // Inline edit state - keyed by meal id
  const [editingMeals, setEditingMeals] = useState<Record<string, { name: string; calories: string }>>({});

  const loadMeals = useCallback(async () => {
    try {
      const res = await fetch("/api/meals?limit=500");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setMealHistory(json.data?.meals || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const { availableDates, availableWeeks, availableMonths } = useMemo(() => {
    if (mealHistory.length === 0) {
      return { availableDates: [], availableWeeks: [], availableMonths: [] };
    }

    const dateMap = new Map<string, string>();
    mealHistory.forEach(meal => {
      const d = parseDate(meal.time);
      if (!d) return;
      const dateKey = d.toISOString().split("T")[0];
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, formatDateLabel(dateKey));
      }
    });
    const dates = Array.from(dateMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([value, label]) => ({ value, label }));

    const weekMap = new Map<string, WeekOption>();
    mealHistory.forEach(meal => {
      const d = parseDate(meal.time);
      if (!d) return;
      const year = d.getFullYear();
      const firstDayOfYear = new Date(year, 0, 1);
      const pastDays = (d.getTime() - firstDayOfYear.getTime()) / (1000 * 60 * 60 * 24);
      const weekNum = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
      const weekKey = `${year}-W${weekNum}`;
      if (!weekMap.has(weekKey)) {
        const startOfWeek = new Date(d);
        startOfWeek.setDate(d.getDate() - d.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        weekMap.set(weekKey, {
          label: `Tuần ${weekNum} - ${d.toLocaleDateString("vi-VN", { month: "short", year: "numeric" })}`,
          value: weekKey,
          startDate: startOfWeek.toISOString().split("T")[0],
          endDate: endOfWeek.toISOString().split("T")[0],
        });
      }
    });
    const weeks = Array.from(weekMap.values()).sort((a, b) => b.value.localeCompare(a.value));

    const monthMap = new Map<string, MonthOption>();
    mealHistory.forEach(meal => {
      const d = parseDate(meal.time);
      if (!d) return;
      const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          label: d.toLocaleDateString("vi-VN", { month: "long", year: "numeric" }),
          value: monthKey,
        });
      }
    });
    const months = Array.from(monthMap.values()).sort((a, b) => b.value.localeCompare(a.value));

    return { availableDates: dates, availableWeeks: weeks, availableMonths: months };
  }, [mealHistory]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    if (!selectedDate && availableDates.length > 0) {
      const todayExists = availableDates.some(d => d.value === today);
      setSelectedDate(todayExists ? today : availableDates[0].value);
    }
    if (!selectedWeek && availableWeeks.length > 0) {
      setSelectedWeek(availableWeeks[0].value);
    }
    if (!selectedMonth && availableMonths.length > 0) {
      setSelectedMonth(availableMonths[0].value);
    }
  }, [availableDates, availableWeeks, availableMonths, selectedDate, selectedWeek, selectedMonth]);

  const getSessionTime = (type: string): string => {
    switch (type) {
      case "Sáng": return "07:00";
      case "Trưa": return "12:00";
      case "Chiều": return "18:00";
      default: return "12:00";
    }
  };

  const handleUpdateNewMealRow = (session: string, index: number, field: "time" | "dish" | "calories", value: string) => {
    setNewMealRows(prev => ({
      ...prev,
      [session]: prev[session].map((row, i) => i === index ? { ...row, [field]: value } : row),
    }));
  };

  const handleSaveMeals = async () => {
    const sessionsToSave = SESSION_TYPES.filter(s =>
      newMealRows[s].some(r => r.dish || r.calories)
    );
    if (sessionsToSave.length === 0) {
      setShowAddForm(false);
      return;
    }

    setSaving(true);
    try {
      const dateStr = addDate;
      const promises: Promise<Response | null>[] = [];
      sessionsToSave.forEach(session => {
        newMealRows[session].forEach(row => {
          if (!row.dish && !row.calories) return;
          const time = `${dateStr}T${row.time}:00`;
          promises.push(fetch("/api/meals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: row.dish,
              notes: row.calories ? `${row.calories} kcal` : null,
              time: time,
            }),
          }));
        });
      });

      await Promise.all(promises.filter(Boolean));
      setShowAddForm(false);
      setNewMealRows({
        "Sáng": [{ time: "07:00", dish: "", calories: "" }],
        "Trưa": [{ time: "12:00", dish: "", calories: "" }],
        "Chiều": [{ time: "18:00", dish: "", calories: "" }],
      });
      await loadMeals();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setNewMealRows({
      "Sáng": [{ time: "07:00", dish: "", calories: "" }],
      "Trưa": [{ time: "12:00", dish: "", calories: "" }],
      "Chiều": [{ time: "18:00", dish: "", calories: "" }],
    });
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa món ăn này?")) return;
    try {
      const res = await fetch(`/api/meals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMealHistory(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditMeal = (meal: MealEntry) => {
    const notes = meal.notes || "";
    const calMatch = notes.match(/(\d+)/);
    setEditingMeals(prev => ({
      ...prev,
      [meal.id]: { name: meal.name, calories: calMatch ? calMatch[1] : "" },
    }));
  };

  const handleCancelEditMeal = (id: string) => {
    setEditingMeals(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSaveEditMeal = async (id: string) => {
    const edit = editingMeals[id];
    if (!edit) return;
    try {
      const res = await fetch(`/api/meals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: edit.name,
          notes: edit.calories ? `${edit.calories} kcal` : null,
        }),
      });

      if (res.ok) {
        setMealHistory(prev => prev.map(m =>
          m.id === id
            ? { ...m, name: edit.name, notes: edit.calories ? `${edit.calories} kcal` : null }
            : m
        ));
        handleCancelEditMeal(id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditFieldChange = (id: string, field: "name" | "calories", value: string) => {
    setEditingMeals(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // Filter meals by view mode
  const filteredMeals = useMemo(() => {
    if (mealHistory.length === 0) return [];
    if (viewMode === "day" && selectedDate) {
      return mealHistory.filter(m => {
        const d = parseDate(m.time);
        if (!d) return false;
        return d.toISOString().split("T")[0] === selectedDate;
      });
    }
    if (viewMode === "week" && selectedWeek) {
      const weekOpt = availableWeeks.find(w => w.value === selectedWeek);
      if (weekOpt) {
        return mealHistory.filter(m => {
          const d = parseDate(m.time);
          if (!d) return false;
          const datePart = d.toISOString().split("T")[0];
          return datePart >= weekOpt.startDate && datePart <= weekOpt.endDate;
        });
      }
    }
    if (viewMode === "month" && selectedMonth) {
      return mealHistory.filter(m => {
        const d = parseDate(m.time);
        if (!d) return false;
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}` === selectedMonth;
      });
    }
    return mealHistory;
  }, [viewMode, selectedDate, selectedWeek, selectedMonth, mealHistory, availableWeeks]);

  // Group meals by date for week/month view
  const mealsByDate = useMemo(() => {
    if (viewMode === "day") return null;
    const groups: Record<string, MealEntry[]> = {};
    filteredMeals.forEach(m => {
      const d = parseDate(m.time);
      if (!d) return;
      const dateKey = d.toISOString().split("T")[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(m);
    });
    return groups;
  }, [filteredMeals, viewMode]);

  const sortedDates = mealsByDate ? Object.keys(mealsByDate).sort((a, b) => b.localeCompare(a)) : [];
  const totalDatePages = sortedDates.length;
  const currentDateKey = viewMode === "day"
    ? selectedDate
    : (sortedDates[currentPage - 1] || "");
  const currentDateMeals = currentDateKey
    ? (mealsByDate?.[currentDateKey] || (viewMode === "day" ? filteredMeals : []))
    : [];

  const sessionTotals = useMemo(() => {
    const totals = { "Sáng": 0, "Trưa": 0, "Chiều": 0 };
    filteredMeals.forEach(m => {
      const d = parseDate(m.time);
      if (!d) return;
      const session = getSessionFromHour(d.getHours());
      totals[session as keyof typeof totals] += parseCalories(m.notes);
    });
    return totals;
  }, [filteredMeals]);

  const totalCalories = sessionTotals["Sáng"] + sessionTotals["Trưa"] + sessionTotals["Chiều"];

  // For day view: show all meals (no pagination), for week/month: paginate by date
  const totalPages = viewMode === "day" ? 1 : totalDatePages;
  const displayMeals = viewMode === "day" ? filteredMeals : currentDateMeals;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
      </div>
    );
  }

  const renderMealRow = (meal: MealEntry) => {
    const isEditing = meal.id in editingMeals;
    const edit = editingMeals[meal.id];

    if (isEditing && edit) {
      return (
        <div key={meal.id} className="flex items-center gap-1.5 py-1.5 px-2 border-b border-natural-border/10 last:border-0 bg-natural-light/30">
          <input
            type="time"
            value={meal.time ? meal.time.split("T")[1]?.slice(0, 5) : ""}
            disabled
            className="w-16 text-[10px] font-bold p-1.5 rounded-lg bg-white/50 border border-natural-border outline-none text-slate-400"
          />
          <input
            type="text"
            value={edit.name}
            onChange={(e) => handleEditFieldChange(meal.id, "name", e.target.value)}
            className="flex-1 text-[11px] font-bold p-1.5 rounded-lg bg-white border border-natural-border outline-none focus:border-natural-primary"
          />
          <input
            type="number"
            value={edit.calories}
            onChange={(e) => handleEditFieldChange(meal.id, "calories", e.target.value)}
            className="w-16 text-[10px] font-bold p-1.5 rounded-lg bg-white border border-natural-border outline-none focus:border-natural-primary"
          />
          <button
            onClick={() => handleSaveEditMeal(meal.id)}
            className="p-1 rounded text-emerald-500 hover:bg-emerald-50 transition-all"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleCancelEditMeal(meal.id)}
            className="p-1 rounded text-slate-400 hover:bg-slate-100 transition-all"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      );
    }

    return (
      <div key={meal.id} className="flex items-center gap-1.5 py-1.5 px-2 border-b border-natural-border/10 last:border-0">
        <span className="w-16 text-[10px] font-bold text-slate-400">{meal.time ? meal.time.split("T")[1]?.slice(0, 5) : ""}</span>
        <p className="text-[11px] font-bold text-natural-primary-dark line-clamp-1 flex-1">{meal.name}</p>
        <p className="w-16 text-[10px] font-bold text-slate-400 text-right">{parseCalories(meal.notes)}</p>
        <div className="flex gap-0.5">
          <button
            onClick={() => handleStartEditMeal(meal)}
            className="p-1 rounded text-slate-400 hover:text-natural-primary hover:bg-natural-light transition-all"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleDeleteMeal(meal.id)}
            className="p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Nhật ký calo</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Theo dõi năng lượng bạn đã nạp vào cơ thể.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 p-1 bg-natural-light rounded-full">
            {(["day", "week", "month"] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); setCurrentPage(1); }}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  viewMode === mode
                    ? "bg-natural-primary text-white shadow-md"
                    : "text-slate-500 hover:text-natural-primary"
                )}
              >
                {mode === "day" ? "Ngày" : mode === "week" ? "Tuần" : "Tháng"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            {viewMode === "day" && (
              <select
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setCurrentPage(1); }}
                className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary outline-none cursor-pointer"
              >
                {availableDates.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {viewMode === "week" && (
              <select
                value={selectedWeek}
                onChange={(e) => { setSelectedWeek(e.target.value); setCurrentPage(1); }}
                className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary outline-none cursor-pointer"
              >
                {availableWeeks.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
            {viewMode === "month" && (
              <select
                value={selectedMonth}
                onChange={(e) => { setSelectedMonth(e.target.value); setCurrentPage(1); }}
                className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary outline-none cursor-pointer"
              >
                {availableMonths.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            )}
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-2">
              <span className="text-4xl font-black text-natural-primary">{totalCalories}</span>
              <span className="text-xl font-bold text-slate-300">/ 2,100</span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Tổng calo đã nạp</p>
          </div>
        </div>
      </div>

      {/* Session totals */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(sessionTotals).map(([session, total]) => (
          <div key={session} className="p-4 rounded-2xl bg-natural-light/40 border border-natural-border/30 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{session}</p>
            <p className="text-lg font-black text-natural-primary-dark">{total} <span className="text-[10px] text-slate-400">kcal</span></p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-4 w-full bg-natural-light rounded-full overflow-hidden border border-natural-border/30 shadow-inner">
        <div
          className="h-full bg-natural-primary shadow-sm transition-all duration-1000 ease-out"
          style={{ width: `${Math.min((totalCalories / 2100) * 100, 100)}%` }}
        />
      </div>

      {/* Add meal form & History */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lịch sử bữa ăn</h4>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-natural-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-natural-primary/90 transition-all shadow-md shadow-natural-primary/20"
            >
              <Plus className="h-3 w-3" /> Thêm bữa ăn
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="rounded-[32px] bg-white border-2 border-natural-primary shadow-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-natural-primary uppercase tracking-widest">Thêm bữa ăn mới</h4>
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-black text-slate-400 uppercase">Ngày:</label>
                <input
                  type="date"
                  value={addDate}
                  onChange={(e) => setAddDate(e.target.value)}
                  className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-natural-border/30 gap-4">
              {SESSION_TYPES.map(session => {
                const rows = newMealRows[session];
                const headerColor = session === "Sáng" ? "bg-amber-50 text-amber-600 border-amber-100" :
                  session === "Trưa" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                    "bg-rose-50 text-rose-600 border-rose-100";

                return (
                  <div key={session} className="space-y-3">
                    <div className={clsx(
                      "flex items-center justify-between p-2 rounded-xl border",
                      headerColor
                    )}>
                      <span className="text-[10px] font-black uppercase tracking-widest">{session}</span>
                      <button
                        onClick={() => addMealRow(session)}
                        className="p-1 rounded-full hover:bg-black/10 transition-all"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {/* Column headers */}
                      <div className="grid grid-cols-[auto_1fr_auto] gap-1.5 px-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase w-12">Giờ</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase">Món ăn</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase w-14 text-right">Calo</span>
                      </div>
                      {/* Meal rows */}
                      {rows.map((row, idx) => (
                        <div key={idx} className="grid grid-cols-[auto_1fr_auto] gap-1.5 items-center">
                          <input
                            type="time"
                            value={row.time}
                            onChange={(e) => handleUpdateNewMealRow(session, idx, "time", e.target.value)}
                            className="w-12 text-[10px] font-bold p-1.5 rounded-lg bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                          />
                          <input
                            type="text"
                            value={row.dish}
                            onChange={(e) => handleUpdateNewMealRow(session, idx, "dish", e.target.value)}
                            placeholder="Tên món..."
                            className="text-[11px] font-bold p-1.5 rounded-lg bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={row.calories}
                              onChange={(e) => handleUpdateNewMealRow(session, idx, "calories", e.target.value)}
                              placeholder="Kcal"
                              className="w-14 text-[10px] font-bold p-1.5 rounded-lg bg-natural-light border border-natural-border outline-none focus:border-natural-primary text-right"
                            />
                            {rows.length > 1 && (
                              <button
                                onClick={() => removeMealRow(session, idx)}
                                className="p-1 rounded text-rose-400 hover:bg-rose-50 transition-all"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t border-natural-border/30">
              <button
                onClick={handleCancelForm}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveMeals}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20 disabled:opacity-50 hover:bg-natural-primary/90 transition-all"
              >
                {saving ? "Đang lưu..." : "Lưu bữa ăn"}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-[32px] bg-white border border-natural-border shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-natural-border/30">
            {SESSION_TYPES.map(session => {
              const sessionMeals = displayMeals.filter(m => {
                const d = parseDate(m.time);
                if (!d) return false;
                return getSessionFromHour(d.getHours()) === session;
              });
              const sessionCal = sessionMeals.reduce((sum, m) => sum + parseCalories(m.notes), 0);

              const headerColor = session === "Sáng" ? "bg-amber-50 text-amber-600 border-amber-100" :
                session === "Trưa" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                  "bg-rose-50 text-rose-600 border-rose-100";

              return (
                <div key={session} className="p-4 transition-all min-h-[160px]">
                  <div className={clsx(
                    "flex items-center justify-between mb-3 p-2 rounded-xl border",
                    headerColor
                  )}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{session}</span>
                    {sessionCal > 0 && (
                      <span className="text-[9px] font-bold opacity-70">{sessionCal} kcal</span>
                    )}
                  </div>

                  {sessionMeals.length > 0 ? (
                    <div className="space-y-0.5">{sessionMeals.map(m => renderMealRow(m))}</div>
                  ) : (
                    <p className="text-[10px] text-slate-300 font-medium italic text-center py-4">Chưa ghi nhận</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}