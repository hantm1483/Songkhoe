import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Heart, Activity, Sparkles, PenTool } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; fill?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Trang chủ", icon: Heart },
  { href: "/tracking", label: "Theo dõi tiểu đường", icon: Activity },
  { href: "/care", label: "Chăm sóc", icon: Sparkles },
  { href: "/memory", label: "Blog's", icon: PenTool },
];

export const BottomNav = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40 lg:hidden"
      aria-label="Navigation"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const IconComponent = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-[64px]",
                "transition-all duration-200",
                active
                  ? "text-primary"
                  : "text-slate-400 hover:text-slate-600"
              )}
              aria-current={active ? "page" : undefined}
            >
              <IconComponent
                className={cn("w-6 h-6", active && "fill-current")}
                fill={active ? "currentColor" : "none"}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};