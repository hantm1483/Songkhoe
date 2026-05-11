"use client";

import { Page } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Mock schedule data
const SCHEDULE_ITEMS = [
  {
    time: "07:00 AM",
    label: "Bữa sáng lành mạnh",
    sub: "Yến mạch & Trái cây",
    icon: "coffee",
    status: "done",
    color: "bg-amber-100 text-amber-600",
  },
  {
    time: "08:30 AM",
    label: "Bài tập buổi sáng",
    sub: "Yoga 15 phút",
    icon: "wb_sunny",
    status: "doing",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    time: "12:00 PM",
    label: "Liều thuốc Metformin",
    sub: "Uống sau bữa trưa",
    icon: "psychiatry",
    status: "pending",
    color: "bg-blue-100 text-blue-600",
  },
  {
    time: "09:00 PM",
    label: "Thư giãn trước ngủ",
    sub: "Thiền 10 phút",
    icon: "nightlight",
    status: "pending",
    color: "bg-indigo-100 text-indigo-600",
  },
];

// Schedule Item
function ScheduleItem({ item, index }: { item: typeof SCHEDULE_ITEMS[0]; index: number }) {
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
        <span className="text-xs font-black text-slate-400 w-20 tracking-tighter">{item.time}</span>
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", item.color)}>
          <Icon name={item.icon} className="w-6 h-6" />
        </div>
        <div>
          <h4 className={cn("font-bold", item.status === "done" ? "text-slate-400 line-through" : "text-slate-800")}>
            {item.label}
          </h4>
          <p className="text-xs text-slate-400 font-medium">{item.sub}</p>
        </div>
      </div>
      {item.status === "done" ? (
        <Icon name="check_circle" className="w-6 h-6 text-emerald-500" filled />
      ) : item.status === "doing" ? (
        <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-primary/20">
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
  const today = new Date();
  const dateStr = today.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" });

  return (
    <Page title="Chăm sóc sức khỏe">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <Badge variant="accent">Cá nhân hóa</Badge>
            <h1 className="text-4xl font-bold text-slate-800">Cây chăm sóc của Ngọc My</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <Icon name="location_on" className="w-4 h-4 text-primary" />
              Hôm nay, {dateStr}
            </p>
          </div>
          <div className="bg-white px-6 py-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
              <Icon name="check_circle" className="w-6 h-6" filled />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Tiến độ ngày</p>
              <p className="text-lg font-black text-slate-800 leading-none">65% Hoàn thành</p>
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
                Dựa trên chỉ số đường huyết sáng nay (120 mg/dL), chúng tôi đề xuất bạn nên bắt đầu ngày mới với một bữa sáng giàu chất xơ và 15 phút Yoga thư giãn.
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
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Lịch trình hôm nay</h2>
              <button className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                Xem tất cả <Icon name="chevron_right" className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {SCHEDULE_ITEMS.map((item, index) => (
                <ScheduleItem key={item.label} item={item} index={index} />
              ))}
            </div>
          </div>

          <section className="space-y-8">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Sức khỏe tinh thần</h2>

            {/* Mental Health Card 1 */}
            <Card className="bg-rose-50 border-rose-100 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-200">
                  <Icon name="fitness_center" className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-rose-900">Vận động hằng ngày</h4>
              </div>
              <p className="text-sm text-rose-700/70 mb-6 leading-relaxed">
                Vận động nhẹ nhàng giúp cơ thể nhạy cảm hơn với insulin. Bạn đã hoàn thành 4,500 bước hôm nay.
              </p>
              <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-rose-500 w-[45%] rounded-full transition-all duration-1000" />
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
                "Uống một cốc nước ấm ngay sau khi thức dậy giúp thanh lọc cơ thể và ổn định quá trình trao đổi chất."
              </p>
            </Card>
          </section>
        </div>
      </div>
    </Page>
  );
}
