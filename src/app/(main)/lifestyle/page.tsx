"use client";

import { useState } from "react";
import { Page } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Mock data
const TAGS = [
  "#yoga_sang",
  "#meditation",
  "#healthy_habit",
  "#sleeping_well",
  "#mindfulness",
  "#no_stress",
  "#balance",
  "#energy",
];

const TOPICS = [
  {
    title: "Giấc ngủ & Đường huyết",
    description: "Khám phá mối liên hệ mật thiết giữa chất lượng giấc ngủ và khả năng kiểm soát glucose của cơ thể.",
    icon: "bedtime",
    color: "bg-indigo-100 text-indigo-600",
    colorHover: "hover:bg-indigo-600 hover:text-white",
  },
  {
    title: "Kiểm soát Stress",
    description: "Các bài tập hít thở và kỹ thuật tâm lý giúp giảm hormone Cortisol gây tăng đường huyết đột ngột.",
    icon: "air",
    color: "bg-emerald-100 text-emerald-600",
    colorHover: "hover:bg-emerald-600 hover:text-white",
  },
  {
    title: "Đời sống tinh thần",
    description: "Xây dựng thái độ lạc quan và kết nối với cộng đồng để hành trình sống cùng tiểu đường nhẹ nhàng hơn.",
    icon: "mood",
    color: "bg-amber-100 text-amber-600",
    colorHover: "hover:bg-amber-600 hover:text-white",
  },
];

// Topic Card
function TopicCard({ topic, index }: { topic: typeof TOPICS[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={cn(
        "flex flex-col gap-6 group border-none shadow-xl hover:shadow-2xl transition-all duration-300 p-6",
        topic.colorHover
      )}>
        <div className={cn(
          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all",
          topic.color
        )}>
          <Icon name={topic.icon} className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{topic.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{topic.description}</p>
        </div>
        <button className="mt-auto flex items-center gap-2 text-sm font-bold text-indigo-600 group-hover:text-inherit">
          Tìm hiểu thêm <Icon name="arrow_forward" className="w-4 h-4" />
        </button>
      </Card>
    </motion.div>
  );
}

// Main Page Component
export default function LifestylePage() {
  return (
    <Page title="Lối sống lành mạnh">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Lối sống lành mạnh</h1>
            <p className="text-slate-500 mt-1">Cân bằng thân - tâm - trí để sống trọn vẹn mỗi ngày.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="neutral">Yoga</Badge>
            <Badge variant="neutral">Thiền</Badge>
            <Badge variant="neutral">Giấc ngủ</Badge>
            <Badge variant="neutral">Stress</Badge>
          </div>
        </div>

        {/* Featured Video */}
        <section>
          <div className="group relative rounded-[40px] overflow-hidden aspect-video lg:h-[450px] bg-slate-200 shadow-2xl shadow-slate-200">
            <img
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1400"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="Yoga class"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-widest">Video nổi bật</span>
                <span className="text-white/60 text-sm font-medium">15:20 • Đã xem 12.5k lần</span>
              </div>
              <h2 className="text-4xl font-black text-white mb-6 max-w-2xl leading-tight">
                Cân bằng đường huyết <br />với chuỗi bài Yoga 15 phút buổi sáng
              </h2>
              <div className="flex items-center gap-6">
                <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl hover:scale-110 transition-transform">
                  <Icon name="play_arrow" className="w-8 h-8 ml-1" filled />
                </button>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-primary/20 flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-md">
                    +1.2k
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOPICS.map((topic, index) => (
            <TopicCard key={topic.title} topic={topic} index={index} />
          ))}
        </div>

        {/* Community / Tags Section */}
        <section className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm overflow-hidden relative">
          <div className="flex flex-col lg:flex-row gap-12 relative z-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Thẻ phổ biến</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="px-5 py-3 bg-slate-50 rounded-full text-sm font-bold text-slate-600 border border-slate-100 hover:bg-primary/10 hover:text-primary hover:border-primary/20 cursor-pointer transition-all"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:w-80 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Cộng đồng</h2>
              </div>
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                    <Icon name="group" className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Nhóm GlucoFriends</p>
                    <p className="text-xs text-slate-500">2,541 thành viên</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20">
                  Tham gia ngay
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
