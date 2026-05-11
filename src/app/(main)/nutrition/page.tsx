"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Page } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

// Types
interface Meal {
  id: string;
  name: string;
  gi_level: "low" | "medium" | "high" | null;
  time: string;
  notes: string | null;
  created_at: string;
}

interface Article {
  id: string;
  title: string;
  category: string | null;
  content: string;
  image_url: string | null;
  created_at: string;
}

// Back Button Component
function BackButton({ href = "/trangchu" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
      <Icon name="arrow_back" className="w-5 h-5" />
      <span className="text-body-lg">Quay lại</span>
    </Link>
  );
}

// Section Header Component
function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-headline-md text-on-surface font-headline">{title}</h2>
      {action}
    </div>
  );
}

// Featured meals mock data
const FEATURED_MEALS = [
  {
    name: "Xà lách ức gà và bơ",
    cal: "320",
    time: "15p",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
    badges: ["Dễ làm", "Kiểm soát tinh bột"],
  },
  {
    name: "Yến mạch trái cây tươi",
    cal: "280",
    time: "10p",
    image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=600",
    badges: ["Dễ làm", "Giàu chất xơ"],
  },
  {
    name: "Cá hồi áp chảo măng tây",
    cal: "410",
    time: "25p",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600",
    badges: ["Đạm cao", "Low GI"],
  },
];

// Expert suggestions mock data
const EXPERT_SUGGESTIONS = [
  { title: "Top 10 thực phẩm chỉ số GI thấp bạn nên biết", date: "Hôm qua" },
  { title: "Tại sao chất xơ là bạn đồng hành tốt nhất của bệnh nhân tiểu đường?", date: "2 ngày trước" },
  { title: "Nguyên tắc đĩa ăn 1/2 Rau - 1/4 Đạm - 1/4 Tinh bột", date: "3 ngày trước" },
];

// Featured Meal Card
function FeaturedMealCard({ meal, index }: { meal: (typeof FEATURED_MEALS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <Card className="p-0 overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500">
        <div className="h-56 relative overflow-hidden">
          <img
            src={meal.image}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt={meal.name}
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1 shadow-md">
              <Icon name="local_fire_department" className="w-3.5 h-3.5 text-orange-500" /> {meal.cal} kcal
            </div>
            <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1 shadow-md">
              <Icon name="schedule" className="w-3.5 h-3.5 text-blue-500" /> {meal.time}
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{meal.badges[0]}</Badge>
            <Badge variant="neutral">{meal.badges[1]}</Badge>
          </div>
          <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight mb-4">
            {meal.name}
          </h3>
          <button className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all">
            Xem công thức <Icon name="arrow_forward" className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

// Expert Suggestion Item
function ExpertSuggestionItem({ suggestion }: { suggestion: (typeof EXPERT_SUGGESTIONS)[0] }) {
  return (
    <div className="p-5 bg-white rounded-3xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-primary/30 transition-all">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
          <Icon name="target" className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{suggestion.title}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{suggestion.date}</p>
        </div>
      </div>
      <Icon name="chevron_right" className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );
}

// Expert Consultation Card
function ExpertConsultationCard() {
  return (
    <Card className="bg-emerald-50 border-emerald-100 flex flex-col justify-center items-center text-center py-10 min-h-[300px]">
      <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-200 mb-6 scale-110">
        <Icon name="chat_bubble" className="w-10 h-10" />
      </div>
      <h3 className="text-2xl font-bold text-emerald-900 mb-2">Tư vấn dinh dưỡng 1:1</h3>
      <p className="text-emerald-700/70 max-w-xs mb-8">Đội ngũ chuyên gia sẵn sàng trả lời mọi thắc mắc về thực đơn của bạn.</p>
      <Button className="bg-emerald-500 text-white font-bold px-10 py-3.5 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-95">
        Kết nối chuyên gia
      </Button>
    </Card>
  );
}

// Carb Tool Hero Section
function CarbToolHero() {
  return (
    <section className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-primary/20">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <Badge variant="neutral" className="text-slate-600">Công cụ mới</Badge>
          <h2 className="text-4xl font-bold mt-4 mb-4 leading-tight">Tính toán Carb & Nhật ký ăn uống</h2>
          <p className="text-white/80 text-lg mb-8">Dễ dàng theo dõi lượng tinh bột tiêu thụ và nhận cảnh báo khi vượt ngư���ng cho phép.</p>
          <button className="bg-white text-primary font-bold px-10 py-4 rounded-2xl flex items-center gap-3 shadow-xl hover:scale-105 transition-transform active:scale-95">
            <Icon name="calculate" className="w-6 h-6" /> Bắt đầu tính toán
          </button>
        </div>
        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold">Mục tiêu ngày</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs">Phù hợp</span>
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
  );
}

// Main Page Component
export default function NutritionPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, category, content, image_url, created_at")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching articles:", error);
        return;
      }

      if (data) {
        setArticles(data);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <Page title="Dinh dưỡng">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
        {/* Back Button */}
        <BackButton />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dinh dưỡng khoa học</h1>
            <p className="text-slate-500 mt-1">Lên kế hoạch ăn uống cân bằng cho chỉ số đường huyết ổn định.</p>
          </div>
        </div>

        {/* Carb Tool Hero */}
        <CarbToolHero />

        {/* Featured Meals */}
        <section>
          <SectionHeader title="Thực đơn tiêu biểu hôm nay" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_MEALS.map((meal, idx) => (
              <FeaturedMealCard key={meal.name} meal={meal} index={idx} />
            ))}
          </div>
        </section>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <SectionHeader title="Gợi ý từ chuyên gia" />
            <div className="space-y-4">
              {EXPERT_SUGGESTIONS.map((suggestion) => (
                <ExpertSuggestionItem key={suggestion.title} suggestion={suggestion} />
              ))}
            </div>
          </section>

          <section>
            <ExpertConsultationCard />
          </section>
        </div>
      </div>
    </Page>
  );
}