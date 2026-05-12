"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface MealEntry {
  date: string;
  type: string;
  dish: string;
  calories: number;
}

export function NutritionPlan() {
  const [mealHistory, setMealHistory] = useState<MealEntry[]>([
    { date: '12/05', type: 'Sáng', dish: 'Phở bò ít bánh', calories: 350 },
    { date: '12/05', type: 'Trưa', dish: 'Cơm gạo lứt, cá kho', calories: 550 },
    { date: '12/05', type: 'Chiều', dish: 'Salad gà, súp rau', calories: 450 },
    { date: '11/05', type: 'Chiều', dish: 'Bún chả bò', calories: 600 },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [sessionMeta, setSessionMeta] = useState({
    date: new Date().toLocaleDateString('vi-VN').slice(0, 5),
    type: 'Sáng'
  });
  const [sessionDishes, setSessionDishes] = useState([{ dish: '', calories: '' }]);

  const handleAddDishRow = () => {
    setSessionDishes([...sessionDishes, { dish: '', calories: '' }]);
  };

  const handleRemoveDishRow = (index: number) => {
    if (sessionDishes.length > 1) {
      setSessionDishes(sessionDishes.filter((_, i) => i !== index));
    }
  };

  const handleUpdateDish = (index: number, field: 'dish' | 'calories', value: string) => {
    const updated = [...sessionDishes];
    updated[index][field] = value;
    setSessionDishes(updated);
  };

  const handleSaveSession = () => {
    const validDishes = sessionDishes.filter(d => d.dish && d.calories);
    if (validDishes.length === 0) return;

    const newEntries = validDishes.map(d => ({
      ...sessionMeta,
      dish: d.dish,
      calories: parseInt(d.calories.toString())
    }));

    setMealHistory([...newEntries, ...mealHistory]);
    setIsAdding(false);
    setSessionDishes([{ dish: '', calories: '' }]);
  };

  const uniqueDates = Array.from(new Set(mealHistory.map(m => m.date))).sort((a, b) => (b as string).localeCompare(a as string)) as string[];
  const today = '12/05';
  const todayMeals = mealHistory.filter(m => m.date === today);
  const sessionTotals = {
    'Sáng': todayMeals.filter(m => m.type === 'Sáng').reduce((sum, m) => sum + m.calories, 0),
    'Trưa': todayMeals.filter(m => m.type === 'Trưa').reduce((sum, m) => sum + m.calories, 0),
    'Chiều': todayMeals.filter(m => m.type === 'Chiều').reduce((sum, m) => sum + m.calories, 0),
  };
  const totalTodayCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-natural-primary-dark uppercase tracking-tight">Nhật ký calo hôm nay</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">Theo dõi năng lượng bạn đã nạp vào cơ thể.</p>
        </div>
        <div className="text-right">
          <div className="flex items-baseline justify-end gap-2">
            <span className="text-4xl font-black text-natural-primary">{totalTodayCalories}</span>
            <span className="text-xl font-bold text-slate-300">/ 2,100</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Tổng calo trên mức calo đã nạp</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(sessionTotals).map(([session, total]) => (
          <div key={session} className="p-4 rounded-2xl bg-natural-light/40 border border-natural-border/30 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{session}</p>
            <p className="text-lg font-black text-natural-primary-dark">{total} <span className="text-[10px] text-slate-400">kcal</span></p>
          </div>
        ))}
      </div>

      <div className="h-4 w-full bg-natural-light rounded-full overflow-hidden border border-natural-border/30 shadow-inner">
        <div
          className="h-full bg-natural-primary shadow-sm transition-all duration-1000 ease-out"
          style={{ width: `${Math.min((totalTodayCalories / 2100) * 100, 100)}%` }}
        />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Lịch sử bữa ăn gần đây</h4>
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
                  type="text"
                  value={sessionMeta.date}
                  onChange={(e) => setSessionMeta({ ...sessionMeta, date: e.target.value })}
                  className="w-full text-xs font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                  placeholder="DD/MM"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Buổi</label>
                <select
                  value={sessionMeta.type}
                  onChange={(e) => setSessionMeta({ ...sessionMeta, type: e.target.value })}
                  className="w-full text-xs font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                >
                  <option>Sáng</option>
                  <option>Trưa</option>
                  <option>Chiều</option>
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
                      onChange={(e) => handleUpdateDish(i, 'dish', e.target.value)}
                      className="w-full text-xs font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                      placeholder="Tên món ăn..."
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={dish.calories}
                      onChange={(e) => handleUpdateDish(i, 'calories', e.target.value)}
                      className="w-full text-xs font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
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
                className="px-6 py-2.5 rounded-xl bg-natural-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-natural-primary/20"
              >
                Lưu nhật ký
              </button>
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          {uniqueDates.map(date => {
            const dayMeals = mealHistory.filter(m => m.date === date);
            const totalDayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);

            return (
              <div key={date} className="bg-natural-light/20 rounded-[32px] p-6 border border-natural-border/50">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-natural-primary" />
                    <span className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">Ngày {date}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Tổng: <span className="text-natural-primary">{totalDayCalories}</span> kcal</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Sáng', 'Trưa', 'Chiều'].map(type => {
                    const mealsOfType = dayMeals.filter(m => m.type === type);
                    const sessionCal = mealsOfType.reduce((sum, m) => sum + m.calories, 0);

                    return (
                      <div key={type} className={clsx(
                        "p-5 rounded-2xl border transition-all h-full",
                        mealsOfType.length > 0 ? "bg-white border-natural-border shadow-sm" : "bg-white/50 border-dashed border-slate-200 opacity-50"
                      )}>
                        <div className="flex justify-between items-start mb-2">
                          <p className={clsx(
                            "text-[9px] font-black uppercase tracking-widest",
                            type === 'Sáng' ? "text-amber-500" : type === 'Trưa' ? "text-emerald-500" : "text-rose-500"
                          )}>{type}</p>
                          {mealsOfType.length > 0 && (
                            <span className="text-[10px] font-black text-natural-primary">{sessionCal} kcal</span>
                          )}
                        </div>
                        {mealsOfType.length > 0 ? (
                          <div className="space-y-1">
                            {mealsOfType.map((meal, idx) => (
                              <div key={idx} className="flex justify-between items-center gap-2">
                                <p className="text-xs font-bold text-natural-primary-dark line-clamp-1">{meal.dish}</p>
                                <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{meal.calories}</p>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}