import { InputHTMLAttributes, forwardRef, useId, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  iconPrefix?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, iconPrefix, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-lg text-on-surface-variant mb-2 block font-body"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {iconPrefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              {iconPrefix}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full min-h-touch-target px-4 py-3 rounded-2xl",
              "bg-surface-container-low border-2 border-outline",
              "text-body-lg text-on-surface font-body placeholder:text-on-surface-variant",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200",
              iconPrefix && "pl-12",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-label-lg text-error mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
