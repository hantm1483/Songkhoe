import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "default" | "gi" | "accent" | "neutral" | "secondary";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      success: "bg-primary/10 text-primary border border-primary/20",
      warning: "bg-amber-100 text-amber-700 border border-amber-200",
      error: "bg-error/10 text-error border border-error/20",
      default: "bg-surface-container text-on-surface-variant border border-outline font-body",
      gi: "bg-secondary-container text-on-secondary-container rounded-full px-3 py-1 font-body",
      accent: "bg-accent/10 text-accent",
      neutral: "bg-slate-100 text-slate-600",
      secondary: "bg-emerald-100 text-emerald-600",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-full",
          "text-label-lg font-semibold",
          variant !== "gi" && "rounded-full",
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