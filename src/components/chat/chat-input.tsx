/**
 * Chat Input Component
 * Input field with send button for typing messages
 */

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("message") as HTMLInputElement;
    const message = input.value.trim();

    if (!message || disabled) return;

    onSend(message);
    input.value = "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 items-center p-3 border-t border-gray-100 bg-white"
    >
      <input
        type="text"
        name="message"
        placeholder={placeholder || "Nhập tin nhắn..."}
        disabled={disabled}
        className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={disabled}
        className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 flex items-center justify-center transition-colors"
      >
        {disabled ? (
          <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        )}
      </button>
    </form>
  );
}