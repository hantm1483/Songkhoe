"use client";

import Link from "next/link";
import { Page } from "@/components/layout/page";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// Categories - exact from GlucoCare source
const CATEGORIES = [
  { name: "Toàn tập về tiểu đường", count: "15 bài viết", icon: "menu_book" },
  { name: "Sử dụng thiết bị tại nhà", count: "8 bài viết", icon: "settings" },
  { name: "Thuốc và Điều trị", count: "12 bài viết", icon: "medication" },
  { name: "Hỏi đáp chuyên gia", count: "50+ câu hỏi", icon: "help" },
];

// Tutorials - exact from GlucoCare source
const TUTORIALS = [
  { title: "Hiểu về tiểu đường Type 2 trong 5 phút", desc: "Nguyên nhân, triệu chứng và cơ chế hoạt động của insulin.", time: "05:24", image: "https://images.unsplash.com/photo-1530026405186-ed1f139d73f0?auto=format&fit=crop&q=80&w=600" },
  { title: "Cách sử dụng máy đo đường huyết chuẩn xác", desc: "Hướng dẫn từng bước để có kết quả đo chính xác nhất tại nhà.", time: "08:15", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600" },
  { title: "Tầm quan trọng của HbA1c", desc: "Tại sao chỉ số này lại quan trọng hơn cả đường huyết tức thời?", time: "04:50", image: "https://images.unsplash.com/photo-1579154235884-332c411d04d4?auto=format&fit=crop&q=80&w=600" },
];

export default function KnowledgePage() {
  return (
    <Page title="Kiến thức">
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto pb-20">
        {/* Back Button */}
        <div className="flex items-center gap-2 text-slate-500 hover:text-primary group transition-colors">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <Icon name="arrow_back" className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold">Trang chủ</span>
          </Link>
        </div>

        {/* Header - exact Badge variant primary, text-4xl h1, italic font-serif span */}
        <header className="space-y-4">
          <Badge variant="success">Thư viện kiến thức</Badge>
          <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">Mọi thứ bạn cần biết về <br/><span className="text-primary italic font-serif">Kiểm soát tiểu đường</span></h1>
          <p className="text-slate-500 text-lg max-w-2xl">Được biên soạn bởi đội ngũ bác sĩ hàng đầu, trình bày dễ hiểu và khoa học.</p>
        </header>

        {/* Main Categories Row - exact grid-cols-2 sm:grid-cols-2 lg:grid-cols-4, p-4 bg-white rounded-3xl border */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, idx) => (
            <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <div className="group cursor-pointer p-4 bg-white rounded-3xl border border-slate-100 hover:border-primary/40 hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon name={cat.icon as any} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-800 mb-0.5 text-sm leading-tight truncate">{cat.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cat.count}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Video Tutorials - exact grid-cols-1 md:grid-cols-3, aspect-[4/3], rounded-3xl */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Hướng dẫn từng bước (Video)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TUTORIALS.map((item, idx) => (
              <motion.div key={item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + idx * 0.1 }}>
                <div className="group cursor-pointer">
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-200 mb-4 shadow-lg">
                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <Icon name="play_arrow" className="w-8 h-8" filled />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                      <Icon name="schedule" className="w-3 h-3" /> {item.time}
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors mb-2 leading-snug text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Coming Soon Section - exact bg-slate-900 rounded-[40px], amber accent */}
        <section className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Sắp xuất hiện</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Khóa học chuyên sâu: <br/>Làm chủ đường huyết sau 30 ngày</h2>
                <p className="text-white/60 mb-8 max-w-sm text-sm">Chương trình đào tạo tương tác với lộ trình cá nhân hóa, giúp bạn nắm vững kiến thức và kỹ năng tự chăm sóc.</p>
                <div className="flex gap-4">
                  <button className="bg-amber-400 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-xl shadow-amber-400/20 hover:bg-amber-300 transition-all active:scale-95">Đăng ký nhận tin</button>
                  <button className="flex items-center gap-2 px-8 py-3.5 border border-white/20 rounded-2xl font-bold hover:bg-white/10 transition-all text-sm">Xem nội dung <Icon name="open_in_new" className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="hidden md:flex justify-end pr-10">
                <div className="w-48 h-48 border-4 border-amber-400/20 rounded-full flex items-center justify-center">
                  <div className="w-32 h-32 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 text-4xl font-black">30</div>
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