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
  { href: "/nhatky", label: "Theo dõi", iconName: "blood_pressure" },
  { href: "/bua-an", label: "Dinh dưỡng", iconName: "restaurant" },
  { href: "/lifestyle", label: "Lối sống", iconName: "favorite" },
  { href: "/care", label: "Chăm sóc", iconName: "medical_services" },
];

export const BottomNav = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/trangchu") return pathname === "/trangchu" || pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant lg:hidden"
      aria-label="Navigation"
    >
      <div className="flex items-center justify-around px-2 pb-safe">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 min-w-touch-target",
                "transition-colors duration-200",
                active
                  ? "text-primary bg-secondary-container rounded-2xl -mt-2"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                name={item.iconName}
                className={cn("w-6 h-6", active && "text-primary")}
                filled={active}
              />
              <span className="text-xs font-medium font-body">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};