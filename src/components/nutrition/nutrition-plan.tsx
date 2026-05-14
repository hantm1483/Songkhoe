"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit2, Calendar } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface MealEntry {
  id: string;
  name: string;
  gi_level: string | null;
  notes: string | null;
  time: string;
  calories?: number;
}

interface DateOption {
  label: string;
  value: string;
}

export function NutritionPlan() {
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Form state
  const [isAdding, setIsAdding] = useState(false);
  const [sessionMeta, setSessionMeta] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "Sáng",
  });
  const [sessionDishes, setSessionDishes] = useState([{ dish: "", calories: "" }]);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editingMeal, setEditingMeal] = useState<MealEntry | null>(null);
  const [editForm, setEditForm] = useState({ name: "", calories: "" });

  const SESSION_TYPES = ["Sáng", "Trưa", "Chiều"];

  const loadMeals = useCallback(async () => {
    try {
      const res = await fetch("/api/meals?limit=200");
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const meals: MealEntry[] = json.data?.meals || [];
      setMealHistory(meals);

      // Set default selected date to today
      const today = new Date().toISOString().split("T")[0];
      if (!selectedDate && meals.length > 0) {
        const dates = getDistinctDates(meals);
        if (dates.some(d => d.value === today)) {
          setSelectedDate(today);
        } else if (dates.length > 0) {
          setSelectedDate(dates[0].value);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const getDistinctDates = (meals: MealEntry[]): DateOption[] => {
    const dateSet = new Set<string>();
    meals.forEach(meal => {
      const date = meal.time.split("T")[0];
      dateSet.add(date);
    });
    return Array.from(dateSet)
      .sort((a, b) => b.localeCompare(a))
      .map(value => {
        const d = new Date(value);
        const label = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
        return { value, label };
      });
  };

  const availableDates = getDistinctDates(mealHistory);

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
      await loadMeals();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const getSessionTime = (type: string): string => {
    switch (type) {
      case "Sáng": return "07:00";
      case "Trưa": return "12:00";
      case "Chiều": return "18:00";
      default: return "12:00";
    }
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      const res = await fetch(`/api/meals/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMealHistory(mealHistory.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditMeal = (meal: MealEntry) => {
    setEditingMeal(meal);
    // Extract calories from notes if available
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
        setMealHistory(mealHistory.map(m =>
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

  // Filter meals by selected date
  const filteredMeals = selectedDate
    ? mealHistory.filter(m => m.time.startsWith(selectedDate))
    : mealHistory;

  // Calculate calories per session
  const parseCalories = (notes: string | null): number => {
    if (!notes) return 0;
    const match = notes.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  const sessionTotals = {
    "Sáng": filteredMeals
      .filter(m => {
        const hour = new Date(m.time).getHours();
        return hour >= 5 && hour < 12;
      })
      .reduce((sum, m) => sum + parseCalories(m.notes), 0),
    "Trưa": filteredMeals
      .filter(m => {
        const hour = new Date(m.time).getHours();
        return hour >= 12 && hour < 17;
      })
      .reduce((sum, m) => sum + parseCalories(m.notes), 0),
    "Chiều": filteredMeals
      .filter(m => {
        const hour = new Date(m.time).getHours();
        return hour >= 17 && hour < 22;
      })
      .reduce((sum, m) => sum + parseCalories(m.notes), 0),
  };
  const totalTodayCalories = sessionTotals["Sáng"] + sessionTotals["Trưa"] + sessionTotals["Chiều"];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header with date selector */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Nhật ký calo</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Theo dõi năng lượng bạn đã nạp vào cơ thể.</p>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-natural-border bg-natural-light/50 px-3 py-2 text-xs font-bold text-natural-primary-dark focus:border-natural-primary outline-none cursor-pointer"
          >
            {availableDates.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
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

        {/* Meal history by session */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SESSION_TYPES.map(type => {
            const typeMeals = filteredMeals.filter(m => {
              const hour = new Date(m.time).getHours();
              if (type === "Sáng") return hour >= 5 && hour < 12;
              if (type === "Trưa") return hour >= 12 && hour < 17;
              return hour >= 17 && hour < 22;
            });
            const sessionCal = typeMeals.reduce((sum, m) => sum + parseCalories(m.notes), 0);

            return (
              <div key={type} className={clsx(
                "p-5 rounded-2xl border transition-all",
                typeMeals.length > 0 ? "bg-white border-natural-border shadow-sm" : "bg-white/50 border-dashed border-slate-200 opacity-50"
              )}>
                <div className="flex justify-between items-start mb-3">
                  <p className={clsx(
                    "text-[9px] font-black uppercase tracking-widest",
                    type === "Sáng" ? "text-amber-500" : type === "Trưa" ? "text-emerald-500" : "text-rose-500"
                  )}>{type}</p>
                  {typeMeals.length > 0 && (
                    <span className="text-[10px] font-black text-natural-primary">{sessionCal} kcal</span>
                  )}
                </div>

                {typeMeals.length > 0 ? (
                  <div className="space-y-2">
                    {typeMeals.map((meal) => (
                      <div key={meal.id} className="flex justify-between items-center gap-2 py-2 border-b border-natural-border/20 last:border-0">
                        <p className="text-xs font-bold text-natural-primary-dark line-clamp-1 flex-1">{meal.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{parseCalories(meal.notes)}</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleStartEditMeal(meal)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-natural-primary hover:bg-natural-light transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-slate-300 font-bold italic">Chưa ghi nhận</p>
                )}
              </div>
            );
          })}
        </div>
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