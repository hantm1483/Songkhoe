"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { glucoseThresholds } from "@/lib/design-system";
import { cn } from "@/lib/utils";

// Types
interface GlucoseReading {
  id: string;
  value: number;
  timing: "fasting" | "before_meal" | "after_meal" | "bedtime";
  created_at: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url?: string;
  read_time_minutes: number;
}

interface HealthTip {
  condition: (g: number, t: string, d: number) => boolean;
  tip: string;
}

// Categories
const CATEGORIES = [
  { id: "co-ban", label: "Cơ bản", icon: "auto_stories", description: "Kiến thức nền tảng" },
  { id: "dinh-duong", label: "Dinh dưỡng", icon: "restaurant", description: "Chế độ ăn uống" },
  { id: "loi-song", label: "Lối sống", icon: "directions_walk", description: "Vận động & sinh hoạt" },
  { id: "tin-y-khoa", label: "Tin y khoa", icon: "medical_information", description: "Tin tức mới" },
];

// Mock data
function getTodayGlucoseReadings(): GlucoseReading[] {
  return [
    { id: "1", value: 5.8, timing: "fasting", created_at: new Date().toISOString() },
  ];
}

function getArticles(): Article[] {
  return [
    {
      id: "1",
      title: "Chế độ ăn uống cho người tiểu đường type 2",
      excerpt: "Tìm hiểu nguyên tắc dinh dưỡng đúng cách để kiểm soát đường huyết hiệu quả.",
      category: "dinh-duong",
      image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
      read_time_minutes: 5,
    },
    {
      id: "2",
      title: "Tập thể dục an toàn cho người tiểu đường",
      excerpt: "Hướng dẫn các bài tập phù hợp và lưu ý khi vận động.",
      category: "loi-song",
      image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      read_time_minutes: 4,
    },
  ];
}

function getGlucoseStatus(value: number): "normal" | "high" | "low" {
  if (value < glucoseThresholds.low) return "low";
  if (value > glucoseThresholds.high) return "high";
  return "normal";
}

// Hero Section
function HeroSection() {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 p-6 overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
        <Icon name="monitor_heart" className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <h2 className="text-headline-md text-on-surface mb-2">
          Cẩm nang quản lý tiểu đường
        </h2>
        <p className="text-body-md text-on-surface-variant mb-4">
          Theo dõi sức khỏe mỗi ngày
        </p>
        <div className="relative">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full min-h-touch-target pl-10 pr-4 py-3 rounded-2xl bg-surface-container-lowest border-2 border-outline-variant text-body-lg text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
}

// Category Card
function CategoryCard({
  category,
  onClick,
}: {
  category: typeof CATEGORIES[0];
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant hover:bg-secondary-container transition-colors duration-200"
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon name={category.icon} className="w-6 h-6 text-primary" />
      </div>
      <span className="text-label-lg text-on-surface font-medium">{category.label}</span>
    </button>
  );
}

// Article Featured Card
function ArticleFeaturedCard({ article }: { article: Article }) {
  return (
    <Link href={`/kien-thuc`} className="block">
      <div className="rounded-3xl overflow-hidden bg-surface-container-lowest border border-outline-variant">
        <div className="aspect-video relative">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-label-lg font-medium bg-secondary-container text-on-secondary-container">
              {article.category === "dinh-duong" ? "Dinh dưỡng" : "Lối sống"}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-body-lg font-semibold text-on-surface mb-2 line-clamp-2">
            {article.title}
          </h3>
          <p className="text-body-md text-on-surface-variant line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-label-lg text-on-surface-variant">
              {article.read_time_minutes} phút đọc
            </span>
            <span className="text-label-lg text-primary font-medium">Đọc tiếp →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// Article Small Card
function ArticleSmallCard({ article }: { article: Article }) {
  return (
    <Link href={`/kien-thuc`} className="block">
      <div className="flex gap-3 p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant">
        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-body-md font-semibold text-on-surface line-clamp-2">
            {article.title}
          </h3>
          <span className="text-label-lg text-on-surface-variant">
            {article.read_time_minutes} phút
          </span>
        </div>
      </div>
    </Link>
  );
}

// Glucose Summary Card
function GlucoseSummaryCard({ readings }: { readings: GlucoseReading[] }) {
  const latestReading = readings[0];
  const status = latestReading ? getGlucoseStatus(latestReading.value) : "normal";

  const statusLabels = {
    normal: "Ổn định",
    high: "Cao",
    low: "Thấp",
  };

  return (
    <Card variant="elevated" className="w-full rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="water_drop" className="w-5 h-5 text-primary" filled />
          Đường huyết hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latestReading ? (
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-display-lg font-bold text-on-surface">
                {latestReading.value}
              </span>
              <span className="text-body-md text-on-surface-variant">mmol/L</span>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-label-lg font-medium",
              status === "normal" ? "bg-primary text-on-primary" :
              status === "high" ? "bg-error text-white" : "bg-warning text-amber-900"
            )}>
              {statusLabels[status]}
            </span>
          </div>
        ) : (
          <div className="text-body-lg text-on-surface-variant">
            Chưa có dữ liệu hôm nay
          </div>
        )}
        <div className="mt-3 text-label-lg text-on-surface-variant">
          {latestReading?.timing === "fasting"
            ? "Lúc đói"
            : latestReading?.timing === "after_meal"
            ? "Sau ăn"
            : latestReading?.timing === "before_meal"
            ? "Trước ăn"
            : latestReading?.timing === "bedtime"
            ? "Trước ngủ"
            : "Chưa đo"}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Actions
function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Link href="/nhatky">
        <Button variant="primary" size="lg" className="w-full h-full flex flex-col gap-1 shadow-lg active:scale-95">
          <Icon name="water_drop" className="w-6 h-6" filled />
          <span className="text-label-lg">Đo đường</span>
        </Button>
      </Link>
      <Link href="/bua-an">
        <Button variant="secondary" size="lg" className="w-full h-full flex flex-col gap-1 shadow-lg active:scale-95">
          <Icon name="restaurant" className="w-6 h-6" />
          <span className="text-label-lg">Ăn</span>
        </Button>
      </Link>
      <Link href="/thuoc">
        <Button variant="ghost" size="lg" className="w-full h-full flex flex-col gap-1 border border-outline shadow-lg active:scale-95">
          <Icon name="medication" className="w-6 h-6" />
          <span className="text-label-lg">Thuốc</span>
        </Button>
      </Link>
    </div>
  );
}

// Main Page Component
export default function TrangchuPage() {
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    setGlucoseReadings(getTodayGlucoseReadings());
    setArticles(getArticles());
  }, []);

  return (
    <Page title="Trang chủ">
      <div className="p-6 space-y-4">
        {/* Hero Section */}
        <HeroSection />

        {/* Category Grid */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-3">Danh mục</h2>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Glucose Summary */}
        <GlucoseSummaryCard readings={glucoseReadings} />

        {/* Quick Actions */}
        <QuickActions />

        {/* Latest Articles */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-3">Bài viết mới</h2>
          {articles.length > 0 && (
            <div className="space-y-3">
              <ArticleFeaturedCard article={articles[0]} />
              {articles[1] && <ArticleSmallCard article={articles[1]} />}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}