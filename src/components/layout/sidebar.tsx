"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

interface NavItem {
  href: string;
  label: string;
  iconName: string;
}

const navItems: NavItem[] = [
  { href: "/trangchu", label: "Trang chủ", iconName: "home" },
  { href: "/nhatky", label: "Theo dõi tiểu đường", iconName: "edit_note" },
  { href: "/bua-an", label: "Dinh dưỡng", iconName: "restaurant" },
  { href: "/kien-thuc", label: "Kiến thức", iconName: "menu_book" },
  { href: "/lifestyle", label: "Lối sống", iconName: "favorite" },
  { href: "/care", label: "Chăm sóc", iconName: "sparkles" },
  { href: "/memory", label: "Ký ức", iconName: "history" },
  { href: "/news", label: "Tin tức", iconName: "newspaper" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/trangchu") return pathname === "/trangchu" || pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="hidden md:flex bg-surface shadow-sm shadow-primary/10 sticky top-0 z-40 w-full px-container-padding h-touch-target-min justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Icon name="candle" className="w-7 h-7 text-primary" />
        <span className="text-xl font-headline font-bold text-primary tracking-tight">
          Sổ Tay Tiểu Đường
        </span>
      </div>

      {/* Navigation - horizontal center */}
      <nav className="flex items-center gap-4">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center px-3 py-2 rounded-full transition-colors",
                active
                  ? "text-primary font-bold bg-surface-container-high"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <Icon
                name={item.iconName}
                className="w-6 h-6"
                filled={active}
              />
              <span className="text-label-lg mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-fixed">
        <img
          alt="User profile"
          src="https://lh3.googleusercontent.com/a/default-user"
          className="w-full h-full object-cover"
        />
      </div>
    </header>
  );
}