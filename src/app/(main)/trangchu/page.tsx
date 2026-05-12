"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, BookOpen, Utensils, Heart, Newspaper, ArrowRight } from "lucide-react";
import { Page } from "@/components/layout/page";
import { StatsCard, CategoryCard, PostCard } from "@/components/home";

// Re-export for backward compatibility
export { ChevronRight as Icon };

// Back button component
export function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-slate-500 hover:text-natural-primary mb-6 group transition-colors font-semibold"
    >
      <div className="p-2 rounded-xl group-hover:bg-natural-light transition-colors">
        <ArrowRight size={20} className="rotate-180" />
      </div>
      Quay lại Trang chủ
    </Link>
  );
}

// Section header
export function SectionHeader({ title, showAll = true }: { title: string; showAll?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-black text-natural-primary-dark tracking-tight uppercase">{title}</h2>
      {showAll && (
        <Link href="/blog" className="text-xs font-black text-natural-primary hover:underline flex items-center gap-1 uppercase tracking-widest">
          Xem tất cả <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}

// Dashboard page - Sống Khỏe Home design
export default function HomePage() {
  const stats = [
    { label: 'Đường huyết gần nhất', value: '6.2', unit: 'mmol/L', color: 'text-natural-primary-dark', bgColor: 'bg-natural-light' },
    { label: 'HBA1C mục tiêu', value: '< 7.0', unit: '%', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
    { label: 'Vận động hôm nay', value: '3,200', unit: 'bước', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  ];

  const categories = [
    { label: 'Kiến thức', count: '12 BÀI VIẾT', icon: BookOpen, color: 'bg-blue-500' },
    { label: 'Dinh dưỡng', count: '50+ MÓN ĂN', icon: Utensils, color: 'bg-emerald-500' },
    { label: 'Lối sống', count: '24 BÀI HỌC', icon: Heart, color: 'bg-rose-500' },
    { label: 'Tin tức', count: 'CẬP NHẬT HÀNG NGÀY', icon: Newspaper, color: 'bg-orange-500' },
  ];

  const posts = [
    {
      title: 'Top 10 thực phẩm kiểm soát đường huyết hiệu quả cho mẹ',
      excerpt: 'Lựa chọn thực phẩm có chỉ số GI thấp là chìa khóa để duy trì một cơ thể khỏe mạnh...',
      author: 'Bác sĩ Minh Anh',
      date: '10/05/2024',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600',
      category: 'Dinh dưỡng',
      likes: 12,
      comments: 6,
    },
    {
      title: 'Hiểu về chỉ số GI và GL trong thực phẩm hàng ngày',
      excerpt: 'Tại sao chỉ số hạ đường (GI) lại quan trọng đối với người bệnh tiểu đường?...',
      author: 'Chuyên gia Hải Yến',
      date: '08/05/2024',
      image: 'https://images.unsplash.com/photo-1543332164-6e82f3555182?auto=format&fit=crop&q=80&w=600',
      category: 'Kiến thức',
      likes: 8,
      comments: 2,
    },
  ];

  const latestUpdates = [
    { cat: 'Y KHOA', time: '10 phút trước', title: 'Tia hy vọng cho bệnh nhân đái tháo đường qua công nghệ mới', iconColor: 'bg-natural-primary' },
    { cat: 'KIẾN THỨC', time: '2 giờ trước', title: 'Hiểu về chỉ số HbA1c và cách kiểm soát hiệu quả', iconColor: 'bg-amber-500' },
    { cat: 'LỐI SỐNG', time: '5 giờ trước', title: '5 phút Yoga đơn giản cho buổi sáng đầy năng lượng', iconColor: 'bg-rose-500' },
  ];

  return (
    <Page>
      <div className="space-y-10">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-black tracking-tight text-natural-primary-dark sm:text-5xl">
            Chào bạn, <span className="text-natural-primary">Sống Khỏe</span> mỗi ngày 👋
          </h1>
          <p className="mt-4 text-lg text-[#6B705C] font-medium leading-relaxed max-w-4xl">
            Chào mừng bạn quay lại. Hãy cùng theo dõi và kiểm soát chỉ số đường huyết để duy trì một cơ thể khỏe mạnh và tràn đầy năng lượng.
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-3">
          {stats.map((stat, i) => (
            <StatsCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
              color={stat.color}
              bgColor={stat.bgColor}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Categories */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-natural-primary-dark tracking-tight">Danh mục nổi bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <CategoryCard
                key={cat.label}
                label={cat.label}
                count={cat.count}
                icon={cat.icon}
                color={cat.color}
                delay={i * 0.05}
              />
            ))}
          </div>
        </section>

        {/* Main Content: Blog Posts + Sidebar */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Blog Posts Section */}
          <section className="lg:col-span-2 space-y-8">
            <SectionHeader title="Góc Chia Sẻ Kiến Thức" />
            <div className="space-y-12">
              {posts.map((post, i) => (
                <PostCard key={i} post={post} index={i} />
              ))}
            </div>
          </section>

          {/* Latest Updates Sidebar */}
          <section className="space-y-6">
            <SectionHeader title="Mới nhất" showAll={false} />
            <div className="space-y-4">
              {latestUpdates.map((item, i) => (
                <PostCard key={i} post={item as any} index={i} compact />
              ))}
            </div>
            <button className="w-full mt-6 py-5 rounded-[28px] border-2 border-dashed border-natural-border text-slate-400 font-black uppercase text-xs tracking-[0.2em] hover:bg-white hover:border-natural-primary hover:text-natural-primary transition-all">
              Xem thêm kiến thức
            </button>
          </section>
        </div>
      </div>
    </Page>
  );
}