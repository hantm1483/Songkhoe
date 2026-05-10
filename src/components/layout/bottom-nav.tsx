import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Book, Pill, BookOpen, Heart } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: "/", label: "Trang chủ", icon: Home },
  { href: "/diary", label: "Nhật ký", icon: Book },
  { href: "/medications", label: "Thuốc", icon: Pill },
  { href: "/knowledge", label: "Kiến thức", icon: BookOpen },
  { href: "/memorial", label: "Nhớ", icon: Heart },
];

export const BottomNav = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant"
      aria-label="Navigation"
    >
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-touch-target",
                "transition-colors duration-200",
                active
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "w-6 h-6",
                  active && "fill-primary"
                )}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};