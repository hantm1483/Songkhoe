import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BottomNav } from "./bottom-nav";
import { Header } from "./header";

interface PageProps {
  title?: string;
  children: ReactNode;
  showBottomNav?: boolean;
  showHeader?: boolean;
  backHref?: string;
  onBack?: () => void;
  right?: ReactNode;
  className?: string;
}

export const Page = ({
  title,
  children,
  showBottomNav = true,
  showHeader = true,
  backHref,
  onBack,
  right,
  className,
}: PageProps) => {
  return (
    <div className="min-h-screen bg-surface">
      {showHeader && title && (
        <Header
          title={title}
          backHref={backHref}
          onBack={onBack}
          right={right}
        />
      )}
      <main
        className={cn(
          "flex-1 pb-safe",
          showBottomNav && "pb-20",
          className
        )}
      >
        {children}
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
};