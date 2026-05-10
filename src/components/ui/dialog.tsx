import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Dialog = ({ open, onClose, children, size = "md" }: DialogProps) => {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 backdrop-blur-sm bg-surface/80"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Dialog panel */}
      <div
        className={cn(
          "relative w-full rounded-xl bg-surface-container-lowest p-6",
          "shadow-soft-elevation animate-in fade-in zoom-in-95 duration-200",
          sizes[size]
        )}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center justify-between mb-4">{children}</div>
);

export const DialogContent = ({ children }: { children: ReactNode }) => (
  <div className="text-body-lg text-on-surface">{children}</div>
);

export const DialogCloseButton = ({
  onClick,
  ariaLabel = "Close",
}: {
  onClick: () => void;
  ariaLabel?: string;
}) => (
  <button
    onClick={onClick}
    className="min-h-touch-target min-w-touch-target flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
    aria-label={ariaLabel}
  >
    <X className="w-5 h-5 text-on-surface-variant" />
  </button>
);

export const DialogTitleText = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h2 className={cn("text-headline-md text-on-surface", className)}>
    {children}
  </h2>
);

export const DialogActions = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn("flex gap-3 mt-6", className)}>{children}</div>
);