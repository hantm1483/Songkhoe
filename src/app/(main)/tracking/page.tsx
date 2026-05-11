"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon as UIIcon } from "@/components/ui/icon";
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
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// Types
interface GlucoseReading {
  id: string;
  value: number;
  timing: string;
  notes: string | null;
  measured_at: string;
  created_at: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string | null;
  schedule_time: string;
  taken: boolean;
  session: string;
  days: number[];
}

interface MealEntry {
  id: string;
  date: string;
  time: string;
  mealName: string;
  emoji: string;
  kcal?: string;
}

// Helper functions
const getStatusFromValue = (value: number): { status: string; variant: string } => {
  if (value > 180) return { status: "Cao", variant: "accent" };
  if (value < 70) return { status: "Thấp", variant: "neutral" };
  return { status: "Bình thường", variant: "secondary" };
};

const getSessionFromTime = (time: string): string => {
  const hour = parseInt(time.split(":")[0]);
  if (hour < 11) return "Sáng";
  if (hour < 14) return "Trưa";
  if (hour < 19) return "Chiều";
  return "Tối";
};

// Chart data mock
const chartData = [
  { day: "T2", level: 120 },
  { day: "T3", level: 145 },
  { day: "T4", level: 110 },
  { day: "T5", level: 135 },
  { day: "T6", level: 160 },
  { day: "T7", level: 130 },
  { day: "CN", level: 115 },
];

const SESSIONS = ["Sáng", "Trưa", "Chiều", "Tối"];
const MEAL_SESSIONS = ["Sáng", "Trưa", "Tối"];

export default function TrackingPage() {
  const supabase = createClient();
  const [showGlucoseModal, setShowGlucoseModal] = useState(false);
  const [showMedModal, setShowMedModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);

  const [readings, setReadings] = useState<GlucoseReading[]>([]);
  const [meds, setMeds] = useState<Medication[]>([
    { id: "1", name: "Metformin 500mg", dosage: "1 viên", schedule_time: "07:30", taken: false, session: "Sáng", days: Array.from({ length: 31 }, (_, i) => i + 1) },
    { id: "2", name: "Metformin 500mg", dosage: "1 viên", schedule_time: "21:00", taken: false, session: "Tối", days: Array.from({ length: 31 }, (_, i) => i + 1) },
  ]);
  const [menus, setMenus] = useState<MealEntry[]>([
    { id: "1", date: new Date().toISOString().split("T")[0], time: "07:30", mealName: "Phở bò", emoji: "🍜", kcal: "450" },
    { id: "2", date: new Date().toISOString().split("T")[0], time: "12:00", mealName: "Cơm gạo lứt, cá kho", emoji: "🍱", kcal: "520" },
    { id: "3", date: new Date().toISOString().split("T")[0], time: "18:30", mealName: "Salad gà, súp", emoji: "🥗", kcal: "380" },
  ]);

  // Form State for Blood Sugar
  const [glucoseForm, setGlucoseForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: new Date().toTimeString().slice(0, 5),
    value: "",
    notes: "",
  });

  // Form State for Medication Schedule
  const [medForm, setMedForm] = useState({
    name: "",
    dosage: "",
    time: "08:00",
    selectedDays: [] as number[],
  });

  // Form State for Menu
  const [menuForm, setMenuForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "08:00",
    mealName: "",
    kcal: "",
    emoji: "🍱",
  });

  // Fetch glucose readings on mount
  useEffect(() => {
    const fetchGlucoseReadings = async () => {
      try {
        const { data, error } = await supabase
          .from("glucose_logs")
          .select("*")
          .order("measured_at", { ascending: false })
          .limit(20);

        if (error) throw error;
        if (data) {
          setReadings(data.map((r: any) => ({
            id: r.id,
            value: r.value,
            timing: r.timing,
            notes: r.notes,
            measured_at: r.measured_at,
            created_at: r.created_at,
          })));
        }
      } catch (error) {
        console.error("Error fetching glucose readings:", error);
      }
    };

    fetchGlucoseReadings();
  }, [supabase]);

  // Handle save glucose reading
  const handleSaveGlucose = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const newReading = {
        user_id: user?.id || null,
        value: parseInt(glucoseForm.value),
        unit: "mg/dL",
        timing: "fasting",
        notes: glucoseForm.notes || null,
        measured_at: `${glucoseForm.date}T${glucoseForm.time}:00`,
      };

      const { data, error } = await supabase
        .from("glucose_logs")
        .insert(newReading)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setReadings([{
          id: data.id,
          value: data.value,
          timing: data.timing,
          notes: data.notes,
          measured_at: data.measured_at,
          created_at: data.created_at,
        }, ...readings]);
      }

      setShowGlucoseModal(false);
      setGlucoseForm({
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
        value: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error saving glucose reading:", error);
    }
  };

  // Handle save medication
  const handleSaveMed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const newMed = {
        user_id: user?.id || null,
        name: medForm.name,
        dosage: medForm.dosage,
        schedule_time: medForm.time,
        frequency: "daily",
      };

      const { data, error } = await supabase
        .from("medications")
        .insert(newMed)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMeds([...meds, {
          id: data.id,
          name: data.name,
          dosage: data.dosage,
          schedule_time: data.schedule_time,
          taken: false,
          session: getSessionFromTime(data.schedule_time),
          days: medForm.selectedDays.length > 0 ? medForm.selectedDays : Array.from({ length: 31 }, (_, i) => i + 1),
        }]);
      }

      setShowMedModal(false);
      setMedForm({ name: "", dosage: "", time: "08:00", selectedDays: [] });
    } catch (error) {
      console.error("Error saving medication:", error);
    }
  };

  // Handle save meal
  const handleSaveMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Combine date and time into ISO timestamp
      const mealTime = menuForm.date && menuForm.time
        ? `${menuForm.date}T${menuForm.time}:00`
        : new Date().toISOString();

      const newMeal = {
        user_id: user?.id || null,
        name: menuForm.mealName,
        gi_level: "medium",
        time: mealTime,
        notes: menuForm.kcal ? `${menuForm.kcal} kcal` : null,
      };

      const { data, error } = await supabase
        .from("meals")
        .insert(newMeal)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setMenus([{
          id: data.id,
          date: menuForm.date,
          time: menuForm.time,
          mealName: data.name,
          emoji: menuForm.emoji,
          kcal: menuForm.kcal || undefined,
        }, ...menus].sort((a, b) => a.time.localeCompare(b.time)));
      }

      setShowMenuModal(false);
      setMenuForm({
        date: new Date().toISOString().split("T")[0],
        time: "08:00",
        mealName: "",
        kcal: "",
        emoji: "🍱",
      });
    } catch (error) {
      console.error("Error saving meal:", error);
    }
  };

  // Handle mark medication as taken
  const handleTakeMed = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const medLog = {
        medication_id: id,
        user_id: user?.id || null,
        taken_at: new Date().toISOString(),
        status: "taken",
      };

      const { error } = await supabase
        .from("medication_logs")
        .insert(medLog);

      if (error) throw error;

      setMeds(meds.map((m) => (m.id === id ? { ...m, taken: true } : m)));
    } catch (error) {
      console.error("Error marking medication as taken:", error);
    }
  };

  // Day toggle for medication form
  const toggleDay = (day: number) => {
    setMedForm((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };

  const selectAllDays = () => {
    setMedForm((prev) => ({
      ...prev,
      selectedDays: Array.from({ length: 31 }, (_, i) => i + 1),
    }));
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  // Mock readings for display when no data
  const displayReadings = readings.length > 0 ? readings : [
    { id: "1", value: 115, timing: "fasting", notes: null, measured_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: "2", value: 145, timing: "after_meal", notes: null, measured_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: "3", value: 130, timing: "fasting", notes: null, measured_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: "4", value: 160, timing: "bedtime", notes: null, measured_at: new Date().toISOString(), created_at: new Date().toISOString() },
  ];

  return (
    <Page title="Theo dõi đường huyết">
      <div className="p-4 lg:p-6 space-y-3 max-w-7xl mx-auto">
        {/* Header with action buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Theo dõi tiểu đường
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <Calendar size={14} /> Lịch sử
            </button>
            <button
              onClick={() => setShowMedModal(true)}
              className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-indigo-100 transition-colors"
            >
              <Stethoscope size={14} /> Lịch thuốc
            </button>
            <button
              onClick={() => setShowMenuModal(true)}
              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-100 transition-colors"
            >
              <UtensilsCrossed size={14} /> Lập thực đơn
            </button>
            <button
              onClick={() => setShowGlucoseModal(true)}
              className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95"
            >
              <Plus size={14} /> Thêm chỉ số
            </button>
          </div>
        </div>

        {/* Blood Sugar Modal */}
        <AnimatePresence>
          {showGlucoseModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowGlucoseModal(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Nhập chỉ số mới</h2>
                    <button
                      onClick={() => setShowGlucoseModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                      <MoreHorizontal size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveGlucose} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Ngày đo
                        </label>
                        <input
                          type="date"
                          required
                          value={glucoseForm.date}
                          onChange={(e) => setGlucoseForm({ ...glucoseForm, date: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Giờ đo
                        </label>
                        <input
                          type="time"
                          required
                          value={glucoseForm.time}
                          onChange={(e) => setGlucoseForm({ ...glucoseForm, time: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                        Chỉ số (mg/dL)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Ví dụ: 120"
                          required
                          min="20"
                          max="600"
                          value={glucoseForm.value}
                          onChange={(e) => setGlucoseForm({ ...glucoseForm, value: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-primary/20 pr-20"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                          mg/dL
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                        Ghi chú (Tùy chọn)
                      </label>
                      <textarea
                        placeholder="Sau khi ăn sáng, cảm thấy hơi mệt..."
                        value={glucoseForm.notes}
                        onChange={(e) => setGlucoseForm({ ...glucoseForm, notes: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                      />
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowGlucoseModal(false)}
                        className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                      >
                        Đóng
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                      >
                        Lưu chỉ số
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Medication Entry Modal */}
        <AnimatePresence>
          {showMedModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMedModal(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
              >
                <div className="p-8 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Lịch uống thuốc mới</h2>
                    <button
                      onClick={() => setShowMedModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                      <MoreHorizontal size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveMed} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                        Tên thuốc
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Metformin"
                        required
                        value={medForm.name}
                        onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Liều lượng
                        </label>
                        <input
                          type="text"
                          placeholder="1 viên"
                          required
                          value={medForm.dosage}
                          onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Giờ uống
                        </label>
                        <input
                          type="time"
                          required
                          value={medForm.time}
                          onChange={(e) => setMedForm({ ...medForm, time: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Áp dụng cho ngày trong tháng
                        </label>
                        <button
                          type="button"
                          onClick={selectAllDays}
                          className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase"
                        >
                          Tất cả các ngày
                        </button>
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <button
                            key={day}
                            type="button"
                            onClick={() => toggleDay(day)}
                            className={cn(
                              "h-8 w-full rounded-lg text-[10px] font-bold transition-all",
                              medForm.selectedDays.includes(day)
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowMedModal(false)}
                        className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-xl transition-all"
                      >
                        Lưu lịch trình
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Menu Planning Modal */}
        <AnimatePresence>
          {showMenuModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMenuModal(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Lập thực đơn mới</h2>
                    <button
                      onClick={() => setShowMenuModal(false)}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                      <MoreHorizontal size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveMeal} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Ngày
                        </label>
                        <input
                          type="date"
                          required
                          value={menuForm.date}
                          onChange={(e) => setMenuForm({ ...menuForm, date: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Giờ ăn
                        </label>
                        <input
                          type="time"
                          required
                          value={menuForm.time}
                          onChange={(e) => setMenuForm({ ...menuForm, time: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                        Món ăn / Thực đơn
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Phở bò, Sữa hạt..."
                        required
                        value={menuForm.mealName}
                        onChange={(e) => setMenuForm({ ...menuForm, mealName: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Calo (Tùy chọn)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            placeholder="Ví dụ: 350"
                            value={menuForm.kcal}
                            onChange={(e) => setMenuForm({ ...menuForm, kcal: e.target.value })}
                            className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20 pr-10"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                            kcal
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                          Biểu tượng
                        </label>
                        <select
                          value={menuForm.emoji}
                          onChange={(e) => setMenuForm({ ...menuForm, emoji: e.target.value })}
                          className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500/20"
                        >
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
                      <button
                        type="button"
                        onClick={() => setShowMenuModal(false)}
                        className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-colors"
                      >
                        Bỏ qua
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all"
                      >
                        Lên thực đơn
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Content (Chart & Logs) */}
          <div className="lg:col-span-8 space-y-3">
            <Card className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Chỉ số 7 ngày qua</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Trung bình:{" "}
                    <span className="text-primary font-bold">130 mg/dL</span>
                  </p>
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
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 10 }}
                      dy={5}
                    />
                    <YAxis hide />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", fontSize: "10px" }} />
                    <Area
                      type="monotone"
                      dataKey="level"
                      stroke="#008B8B"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorLevel)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800">Nhật ký đo</h3>
                <button className="text-xs font-bold text-primary">Xem tất cả</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {displayReadings.slice(0, 4).map((item) => {
                  const { status, variant } = getStatusFromValue(item.value);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                            variant === "accent"
                              ? "bg-accent"
                              : variant === "neutral"
                              ? "bg-blue-500"
                              : "bg-primary"
                          )}
                        >
                          <Droplet size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-800">{item.value}</span>
                            <Badge variant={variant as any} className="text-[10px] px-1.5 py-0">
                              {status}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {formatTime(item.measured_at)} • {formatDate(item.measured_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar Widgets */}
          <div className="lg:col-span-4 space-y-3">
            {/* Medication Sidebar Widget */}
            <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white border-none p-3 shadow-lg shadow-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <Stethoscope size={18} />
                <Badge variant="neutral" className="text-[10px] bg-white/10 border-white/10">
                  Thuốc
                </Badge>
              </div>

              <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                {SESSIONS.map((session) => {
                  const sessionMeds = meds.filter((m) => m.session === session);
                  if (sessionMeds.length === 0) return null;
                  return (
                    <div key={session} className="space-y-1 mb-2 last:mb-0">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                        {session}
                      </h4>
                      {sessionMeds.map((med) => (
                        <div
                          key={med.id}
                          className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5 flex items-center justify-between"
                        >
                          <p className="text-xs font-bold truncate max-w-[120px]">{med.name}</p>
                          {!med.taken ? (
                            <button
                              onClick={() => handleTakeMed(med.id)}
                              className="bg-white text-indigo-600 px-2 py-0.5 rounded font-bold text-[10px]"
                            >
                              Xong
                            </button>
                          ) : (
                            <span className="text-xs font-bold text-emerald-400">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Menu Sidebar */}
            <Card className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Thực đơn{" "}
                  {menus.length > 0
                    ? `Ngày ${menus[0].date.split("-").reverse().slice(0, 2).join("/")}`
                    : "Hôm nay"}
                </h3>
                <Pizza size={16} className="text-emerald-500" />
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {menus.length > 0 ? (
                  <div>
                    {MEAL_SESSIONS.map((session) => {
                      const sessionMenus = menus.filter((m) => {
                        const hour = parseInt(m.time.split(":")[0]);
                        const mSession = hour < 11 ? "Sáng" : hour < 15 ? "Trưa" : "Tối";
                        return (
                          mSession === session &&
                          (m.date === new Date().toISOString().split("T")[0] ||
                            m.date === menus[0].date)
                        );
                      });

                      if (sessionMenus.length === 0) return null;

                      return (
                        <div key={session} className="space-y-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-[1px] flex-1 bg-slate-100" />
                            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                              {session}
                            </h4>
                            <div className="h-[1px] flex-1 bg-slate-100" />
                          </div>
                          <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                            <div className="grid grid-cols-12 gap-2 px-2.5 py-1.5 bg-slate-50 border-b border-slate-100 text-[9px] font-bold text-slate-400 uppercase">
                              <div className="col-span-3">Giờ</div>
                              <div className="col-span-6">Món ăn</div>
                              <div className="col-span-3 text-right">Calo</div>
                            </div>
                            <div className="divide-y divide-slate-50">
                              {sessionMenus.map((meal) => (
                                <div
                                  key={meal.id}
                                  className="grid grid-cols-12 gap-2 items-center px-2.5 py-2 text-[10px]"
                                >
                                  <div className="col-span-3 font-bold text-slate-500">
                                    {formatTime(meal.time)}
                                  </div>
                                  <div className="col-span-6 flex items-center gap-2 min-w-0">
                                    <span className="text-sm shrink-0">{meal.emoji}</span>
                                    <span className="font-bold text-slate-700 truncate leading-tight">
                                      {meal.mealName}
                                    </span>
                                  </div>
                                  <div className="col-span-3 text-right font-bold text-emerald-600">
                                    {meal.kcal ? `${meal.kcal}k` : "-"}
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
                    <p className="text-xs text-slate-400 font-medium italic">
                      Chưa có thực đơn cho hôm nay
                    </p>
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