"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
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

// Categories with icons
const CATEGORIES = [
  { value: "all", label: "Tất cả" },
  { value: "dinh-duong", label: "Dinh dưỡng", icon: "restaurant" },
  { value: "the-duc", label: "Thể dục", icon: "fitness_center" },
  { value: "thuoc", label: "Thuốc", icon: "medication" },
  { value: "phong-ngua", label: "Phòng ngừa", icon: "health_and_safety" },
];

// Generate mock articles
function generateMockArticles(): Article[] {
  return [
    {
      id: "1",
      title: "Chế độ ăn uống cho người tiểu đường type 2",
      content: "...",
      category: "dinh-duong",
      image_url: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
      read_time_minutes: 5,
      created_at: new Date(-7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Tập thể dục an toàn cho người tiểu đường",
      content: "...",
      category: "the-duc",
      image_url: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600",
      read_time_minutes: 4,
      created_at: new Date(-14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Hiểu đúng về thuốc điều trị tiểu đường",
      content: "...",
      category: "thuoc",
      image_url: "https://images.unsplash.com/photo-1584308666744-24e5a63e9b48?w=600",
      read_time_minutes: 6,
      created_at: new Date(-21 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      title: "Phòng ngừa biến chứng tiểu đường",
      content: "...",
      category: "phong-ngua",
      image_url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600",
      read_time_minutes: 5,
      created_at: new Date(-28 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      title: "Nhận biết và xử lý hạ đường huyết",
      content: "...",
      category: "phong-ngua",
      image_url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600",
      read_time_minutes: 4,
      created_at: new Date(-35 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Welcome Banner - primary-container bg, rounded-3xl
function WelcomeBanner() {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-primary-container to-secondary-container p-6 overflow-hidden">
      <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20">
        <Icon name="school" className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <h2 className="text-headline-md text-on-primary-container mb-2">
          Chào mừng đến Cổng thông tin
        </h2>
        <p className="text-body-md text-on-primary-container/80 mb-4">
          Dành cho những bước đi đầu tiên
        </p>
        <Button variant="primary" className="shadow-lg active:scale-95">
          Bắt đầu học ngay
        </Button>
      </div>
    </div>
  );
}

// Article Card - rounded-3xl, image hover:scale-105
function ArticleCard({ article, onClick }: { article: Article; onClick: () => void }) {
  const categoryLabel =
    CATEGORIES.find((c) => c.value === article.category)?.label || article.category;

  return (
    <button
      onClick={onClick}
      className="block w-full text-left rounded-3xl overflow-hidden bg-surface-container-lowest border border-outline-variant hover:shadow-lg transition-all duration-200 group"
    >
      <div className="aspect-video overflow-hidden">
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <div className="p-4">
        <span className="inline-block px-2 py-1 rounded-lg text-label-lg font-medium bg-secondary-container text-on-secondary-container mb-2">
          {categoryLabel}
        </span>
        <h3 className="text-body-lg font-semibold text-on-surface mb-1 line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-1 text-label-lg text-on-surface-variant">
          <Icon name="schedule" className="w-4 h-4" />
          {article.read_time_minutes} phút
        </div>
      </div>
    </button>
  );
}

// Main Page Component
export default function KienThucPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = generateMockArticles();
      setArticles(data);
      setFilteredArticles(data);
      setLoading(false);
    }, 300);
  }, []);

  // Filter articles when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((a) => a.category === selectedCategory));
    }
  }, [articles, selectedCategory]);

  return (
    <Page title="Kiến thức cơ bản">
      <div className="p-6 space-y-4">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={cn(
                "flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-full min-h-touch-target text-label-lg",
                "transition-colors duration-200",
                selectedCategory === cat.value
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {cat.icon && <Icon name={cat.icon} className="w-4 h-4" />}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid - 3 columns */}
        {!loading ? (
          filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => {}}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="auto_stories" className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
              <p className="text-body-lg text-on-surface-variant">
                Không tìm thấy bài viết nào
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-12 text-on-surface-variant">
            Đang tải...
          </div>
        )}
      </div>
    </Page>
  );
}