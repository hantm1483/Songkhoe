"use client";

import { useState, useEffect, useRef } from "react";
import { Page } from "@/components/layout/page";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  MapPin,
  Image as ImageIcon,
  MoreVertical,
  Heart,
  MessageSquare,
  Share2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Story {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  location?: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return date.toLocaleDateString("vi-VN");
}

// Post Composer Component
function PostComposer({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [content, setContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    await onSubmit(content.trim());
    setContent("");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <Card className="p-0 overflow-hidden border-none shadow-xl">
      <div className="p-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex-shrink-0 overflow-hidden">
            <img
              src="https://i.pravatar.cc/100?img=1"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            placeholder="Bạn đang thấy thế nào hôm nay?"
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-2 resize-none h-24 placeholder:text-slate-300 min-h-[60px]"
            disabled={isSubmitting}
          />
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
              <ImageIcon size={20} className="text-emerald-500" />
              <span className="text-xs font-bold">Ảnh/Video</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl text-slate-500 transition-colors">
              <MapPin size={20} className="text-rose-500" />
              <span className="text-xs font-bold">Địa điểm</span>
            </button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-primary text-white font-bold px-8 py-2.5 rounded-xl text-sm shadow-lg shadow-primary/20"
          >
            {isSubmitting ? "Đang đăng..." : "Đăng bài"}
          </Button>
        </div>
      </div>
      {showSuccess && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
          Đăng bài thành công!
        </div>
      )}
    </Card>
  );
}

// Post Card Component
function PostCard({ story }: { story: Story }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(story.likes_count || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <Card className="p-0 overflow-hidden border-none shadow-xl">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={story.user_avatar || "https://i.pravatar.cc/100?img=1"}
              alt={story.user_name || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h4 className="font-bold text-slate-800">
              {story.user_name || "Người dùng"}
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              {formatRelativeTime(story.created_at)}
              {story.location && ` • ${story.location}`}
            </p>
          </div>
        </div>
        <button className="text-slate-300 hover:text-slate-600">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
          {story.content}
        </p>
      </div>

      {/* Image */}
      {story.image_url && (
        <div className="px-1 overflow-hidden">
          <img
            src={story.image_url}
            className="w-full aspect-[4/3] object-cover rounded-3xl"
            alt="post"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-6 flex items-center justify-between border-t border-slate-50 mt-4">
        <div className="flex gap-6">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-2 transition-colors group",
              liked ? "text-rose-500" : "text-slate-400 hover:text-rose-500"
            )}
          >
            <Heart
              size={20}
              className={cn(liked && "fill-rose-500")}
            />
            <span className="text-xs font-bold">{likesCount}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors">
            <MessageSquare size={20} />
            <span className="text-xs font-bold">{story.comments_count || 0}</span>
          </button>
        </div>
        <button className="text-slate-300 hover:text-slate-600">
          <Share2 size={20} />
        </button>
      </div>
    </Card>
  );
}

// Main Page Component
export default function MemoryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch stories from API
  const fetchStories = async () => {
    try {
      const response = await fetch("/api/memorial/stories");
      const data = await response.json();
      if (data.success && data.data?.stories) {
        setStories(data.data.stories);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Handle new post submission
  const handleSubmit = async (content: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/memorial/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: content.substring(0, 50),
          content,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setStories((prev) => [data.data, ...prev]);
      }
    } catch (error) {
      console.error("Failed to create story:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title="Memory">
      <div className="p-6 lg:p-10 space-y-10 max-w-4xl mx-auto pb-20">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Blog&apos;s
            </h1>
            <p className="text-slate-500 mt-1">
              Lưu giữ khoảnh khắc và hành trình sống khỏe của bạn.
            </p>
          </div>
          <button className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/30 hover:scale-110 transition-transform active:scale-95">
            <Plus size={28} />
          </button>
        </header>

        {/* Post Composer */}
        <PostComposer onSubmit={handleSubmit} isSubmitting={isSubmitting} />

        {/* Feed */}
        <div className="space-y-10">
          {loading ? (
            <div className="text-center py-12 text-slate-500">Đang tải...</div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p>Chưa có bài viết nào.</p>
              <p className="text-sm mt-2">Hãy chia sẻ khoảnh khắc đầu tiên của bạn!</p>
            </div>
          ) : (
            stories.map((story) => <PostCard key={story.id} story={story} />)
          )}
        </div>
      </div>
    </Page>
  );
}