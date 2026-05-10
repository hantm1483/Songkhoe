/**
 * Typing Indicator Component
 * Shows "Tâm đang suy nghĩ..." loading state
 */

interface TypingIndicatorProps {
  text?: string;
}

export function TypingIndicator({ text = "Tâm đang suy nghĩ..." }: TypingIndicatorProps) {
  return (
    <div className="flex gap-2 max-w-[85%] mr-auto">
      {/* Avatar placeholder */}
      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-medium text-emerald-600">Tâm</span>
      </div>

      {/* Dots animation */}
      <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}