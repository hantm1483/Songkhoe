"use client";

import { useState, useEffect } from "react";
import { Plus, X, ThumbsUp, MessageCircle, Share2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Page } from "@/components/layout/page";
import type { Article } from "@/lib/supabase/database.types";

interface Post {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  likes: number;
  comments: number;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    excerpt: "",
    category: "Cá nhân",
    image: "",
  });

  useEffect(() => {
    async function loadPosts() {
      try {
        const res = await fetch("/api/articles?limit=50");
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const articles: Article[] = json.data?.articles || [];
        const transformed = articles.map((a, i) => ({
          id: i + 1,
          title: a.title,
          excerpt: a.content?.substring(0, 150) + (a.content?.length > 150 ? "..." : ""),
          author: "Tôi",
          date: new Date(a.created_at).toLocaleDateString("vi-VN"),
          image: a.image_url || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
          category: a.category || "Cá nhân",
          likes: Math.floor(Math.random() * 20),
          comments: Math.floor(Math.random() * 10),
        }));
        setPosts(transformed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handleSavePost = async () => {
    if (!newPost.title || !newPost.excerpt) return;
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newPost.title,
          content: newPost.excerpt,
          category: newPost.category,
          image_url: newPost.image || null,
        }),
      });
      if (res.ok) {
        const post: Post = {
          id: Date.now(),
          title: newPost.title,
          excerpt: newPost.excerpt,
          author: "Tôi",
          date: new Date().toLocaleDateString("vi-VN"),
          image: newPost.image || "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600",
          category: newPost.category,
          likes: 0,
          comments: 0,
        };
        setPosts([post, ...posts]);
        setNewPost({ title: "", excerpt: "", category: "Cá nhân", image: "" });
        setIsAdding(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <Page>
      <div className="max-w-5xl mx-auto space-y-12 py-10 px-4">
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-natural-light text-natural-primary font-black text-[10px] uppercase tracking-[0.2em] border border-natural-primary/10 shadow-sm">
            Chia sẻ cá nhân
          </div>
          <h1 className="text-4xl font-black tracking-tight text-natural-primary-dark uppercase">
            Nhật ký & Bài viết
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Nơi bạn lưu giữ những trải nghiệm, kiến thức và khoảnh khắc trong hành trình chăm sóc sức khỏe của mình.
          </p>
        </header>

        <div className="bg-white rounded-[40px] border border-natural-border p-8 shadow-sm space-y-6">
          {!isAdding ? (
            <div className="flex gap-4 items-center">
              <div className="h-12 w-12 rounded-full bg-natural-beige flex-shrink-0" />
              <button
                onClick={() => setIsAdding(true)}
                className="flex-1 bg-natural-light/50 hover:bg-natural-light border border-natural-border/50 text-left px-6 py-4 rounded-3xl text-slate-400 font-bold transition-all"
              >
                Hôm nay bạn cảm thế nào? Chia sẻ bài viết ngay...
              </button>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-natural-primary p-4 rounded-2xl text-white shadow-lg shadow-natural-primary/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between border-b border-natural-border/30 pb-4">
                <h3 className="text-sm font-black text-natural-primary-dark uppercase tracking-widest">
                  Viết bài mới
                </h3>
                <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Tiêu đề bài viết..."
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full text-2xl font-black border-none outline-none focus:ring-0 placeholder-slate-300 text-natural-primary-dark"
                />
                <textarea
                  placeholder="Bạn đang nghĩ gì? Hãy chia sẻ kiến thức hoặc kinh nghiệm của mình..."
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full min-h-[150px] text-lg font-medium border-none outline-none focus:ring-0 placeholder-slate-300 text-slate-500 resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-natural-border/30">
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="bg-transparent text-xs font-black text-slate-400 uppercase tracking-widest outline-none border-none focus:ring-0 cursor-pointer"
                >
                  <option>Cá nhân</option>
                  <option>Dinh dưỡng</option>
                  <option>Vận động</option>
                  <option>Kiến thức</option>
                </select>
                <button
                  onClick={handleSavePost}
                  className="bg-natural-primary text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-natural-primary/20 flex items-center gap-2 hover:translate-x-1 transition-all"
                >
                  <Share2 className="w-4 h-4" /> Đăng bài ngay
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-12">
          <h2 className="text-xl font-black text-natural-primary-dark uppercase tracking-widest flex items-center gap-4">
            Bài viết của bạn
            <div className="h-0.5 flex-1 bg-natural-border/30 rounded-full" />
          </h2>

          <div className="grid gap-12">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-natural-border border-t-natural-primary" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[40px] border border-natural-border">
                <p className="text-slate-400 font-bold text-lg">Chưa có bài viết nào</p>
                <p className="text-slate-300 text-sm mt-2">Hãy viết bài đầu tiên của bạn!</p>
              </div>
            ) : (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="flex flex-col lg:flex-row gap-10 group items-start bg-white p-6 rounded-[48px] border border-natural-border shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
                >
                  <div className="lg:w-2/5 aspect-square sm:aspect-[4/3] rounded-[36px] overflow-hidden bg-natural-light shadow-inner relative shrink-0">
                    <img
                      src={post.image}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt={post.title}
                    />
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/20">
                      <span className="text-[10px] font-black text-natural-primary uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6 flex flex-col pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-8 bg-natural-primary rounded-full" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {post.date}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h2 className="text-3xl font-black text-natural-primary-dark group-hover:text-natural-primary transition-colors leading-[1.1] uppercase tracking-tight">
                      {post.title}
                    </h2>
                    <p className="text-slate-500 leading-relaxed text-lg font-medium opacity-80 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-natural-border/50 mt-auto">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-natural-beige border border-natural-primary/10 shadow-inner" />
                        <div>
                          <p className="text-sm font-black text-natural-primary-dark uppercase tracking-tight">
                            {post.author}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tác giả</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-slate-400">
                        <button className="hover:text-natural-accent transition-all flex items-center gap-2 group/btn">
                          <ThumbsUp className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-xs font-black">{post.likes}</span>
                        </button>
                        <button className="hover:text-natural-primary transition-all flex items-center gap-2 group/btn">
                          <MessageCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-xs font-black">{post.comments}</span>
                        </button>
                        <button className="hover:text-natural-primary transition-all group/btn">
                          <Share2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}