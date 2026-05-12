"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  emoji: string;
}

const navItems: NavItem[] = [
  { href: "/trangchu", label: "Trang chủ", emoji: "🏠" },
  { href: "/nhatky", label: "Chỉ số & Biểu đồ", emoji: "📊" },
  { href: "/bua-an", label: "Máy tính Carb", emoji: "🍱" },
  { href: "/thuoc", label: "Nhắc lịch thuốc", emoji: "💊" },
  { href: "/care", label: "Hồ sơ VNeID", emoji: "📂" },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "w-[280px] fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200",
          "transition-transform duration-300 lg:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-8">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">MY</div>
            <span className="text-2xl font-black text-blue-900">Mẹ Yêu</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "sidebar-item",
                    active && "active"
                  )}
                >
                  <span className="icon-box text-2xl">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Legal Footer */}
          <div className="mt-auto pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">Pháp lý 2026</p>
            <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 italic">
              Thông tin AI chỉ mang tính tham khảo. Tuân thủ chỉ định của bác sĩ.
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Desktop-only Sidebar
export function DesktopSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex w-[280px] fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex-col">
      <div className="flex flex-col h-full p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">MY</div>
          <span className="text-2xl font-black text-blue-900">Mẹ Yêu</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "sidebar-item",
                  active && "active"
                )}
              >
                <span className="icon-box text-2xl">{item.emoji}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Legal Footer */}
        <div className="mt-auto pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-4">Pháp lý 2026</p>
          <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-700 italic">
            Thông tin AI chỉ mang tính tham khảo. Tuân thủ chỉ định của bác sĩ.
          </div>
        </div>
      </div>
    </aside>
  );
}