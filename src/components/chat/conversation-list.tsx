/**
 * Conversation List Component
 * Sidebar showing all conversations with metadata
 */

interface Conversation {
  id: string;
  created_at: string;
  message_count: number;
  last_message: {
    role: string;
    content: string;
    created_at: string;
  } | null;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
}: ConversationListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Hôm qua";
    } else if (days < 7) {
      return date.toLocaleDateString("vi-VN", { weekday: "short" });
    } else {
      return date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        Chưa có cuộc trò chuyện nào
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={`p-3 text-left border-b border-gray-50 hover:bg-gray-50 transition-colors ${
            selectedId === conv.id ? "bg-blue-50" : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-900 truncate flex-1">
              {conv.last_message?.content.substring(0, 30) || "Cuộc trò chuyện mới"}
              {(conv.last_message?.content.length || 0) > 30 && "..."}
            </span>
            <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
              {formatDate(conv.created_at)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">
              {conv.message_count} tin nhắn
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}