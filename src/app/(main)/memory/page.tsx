"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Image,
  Quote,
  BookOpen,
  Plus,
  Upload,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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
      content: `Đó là một buổi chiều mùa hè năm 1995, khi tôi còn nhỏ. Mẹ dẫn tôi đi chơi công viên lần đầu tiên. Tôi vẫn nhớ nụ cười của mẹ khi tôi chạy đùa trên cỏ...

Những ký ức như thế này luôn đáng trân quý. Dù thời gian có trôi đi, những khoảnh khắc ấy vẫn luôn sống mãi trong tim.`,
      created_at: new Date(-90 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Bài học từ cha",
      content: `Cha từng dạy tôi: "Cuộc sống có ba điều quan trọng nhất: sức khỏe, tình yêu và niềm tin." Lớn lên, tôi mới hiểu những lời ấy có ý nghĩa thế nào.

Cha đã không còn bên cạnh, nhưng những bài học ấy theo tôi suốt cuộc đời.`,
      created_at: new Date(-120 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

// Component Types
type TabType = "photos" | "quotes" | "stories";

// Photo Gallery
function PhotoGallery({
  photos,
  onUpload,
}: {
  photos: MemorialPhoto[];
  onUpload: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="relative aspect-square rounded-lg overflow-hidden bg-surface-container"
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
      <button
        onClick={onUpload}
        className="aspect-square rounded-lg border-2 border-dashed border-outline flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors"
      >
        <Upload className="w-8 h-8 text-on-surface-variant" />
        <span className="text-body-sm text-on-surface-variant">Tải ảnh lên</span>
      </button>
    </div>
  );
}

// Photo Uploader
function PhotoUploader({
  onUpload,
  onCancel,
}: {
  onUpload: (file: File, title: string, description?: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Vui lòng chọn file ảnh (JPG, PNG, WebP hoặc GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setError("");
    setFile(selectedFile);

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async () => {
    if (!file || !title.trim()) {
      setError("Vui lòng chọn ảnh và nhập tiêu đề");
      return;
    }

    setUploading(true);
    try {
      await onUpload(file, title.trim(), description.trim() || undefined);
    } catch (err) {
      setError("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle>Tải ảnh kỷ niệm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview */}
        {preview ? (
          <div className="relative rounded-lg overflow-hidden">
            <img src={preview} alt="Preview" className="w-full aspect-video object-cover" />
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video rounded-lg border-2 border-dashed border-outline flex flex-col items-center justify-center gap-2 hover:bg-surface-container transition-colors"
          >
            <Upload className="w-8 h-8 text-on-surface-variant" />
            <span className="text-body-md text-on-surface-variant">
              Nhấn để chọn ảnh
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        <Input
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Kỷ niệm ngày sinh nhật"
        />

        <Input
          label="Mô tả (tuỳ chọn)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả kỷ niệm..."
        />

        {error && <p className="text-error text-body-sm">{error}</p>}

        <div className="flex gap-3">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={uploading || !file || !title.trim()}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Tải lên
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Huỷ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Quote List
function QuoteList({
  quotes,
  onAdd,
}: {
  quotes: MemorialQuote[];
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3">
      {quotes.map((quote) => (
        <div
          key={quote.id}
          className="p-4 rounded-lg bg-surface-container-low border-l-4 border-tertiary"
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
      <Button variant="ghost" onClick={onAdd} className="w-full">
        <Plus className="w-5 h-5" />
        Thêm lời nhắc
      </Button>
    </div>
  );
}

// Add Quote Form
function AddQuoteForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { content: string; author?: string }) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit({ content: content.trim(), author: author.trim() || undefined });
  };

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle>Thêm lời nhắc</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập lời nhắc của người thân..."
        />
        <Input
          label="Tác giả (tuỳ chọn)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="VD: Bố, Mẹ, Ông, Bà..."
        />
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleSubmit} disabled={!content.trim()} className="flex-1">
            Lưu
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Huỷ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Story List
function StoryList({
  stories,
  onAdd,
}: {
  stories: MemorialStory[];
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3">
      {stories.map((story) => (
        <Card key={story.id} variant="default" className="w-full">
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
      <Button variant="ghost" onClick={onAdd} className="w-full">
        <Plus className="w-5 h-5" />
        Thêm kỷ niệm
      </Button>
    </div>
  );
}

// Add Story Form
function AddStoryForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { title: string; content: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title: title.trim(), content: content.trim() });
  };

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle>Thêm kỷ niệm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Chuyến đi chơi đầu tiên"
        />
        <div>
          <label className="text-label-lg text-on-surface-variant mb-2 block">
            Nội dung
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết những kỷ niệm của bạn..."
            className="w-full min-h-[150px] px-4 py-3 rounded-lg bg-surface-container-low border border-outline text-body-lg text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="primary" onClick={handleSubmit} disabled={!title.trim() || !content.trim()} className="flex-1">
            Lưu
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Huỷ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Tab Component
function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex flex-col items-center gap-1 py-3 rounded-lg min-h-touch-target",
        "transition-colors duration-200",
        active
          ? "bg-primary text-on-primary"
          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
      )}
    >
      <Icon className="w-6 h-6" />
      <span className="text-label-lg">{label}</span>
    </button>
  );
}

// Main Page Component
export default function MemoryPage() {
  const [supabase] = useState(() => createClient());
  const [activeTab, setActiveTab] = useState<TabType>("photos");
  const [photos, setPhotos] = useState<MemorialPhoto[]>([]);
  const [quotes, setQuotes] = useState<MemorialQuote[]>([]);
  const [stories, setStories] = useState<MemorialStory[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setPhotos(generateMockPhotos());
      setQuotes(generateMockQuotes());
      setStories(generateMockStories());
      setLoading(false);
    }, 300);
  }, []);

  // Handle photo upload
  const handlePhotoUpload = async (file: File, title: string, description?: string) => {
    try {
      // Request signed URL from API
      const response = await fetch("/api/memorial/photos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, content_type: file.type }),
      });

      if (!response.ok) throw new Error("Failed to get upload URL");

      const { uploadUrl, publicUrl } = await response.json();

      // Upload to Supabase Storage
      await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // Save record
      const newPhoto: MemorialPhoto = {
        id: Date.now().toString(),
        title,
        image_url: publicUrl,
        description,
        created_at: new Date().toISOString(),
      };

      setPhotos((prev) => [newPhoto, ...prev]);
      setShowAddForm(false);
    } catch (error) {
      console.error("Upload error:", error);

      // Fallback: Create local URL
      const localUrl = URL.createObjectURL(file);
      const newPhoto: MemorialPhoto = {
        id: Date.now().toString(),
        title,
        image_url: localUrl,
        description,
        created_at: new Date().toISOString(),
      };

      setPhotos((prev) => [newPhoto, ...prev]);
      setShowAddForm(false);
    }
  };

  // Handle add quote
  const handleAddQuote = (data: { content: string; author?: string }) => {
    const newQuote: MemorialQuote = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };

    setQuotes((prev) => [newQuote, ...prev]);
    setShowAddForm(false);
  };

  // Handle add story
  const handleAddStory = (data: { title: string; content: string }) => {
    const newStory: MemorialStory = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };

    setStories((prev) => [newStory, ...prev]);
    setShowAddForm(false);
  };

  return (
    <Page title="Kỷ niệm">
      <div className="space-y-4 p-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <TabButton
            active={activeTab === "photos"}
            onClick={() => setActiveTab("photos")}
            icon={Image}
            label="Ảnh"
          />
          <TabButton
            active={activeTab === "quotes"}
            onClick={() => setActiveTab("quotes")}
            icon={Quote}
            label="Lời nhắc"
          />
          <TabButton
            active={activeTab === "stories"}
            onClick={() => setActiveTab("stories")}
            icon={BookOpen}
            label="Kỷ niệm"
          />
        </div>

        {/* Content */}
        {!loading && (
          <>
            {activeTab === "photos" && showAddForm ? (
              <PhotoUploader
                onUpload={handlePhotoUpload}
                onCancel={() => setShowAddForm(false)}
              />
            ) : activeTab === "photos" ? (
              <PhotoGallery photos={photos} onUpload={() => setShowAddForm(true)} />
            ) : activeTab === "quotes" && showAddForm ? (
              <AddQuoteForm
                onSubmit={handleAddQuote}
                onCancel={() => setShowAddForm(false)}
              />
            ) : activeTab === "quotes" ? (
              <QuoteList quotes={quotes} onAdd={() => setShowAddForm(true)} />
            ) : activeTab === "stories" && showAddForm ? (
              <AddStoryForm
                onSubmit={handleAddStory}
                onCancel={() => setShowAddForm(false)}
              />
            ) : activeTab === "stories" ? (
              <StoryList stories={stories} onAdd={() => setShowAddForm(true)} />
            ) : null}
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