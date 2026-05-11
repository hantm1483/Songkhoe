"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, Activity, Sparkles, PenTool, User, Menu, X } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Trang chủ", icon: Heart },
  { href: "/tracking", label: "Theo dõi tiểu đường", icon: Activity },
  { href: "/care", label: "Chăm sóc", icon: Sparkles },
  { href: "/memory", label: "Blog's", icon: PenTool },
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
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100",
          "transition-transform duration-300 lg:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Heart size={24} fill="currentColor" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">
              GlucoCare
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "nav-item",
                    active && "nav-item-active"
                  )}
                >
                  <IconComponent
                    className={cn("w-5 h-5", active && "fill-current")}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Mini */}
          <div className="p-6 border-t border-slate-100">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                <User size={20} className="text-slate-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  Ngọc My
                </p>
                <p className="text-xs text-slate-500 truncate">
                  Bệnh nhân tiểu đường
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Desktop-only Sidebar for use in layout
export function DesktopSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Heart size={24} fill="currentColor" />
        </div>
        <span className="text-xl font-bold text-primary tracking-tight">
          GlucoCare
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "nav-item",
                active && "nav-item-active"
              )}
            >
              <IconComponent
                className={cn("w-5 h-5", active && "fill-current")}
              />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Mini */}
      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
            <User size={20} className="text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              Ngọc My
            </p>
            <p className="text-xs text-slate-500 truncate">
              Bệnh nhân tiểu đường
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}