"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

const meals = [
  { type: 'Bữa sáng', dish: 'Ngũ cốc nguyên hạt, sữa không đường', note: 'Ưu tiên các loại hạt giàu chất xơ' },
  { type: 'Bữa phụ sáng', dish: '1 hũ sữa chua ít béo', note: 'Giúp duy trì năng lượng ổn định' },
  { type: 'Bữa trưa', dish: 'Cơm gạo lứt, ức gà luộc, súp lơ xanh', note: 'Phân bổ theo quy tắc đĩa thức ăn' },
  { type: 'Bữa phụ chiều', dish: 'Hạt điều hoặc óc chó (1 nắm nhỏ)', note: 'Cung cấp chất béo tốt' },
  { type: 'Bữa tối', dish: 'Cá hồi áp chảo, salad rau củ', note: 'Hạn chế tinh bột vào buổi tối' },
];

export function SuggestedMenu() {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAiSuggestion = async () => {
    setLoading(true);
    // Mock AI response for now
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAiSuggestion("Dựa trên chỉ số đường huyết 6.2 mmol/L của bạn, bữa trưa hôm nay nên ưu tiên thực phẩm giàu chất xơ như rau xanh, ức gà luộc và hạn chế tinh bột. Nên ăn cơm gạo lứt thay cơm trắng để kiểm soát đường huyết tốt hơn.");
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-natural-primary-dark">Thực đơn gợi ý chuyên biệt</h3>
        <span className="text-xs font-black text-natural-primary bg-natural-light px-3 py-1 rounded-full uppercase tracking-widest border border-natural-primary/10">Dinh dưỡng cân bằng</span>
      </div>

      <div className="p-8 rounded-[32px] bg-natural-primary-dark text-white shadow-xl overflow-hidden relative group">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-natural-soft" />
            </div>
            <div>
              <h4 className="font-bold text-xl tracking-tight">Cố vấn Dinh dưỡng AI</h4>
              <p className="text-xs text-natural-soft/80 font-medium uppercase tracking-widest mt-0.5">Phân tích đa chiều</p>
            </div>
          </div>
          {aiSuggestion ? (
            <div className="text-sm bg-white/10 p-5 rounded-2xl backdrop-blur-sm mt-4 border border-white/10 leading-relaxed font-medium">
              {aiSuggestion}
            </div>
          ) : (
            <p className="text-base text-white/80 font-medium leading-relaxed max-w-sm mt-2">AI sẽ phân tích chỉ số đường huyết gần nhất để gợi ý thực đơn tối ưu cho từng bữa ăn của bạn.</p>
          )}
          <button
            onClick={handleGetAiSuggestion}
            disabled={loading}
            className="mt-8 bg-natural-primary text-white border border-white/20 px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-natural-primary/80 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang phân tích...
              </>
            ) : 'Nhận gợi ý thực đơn ngay'}
          </button>
        </div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-natural-primary rounded-full blur-3xl opacity-30 group-hover:scale-125 transition-transform duration-700" />
      </div>

      <div className="space-y-4">
        {meals.map((meal, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white border border-natural-border hover:border-natural-primary/30 hover:shadow-sm transition-all gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-natural-light flex items-center justify-center font-black text-natural-primary text-xs uppercase text-center leading-none px-2">
                {meal.type}
              </div>
              <div>
                <p className="font-bold text-natural-primary-dark text-lg leading-tight">{meal.dish}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mt-1">Carb vừa phải • Giàu xơ</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-natural-beige/50 rounded-xl border border-natural-border/50">
              <p className="text-sm text-natural-primary-dark font-semibold italic">"{meal.note}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}