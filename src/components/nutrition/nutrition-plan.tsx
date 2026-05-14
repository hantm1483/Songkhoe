"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Plus, Trash2, Edit2, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

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
const PAGE_SIZE = 5;
const SESSION_TYPES = ["Sáng", "Trưa", "Chiều"];

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
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

  // Form state - use stable initial values
  const [isAdding, setIsAdding] = useState(false);
  const [sessionMeta, setSessionMeta] = useState({ date: "", type: "Sáng" });
  const [sessionDishes, setSessionDishes] = useState([{ dish: "", calories: "" }]);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [editForm, setEditForm] = useState({ name: "", calories: "" });

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

  // Derive available options from mealHistory - stable across renders
  const { availableDates, availableWeeks, availableMonths } = useMemo(() => {
    if (mealHistory.length === 0) {
      return { availableDates: [], availableWeeks: [], availableMonths: [] };
    }

    // Date options
    const dateMap = new Map<string, string>();
    mealHistory.forEach(meal => {
      const dateKey = meal.time.split("T")[0];
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, formatDateLabel(dateKey));
      }
    });
    const dates = Array.from(dateMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([value, label]) => ({ value, label }));

    // Week options
    const weekMap = new Map<string, WeekOption>();
    mealHistory.forEach(meal => {
      const d = new Date(meal.time);
      if (isNaN(d.getTime())) return;
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

    // Month options
    const monthMap = new Map<string, MonthOption>();
    mealHistory.forEach(meal => {
      const d = new Date(meal.time);
      if (isNaN(d.getTime())) return;
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

  // Set default selections when options become available
  useEffect(() => {
    if (!selectedDate && availableDates.length > 0) {
      const today = new Date().toISOString().split("T")[0];
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

  const handleAddDishRow = () => {
    setSessionDishes([...sessionDishes, { dish: "", calories: "" }]);
  };

  const handleRemoveDishRow = (index: number) => {
    if (sessionDishes.length > 1) {
      setSessionDishes(sessionDishes.filter((_, i) => i !== index));
    }
  };

  const handleUpdateDish = (index: number, field: "dish" | "calories", value: string) => {
    const updated = [...sessionDishes];
    updated[index][field] = value;
    setSessionDishes(updated);
  };

  const getSessionTime = (type: string): string => {
    switch (type) {
      case "Sáng": return "07:00";
      case "Trưa": return "12:00";
      case "Chiều": return "18:00";
      default: return "12:00";
    }
  };

  const handleSaveSession = async () => {
    const validDishes = sessionDishes.filter(d => d.dish && d.calories);
    if (validDishes.length === 0) return;

    setSaving(true);
    try {
      const promises = validDishes.map(dish => {
        const time = `${sessionMeta.date}T${getSessionTime(sessionMeta.type)}:00`;
        return fetch("/api/meals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: dish.dish,
            notes: `${dish.calories} kcal`,
            time: time,
          }),
        });
      });

      await Promise.all(promises);
      setIsAdding(false);
      setSessionDishes([{ dish: "", calories: "" }]);
      setSessionMeta({ date: "", type: "Sáng" });
      await loadMeals();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMeal = async (id: string) => {
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
    setEditingMeal(meal);
    const notes = meal.notes || "";
    const calMatch = notes.match(/(\d+)/);
    setEditForm({
      name: meal.name,
      calories: calMatch ? calMatch[1] : "",
    });
  };

  const handleSaveEditMeal = async () => {
    if (!editingMeal) return;
    try {
      const res = await fetch(`/api/meals/${editingMeal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          notes: editForm.calories ? `${editForm.calories} kcal` : null,
        }),
      });

      if (res.ok) {
        setMealHistory(prev => prev.map(m =>
          m.id === editingMeal.id
            ? { ...m, name: editForm.name, notes: editForm.calories ? `${editForm.calories} kcal` : null }
            : m
        ));
        setEditingMeal(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter meals by view mode
  const filteredMeals = useMemo(() => {
    if (mealHistory.length === 0) return [];
    if (viewMode === "day" && selectedDate) {
      return mealHistory.filter(m => m.time.startsWith(selectedDate));
    }
    if (viewMode === "week" && selectedWeek) {
      const weekOpt = availableWeeks.find(w => w.value === selectedWeek);
      if (weekOpt) {
        return mealHistory.filter(m => {
          const d = m.time.split("T")[0];
          return d >= weekOpt.startDate && d <= weekOpt.endDate;
        });
      }
    }
    if (viewMode === "month" && selectedMonth) {
      return mealHistory.filter(m => m.time.startsWith(selectedMonth));
    }
    return mealHistory;
  }, [viewMode, selectedDate, selectedWeek, selectedMonth, mealHistory, availableWeeks]);

  const sessionTotals = useMemo(() => {
    const totals = { "Sáng": 0, "Trưa": 0, "Chiều": 0 };
    filteredMeals.forEach(m => {
      const hour = new Date(m.time).getHours();
      if (!isNaN(hour)) {
        const session = getSessionFromHour(hour);
        totals[session as keyof typeof totals] += parseCalories(m.notes);
      }
    });
    return totals;
  }, [filteredMeals]);

  const totalTodayCalories = sessionTotals["Sáng"] + sessionTotals["Trưa"] + sessionTotals["Chiều"];

  // Paginated meals
  const paginatedMeals = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredMeals.slice(start, start + PAGE_SIZE);
  }, [filteredMeals, currentPage]);

  const totalPages = Math.ceil(filteredMeals.length / PAGE_SIZE);

  // Group paginated meals by date then session
  const groupedMeals = useMemo(() => {
    const groups: Record<string, Record<string, MealEntry[]>> = {};
    paginatedMeals.forEach(meal => {
      const dateKey = meal.time.split("T")[0];
      const d = new Date(meal.time);
      if (isNaN(d.getTime())) return;
      const session = getSessionFromHour(d.getHours());
      if (!groups[dateKey]) groups[dateKey] = {};
      if (!groups[dateKey][session]) groups[dateKey][session] = [];
      groups[dateKey][session].push(meal);
    });
    return groups;
  }, [paginatedMeals]);

  const sortedDates = Object.keys(groupedMeals).sort((a, b) => b.localeCompare(a));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header with view mode selector */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Nhật ký calo</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Theo dõi năng lượng bạn đã nạp vào cơ thể.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* View mode toggle */}
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

          {/* Date/Week/Month selector */}
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
              <span className="text-4xl font-black text-natural-primary">{totalTodayCalories}</span>
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
          style={{ width: `${Math.min((totalTodayCalories / 2100) * 100, 100)}%` }}
        />
      </div>

      {/* Add meal form */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lịch sử bữa ăn</h4>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-natural-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-natural-primary/90 transition-all shadow-md shadow-natural-primary/20"
            >
              <Plus className="h-3 w-3" /> Thêm nhanh
            </button>
          )}
        </div>

        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-6 border-2 border-natural-primary shadow-xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              <div className="w-full sm:w-1/3">
                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Ngày</label>
                <input
                  type="date"
                  value={sessionMeta.date}
                  onChange={(e) => setSessionMeta({ ...sessionMeta, date: e.target.value })}
                  className="w-full text-xs font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Buổi</label>
                <select
                  value={sessionMeta.type}
                  onChange={(e) => setSessionMeta({ ...sessionMeta, type: e.target.value })}
                  className="w-full text-xs font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                >
                  {SESSION_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-1 block">Chi tiết món ăn</label>
              {sessionDishes.map((dish, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={dish.dish}
                      onChange={(e) => handleUpdateDish(i, "dish", e.target.value)}
                      className="w-full text-sm font-bold p-4 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                      placeholder="Tên món ăn..."
                    />
                  </div>
                  <div className="w-40">
                    <input
                      type="number"
                      value={dish.calories}
                      onChange={(e) => handleUpdateDish(i, "calories", e.target.value)}
                      className="w-full text-sm font-bold p-4 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                      placeholder="Kcal"
                    />
                  </div>
                  {sessionDishes.length > 1 && (
                    <button
                      onClick={() => handleRemoveDishRow(i)}
                      className="p-3 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Plus className="h-4 w-4 rotate-45" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={handleAddDishRow}
                className="flex items-center gap-2 text-[10px] font-black text-natural-primary uppercase tracking-widest hover:underline ml-1"
              >
                <Plus className="h-3 w-3" /> Thêm món khác
              </button>
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-natural-border/30">
              <button
                onClick={() => setIsAdding(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveSession}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20 disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu nhật ký"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Meal history by date → session → meal */}
        <div className="space-y-3">
          {sortedDates.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-bold text-sm">Chưa có dữ liệu</div>
          ) : (
            sortedDates.map(dateKey => {
              const sessionsInDay = groupedMeals[dateKey];
              return (
                <div key={dateKey} className="rounded-2xl bg-white border border-natural-border shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-natural-light/30 border-b border-natural-border/30 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-natural-primary" />
                    <span className="text-[10px] font-black text-natural-primary-dark uppercase tracking-widest">{formatDateLabel(dateKey)}</span>
                  </div>
                  <div className="divide-y divide-natural-border/10">
                    {SESSION_TYPES.map(session => {
                      const meals = sessionsInDay[session] || [];
                      const sessionCal = meals.reduce((sum, m) => sum + parseCalories(m.notes), 0);
                      return (
                        <div key={session}>
                          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50/50">
                            <span className={clsx(
                              "text-[9px] font-black uppercase tracking-widest",
                              session === "Sáng" ? "text-amber-500" : session === "Trưa" ? "text-emerald-500" : "text-rose-500"
                            )}>{session}</span>
                            {meals.length > 0 && (
                              <span className="text-[9px] font-bold text-slate-400 ml-auto">{sessionCal} kcal</span>
                            )}
                          </div>
                          {meals.length > 0 ? (
                            meals.map(meal => (
                              <div key={meal.id} className="flex items-center gap-2 px-4 py-1.5 hover:bg-natural-light/20 transition-colors">
                                <p className="text-[11px] font-bold text-natural-primary-dark line-clamp-1 flex-1">{meal.name}</p>
                                <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{parseCalories(meal.notes)}</p>
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
                            ))
                          ) : (
                            <p className="px-4 py-1 text-[10px] text-slate-300 font-medium italic">Chưa ghi nhận</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-500">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-natural-border text-slate-400 hover:text-natural-primary hover:border-natural-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setEditingMeal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="text-sm font-black text-natural-primary-dark uppercase tracking-wide mb-4">Chỉnh sửa món ăn</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Tên món</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full text-sm font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Calo (kcal)</label>
                  <input
                    type="number"
                    value={editForm.calories}
                    onChange={(e) => setEditForm({ ...editForm, calories: e.target.value })}
                    className="w-full text-sm font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setEditingMeal(null)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveEditMeal}
                  className="flex-[2] py-3 rounded-xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20"
                >
                  Lưu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}