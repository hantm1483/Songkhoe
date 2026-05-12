import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { MobileHeader } from "./sidebar";
import { FooterSummary } from "./footer-summary";

interface PageProps {
  title?: string;
  children: ReactNode;
  showMobileHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function Page({
  title,
  children,
  showMobileHeader = true,
  showFooter = true,
  className,
}: PageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text antialiased font-sans selection:bg-natural-soft">
      {/* Mobile Header with hamburger menu */}
      {showMobileHeader && (
        <MobileHeader
          isOpen={isMobileMenuOpen}
          onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
      )}

      {/* Main Content - Desktop: lg:pl-64 for sidebar offset */}
      <main
        className={cn(
          "lg:pl-64",
          className
        )}
      >
        <div className="mx-auto max-w-[1700px] px-4 py-10 sm:px-8 lg:px-12">
          {children}
        </div>

        {/* Footer Summary */}
        {showFooter && <FooterSummary />}
      </main>
    </div>
  );
}