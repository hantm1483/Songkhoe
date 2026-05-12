"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft, UtensilsCrossed, Activity, CalendarCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Page } from "@/components/layout/page";
import { cn } from "@/lib/utils";

// Re-export for backward compatibility
export { Badge, Card };

export function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-6 group transition-colors font-semibold"
    >
      <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
        <ArrowLeft size={20} />
      </div>
      Quay lại Trang chủ
    </Link>
  );
}

export function SectionHeader({ title, showAll = true }: { title: string; showAll?: boolean }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
      {showAll && (
        <button className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
          Xem tất cả <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

// AI Sidebar component
function AISidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 z-50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-[350px] bg-white shadow-[-5px_0_15px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 flex flex-col p-6",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-xl font-bold text-slate-800">Trợ lý AI Mẹ Yêu</h4>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-slate-600">×</button>
        </div>
        <div className="flex-1 overflow-y-auto mb-4 bg-slate-50 rounded-2xl p-4 text-base">
          <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none ml-8 mb-4">
            Chào bạn! Bạn cần tôi tóm tắt bài báo y khoa hay tư vấn thực đơn hôm nay?
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Hỏi AI về tiểu đường..."
            className="flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="bg-primary text-white px-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Gửi
          </button>
        </div>
      </div>
    </>
  );
}

// Carb Calculator component
function CarbCalculator() {
  const [food, setFood] = useState("");
  const [result, setResult] = useState("");

  const handleCalculate = () => {
    if (food.trim()) {
      setResult(`🤖 AI nhận diện: 45g Carbohydrate. <br /> Khuyên dùng: Đi bộ 15p sau khi ăn.`);
    }
  };

  return (
    <Card className="p-8 hover:-translate-y-1 transition-all duration-300">
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
        <UtensilsCrossed size={28} className="text-blue-600" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-slate-800">Máy tính Carb Việt</h3>
      <p className="text-slate-500 mb-6 text-base">Nhập món ăn bạn vừa dùng (Phở, Cơm tấm...), AI sẽ tính toán lượng tinh bột ngay.</p>
      <input
        type="text"
        value={food}
        onChange={(e) => setFood(e.target.value)}
        placeholder="Ví dụ: 1 bát phở bò"
        className="w-full p-3 border border-slate-200 rounded-xl mb-4 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        onClick={handleCalculate}
        className="w-full bg-primary text-white p-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
      >
        Phân tích ngay
      </button>
      {result && (
        <div
          className="mt-4 p-3 bg-blue-50 rounded-lg text-blue-700 font-bold"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      )}
    </Card>
  );
}

// Dashboard page
export default function DashboardPage() {
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

  return (
    <Page title="Trang chủ">
      {/* AI Sidebar */}
      <AISidebar isOpen={isAISidebarOpen} onClose={() => setIsAISidebarOpen(false)} />

      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white py-4 px-6 rounded-2xl shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">MY</div>
              <h1 className="text-2xl font-bold text-primary tracking-tight">meyeu.com.vn</h1>
            </div>
            <nav className="hidden md:flex gap-8 font-medium text-slate-600">
              <a href="#" className="text-primary border-b-2 border-primary">Trang chủ</a>
              <a href="/nhatky" className="hover:text-primary transition-colors">Nhật ký</a>
              <a href="/nutrition" className="hover:text-primary transition-colors">Thực đơn GI</a>
              <a href="/news" className="hover:text-primary transition-colors">Cộng đồng</a>
            </nav>
            <button
              onClick={() => setIsAISidebarOpen(true)}
              className="bg-blue-100 text-primary px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-200 transition-colors"
            >
              <Sparkles size={18} />
              Trợ lý AI
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-10 py-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-extrabold leading-tight">
              Sống khỏe cùng tiểu đường <br />
              <span className="text-primary">Đơn giản & Khoa học</span>
            </h2>
            <p className="text-slate-500 text-xl">
              Chào bạn! Tôi là chuyên gia đồng hành giúp bạn quản lý chỉ số đường huyết hàng ngày một cách nhẹ nhàng nhất.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="#calculator" className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors inline-block">
                Tính Carb bữa ăn
              </Link>
              <button className="bg-slate-200 px-6 py-4 rounded-full font-semibold text-slate-700 hover:bg-slate-300 transition-colors">
                Tải hồ sơ VNeID
              </button>
            </div>
          </div>
          <div className="flex-1 w-full h-64 bg-blue-50 rounded-3xl flex items-center justify-center border-2 border-dashed border-blue-200 text-blue-400">
            Hình ảnh minh họa
          </div>
        </section>

        {/* Cards Section */}
        <section id="calculator" className="grid md:grid-cols-3 gap-8 py-10">
          <CarbCalculator />

          <Card className="p-8 hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4">
              <Activity size={28} className="text-orange-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Nhật ký số 2026</h3>
            <p className="text-slate-500 mb-6 text-base">
              Tự động vẽ biểu đồ xu hướng đường huyết và cảnh báo khi vượt ngưỡng an toàn.
            </p>
            <Link href="/tracking" className="text-primary font-bold underline">
              Xem biểu đồ của tôi →
            </Link>
          </Card>

          <Card className="p-8 hover:-translate-y-1 transition-all duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <CalendarCheck size={28} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-slate-800">Nhắc lịch thông minh</h3>
            <p className="text-slate-500 mb-6 text-base">
              Đồng bộ lịch tái khám, lịch tiêm Insulin và xét nghiệm HbA1c định kỳ.
            </p>
            <span className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-bold">
              1 việc cần làm hôm nay
            </span>
          </Card>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-slate-200 text-center text-sm text-slate-400">
          <p className="mb-4">© 2026 meyeu.com.vn. Thông tin được cung cấp bởi AI Content Assistant chỉ mang tính tham khảo.</p>
          <p className="font-semibold">
            Vui lòng tuân thủ chỉ định của bác sĩ chuyên khoa nội tiết. Tuân thủ Nghị định 102/2025/ND-CP về bảo mật dữ liệu y tế.
          </p>
        </footer>
      </div>
    </Page>
  );
}
