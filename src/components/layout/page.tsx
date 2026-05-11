import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

interface PageProps {
  title?: string;
  children: ReactNode;
  showBottomNav?: boolean;
  showSidebar?: boolean;
  right?: ReactNode;
  className?: string;
}

export const Page = ({
  title,
  children,
  showBottomNav = true,
  showSidebar = true,
  right,
  className,
}: PageProps) => {
  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col">
      {/* Desktop Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content - no max-width constraint so children can use max-w-7xl */}
      <main
        className={cn(
          "flex-1 w-full",
          className
        )}
      >
        {children}
      </main>

      {/* Bottom Navigation - Mobile only */}
      {showBottomNav && <BottomNav />}
    </div>
  );
};