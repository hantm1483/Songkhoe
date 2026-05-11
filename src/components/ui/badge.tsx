import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "accent" | "secondary" | "neutral" | "success" | "error" | "warning";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-primary/10 text-primary",
      accent: "bg-accent/10 text-accent",
      secondary: "bg-emerald-100 text-emerald-600",
      neutral: "bg-slate-100 text-slate-600",
      success: "bg-emerald-100 text-emerald-600",
      error: "bg-rose-100 text-rose-600",
      warning: "bg-amber-100 text-amber-600"
    };

    return (
      <span
        ref={ref}
        className={cn(
          "px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap",
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