"use client";

import { useState } from "react";
import Link from "next/link";
import { Page } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// Featured meals - exact from GlucoCare source
const FEATURED_MEALS = [
  { name: "Xà lách ức gà và bơ", cal: "320", time: "15p", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600" },
  { name: "Yến mạch trái cây tươi", cal: "280", time: "10p", image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=600" },
  { name: "Cá hồi áp chảo măng tây", cal: "410", time: "25p", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600" },
];

// Expert suggestions - exact from GlucoCare source
const EXPERT_SUGGESTIONS = [
  { title: "Top 10 thực phẩm chỉ số GI thấp bạn nên biết", date: "Hôm qua" },
  { title: "Tại sao chất xơ là bạn đồng hành tốt nhất của bệnh nhân tiểu đường?", date: "2 ngày trước" },
  { title: "Nguyên tắc đĩa ăn 1/2 Rau - 1/4 Đạm - 1/4 Tinh bột", date: "3 ngày trước" },
];

export default function NutritionPage() {
  return (
    <Page title="Dinh dưỡng">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
        {/* Header with BackButton */}
        <div className="flex items-center gap-2 text-slate-500 hover:text-primary group transition-colors">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <Icon name="arrow_back" className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold">Trang chủ</span>
          </Link>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dinh dưỡng khoa học</h1>
            <p className="text-slate-500 mt-1 text-sm">Lên kế hoạch ăn uống cân bằng cho chỉ số đường huyết ổn định.</p>
          </div>
        </div>

        {/* Carb Tool Hero - exact rounded-[40px], primary gradient, text-4xl h2 */}
        <section className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <Badge variant="neutral" className="bg-white/20 text-white border-none">Công cụ mới</Badge>
              <h2 className="text-4xl font-bold mt-4 mb-4 leading-tight">Tính toán Carb & Nhật ký ăn uống</h2>
              <p className="text-white/80 text-lg mb-8">Dễ dàng theo dõi lượng tinh bột tiêu thụ và nhận cảnh báo khi vượt ngưỡng cho phép.</p>
              <button className="bg-white text-primary font-bold px-10 py-4 rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 transition-transform active:scale-95">
                <Icon name="calculate" className="w-6 h-6" /> Bắt đầu tính toán
              </button>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20 p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Mục tiêu ngày</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Phù hợp</span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[65%] rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">130</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Carbs (g)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">1250</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Kcal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">45</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider font-bold">Xơ (g)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Abstract circles */}
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </section>

        {/* Featured Meals - exact grid-cols-1 md:grid-cols-3, h-56 image, text-xl h3 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Thực đơn tiêu biểu hôm nay</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_MEALS.map((meal, idx) => (
              <motion.div key={meal.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="group cursor-pointer">
                <Card variant="elevated" className="p-0 overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="h-56 relative overflow-hidden">
                    <img src={meal.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={meal.name} />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1 shadow-md">
                        <Icon name="local_fire_department" className="w-4 h-4 text-orange-500" /> {meal.cal} kcal
                      </div>
                      <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1 shadow-md">
                        <Icon name="schedule" className="w-4 h-4 text-blue-500" /> {meal.time}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="success">Dễ làm</Badge>
                      <Badge variant="neutral">Kiểm soát tinh bột</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight mb-4">{meal.name}</h3>
                    <button className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
                      Xem công thức <Icon name="arrow_forward" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom Section - exact grid-cols-1 lg:grid-cols-2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Expert Suggestions - text-[10px] timestamps, text-sm titles */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Gợi ý từ chuyên gia</h2>
            </div>
            <div className="space-y-4">
              {EXPERT_SUGGESTIONS.map((article) => (
                <Link key={article.title} href="/kien-thuc" className="p-5 bg-white rounded-3xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Icon name="track_changes" className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors text-sm">{article.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{article.date}</p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </section>

          {/* Consultation Card - bg-emerald-50, emerald consultation */}
          <section>
            <Card className="bg-emerald-50 border-emerald-100 flex flex-col justify-center items-center text-center py-10 min-h-[300px]">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-200 mb-6 scale-110">
                <Icon name="chat" className="w-10 h-10" filled />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-2">Tư vấn dinh dưỡng 1:1</h3>
              <p className="text-emerald-700/70 max-w-xs mb-8 text-sm">Đội ngũ chuyên gia sẵn sàng trả lời mọi thắc mắc về thực đơn của bạn.</p>
              <button className="bg-emerald-500 text-white font-bold px-10 py-3.5 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95">
                Kết nối chuyên gia
              </button>
            </Card>
          </section>
        </div>
      </div>
    </Page>
  );
}