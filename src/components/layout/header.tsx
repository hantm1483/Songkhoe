"use client";

import React, { useState } from "react";
import { Search, Bell, User, Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  title?: string;
}

export function Header({ onMenuClick, showMenuButton = false, title }: HeaderProps) {
  const [showAI, setShowAI] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 md:px-10 flex justify-between items-center">
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

      {/* Page title with greeting */}
      <h2 className="text-xl font-bold text-slate-800">
        {title || `${getGreeting()}, User!`}
      </h2>

      {/* Right side: AI Button */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowAI(!showAI)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md flex items-center gap-2"
        >
          ✨ AI Assistant
        </button>
      </div>
    </header>
  );
}