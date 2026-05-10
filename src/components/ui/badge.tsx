import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "default";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      success:
        "bg-primary/10 text-primary border border-primary/20",
      warning:
        "bg-amber-100 text-amber-700 border border-amber-200",
      error:
        "bg-error/10 text-error border border-error/20",
      default:
        "bg-surface-container text-on-surface-variant border border-outline",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-full",
          "text-label-lg font-semibold",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };