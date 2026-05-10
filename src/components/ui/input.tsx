import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-lg text-on-surface-variant mb-2 block"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full min-h-touch-target px-4 py-3 rounded-lg",
            "bg-surface-container-low border border-outline",
            "text-body-lg text-on-surface placeholder:text-on-surface-variant",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-label-lg text-error mt-2">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
