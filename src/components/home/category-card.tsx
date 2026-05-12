"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  label: string;
  count: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export function CategoryCard({ label, count, icon: Icon, color, delay = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-4 rounded-[28px] border border-natural-border bg-white flex items-center gap-4 hover:shadow-lg transition-all cursor-pointer group"
    >
      <div className={cn("h-12 w-12 rounded-full flex items-center justify-center shrink-0 text-white shadow-lg", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-natural-primary-dark text-sm sm:text-base leading-none group-hover:text-natural-primary">{label}</h3>
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{count}</p>
      </div>
    </motion.div>
  );
}