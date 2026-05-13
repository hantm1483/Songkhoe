"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, Droplets, Utensils, Activity, Calendar, ClipboardList, BookOpen, Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";

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

function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Get guest device ID
function getGuestDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sk_demo_uid");
}

// User info display component
function UserInfo() {
  const [userName, setUserName] = useState<string>("");
  const [userType, setUserType] = useState<"guest" | "account" | null>(null);

  useEffect(() => {
    // Check Supabase auth first
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        // Real authenticated user
        const user = data.session.user;
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
        setUserName(name);
        setUserType("account");
      } else {
        // Check guest session
        const guestId = getGuestDeviceId();
        if (guestId) {
          setUserName("Guest");
          setUserType("guest");
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        const user = session.user;
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
        setUserName(name);
        setUserType("account");
      } else {
        const guestId = getGuestDeviceId();
        if (guestId) {
          setUserName("Guest");
          setUserType("guest");
        } else {
          setUserName("");
          setUserType(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!userName) return null;

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-2xl mb-4",
      userType === "guest" ? "bg-natural-light" : "bg-primary/10"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center",
        userType === "guest" ? "bg-natural-primary" : "bg-primary"
      )}>
        <User className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-natural-primary-dark truncate">
          {userName}
        </p>
        <p className="text-xs text-slate-500">
          {userType === "guest" ? "Guest User" : "Tài khoản"}
        </p>
      </div>
    </div>
  );
}

// Desktop Sidebar - Sống Khỏe style
export function DesktopSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    localStorage.removeItem("sk_demo_uid");
    document.cookie = "sk_guest_session=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 hidden lg:block h-screen w-64 border-r border-natural-border bg-white p-6 z-50">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-natural-primary rounded-full flex items-center justify-center shadow-sm">
          <Activity className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-natural-primary-dark">Sống Khỏe</h1>
      </div>

      {/* User Info */}
      <UserInfo />

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

      {/* Sign Out Button */}
      <div className="absolute bottom-6 left-6 right-6">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Đăng xuất
        </button>
      </div>
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

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    localStorage.removeItem("sk_demo_uid");
    document.cookie = "sk_guest_session=; path=/; max-age=0";
    window.location.href = "/login";
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
              <div className="mb-6 flex items-center justify-between">
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

              {/* User Info */}
              <UserInfo />

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

              {/* Sign Out Button */}
              <div className="absolute bottom-6 left-6 right-6">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Đăng xuất
                </button>
              </div>
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