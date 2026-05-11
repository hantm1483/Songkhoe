import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  filled?: boolean;
}

export function Icon({ name, filled = false, className, ...props }: IconProps) {
  return (
    <span
      className={cn(
        "material-symbols-outlined",
        filled && "[font-variation-settings:'FILL'_1]",
        className
      )}
      {...props}
    >
      {name}
    </span>
  );
}