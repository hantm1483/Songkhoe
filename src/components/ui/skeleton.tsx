import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = "text", width, height, ...props }, ref) => {
    const variants = {
      text: "rounded",
      circular: "rounded-full",
      rectangular: "rounded-lg",
    };

    const defaultHeights = {
      text: "h-4",
      circular: "h-10",
      rectangular: "h-24",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse bg-surface-dim",
          variants[variant],
          defaultHeights[variant],
          className
        )}
        style={{
          width: width ?? (variant === "circular" ? "2.5rem" : "100%"),
          height: height && variant !== "circular" ? height : undefined,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

// Skeleton for card component
export const SkeletonCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-surface-container-low rounded-lg p-4",
        className
      )}
      {...props}
    >
      <Skeleton variant="text" className="w-1/3 h-5 mb-3" />
      <Skeleton variant="text" className="w-2/3 h-8 mb-2" />
      <Skeleton variant="text" className="w-1/2 h-4" />
    </div>
  )
);

SkeletonCard.displayName = "SkeletonCard";

// Skeleton for avatar
export const SkeletonAvatar = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <Skeleton
      ref={ref}
      variant="circular"
      className={cn("w-10 h-10", className)}
      {...props}
    />
  )
);

SkeletonAvatar.displayName = "SkeletonAvatar";

// Skeleton for glucose stat
export const SkeletonStatCard = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-surface-container rounded-lg p-4",
        className
      )}
      {...props}
    >
      <Skeleton variant="text" className="w-16 h-4 mb-2" />
      <Skeleton variant="text" className="w-24 h-10" />
    </div>
  )
);

SkeletonStatCard.displayName = "SkeletonStatCard";

export { Skeleton };