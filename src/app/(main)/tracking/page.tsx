"use client";

import { useState } from "react";
import { Page } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Droplet,
  Clock,
  Plus,
  Calendar,
  MoreHorizontal,
  Stethoscope,
  Pizza,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

// Chart data - exact format from GlucoCare source
const chartData = [
  { day: "T2", level: 120 },
  { day: "T3", level: 145 },
  { day: "T4", level: 110 },
  { day: "T5", level: 135 },
  { day: "T6", level: 160 },
  { day: "T7", level: 130 },
  { day: "CN", level: 115 },
];

// History data from GlucoCare source
const historyData = [
  { id: 1, time: "18:30", date: "21/10/2023", level: 115, status: "Bình thường", mood: "😊", notes: "Sau khi đi bộ" },
  { id: 2, time: "12:00", date: "21/10/2023", level: 145, status: "Hơi cao", mood: "😐", notes: "Trước bữa trưa" },
  { id: 3, time: "07:30", date: "21/10/2023", level: 130, status: "Bình thường", mood: "🙂", notes: "Lúc mới ngủ dậy" },
  { id: 4, time: "21:00", date: "20/10/2023", level: 160, status: "Cao", mood: "😟", notes: "Sau khi ăn tiệc" },
];

// Medication data from GlucoCare source
const initialMeds = [
  { id: 1, name: "Metformin 500mg", time: "07:30", dose: "1 viên", taken: false, session: "Sáng", days: Array.from({ length: 31 }, (_, i) => i + 1) },
  { id: 2, name: "Metformin 500mg", time: "21:00", dose: "1 viên", taken: false, session: "Tối", days: Array.from({ length: 31 }, (_, i) => i + 1) },
];

// Meal data from GlucoCare source
const initialMenus = [
  { id: 1, date: new Date().toISOString().split("T")[0], time: "07:30", mealName: "Phở bò", emoji: "🍜", kcal: "450k" },
  { id: 2, date: new Date().toISOString().split("T")[0], time: "12:00", mealName: "Cơm gạo lứt, cá kho", emoji: "🍱", kcal: "520k" },
  { id: 3, date: new Date().toISOString().split("T")[0], time: "18:30", mealName: "Salad gà, súp", emoji: "🥗", kcal: "380k" },
];

const SESSIONS = ["Sáng", "Trưa", "Chiều", "Tối"];
const MEAL_SESSIONS = ["Sáng", "Trưa", "Tối"];

export default function TrackingPage() {
  const [showModal, setShowModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const [readings, setReadings] = useState(historyData);
  const [meds, setMeds] = useState(initialMeds);
  const [menus, setMenus] = useState(initialMenus);

  // Form State
  const [formData, setFormData] = useState({ date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0, 5), value: "", notes: "" });
  const [medFormData, setMedFormData] = useState({ name: "", dose: "", time: "08:00", selectedDays: [] as number[] });
  const [menuFormData, setMenuFormData] = useState({ date: new Date().toISOString().split("T")[0], time: "08:00", mealName: "", kcal: "", emoji: "🍱" });

  const getStatusFromValue = (value: number): { status: string; variant: "success" | "warning" | "error" } => {
    if (value > 140) return { status: "Cao", variant: "warning" };
    if (value < 70) return { status: "Thấp", variant: "error" };
    return { status: "Bình thường", variant: "success" };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newReading = {
      id: Date.now(),
      time: formData.time,
      date: formData.date.split("-").reverse().join("/"),
      level: parseInt(formData.value),
      status: parseInt(formData.value) > 140 ? "Cao" : parseInt(formData.value) < 70 ? "Thấp" : "Bình thường",
      mood: "📝",
      notes: formData.notes
    };
    setReadings([newReading, ...readings]);
    setShowModal(false);
    setFormData({ date: new Date().toISOString().split("T")[0], time: new Date().toTimeString().slice(0, 5), value: "", notes: "" });
  };

  const handleSaveMed = (e: React.FormEvent) => {
    e.preventDefault();
    const session = parseInt(medFormData.time.split(":")[0]) < 11 ? "Sáng" : parseInt(medFormData.time.split(":")[0]) < 14 ? "Trưa" : parseInt(medFormData.time.split(":")[0]) < 19 ? "Chiều" : "Tối";
    const newMed = { id: Date.now(), name: medFormData.name, time: medFormData.time, dose: medFormData.dose, taken: false, session, days: medFormData.selectedDays.length > 0 ? medFormData.selectedDays : Array.from({ length: 31 }, (_, i) => i + 1) };
    setMeds([...meds, newMed]);
    setShowMedModal(false);
    setMedFormData({ name: "", dose: "", time: "08:00", selectedDays: [] });
  };

  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    const newMenu = { id: Date.now(), date: menuFormData.date, time: menuFormData.time, mealName: menuFormData.mealName, emoji: menuFormData.emoji, kcal: menuFormData.kcal ? `${menuFormData.kcal}k` : "" };
    setMenus([newMenu, ...menus].sort((a, b) => a.time.localeCompare(b.time)));
    setShowMenuModal(false);
    setMenuFormData({ date: new Date().toISOString().split("T")[0], time: "08:00", mealName: "", kcal: "", emoji: "🍱" });
  };

  const handleTakeMed = (id: number) => {
    setMeds(meds.map((m) => (m.id === id ? { ...m, taken: true } : m)));
  };

  const toggleDay = (day: number) => {
    setMedFormData(prev => ({ ...prev, selectedDays: prev.selectedDays.includes(day) ? prev.selectedDays.filter(d => d !== day) : [...prev.selectedDays, day] }));
  };

  const selectAllDays = () => {
    setMedFormData(prev => ({ ...prev, selectedDays: Array.from({ length: 31 }, (_, i) => i + 1) }));
  };

  return (
    <Page title="Theo dõi đường huyết">
      <div className="p-4 lg:p-6 space-y-3 max-w-7xl mx-auto">
        {/* Header - exact from GlucoCare: flex-col md:flex-row, h1 text-2xl, buttons text-xs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Theo dõi đường huyết</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <Calendar size={14} /> Lịch sử
            </button>
            <button onClick={() => setShowMedModal(true)} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors">
              <Stethoscope size={14} /> Lịch thuốc
            </button>
            <button onClick={() => setShowMenuModal(true)} className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors">
              <UtensilsCrossed size={14} /> Lập thực đơn
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
              <Plus size={14} /> Thêm chỉ số
            </button>
          </div>
        </div>

        {/* Blood Sugar Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Nhập chỉ số mới</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                      <MoreHorizontal size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ngày đo</label>
                        <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Giờ đo</label>
                        <input type="time" required value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Chỉ số (mg/dL)</label>
                      <div className="relative">
                        <input type="number" placeholder="Ví dụ: 120" required min="20" max="600" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-primary/20 pr-20" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">mg/dL</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ghi chú (Tùy chọn)</label>
                      <textarea placeholder="Sau khi ăn sáng, cảm thấy hơi mệt..." value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 h-24 resize-none" />
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Đóng</button>
                      <button type="submit" className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all">Lưu chỉ số</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Medication Modal */}
        <AnimatePresence>
          {showMedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMedModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden">
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Lịch uống thuốc mới</h2>
                    <button onClick={() => setShowMedModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                      <MoreHorizontal size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleSaveMed} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Tên thuốc</label>
                      <input type="text" placeholder="Ví dụ: Metformin" required value={medFormData.name} onChange={(e) => setMedFormData({ ...medFormData, name: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Liều lượng</label>
                        <input type="text" placeholder="1 viên" required value={medFormData.dose} onChange={(e) => setMedFormData({ ...medFormData, dose: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Giờ uống</label>
                        <input type="time" required value={medFormData.time} onChange={(e) => setMedFormData({ ...medFormData, time: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Áp dụng cho ngày trong tháng</label>
                        <button type="button" onClick={selectAllDays} className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase">Tất cả các ngày</button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <button key={day} type="button" onClick={() => toggleDay(day)} className={cn("h-8 w-full rounded-lg text-[10px] font-bold transition-all", medFormData.selectedDays.includes(day) ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-50 text-slate-400 hover:bg-slate-100")}>
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setShowMedModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Hủy bỏ</button>
                      <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">Lưu lịch trình</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Menu Modal */}
        <AnimatePresence>
          {showMenuModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMenuModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Lập thực đơn mới</h2>
                    <button onClick={() => setShowMenuModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                      <MoreHorizontal size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleSaveMenu} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Ngày</label>
                        <input type="date" required value={menuFormData.date} onChange={(e) => setMenuFormData({ ...menuFormData, date: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Giờ ăn</label>
                        <input type="time" required value={menuFormData.time} onChange={(e) => setMenuFormData({ ...menuFormData, time: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Món ăn / Thực đơn</label>
                      <input type="text" placeholder="Ví dụ: Phở bò, Sữa hạt..." required value={menuFormData.mealName} onChange={(e) => setMenuFormData({ ...menuFormData, mealName: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Calo (Tùy chọn)</label>
                        <div className="relative">
                          <input type="number" placeholder="Ví dụ: 350" value={menuFormData.kcal} onChange={(e) => setMenuFormData({ ...menuFormData, kcal: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20 pr-10" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">kcal</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Biểu tượng</label>
                        <select value={menuFormData.emoji} onChange={(e) => setMenuFormData({ ...menuFormData, emoji: e.target.value })} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20">
                          <option value="🍱">🍱 Cơm hộp</option>
                          <option value="🍜">🍜 Mì / Phở</option>
                          <option value="🥗">🥗 Salad</option>
                          <option value="🍳">🍳 Bữa sáng</option>
                          <option value="🍲">🍲 Canh / Súp</option>
                          <option value="🍎">🍎 Trái cây</option>
                          <option value="🥛">🥛 Sữa</option>
                          <option value="🥞">🥞 Bánh</option>
                        </select>
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                      <button type="button" onClick={() => setShowMenuModal(false)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors">Bỏ qua</button>
                      <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all">Lên thực đơn</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Grid - exact layout grid-cols-1 lg:grid-cols-12 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Content (Chart & Logs) */}
          <div className="lg:col-span-8 space-y-3">
            {/* Chart Card - p-3, h-[120px] */}
            <Card className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Chỉ số 7 ngày qua</h3>
                  <p className="text-xs text-slate-500 font-medium">Trung bình: <span className="text-primary font-bold">130 mg/dL</span></p>
                </div>
                <select className="bg-slate-50 border-none rounded-lg px-2 py-1 text-xs font-bold text-slate-600 outline-none">
                  <option>Tuần</option>
                  <option>Tháng</option>
                </select>
              </div>
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#008B8B" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#008B8B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 10 }} dy={5} />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "10px" }} />
                    <Area type="monotone" dataKey="level" stroke="#008B8B" strokeWidth={2} fillOpacity={1} fill="url(#colorLevel)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* History Card - bg-emerald-100, text-xs header, text-[9px]-text-[11px] table */}
            <Card className="p-3 bg-emerald-100 border-emerald-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Nhật ký đo</h3>
                <button className="text-xs font-bold text-primary hover:underline">Xem tất cả</button>
              </div>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {Array.from(new Set(readings.map(r => r.date))).slice(0, 3).map(date => {
                  const dateReadings = readings.filter(r => r.date === date);
                  return (
                    <div key={date} className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 bg-emerald-200"></div>
                        <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">{date}</span>
                        <div className="h-1 flex-1 bg-emerald-200"></div>
                      </div>
                      <div className="bg-white rounded-xl border border-emerald-200 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-12 gap-2 px-3 py-1.5 bg-emerald-50 border-b border-emerald-100 text-[9px] font-bold text-emerald-600 mt-0 uppercase">
                          <div className="col-span-2">Chỉ số</div>
                          <div className="col-span-2">Giờ đo</div>
                          <div className="col-span-3">Mức độ</div>
                          <div className="col-span-3">Ghi chú</div>
                          <div className="col-span-2 text-right">Thao tác</div>
                        </div>
                        <div className="divide-y divide-emerald-100">
                          {dateReadings.map((item) => {
                            const { status, variant } = getStatusFromValue(item.level);
                            return (
                              <div key={item.id} className="grid grid-cols-12 gap-2 items-center px-3 py-2 text-[11px] hover:bg-slate-50/50 transition-colors">
                                <div className="col-span-2 font-extrabold text-slate-700">
                                  {item.level} <span className="text-[8px] font-medium text-slate-400">mg/dL</span>
                                </div>
                                <div className="col-span-2 font-medium text-slate-500">{item.time}</div>
                                <div className="col-span-3">
                                  <Badge variant={variant} className="text-[9px] px-1.5 py-0 font-bold">{status}</Badge>
                                </div>
                                <div className="col-span-3 text-slate-400 text-[10px] truncate italic">{item.notes || "-"}</div>
                                <div className="col-span-2 flex items-center justify-end gap-1">
                                  <button className="p-1 hover:bg-white rounded text-slate-400 hover:text-primary shadow-sm border border-transparent hover:border-slate-100 transition-colors">
                                    <X size={10} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {readings.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-400 italic">Chưa có nhật ký đo nào</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Widgets - exact col-span-4 layout */}
          <div className="lg:col-span-4 space-y-3">
            {/* Medication Widget - bg-amber-100, amber icon */}
            <Card className="bg-amber-100 border-amber-200 p-3 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <Stethoscope size={18} className="text-amber-700" />
                <Badge variant="neutral" className="text-[10px] bg-amber-600 text-white border-none shadow-sm shadow-amber-200">Thuốc</Badge>
              </div>
              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {SESSIONS.map(session => {
                  const sessionMeds = meds.filter(m => m.session === session);
                  if (sessionMeds.length === 0) return null;
                  return (
                    <div key={session} className="space-y-1 mb-2 last:mb-0">
                      <div className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-sm">
                        <div className="grid grid-cols-12 gap-2 px-2.5 py-1.5 bg-amber-50 border-b border-amber-100 text-[9px] font-bold text-amber-600 uppercase">
                          <div className="col-span-6">Thuốc</div>
                          <div className="col-span-6 text-right pr-2">Thao tác</div>
                        </div>
                        <div className="divide-y divide-amber-50">
                          {sessionMeds.map(med => (
                            <div key={med.id} className="group grid grid-cols-12 items-center gap-2 p-2 bg-white hover:bg-amber-50/50 transition-colors">
                              <div className="col-span-6 flex flex-col min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">{med.name}</p>
                                <p className="text-[8px] text-amber-500 font-medium">{med.dose} • {med.time}</p>
                              </div>
                              <div className="col-span-6 flex items-center justify-end gap-1.5">
                                {!med.taken ? (
                                  <>
                                    <button onClick={() => handleTakeMed(med.id)} className="bg-amber-600 text-white px-2 py-0.5 rounded font-bold text-[9px] hover:bg-amber-700 transition-colors shadow-sm whitespace-nowrap">Xong</button>
                                  </>
                                ) : (
                                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 whitespace-nowrap">✓ Đã uống</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Meal Widget - bg-sky-100 */}
            <Card className="p-3 bg-sky-100 border-sky-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Thực đơn {menus.length > 0 ? `Ngày ${menus[0].date.split("-").reverse().slice(0, 2).join("/")}` : "Hôm nay"}
                </h3>
                <Pizza size={16} className="text-sky-500" />
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {menus.length > 0 ? (
                  <div>
                    {MEAL_SESSIONS.map(session => {
                      const sessionMenus = menus.filter(m => {
                        const hour = parseInt(m.time.split(":")[0]);
                        const mSession = hour < 11 ? "Sáng" : hour < 15 ? "Trưa" : "Tối";
                        return mSession === session;
                      });
                      if (sessionMenus.length === 0) return null;
                      return (
                        <div key={session} className="space-y-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-[1px] flex-1 bg-sky-200"></div>
                            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-sky-600">{session}</h4>
                            <div className="h-[1px] flex-1 bg-sky-200"></div>
                          </div>
                          <div className="bg-white rounded-xl overflow-hidden border border-sky-100 shadow-sm">
                            <div className="grid grid-cols-12 gap-2 px-2.5 py-1.5 bg-sky-50/50 border-b border-sky-100 text-[9px] font-bold text-sky-600 uppercase">
                              <div className="col-span-2">Giờ</div>
                              <div className="col-span-5">Món ăn</div>
                              <div className="col-span-2 text-right">Calo</div>
                              <div className="col-span-3 text-right pr-2">Thao tác</div>
                            </div>
                            <div className="divide-y divide-slate-50">
                              {sessionMenus.map((meal) => (
                                <div key={meal.id} className="group grid grid-cols-12 gap-2 items-center px-2.5 py-2 text-[10px]">
                                  <div className="col-span-2 font-bold text-slate-500">{meal.time}</div>
                                  <div className="col-span-5 flex items-center gap-2 min-w-0">
                                    <span className="text-sm shrink-0">{meal.emoji}</span>
                                    <span className="font-bold text-slate-700 truncate leading-tight">{meal.mealName}</span>
                                  </div>
                                  <div className="col-span-2 text-right font-bold text-sky-600">{meal.kcal || "-"}</div>
                                  <div className="col-span-3 flex items-center justify-end gap-1">
                                    <button className="p-1 bg-sky-50 rounded text-sky-400 hover:text-primary transition-colors border border-sky-100 shadow-sm">
                                      <X size={10} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-medium italic">Chưa có thực đơn cho hôm nay</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}