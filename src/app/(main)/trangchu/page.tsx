"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Heart, Activity, Sparkles, PenTool, Newspaper, BookOpen, Utensils, Star, ArrowRight, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Page } from "@/components/layout/page";
import { FloatingAISidebar, FloatingSidebarToggle } from "@/components/ai-sidebar/floating-ai-sidebar";
import { useTextSelection } from "@/hooks/use-text-selection";

// Re-export for backward compatibility
export { Heart as Icon, Badge, Card };

// Back button component
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

// Section header
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

// Dashboard page - EXACT match to GlucoCare Dashboard.tsx
export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { selectedText } = useTextSelection({ minLength: 2, maxLength: 100 });

  // Sample article content for summarization (in real app, this would come from the page content)
  const articleContent = "Bài viết về tiểu đường type 2: Tình trạng này xảy ra khi cơ thể không sản xuất đủ insulin hoặc không sử dụng insulin hiệu quả. Triệu chứng bao gồm khát nhiều, đi tiểu thường xuyên, mờ mắt và mệt mỏi. Việc kiểm soát bao gồm chế độ ăn uống lành mạnh, tập thể dục đều đặn và theo dõi đường huyết.";
  const categories = [
    { name: "Kiến thức", icon: BookOpen, color: "bg-blue-500", count: "12 bài viết", path: "/knowledge" },
    { name: "Dinh dưỡng", icon: Utensils, color: "bg-emerald-500", count: "50+ món ăn", path: "/nutrition" },
    { name: "Lối sống", icon: Heart, color: "bg-rose-500", count: "24 bài học", path: "/lifestyle" },
    { name: "Tin tức", icon: Newspaper, color: "bg-amber-500", count: "Cập nhật hàng ngày", path: "/news" },
  ];

  const articles = [
    {
      title: "Tia hy vọng cho bệnh nhân đái tháo đường qua công nghệ mới",
      category: "Y khoa",
      time: "10 phút trước",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Hiểu về chỉ số HbA1c và cách kiểm soát hiệu quả",
      category: "Kiến thức",
      time: "2 giờ trước",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "5 phút Yoga đơn giản cho buổi sáng đầy năng lượng",
      category: "Lối sống",
      time: "5 giờ trước",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <Page title="Trang chủ">
      {/* Floating AI Sidebar */}
      <FloatingSidebarToggle
        onClick={() => setIsSidebarOpen(true)}
        isOpen={isSidebarOpen}
      />
      <FloatingAISidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedText={selectedText}
        articleContent={articleContent}
      />

    <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Hero Section - EXACT from GlucoCare */}
      <section className="relative overflow-hidden rounded-3xl bg-primary min-h-[220px] flex items-center px-8 lg:px-12 py-8 text-white shadow-2xl shadow-primary/30">
        <div className="relative z-10 w-full space-y-2">
          <Badge variant="neutral" className="bg-white/20 text-white border-none">Giới thiệu</Badge>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">Chào mừng đến với Sổ Tay Sức Khỏe</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <p className="text-white/80 text-sm md:text-base max-w-2xl leading-relaxed">
              Hành trình kiểm soát tiểu đường của bạn bắt đầu tại đây. Chúng tôi cung cấp kiến thức, công cụ và sự hỗ trợ tốt nhất.
            </p>
            <Link href="/knowledge" className="inline-flex bg-white text-primary font-bold px-6 py-2.5 rounded-full items-center gap-2 hover:bg-slate-50 transition-colors shrink-0 shadow-xl shadow-white/10 text-sm">
              Khám phá ngay <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-[-15deg] translate-x-20"></div>
        <div className="absolute right-10 bottom-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
      </section>

      {/* Categories Grid - EXACT from GlucoCare */}
      <section>
        <SectionHeader title="Danh mục nổi bật" showAll={false} />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={cat.path} className="block group">
                <Card className="p-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`${cat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-${cat.color.split('-')[1]}-200 shrink-0`}>
                      <cat.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight truncate">{cat.name}</h3>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5">{cat.count}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured + Sidebar - EXACT from GlucoCare */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <SectionHeader title="Dành riêng cho bạn" />
          <div className="grid grid-cols-1 gap-6">
            <div className="group relative rounded-3xl overflow-hidden aspect-video bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                alt="Health talk"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="accent">Nổi bật</Badge>
                  <span className="text-white/60 text-xs">Phát sóng trực tiếp</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">Tọa đàm: Bí quyết sống khỏe cùng tiểu đường Type 2</h3>
                <div className="flex items-center gap-4">
                  <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                    <Play size={24} fill="currentColor" />
                  </button>
                  <span className="text-white font-medium">Xem ngay</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <SectionHeader title="Mới nhất" />
          {articles.map((art, idx) => (
            <motion.div
              key={art.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex gap-4 group cursor-pointer"
            >
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                <img src={art.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={art.title} />
              </div>
              <div className="flex-1 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary">{art.category}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-[10px] text-slate-400 font-medium">{art.time}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {art.title}
                </h4>
              </div>
            </motion.div>
          ))}

          <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary hover:text-primary transition-all">
            Xem thêm kiến thức
          </button>
        </aside>
      </div>
    </div>
    </Page>
  );
}
