"use client";

import { Calculator } from "lucide-react";
import { useState } from "react";

export function CarbCalculator() {
  const [foodType, setFoodType] = useState('Cơm trắng');
  const [weight, setWeight] = useState('');
  const [carbResult, setCarbResult] = useState<number | null>(null);

  const carbPer100g: Record<string, number> = {
    'Cơm trắng': 28,
    'Cơm gạo lứt': 23,
    'Bánh mì đen': 48,
    'Khoai tây': 17,
    'Khoai lang': 20,
  };

  const calculate = () => {
    if (weight) {
      const carbs = carbPer100g[foodType] || 28;
      setCarbResult((parseInt(weight) * carbs) / 100);
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-[28px] bg-[#F2E8CF] border border-natural-border flex gap-5 items-start">
        <Calculator className="h-8 w-8 text-[#BC4749] shrink-0" />
        <div>
          <h4 className="font-bold text-natural-primary-dark">Công cụ tính toán Carb</h4>
          <p className="text-sm text-[#6B705C] font-medium leading-relaxed mt-1">Giúp bạn tính toán chính xác lượng Carbohydrate để điều chỉnh liều lượng insulin hoặc thực đơn phù hợp.</p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Loại thực phẩm</label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full rounded-2xl border border-natural-border bg-natural-light/50 p-4 font-bold text-natural-primary-dark outline-none focus:border-natural-primary"
            >
              {Object.keys(carbPer100g).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Trọng lượng (gram)</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onBlur={calculate}
              placeholder="100"
              className="w-full rounded-2xl border border-natural-border bg-natural-light/50 p-4 font-bold text-natural-primary-dark outline-none focus:border-natural-primary"
            />
          </div>
        </div>
        <div className="p-10 rounded-[40px] bg-white border-2 border-natural-border shadow-inner text-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Lượng Carb ước tính</p>
          <p className="text-6xl font-black text-natural-primary mt-2">
            {carbResult !== null ? carbResult.toFixed(1) : '0'}
            <span className="text-xl font-bold text-slate-400 ml-2 italic">g</span>
          </p>
        </div>
      </div>
    </div>
  );
}