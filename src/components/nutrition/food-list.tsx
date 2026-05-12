"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import type { Meal } from "@/lib/supabase/database.types";

const categories = ['Tất cả', 'Rau xanh', 'Đạm', 'Tinh bột', 'Trái cây', 'Sữa'];

interface FoodItem {
  id: string;
  name: string;
  gi_level: string | null;
  time: string;
}

export function FoodList() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  useEffect(() => {
    async function loadFoods() {
      try {
        const res = await fetch("/api/meals?limit=100");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const meals: Meal[] = json.data?.meals || [];
        setFoods(meals.map(m => ({ id: m.id, name: m.name, gi_level: m.gi_level, time: m.time })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFoods();
  }, []);

  const getCategoryIcon = (gi: string | null) => {
    if (gi === 'low') return '🟢';
    if (gi === 'medium') return '🟡';
    return '🔴';
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

  const filteredFoods = activeCategory === 'Tất cả'
    ? foods
    : foods.filter(f => {
        // Simple category matching based on name
        const lowGI = ['rau', 'cải', 'đậu', 'táo', 'sữa'];
        return lowGI.some(term => f.name.toLowerCase().includes(term));
      });

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm thực phẩm lành mạnh..."
          className="w-full rounded-2xl border border-natural-border bg-natural-light/50 pl-12 pr-4 py-4 text-sm font-medium focus:border-natural-primary focus:ring-0 outline-none"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap rounded-full px-6 py-2 text-xs font-bold transition-all ${
              activeCategory === cat
                ? 'bg-natural-primary text-white border-natural-primary'
                : 'bg-white border border-natural-border text-slate-500 hover:bg-natural-primary hover:text-white hover:border-natural-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {filteredFoods.length === 0 ? (
          <p className="text-center py-8 text-slate-400 font-medium">Chưa có thực phẩm nào</p>
        ) : (
          filteredFoods.map((food) => (
            <div
              key={food.id}
              className="flex items-center justify-between p-5 rounded-2xl bg-white border border-natural-border hover:border-natural-primary hover:shadow-lg cursor-pointer transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-natural-light flex items-center justify-center text-natural-primary font-black text-xl">
                  {getCategoryIcon(food.gi_level)}
                </div>
                <div>
                  <span className="text-lg font-bold text-natural-primary-dark">{food.name}</span>
                  <p className="text-xs text-slate-400 font-medium capitalize">GI: {food.gi_level || 'N/A'}</p>
                </div>
              </div>
              <div className="h-8 w-8 rounded-full border border-natural-border flex items-center justify-center text-slate-300">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}