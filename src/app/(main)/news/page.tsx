"use client";

import { useState } from "react";
import { Page } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Mock data
const FEATURED_NEWS = {
  title: "Bước đột phá trong công nghệ Insulin thông minh có thể tự điều chỉnh theo mức đường huyết",
  desc: "Các nhà khoa học vừa công bố một loại Insulin mới có khả năng cảm ứng glucose, hứa hẹn thay đổi hoàn toàn cách điều trị tiểu đường trong tương lai gần.",
  author: "Dr. Lê Trung",
  date: "12 Tháng 5, 2023",
  image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=1200",
};

const LATEST_NEWS = [
  {
    id: 1,
    title: "Ăn giấm táo buổi tối có thực sự giúp ổn định đường huyết?",
    category: "Dinh dưỡng",
    time: "1 giờ trước",
    reads: "1.2k",
  },
  {
    id: 2,
    title: "Tác động của ô nhiễm môi trường đến nguy cơ mắc tiểu đường Type 2",
    category: "Nghiên cứu",
    time: "5 giờ trước",
    reads: "850",
  },
  {
    id: 3,
    title: "5 dấu hiệu cảnh báo sớm bệnh thần kinh ngoại biên ở người tiểu đường",
    category: "Y khoa",
    time: "Hôm qua",
    reads: "2.5k",
  },
  {
    id: 4,
    title: "Cập nhật hướng dẫn điều trị tiểu đường năm 2023 của Hiệp hội ADA",
    category: "Y khoa",
    time: "2 ngày trước",
    reads: "4.1k",
  },
];

const TRENDING_NEWS = [
  { id: 1, title: "Chế độ IF 16/8 có an toàn cho người bệnh đái tháo đường?" },
  { id: 2, title: "Cách chọn thực phẩm low-GI cho bữa ăn hàng ngày" },
  { id: 3, title: "10 bài tập yoga phù hợp cho người tiểu đường" },
];

// News Item Card
function NewsItemCard({ news }: { news: typeof LATEST_NEWS[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">{news.category}</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Icon name="schedule" className="w-3 h-3" /> {news.time}
          </span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 leading-snug group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        <div className="flex items-center gap-6 pt-2">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Icon name="visibility" className="w-4 h-4" /> {news.reads} lượt đọc
          </span>
          <button className="text-slate-300 hover:text-slate-600">
            <Icon name="share" className="w-4 h-4" />
          </button>
          <button className="text-slate-300 hover:text-primary">
            <Icon name="bookmark" className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="w-32 h-32 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 hidden sm:block">
        <img
          src={`https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=300&sig=${news.id}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt="news"
        />
      </div>
    </motion.div>
  );
}

// Trending Item
function TrendingItem({ news, index }: { news: typeof TRENDING_NEWS[0]; index: number }) {
  return (
    <div className="flex gap-4 group cursor-pointer">
      <span className="text-4xl font-black text-slate-100 group-hover:text-primary/20 transition-colors">
        0{index + 1}
      </span>
      <div>
        <h4 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 hover:text-primary transition-colors">
          {news.title}
        </h4>
        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">Bởi Ban biên tập GlucoCare</p>
      </div>
    </div>
  );
}

// Main Page Component
export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Page title="Tin tức Y khoa">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto pb-20">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Tin tức Y khoa</h1>
            <p className="text-slate-500 mt-1">Cập nhật những tiến bộ khoa học và thông tin sức khỏe mới nhất.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Icon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              />
              <input
                type="text"
                placeholder="Tìm tin tức..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-primary/20"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-colors">
              <Icon name="tune" className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Featured Big News */}
        <section className="group relative rounded-[40px] overflow-hidden aspect-[21/9] lg:h-[400px] bg-slate-200 shadow-2xl">
          <img
            src={FEATURED_NEWS.image}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            alt="featured"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="accent">Tiến bộ mới</Badge>
              <div className="h-4 w-px bg-white/20 mx-2" />
              <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{FEATURED_NEWS.date}</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white mb-4 line-clamp-2 max-w-4xl tracking-tight leading-tight group-hover:text-amber-400 transition-colors">
              {FEATURED_NEWS.title}
            </h2>
            <p className="text-white/70 max-w-2xl text-sm lg:text-base line-clamp-2 mb-8">{FEATURED_NEWS.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md">
                  <Icon name="newspaper" className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold">{FEATURED_NEWS.author}</span>
              </div>
              <button className="bg-white text-slate-900 font-bold px-8 py-3 rounded-2xl flex items-center gap-2 hover:bg-amber-400 transition-colors">
                Đọc toàn văn <Icon name="arrow_forward" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Latest List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Tin mới cập nhật</h2>
              <button className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
                Xem tất cả <Icon name="chevron_right" className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-6">
              {LATEST_NEWS.map((news) => (
                <NewsItemCard key={news.id} news={news} />
              ))}
            </div>
            <button className="w-full py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-slate-100 transition-colors">
              Xem tất cả tin tức
            </button>
          </div>

          <aside className="space-y-10">
            {/* Most Popular */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Được quan tâm nhất</h2>
              </div>
              <div className="space-y-6">
                {TRENDING_NEWS.map((news, index) => (
                  <TrendingItem key={news.id} news={news} index={index} />
                ))}
              </div>
            </section>

            {/* Newsletter Card */}
            <Card className="bg-amber-50 border-amber-100 p-6">
              <h4 className="font-bold text-amber-900 mb-2">Đăng ký bản tin Y khoa</h4>
              <p className="text-xs text-amber-800/60 mb-6">Nhận những cập nhật quan trọng nhất trực tiếp vào Email của bạn hàng tuần.</p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl text-sm"
                />
                <button className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20">
                  Đăng ký ngay
                </button>
              </div>
              <p className="text-[10px] text-center text-amber-400 mt-4">Không spam, hủy bất cứ lúc nào.</p>
            </Card>
          </aside>
        </div>
      </div>
    </Page>
  );
}
