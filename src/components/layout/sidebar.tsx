"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, Droplets, Utensils, Activity, Calendar, ClipboardList, BookOpen, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const menuItems: NavItem[] = [
  { name: 'Trang chủ', path: '/', icon: Heart },
  { name: 'Theo dõi đường huyết', path: '/blood-sugar', icon: Droplets },
  { name: 'Chế độ dinh dưỡng', path: '/nutrition', icon: Utensils },
  { name: 'Chế độ sinh hoạt', path: '/lifestyle', icon: Activity },
  { name: 'Lịch tầm soát định kỳ', path: '/screening', icon: Calendar },
  { name: 'Nhật ký sức khỏe', path: '/health-diary', icon: ClipboardList },
  { name: "Blog's", path: '/blog', icon: BookOpen },
];

// Desktop Sidebar - Sống Khỏe style
export function DesktopSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-0 hidden lg:block h-screen w-64 border-r border-natural-border bg-white p-6 z-50">
      {/* Logo */}
      <div className="mb-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-natural-primary rounded-full flex items-center justify-center shadow-sm">
          <Activity className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-natural-primary-dark">Sống Khỏe</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          const IconComponent = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-natural-primary text-white shadow-md"
                  : "text-slate-500 hover:bg-natural-light hover:text-natural-primary-dark"
              )}
            >
              <IconComponent className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// Mobile Header with hamburger menu
interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-50 h-screen w-72 bg-white p-6 shadow-2xl lg:hidden"
            >
              {/* Logo */}
              <div className="mb-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-natural-primary flex items-center justify-center">
                    <Activity className="text-white w-6 h-6" />
                  </div>
                  <h1 className="text-xl font-bold text-natural-primary-dark">Sống Khỏe</h1>
                </div>
                <button onClick={onToggle}>
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const active = isActive(item.path);
                  const IconComponent = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={onToggle}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                        active
                          ? "bg-natural-primary text-white"
                          : "text-slate-500 hover:bg-slate-50 font-medium"
                      )}
                    >
                      <IconComponent className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Header Bar */}
      <header className="sticky top-0 z-40 border-b border-natural-border bg-white/80 backdrop-blur-md lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-natural-primary flex items-center justify-center">
              <Activity className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-natural-primary-dark">Sống Khỏe</h1>
          </div>
          <button
            onClick={onToggle}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>
    </>
  );
}

// Re-export Sidebar for backward compat
export function Sidebar() {
  return <DesktopSidebar />;
}