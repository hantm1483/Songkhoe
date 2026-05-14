"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  likes?: number;
  comments?: number;
}

interface PostCardProps {
  post: Post;
  index: number;
  compact?: boolean;
}

export const PostCard = memo(function PostCard({ post, index, compact = false }: PostCardProps) {
  if (compact) {
    return (
      <motion.div
        key={post.title}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 + index * 0.1 }}
        className="flex gap-4 group cursor-pointer hover:bg-natural-light p-3 rounded-2xl transition-all"
      >
        <div className="h-12 w-12 rounded-full shrink-0 bg-natural-primary p-0.5 border border-white/50 shadow-sm overflow-hidden">
          <img src={`https://i.pravatar.cc/150?u=${index}`} className="w-full h-full object-cover rounded-full" alt="avatar" />
        </div>
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest mb-1">
            <span className="text-natural-primary">{post.category}</span> • <span className="text-slate-400">{post.date}</span>
          </p>
          <h4 className="text-sm font-bold text-natural-primary-dark line-clamp-2 leading-snug group-hover:text-natural-primary">{post.title}</h4>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex flex-col sm:flex-row gap-8 group"
    >
      <div className="sm:w-1/3 aspect-[16/10] rounded-3xl overflow-hidden shadow-lg relative shrink-0">
        <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm border border-white/20">
          <span className="text-[8px] font-black text-natural-primary uppercase tracking-widest">{post.category}</span>
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-8 bg-natural-primary rounded-full" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{post.date}</span>
        </div>
        <h3 className="text-xl font-black text-natural-primary-dark group-hover:text-natural-primary transition-colors leading-tight uppercase tracking-tight cursor-pointer">
          {post.title}
        </h3>
        <p className="text-sm text-slate-500 font-medium line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between pt-4 border-t border-natural-border/50">
          <span className="text-[10px] font-bold text-natural-primary-dark uppercase tracking-wide">{post.author}</span>
          <div className="flex gap-4 text-slate-400">
            <button className="hover:text-natural-accent transition-all flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4" />
              <span className="text-[10px] font-black">{post.likes || 12}</span>
            </button>
            <button className="hover:text-natural-primary transition-all flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span className="text-[10px] font-black">{post.comments || 6}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
});