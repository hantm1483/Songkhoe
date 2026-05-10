/**
 * Message Bubble Component
 * Displays user or assistant message in chat
 */

import { Avatar } from "@/components/ui/avatar";

interface MessageBubbleProps {
  content: string;
  role: "user" | "assistant";
  createdAt: string;
}

export function MessageBubble({ content, role, createdAt }: MessageBubbleProps) {
  const isUser = role === "user";
  const time = new Date(createdAt).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex gap-2 max-w-[85%] ${
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      }`}
    >
      {/* Avatar */}
      <Avatar
        className="w-8 h-8 flex-shrink-0"
        fallback={isUser ? "Bạn" : "Tâm"}
      />

      {/* Message content */}
      <div
        className={`flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          }`}
        >
          {content}
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">{time}</span>
      </div>
    </div>
  );
}