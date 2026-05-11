"use client";

import { useState, useEffect, useRef } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

// Types
interface MemorialPhoto {
  id: string;
  title: string;
  image_url: string;
  description?: string;
  created_at: string;
}

interface MemorialQuote {
  id: string;
  content: string;
  author?: string;
  created_at: string;
}

interface MemorialStory {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

// Mock data generators
function generateMockPhotos(): MemorialPhoto[] {
  return [
    {
      id: "1",
      title: "Kỷ niệm ngày sinh nhật",
      image_url: "https://images.unsplash.com/photo-1511895426328-dc8714195340?w=400",
      description: "Ngày sinh nhật của mẹ năm 2020",
      created_at: new Date(-180 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Chuyến đi Đà Nẵng",
      image_url: "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=400",
      description: "Gia đình cùng đi Đà Nẵng năm 2019",
      created_at: new Date(-365 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function generateMockQuotes(): MemorialQuote[] {
  return [
    {
      id: "1",
      content: "Cuộc sống không phải là việc chờ đợi bão tố đi qua, mà là học cách nhảy múa dưới mưa.",
      author: "Ngạn",
      created_at: new Date(-30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      content: "Mẹ luôn nói: 'Con là món quà quý nhất mà cuộc sống đã ban tặng.'",
      author: "Gia đình",
      created_at: new Date(-60 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function generateMockStories(): MemorialStory[] {
  return [
    {
      id: "1",
      title: "Kỷ niệm đầu tiên",
      content: "Đó là một buổi chiều mùa hè năm 1995, khi tôi còn nhỏ. Mẹ dẫn tôi đi chơi công viên lần đầu tiên...",
      created_at: new Date(-90 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Tab type
type TabType = "photos" | "quotes" | "stories";

// Memory Banner - primary-container, rounded-3xl
function MemoryBanner() {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-primary-container to-secondary-container p-6 overflow-hidden">
      <div className="absolute right-0 bottom-0 w-32 h-32 opacity-20">
        <Icon name="auto_stories" className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <h2 className="text-headline-md text-on-primary-container mb-2">
          Nhật ký hành trình
        </h2>
        <p className="text-body-md text-on-primary-container/80">
          Lưu giữ những khoảnh khắc...
        </p>
      </div>
    </div>
  );
}

// Featured Story Card - rounded-3xl, image hover:scale-105
function FeaturedStoryCard({ story }: { story: MemorialStory }) {
  return (
    <Card variant="elevated" className="w-full rounded-3xl overflow-hidden">
      <div className="aspect-video bg-surface-container">
        <Icon name="auto_stories" className="w-full h-full text-on-surface-variant p-8" />
      </div>
      <CardContent className="pt-4">
        <span className="text-label-lg text-primary font-medium">Kinh nghiệm</span>
        <h3 className="text-body-lg font-semibold text-on-surface mb-2 line-clamp-2">
          {story.title}
        </h3>
        <p className="text-body-md text-on-surface-variant line-clamp-2 mb-3">
          {story.content}
        </p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-label-lg text-on-surface-variant">
            <Icon name="favorite" className="w-4 h-4" />
            24
          </span>
          <span className="text-label-lg text-primary font-medium">Đọc tiếp →</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick Note Card - secondary-container, rounded-3xl
function QuickNoteCard() {
  return (
    <div className="p-4 rounded-3xl bg-secondary-container text-on-secondary-container">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="edit" className="w-5 h-5" />
        <span className="text-label-lg font-medium">Ghi chú nhanh</span>
      </div>
      <p className="text-body-md italic text-on-secondary-container/80">
        Đi bộ 15 phút sau bữa tối...
      </p>
    </div>
  );
}

// Memorial Tabs - segmented control, rounded-full
function MemorialTabs({
  activeTab,
  onChange,
}: {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}) {
  const tabs = [
    { value: "photos", label: "Ảnh", icon: "photo_library" },
    { value: "quotes", label: "Lời nói", icon: "format_quote" },
    { value: "stories", label: "Kỷ niệm", icon: "auto_stories" },
  ] as const;

  return (
    <div className="flex gap-2 p-1 rounded-full bg-surface-container">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1 py-2 px-4 rounded-full min-h-touch-target",
            "transition-colors duration-200",
            activeTab === tab.value
              ? "bg-primary text-on-primary shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <Icon name={tab.icon} className="w-5 h-5" />
          <span className="text-label-lg">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Photo Gallery - 3 columns, rounded-2xl
function PhotoGallery({ photos }: { photos: MemorialPhoto[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-square rounded-2xl overflow-hidden bg-surface-container"
        >
          <img
            src={photo.image_url}
            alt={photo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
            <div className="text-body-sm text-white font-medium truncate">
              {photo.title}
            </div>
          </div>
        </div>
      ))}
      <button className="aspect-square rounded-2xl border-2 border-dashed border-outline flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors">
        <Icon name="add_photo_alternate" className="w-8 h-8 text-on-surface-variant" />
        <span className="text-body-sm text-on-surface-variant">Tải ảnh</span>
      </button>
    </div>
  );
}

// Quote List
function QuoteList({ quotes }: { quotes: MemorialQuote[] }) {
  return (
    <div className="space-y-3">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="p-4 rounded-2xl bg-surface-container border-l-4 border-tertiary"
        >
          <div className="text-body-lg text-on-surface italic mb-2">
            "{quote.content}"
          </div>
          {quote.author && (
            <div className="text-label-lg text-on-surface-variant">
              — {quote.author}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Story List
function StoryList({ stories }: { stories: MemorialStory[] }) {
  return (
    <div className="space-y-3">
      {stories.map((story) => (
        <Card key={story.id} variant="default" className="w-full rounded-2xl">
          <CardContent className="pt-4">
            <h3 className="text-body-lg font-semibold text-on-surface mb-2">
              {story.title}
            </h3>
            <p className="text-body-md text-on-surface-variant line-clamp-3">
              {story.content}
            </p>
            <div className="text-label-lg text-on-surface-variant mt-2">
              {new Date(story.created_at).toLocaleDateString("vi-VN", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main Page Component
export default function MemoryPage() {
  const [activeTab, setActiveTab] = useState<TabType>("photos");
  const [photos, setPhotos] = useState<MemorialPhoto[]>([]);
  const [quotes, setQuotes] = useState<MemorialQuote[]>([]);
  const [stories, setStories] = useState<MemorialStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPhotos(generateMockPhotos());
      setQuotes(generateMockQuotes());
      setStories(generateMockStories());
      setLoading(false);
    }, 300);
  }, []);

  return (
    <Page title="Memory">
      <div className="p-6 space-y-4">
        {/* Memory Banner */}
        <MemoryBanner />

        {/* Featured Story */}
        {stories.length > 0 && <FeaturedStoryCard story={stories[0]} />}

        {/* Quick Note */}
        <QuickNoteCard />

        {/* Memorial Tabs */}
        <MemorialTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Content */}
        {!loading && (
          <>
            {activeTab === "photos" && <PhotoGallery photos={photos} />}
            {activeTab === "quotes" && <QuoteList quotes={quotes} />}
            {activeTab === "stories" && <StoryList stories={stories} />}
          </>
        )}

        {loading && (
          <div className="text-center py-12 text-on-surface-variant">
            Đang tải...
          </div>
        )}
      </div>
    </Page>
  );
}