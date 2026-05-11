import { ReactNode, createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <Icon name="check_circle" className="w-5 h-5 text-primary" />,
    error: <Icon name="error" className="w-5 h-5 text-error" />,
    warning: <Icon name="warning" className="w-5 h-5 text-amber-600" />,
    info: <Icon name="info" className="w-5 h-5 text-secondary" />,
  };

  const bgColors = {
    success: "bg-primary/10 border-primary/20",
    error: "bg-error/10 border-error/20",
    warning: "bg-amber-50 border-amber-200",
    info: "bg-secondary/10 border-secondary/20",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed top-4 left-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg border",
              "shadow-soft-elevation pointer-events-auto",
              bgColors[toast.type]
            )}
          >
            {icons[toast.type]}
            <p className="flex-1 text-body-lg text-on-surface">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="min-h-touch-target min-w-touch-target flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
              aria-label="Dismiss"
            >
              <Icon name="close" className="w-4 h-4 text-on-surface-variant" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};