import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ChefHat, ClipboardList, Utensils, Calculator, Search, ChevronRight, Plus, Sparkles, UtensilsCrossed, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { getNutritionSuggestion } from '../services/geminiService';

export default function Nutrition() {
  const location = useLocation();

  const subMenu = [
    { name: 'Tạo thực đơn và Nhật ký', path: '/nutrition', icon: ClipboardList },
    { name: 'Tra cứu & Gợi ý', path: '/nutrition/resources', icon: ChefHat },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-black text-natural-primary-dark tracking-tight uppercase">Chế độ dinh dưỡng</h1>
        <nav className="mt-6 flex flex-wrap gap-2">
          {subMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all border',
                location.pathname === item.path
                  ? 'bg-natural-primary text-white border-natural-primary shadow-lg shadow-natural-primary/20'
                  : 'bg-white text-slate-500 hover:bg-natural-light border-natural-border'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </header>

      <div className="rounded-[32px] bg-white p-8 shadow-sm border border-natural-border">
        <Routes>
          <Route path="/" element={<PlanningTab />} />
          <Route path="/resources" element={<ResourcesTab />} />
        </Routes>
      </div>
    </div>
  );
}

function PlanningTab() {
  return (
    <div className="space-y-12">
      <section>
        <NutritionPlan />
      </section>
      <div className="h-px bg-natural-border w-full" />
      <section>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-natural-primary-dark">Tính toán Carbohydrate</h3>
          <p className="text-sm text-slate-500 font-medium">Ước tính lượng tinh bột trong phần ăn của bạn.</p>
        </div>
        <CarbCalculator />
      </section>
    </div>
  );
}

function ResourcesTab() {
  return (
    <div className="space-y-12">
      <section>
        <SuggestedMenu />
      </section>
      <div className="h-px bg-natural-border w-full" />
      <section>
        <div className="mb-6">
          <h3 className="text-lg font-bold text-natural-primary-dark">Tra cứu thực phẩm</h3>
          <p className="text-sm text-slate-500 font-medium">Tìm kiếm chỉ số dinh dưỡng của các thực phẩm phổ biến.</p>
        </div>
        <FoodList />
      </section>
    </div>
  );
}

function SuggestedMenu() {
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetAiSuggestion = async () => {
    setLoading(true);
    try {
      const suggestion = await getNutritionSuggestion(6.2, 'bữa trưa');
      setAiSuggestion(suggestion);
    } catch (error) {
       setAiSuggestion("Rất tiếc, AI đang bận một chút. Bạn hãy thử lại sau nhé!");
    } finally {
      setLoading(false);
    }
  };

  const meals = [
    { type: 'Bữa sáng', dish: 'Ngũ cốc nguyên hạt, sữa không đường', note: 'Ưu tiên các loại hạt giàu chất xơ' },
    { type: 'Bữa phụ sáng', dish: '1 hũ sữa chua ít béo', note: 'Giúp duy trì năng lượng ổn định' },
    { type: 'Bữa trưa', dish: 'Cơm gạo lứt, ức gà luộc, súp lơ xanh', note: 'Phân bổ theo quy tắc đĩa thức ăn' },
    { type: 'Bữa phụ chiều', dish: 'Hạt điều hoặc óc chó (1 nắm nhỏ)', note: 'Cung cấp chất béo tốt' },
    { type: 'Bữa tối', dish: 'Cá hồi áp chảo, salad rau củ', note: 'Hạn chế tinh bột vào buổi tối' },
  ];

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

function NutritionPlan() {
  const [mealHistory, setMealHistory] = useState([
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

  // Calculate totals per session (Sáng, Trưa, Chiều) for Today (12/05 hardcoded for demo)
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
                  onChange={(e) => setSessionMeta({...sessionMeta, date: e.target.value})}
                  className="w-full text-xs font-bold p-3 rounded-xl bg-natural-light border border-natural-border outline-none focus:border-natural-primary"
                  placeholder="DD/MM"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-1">Buổi</label>
                <select 
                  value={sessionMeta.type}
                  onChange={(e) => setSessionMeta({...sessionMeta, type: e.target.value})}
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

function FoodList() {
  const categories = ['Rau xanh', 'Đạm', 'Tinh bột', 'Trái cây', 'Sữa'];
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
        {categories.map((cat, i) => (
          <button key={i} className="whitespace-nowrap rounded-full bg-white border border-natural-border px-6 py-2 text-xs font-bold text-slate-500 hover:bg-natural-primary hover:text-white hover:border-natural-primary transition-all">
            {cat}
          </button>
        ))}
      </div>
      <div className="grid gap-4">
        {['Bông cải xanh', 'Thịt bò nạc', 'Gạo lứt', 'Táo đỏ'].map((food, i) => (
          <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-natural-border hover:border-natural-primary hover:shadow-lg cursor-pointer transition-all">
             <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-xl bg-natural-light flex items-center justify-center text-natural-primary font-black text-xl">
                 {food[0]}
               </div>
               <span className="text-lg font-bold text-natural-primary-dark">{food}</span>
             </div>
             <div className="h-8 w-8 rounded-full border border-natural-border flex items-center justify-center text-slate-300">
               <ChevronRight className="h-5 w-5" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CarbCalculator() {
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
             <select className="w-full rounded-2xl border border-natural-border bg-natural-light/50 p-4 font-bold text-natural-primary-dark outline-none focus:border-natural-primary">
               <option>Cơm trắng</option>
               <option>Cơm gạo lứt</option>
               <option>Bánh mì đen</option>
               <option>Khoai tây / Khoai lang</option>
             </select>
          </div>
          <div>
             <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Trọng lượng (gram)</label>
             <input type="number" placeholder="100" className="w-full rounded-2xl border border-natural-border bg-natural-light/50 p-4 font-bold text-natural-primary-dark outline-none focus:border-natural-primary" />
          </div>
        </div>
        <div className="p-10 rounded-[40px] bg-white border-2 border-natural-border shadow-inner text-center">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Lượng Carb ước tính</p>
          <p className="text-6xl font-black text-natural-primary mt-2">28<span className="text-xl font-bold text-slate-400 ml-2 italic">g</span></p>
        </div>
      </div>
    </div>
  );
}
