import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  title: string;
  backHref?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export const Header = ({ title, backHref, onBack, right }: HeaderProps) => {
  const showBack = backHref || onBack;

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        "flex items-center justify-between",
        "h-14 px-4",
        "bg-surface/95 backdrop-blur-sm",
        "border-b border-outline-variant"
      )}
    >
      <div className="flex items-center gap-2">
        {showBack && (
          <Link
            href={backHref || "/"}
            onClick={onBack}
            className={cn(
              "min-h-touch-target min-w-touch-target",
              "flex items-center justify-center",
              "rounded-lg hover:bg-surface-container transition-colors"
            )}
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-on-surface" />
          </Link>
        )}
        <h1 className="text-headline-md text-on-surface truncate">
          {title}
        </h1>
      </div>
      {right && <div className="flex items-center">{right}</div>}
    </header>
  );
};