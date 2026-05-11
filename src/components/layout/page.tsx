import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";

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
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Desktop Header with horizontal nav */}
      {showSidebar && <Sidebar />}

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 w-full bg-surface border-b border-surface-variant h-16 flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[24px]">candle</span>
          <h1 className="text-[20px] font-bold text-primary font-headline">Sổ Tay Tiểu Đường</h1>
        </div>
        {right && <div className="flex items-center">{right}</div>}
      </header>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 max-w-4xl mx-auto w-full px-container-padding py-section-margin flex flex-col gap-section-margin",
          "pb-24 md:pb-0",
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