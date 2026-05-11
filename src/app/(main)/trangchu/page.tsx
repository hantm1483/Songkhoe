"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Page } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Supabase client import
import { createClient } from "@/lib/supabase/client";

// Types
interface Article {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  image_url?: string;
  read_time_minutes?: number;
  created_at: string;
  is_featured?: boolean;
}

// Categories data
const CATEGORIES = [
  { name: "Kiến thức", icon: "menu_book", color: "bg-blue-500", count: "12 bài viết", path: "/kien-thuc" },
  { name: "Dinh dưỡng", icon: "restaurant", color: "bg-emerald-500", count: "50+ món ăn", path: "/bua-an" },
  { name: "Lối sống", icon: "favorite", color: "bg-rose-500", count: "24 bài học", path: "/lifestyle" },
  { name: "Tin tức", icon: "newspaper", color: "bg-amber-500", count: "Cập nhật hàng ngày", path: "/news" },
];

// Hero Section - Match GlucoCare design
function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary h-[320px] flex items-center px-10 text-white shadow-2xl shadow-primary/30">
      <div className="relative z-10 max-w-lg space-y-4">
        <Badge variant="neutral">Giới thiệu</Badge>
        <h1 className="text-4xl font-bold leading-tight">Chào mừng đến với Sổ Tay Sức Khỏe</h1>
        <p className="text-white/80 text-lg">
          Hành trình kiểm soát tiểu đường của bạn bắt đầu tại đây. Chúng tôi cung cấp kiến thức, công cụ và sự hỗ trợ tốt nhất.
        </p>
        <Link
          href="/kien-thuc"
          className="inline-flex bg-white text-primary font-bold px-8 py-3 rounded-full items-center gap-2 hover:bg-slate-50 transition-colors w-fit"
        >
          Khám phá ngay <Icon name="arrow_forward" />
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-[-15deg] translate-x-20"></div>
      <div className="absolute right-10 bottom-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
    </section>
  );
}

// Category Card Component with animation
function CategoryCard({
  category,
  index,
}: {
  category: (typeof CATEGORIES)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={category.path} className="block group">
        <div className="glass-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">
          <div
            className={cn(
              category.color,
              "w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"
            )}
          >
            <Icon name={category.icon} className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-slate-500 mt-1">{category.count}</p>
        </div>
      </Link>
    </motion.div>
  );
}

// Featured Video Section
function FeaturedSection() {
  return (
    <section className="lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Dành riêng cho bạn</h2>
      </div>
      <div className="group relative rounded-3xl overflow-hidden aspect-video bg-slate-200">
        <img
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          alt="Health talk"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="accent">Nổi bật</Badge>
            <span className="text-white/60 text-xs">Video</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2">
            Tọa đàm: Bí quyết sống khỏe cùng tiểu đường Type 2
          </h3>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
              <Icon name="play_arrow" className="w-6 h-6" filled />
            </button>
            <span className="text-white font-medium">Xem ngay</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Article List Sidebar with animations
function ArticleSidebar({ articles }: { articles: Article[] }) {
  return (
    <aside className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Mới nhất</h2>
      </div>
      {articles.map((article, idx) => (
        <motion.div
          key={article.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + idx * 0.1 }}
        >
          <Link href={`/kien-thuc`} className="block group cursor-pointer">
            <div className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                {article.image_url ? (
                  <img
                    src={article.image_url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={article.title}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200">
                    <Icon name="image" className="w-8 h-8 text-slate-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                    {article.category}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {article.read_time_minutes || 5} phút
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h4>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}

      <Link
        href="/kien-thuc"
        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
      >
        Xem thêm kiến thức <Icon name="arrow_forward" />
      </Link>
    </aside>
  );
}

// Main Page Component
export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      const supabase = createClient();
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("id, title, excerpt, category, image_url, read_time_minutes, created_at, is_featured")
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
      }
    }

    fetchArticles();
  }, []);

  // Get featured article and latest articles
  const featuredArticle = articles.find((a) => a.is_featured) || articles[0];
  const latestArticles = articles
    .filter((a) => a.id !== featuredArticle?.id)
    .slice(0, 3);

  return (
    <Page title="Trang chủ">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <HeroSection />

        {/* Categories Grid */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Danh mục nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, idx) => (
              <CategoryCard key={cat.name} category={cat} index={idx} />
            ))}
          </div>
        </section>

        {/* Featured Video & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FeaturedSection />
          <ArticleSidebar articles={latestArticles.length > 0 ? latestArticles : MOCK_ARTICLES} />
        </div>
      </div>
    </Page>
  );
}

// Fallback mock data when no articles from Supabase
const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Tia hy vọng cho bệnh nhân đái tháo đường qua công nghệ mới",
    category: "Kiến thức",
    image_url:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
    read_time_minutes: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Hiểu về chỉ số HbA1c và cách kiểm soát hiệu quả",
    category: "Kiến thức",
    image_url:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
    read_time_minutes: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "5 phút Yoga đơn giản cho buổi sáng đầy năng lượng",
    category: "Lối sống",
    image_url:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
    read_time_minutes: 5,
    created_at: new Date().toISOString(),
  },
];