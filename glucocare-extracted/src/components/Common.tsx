import React from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("glass-card p-6 h-full", className)}>
    {children}
  </div>
);

export const SectionHeader = ({ title, showAll = true }: { title: string; showAll?: boolean }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
    {showAll && (
      <button className="flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all">
        Xem tất cả <ChevronRight size={16} />
      </button>
    )}
  </div>
);

export const Badge = ({ children, variant = 'primary' }: { children: React.ReactNode; variant?: 'primary' | 'accent' | 'secondary' | 'neutral' }) => {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    secondary: 'bg-emerald-100 text-emerald-600',
    neutral: 'bg-slate-100 text-slate-600'
  };
  
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold", variants[variant])}>
      {children}
    </span>
  );
};
