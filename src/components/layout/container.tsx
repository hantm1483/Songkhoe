import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Container = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full max-w-md px-6",
        className
      )}
      {...props}
    />
  )
);

Container.displayName = "Container";

export { Container };