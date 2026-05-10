import { SelectHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id: providedId, ...props }, ref) => {
    const generatedId = useId();
    const selectId = providedId || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-label-lg text-on-surface-variant mb-2 block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "w-full min-h-touch-target px-4 py-3 pr-12 rounded-lg appearance-none",
              "bg-surface-container-low border border-outline",
              "text-body-lg text-on-surface",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              "transition-all duration-200",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none"
            aria-hidden="true"
          />
        </div>
        {error && <p className="text-label-lg text-error mt-2">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };