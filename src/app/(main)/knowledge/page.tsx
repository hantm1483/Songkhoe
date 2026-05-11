"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { motion } from "framer-motion";
import {
  BookOpen,
  Menu as MenuIcon,
  FileText,
  HelpCircle,
  Play,
  Clock,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  read_time_minutes: number;
  created_at: string;
}

// Mock articles fallback
function generateMockArticles(): Article[] {
  return [
    {
      id: "1",
      title: "Hiểu về tiểu đường Type 2 trong 5 phút",
      content: "Nguyên nhân, triệu chứng và cơ chế hoạt động của insulin.",
      category: "dinh-duong",
      image_url: "https://images.unsplash.com/photo-1530026405186-ed1f139d73f0?auto=format&fit=crop&q=80&w=600",
      read_time_minutes: 5,
      created_at: new Date(-7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Cách sử dụng máy đo đường huyết chuẩn xác",
      content: "Hướng dẫn từng bước để có kết quả đo chính xác nhất tại nhà.",
      category: "thiet-bi",
      image_url: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600",
      read_time_minutes: 8,
      created_at: new Date(-14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Tầm quan trọng của HbA1c",
      content: "Tại sao chỉ số này lại quan trọng hơn cả đường huyết tức thời?",
      category: "thuoc",
      image_url: "https://images.unsplash.com/photo-1579154235884-332c411d04d4?auto=format&fit=crop&q=80&w=600",
      read_time_minutes: 5,
      created_at: new Date(-21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      title: "Chế độ ăn uống cho người tiểu đường type 2",
      content: "Hướng dẫn chi tiết về chế độ ăn uống khoa học.",
      category: "dinh-duong",
      image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600",
      read_time_minutes: 6,
      created_at: new Date(-28 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      title: "Tập thể dục an toàn cho người tiểu đường",
      content: "Bài tập thể dục phù hợp và an toàn.",
      category: "the-duc",
      image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=600",
      read_time_minutes: 4,
      created_at: new Date(-35 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Categories matching reference design
const CATEGORIES = [
  { name: "Toàn tập về tiểu đường", count: "15 bài viết", icon: BookOpen, category: "all" },
  { name: "Sử dụng thiết bị tại nhà", count: "8 bài viết", icon: MenuIcon, category: "thiet-bi" },
  { name: "Thuốc và Điều trị", count: "12 bài viết", icon: FileText, category: "thuoc" },
  { name: "Hỏi đáp chuyên gia", count: "50+ câu hỏi", icon: HelpCircle, category: "qa" },
];

// Video tutorials
const TUTORIALS = [
  {
    title: "Hiểu về tiểu đường Type 2 trong 5 phút",
    desc: "Nguyên nhân, triệu chứng và cơ chế hoạt động của insulin.",
    time: "05:24",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139d73f0?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Cách sử dụng máy đo đường huyết chuẩn xác",
    desc: "Hướng dẫn từng bước để có kết quả đo chính xác nhất tại nhà.",
    time: "08:15",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Tầm quan trọng của HbA1c",
    desc: "Tại sao chỉ số này lại quan trọng hơn cả đường huyết tức thời?",
    time: "04:50",
    image: "https://images.unsplash.com/photo-1579154235884-332c411d04d4?auto=format&fit=crop&q=80&w=600"
  },
];

// BackButton component - matches reference
function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
    >
      <ArrowLeft size={20} />
      <span className="text-sm font-medium">Quay lại</span>
    </button>
  );
}

// Badge component - matches reference
function Badge({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "secondary" }) {
  return (
    <span className={cn(
      "inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
      variant === "primary"
        ? "bg-primary/10 text-primary"
        : "bg-amber-400/20 text-amber-400"
    )}>
      {children}
    </span>
  );
}

// SectionHeader component - matches reference
function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
  );
}

// Main Page Component
export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Load articles from API
  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch("/api/articles?limit=20");
        const result = await response.json();

        if (result.success && result.data?.articles?.length > 0) {
          setArticles(result.data.articles);
        } else {
          // Fallback to mock data
          setArticles(generateMockArticles());
        }
      } catch (error) {
        console.error("Failed to load articles:", error);
        setArticles(generateMockArticles());
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return (
    <Page title="Kiến thức">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto pb-20">
        <BackButton />

        <header className="space-y-4">
          <Badge variant="primary">Thư viện kiến thức</Badge>
          <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">
            Mọi thứ bạn cần biết về <br/>
            <span className="text-primary italic font-serif">Kiểm soát tiểu đường</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Được biên soạn bởi đội ngũ bác sĩ hàng đầu, trình bày dễ hiểu và khoa học.
          </p>
        </header>

        {/* Main Categories Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="group cursor-pointer p-6 bg-white rounded-3xl border border-slate-100 hover:border-primary/40 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors mb-4">
                  <cat.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-800 mb-1">{cat.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{cat.count}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Video Tutorials */}
        <section>
          <SectionHeader title="Hướng dẫn từng bước (Video)" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TUTORIALS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                <div className="group cursor-pointer">
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-200 mb-4 shadow-lg">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <Play size={32} fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                      <Clock size={12} /> {item.time}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors mb-2 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Articles from API */}
        {!loading && articles.length > 0 && (
          <section>
            <SectionHeader title="Bài viết mới nhất" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.slice(0, 3).map((article, idx) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                >
                  <div className="group cursor-pointer">
                    <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-200 mb-4 shadow-lg">
                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={article.title}
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                          <BookOpen size={48} className="text-slate-300" />
                        </div>
                      )}
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                        <Clock size={12} /> {article.read_time_minutes} phút
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors mb-2 leading-snug">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {article.content?.substring(0, 100)}...
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Course Banner - matches reference */}
        <section className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Sắp xuất hiện</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Khóa học chuyên sâu: <br/>
                  Làm chủ đường huyết sau 30 ngày
                </h2>
                <p className="text-white/60 mb-8 max-w-sm">
                  Chương trình đào tạo tương tác với lộ trình cá nhân hóa, giúp bạn nắm vững kiến thức và kỹ năng tự chăm sóc.
                </p>
                <div className="flex gap-4">
                  <button className="bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-400/20 hover:bg-amber-300 transition-all active:scale-95">
                    Đăng ký nhận tin
                  </button>
                  <button className="flex items-center gap-2 px-8 py-3.5 border border-white/20 rounded-2xl font-bold hover:bg-white/10 transition-all">
                    Xem nội dung <ExternalLink size={18} />
                  </button>
                </div>
              </div>
              <div className="hidden md:flex justify-end pr-10">
                <div className="w-48 h-48 border-4 border-amber-400/20 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 text-4xl font-black">
                    30
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative mask */}
          <div className="absolute right-0 top-0 bottom-0 w-2/3 bg-gradient-to-l from-amber-400/10 to-transparent"></div>
        </section>
      </div>
    </Page>
  );
}