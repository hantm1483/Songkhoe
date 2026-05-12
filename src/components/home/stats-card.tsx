"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string;
  unit: string;
  color: string;
  bgColor: string;
  delay?: number;
}

export function StatsCard({ label, value, unit, color, bgColor, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-[32px] border border-natural-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="text-xs font-bold text-[#6B705C] uppercase tracking-widest">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className={cn("text-4xl font-black", color)}>{value}</span>
        <span className="text-sm text-gray-400 font-bold">{unit}</span>
      </div>
    </motion.div>
  );
}