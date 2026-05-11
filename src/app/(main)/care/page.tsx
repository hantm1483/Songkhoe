"use client";

import { useState, useEffect, useCallback } from "react";
import { Page } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

// Types
interface UserProfile {
  id: string;
  full_name: string | null;
}

interface Medication {
  id: string;
  name: string;
  dosage: string | null;
  instructions: string | null;
  schedule_time: string | null;
}

interface MedicationLog {
  id: string;
  medication_id: string;
  taken_at: string;
  status: string | null;
}

interface ScheduleItem {
  id: string;
  time: string;
  label: string;
  sub: string;
  icon: string;
  status: "done" | "doing" | "pending";
  color: string;
  type: "meal" | "exercise" | "medication" | "relaxation";
}

// Get day name in Vietnamese
function getDayName(date: Date): string {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thăm Năm", "Thứ Sáu", "Thứ Bảy"];
  return days[date.getDay()];
}

// Format date as Vietnamese
function formatDateVN(date: Date): string {
  const dayName = getDayName(date);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `Hôm nay, ${dayName}, ${day} Tháng ${month}`;
}

// Default schedule items (will be enriched with DB data)
const DEFAULT_SCHEDULE: Omit<ScheduleItem, "id">[] = [
  {
    time: "07:00 AM",
    label: "Bữa sáng lành mạnh",
    sub: "Yến mạch & Trái cây",
    icon: "coffee",
    status: "done",
    color: "bg-amber-100 text-amber-600",
    type: "meal",
  },
  {
    time: "08:30 AM",
    label: "Bài tập buổi sáng",
    sub: "Yoga 15 phút",
    icon: "wb_sunny",
    status: "doing",
    color: "bg-emerald-100 text-emerald-600",
    type: "exercise",
  },
  {
    time: "12:00 PM",
    label: "Liều thuốc Metformin",
    sub: "Uống sau bữa trưa",
    icon: "psychiatry",
    status: "pending",
    color: "bg-blue-100 text-blue-600",
    type: "medication",
  },
  {
    time: "09:00 PM",
    label: "Thư giãn trước ngủ",
    sub: "Thiền 10 phút",
    icon: "nightlight",
    status: "pending",
    color: "bg-indigo-100 text-indigo-600",
    type: "relaxation",
  },
];

// Schedule Item Component
function ScheduleItem({
  item,
  index,
  onStatusChange,
}: {
  item: ScheduleItem;
  index: number;
  onStatusChange: (id: string, newStatus: "done" | "doing" | "pending") => void;
}) {
  const handleClick = () => {
    if (item.status === "pending") {
      onStatusChange(item.id, "doing");
    } else if (item.status === "doing") {
      onStatusChange(item.id, "done");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "p-5 rounded-[28px] border transition-all flex items-center justify-between group",
        item.status === "done"
          ? "bg-slate-50 border-transparent opacity-60"
          : "bg-white border-slate-100 shadow-sm hover:border-primary/20"
      )}
    >
      <div className="flex items-center gap-5">
        <span className="text-xs font-black text-slate-400 w-20 tracking-tighter">
          {item.time}
        </span>
        <div
          className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}
        >
          <Icon name={item.icon} className="w-6 h-6" />
        </div>
        <div>
          <h4
            className={cn(
              "font-bold",
              item.status === "done" ? "text-slate-400 line-through" : "text-slate-800"
            )}
          >
            {item.label}
          </h4>
          <p className="text-xs text-slate-400 font-medium">{item.sub}</p>
        </div>
      </div>
      {item.status === "done" ? (
        <Icon name="check_circle" className="w-6 h-6 text-emerald-500" filled />
      ) : item.status === "doing" ? (
        <button
          onClick={handleClick}
          className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20"
        >
          Bắt đầu
        </button>
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
      )}
    </motion.div>
  );
}

// Main Page Component
export default function CarePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Build schedule from medications and defaults
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() =>
    DEFAULT_SCHEDULE.map((item, idx) => ({ ...item, id: `default-${idx}` }))
  );

  const today = new Date();
  const dateStr = formatDateVN(today);

  // Calculate completion percentage
  const completedCount = schedule.filter((s) => s.status === "done").length;
  const completionPercent = Math.round((completedCount / schedule.length) * 100);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profile")
        .select("id, full_name")
        .limit(1)
        .maybeSingle();

      if (profileError) throw profileError;
      if (profileData) setProfile(profileData);

      // Fetch today's medications
      const { data: medicationsData, error: medicationsError } = await supabase
        .from("medications")
        .select("id, name, dosage, instructions, schedule_time")
        .order("schedule_time", { ascending: true });

      if (medicationsError) throw medicationsError;
      setMedications(medicationsData || []);

      // Fetch today's medication logs
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const { data: logsData, error: logsError } = await supabase
        .from("medication_logs")
        .select("id, medication_id, taken_at, status")
        .gte("taken_at", todayStart.toISOString())
        .lte("taken_at", todayEnd.toISOString());

      if (logsError) throw logsError;
      setMedicationLogs(logsData || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = (id: string, newStatus: "done" | "doing" | "pending") => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Get user name or default
  const userName = profile?.full_name || "Ngọc My";

  return (
    <Page title="Chăm sóc sức khỏe">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <Badge variant="accent">Cá nhân hóa</Badge>
            <h1 className="text-4xl font-bold text-slate-800">Cây chăm sóc của {userName}</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Icon name="location_on" className="w-4 h-4 text-primary" />
              {dateStr}
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <Icon name="check_circle" className="w-6 h-6" filled />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                Tiến độ ngày
              </p>
              <p className="text-lg font-black text-slate-800 leading-none">
                {completionPercent}% Hoàn thành
              </p>
            </div>
          </div>
        </header>

        {/* AI Suggestion Area */}
        <Card className="bg-gradient-to-br from-primary to-indigo-600 text-white border-none shadow-2xl shadow-primary/20 p-10 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <Icon name="auto_awesome" className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold leading-tight">
                Gợi ý từ AI: Thực đơn cân bằng và Bài tập nhẹ
              </h2>
              <p className="text-white/80 leading-relaxed">
                Dựa trên chỉ số đường huyết sáng nay (120 mg/dL), chúng tôi đề xuất
                bạn nên bắt đầu ngày mới với một bữa sáng giàu chất xơ và 15 phút Yoga
                thư giãn.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-primary font-bold px-8 py-3.5 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                  Xem chi tiết
                </button>
                <button className="bg-white/10 border border-white/20 px-8 py-3.5 rounded-2xl font-bold hover:bg-white/20 transition-all">
                  Để sau
                </button>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="relative">
                <div className="w-48 h-48 bg-white/10 rounded-full animate-ping absolute inset-0" />
                <div className="w-48 h-48 bg-white/20 rounded-full backdrop-blur-xl border border-white/30 flex items-center justify-center relative">
                  <Icon name="auto_awesome" className="w-16 h-16 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                Lịch trình hôm nay
              </h2>
              <button className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                Xem tất cả <Icon name="chevron_right" className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <ScheduleItem
                  key={item.id}
                  item={item}
                  index={index}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </div>

          <section className="space-y-8">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Sức khỏe tinh thần
            </h2>

            {/* Mental Health Card 1 */}
            <Card className="bg-rose-50 border-rose-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                  <Icon name="fitness_center" className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-rose-900">Vận động hằng ngày</h4>
              </div>
              <p className="text-sm text-rose-700/70 mb-6 leading-relaxed">
                Vận động nhẹ nhàng giúp cơ thể nhạy cảm hơn với insulin. Bạn đã hoàn
                thành 4,500 bước hôm nay.
              </p>
              <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-rose-500 w-[45%] rounded-full transition-all duration-1000"
                />
              </div>
              <button className="w-full py-3 bg-white text-rose-600 rounded-2xl font-bold text-sm shadow-sm hover:shadow-md transition-shadow">
                Đồng bộ với Health App
              </button>
            </Card>

            {/* Mental Health Card 2 */}
            <Card className="bg-blue-50 border-blue-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="psychology" className="w-6 h-6 text-blue-600" />
                <h4 className="font-bold text-blue-900">Mẹo tự chăm sóc</h4>
              </div>
              <p className="text-xs text-blue-700/70 italic leading-relaxed">
                "Uống một cốc nước ấm ngay sau khi thức dậy giúp thanh lọc cơ thể
                và ổn định quá trình trao đổi chất."
              </p>
            </Card>
          </section>
        </div>
      </div>
    </Page>
  );
}
