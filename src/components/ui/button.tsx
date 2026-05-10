import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 rounded-xl font-beVietnamPro font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-primary text-on-primary hover:bg-primary/90 active:bg-primary/80 shadow-soft-teal",
      secondary: "bg-secondary text-on-secondary hover:bg-secondary/90 active:bg-secondary/80 shadow-soft-blue",
      ghost:
        "bg-transparent text-primary border border-primary/30 hover:bg-primary/10 active:bg-primary/20",
    };

    const sizes = {
      default: "min-h-touch-target px-6 py-3 text-body-md",
      lg: "min-h-touch-target-preferred px-8 py-4 text-body-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
