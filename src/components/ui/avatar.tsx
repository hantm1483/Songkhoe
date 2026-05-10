import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "w-8 h-8 text-label-lg",
      md: "w-10 h-10 text-body-md",
      lg: "w-12 h-12 text-body-lg",
      xl: "w-16 h-16 text-headline-md",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center rounded-full overflow-hidden",
          "bg-primary text-on-primary font-semibold",
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{fallback ? getInitials(fallback) : "?"}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };