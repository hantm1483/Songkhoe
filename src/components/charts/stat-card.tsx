import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { glucoseThresholds } from "@/lib/design-system";

type StatStatus = "normal" | "low" | "high" | "default";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  unit?: string;
  status?: StatStatus;
}

const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, value, label, unit, status = "default", ...props }, ref) => {
    const getStatusColor = (s: StatStatus): string => {
      const colors = {
        normal: "bg-primary/10",
        low: "bg-amber-50",
        high: "bg-red-50",
        default: "bg-surface-container",
      };
      return colors[s];
    };

    const getBorderColor = (s: StatStatus): string => {
      const colors = {
        normal: "border-primary/20",
        low: "border-amber-200",
        high: "border-red-200",
        default: "border-outline",
      };
      return colors[s];
    };

    // Auto-detect status based on glucose value
    const detectStatus = (): StatStatus => {
      const numValue = typeof value === "number" ? value : parseFloat(String(value));
      if (isNaN(numValue)) return "default";
      if (numValue < glucoseThresholds.low) return "low";
      if (numValue > glucoseThresholds.high) return "high";
      return "normal";
    };

    const finalStatus = status === "default" ? detectStatus() : status;

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg p-4 border",
          getStatusColor(finalStatus),
          getBorderColor(finalStatus),
          className
        )}
        {...props}
      >
        <p className="text-label-lg text-on-surface-variant mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span
            className={cn(
              "text-display-lg leading-none",
              finalStatus === "normal" && "text-primary",
              finalStatus === "low" && "text-amber-600",
              finalStatus === "high" && "text-red-600",
              finalStatus === "default" && "text-on-surface"
            )}
          >
            {value}
          </span>
          {unit && (
            <span className="text-body-md text-on-surface-variant">{unit}</span>
          )}
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export { StatCard };