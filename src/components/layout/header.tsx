"use client";

import React from "react";
import { Search, Bell, User, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuClick, showMenuButton = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      {/* Menu button for mobile */}
      {showMenuButton && (
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Search bar */}
      <div className="flex-1 max-w-xl mx-4">
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
          />
          <input
            type="text"
            placeholder="Tìm kiếm kiến thức, thực đơn..."
            className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Right side: Bell and User */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
        </button>
        <div className="h-8 w-px bg-slate-100 mx-2 hidden sm:block"></div>
        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex">
          <span className="text-sm font-semibold text-slate-700">Ngọc My</span>
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <User size={18} />
          </div>
        </button>
      </div>
    </header>
  );
}